import { BaseSubscreen, getRelativeWidth, getRelativeHeight, setSubscreen } from "zois-core/ui";
import { toastsManager } from "zois-core/toasts";
import {
    modStorage,
    saveStorage,
    syncStorage,
    ModRule,
    AutoLoadMode,
    ViolationAction,
    CuratedModInfo,
    ACCESS_LEVEL_NAMES,
    AccessLevel,
    QoCPermission,
    AuthorityData,
    DEFAULT_PERMISSIONS
} from "modules/storage";
import { getLoadedMods, CURATED_MOD_CATALOG, getAllCatalogMods, DetectedMod, loadCuratedMod } from "modules/modDetection";
import { checkComplianceAgainstRules, evaluateCompliance } from "modules/compliance";
import {
    requestInspect,
    requestSetRules,
    requestUpdateAuthority,
    requestTriggerCompliance,
    requestForceInject,
    restartPeriodicComplianceTimer,
    InspectResponseData
} from "modules/networkSync";
import {
    PERMISSION_DEFINITIONS,
    PermissionDefinition,
    checkPermissionAccess,
    addRoleMember,
    removeRoleMember,
    setPermissionMinRole,
    setPermissionSelfAccess
} from "modules/authority";
import { MOD_NAME } from "src/constants";
import { MainSubscreen } from "./mainSubscreen";

export class InspectorSubscreen extends BaseSubscreen {
    private target: Character | null = null;
    private isSelf: boolean = true;
    private targetData: InspectResponseData | null = null;
    private isLoading: boolean = false;
    private errorMessage: string | null = null;

    // Working copy of rules being edited on target
    private targetRulesCopy: ModRule[] = [];

    // Filter text for permissions tab
    private permissionFilter: string = "";

    // Search filter for Enforce Rules catalog
    private catalogSearchText: string = "";

    // Root UI container & content area
    private rootElement: HTMLDivElement | null = null;
    private contentArea: HTMLDivElement | null = null;
    private modalElement: HTMLElement | null = null;
    private activeTab: string = "addons";

    constructor(target: Character | null = null, initialTab: string = "addons") {
        super();
        this.target = target;
        this.isSelf = !target || (typeof target.IsPlayer === "function" && target.IsPlayer());
        this.activeTab = initialTab;
    }

    public override get name(): string {
        return "";
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public override onLoad(): void {
        this.createRootUI();

        if (!this.isSelf) {
            this.loadTargetData();
        } else {
            this.renderTabContent();
        }
    }

    public override exit(): void {
        this.cleanup();
        if (typeof CurrentScreen !== "undefined" && CurrentScreen === "InformationSheet") {
            setSubscreen(null);
            if (typeof InformationSheetLoadCharacter === "function" && this.target) {
                try {
                    InformationSheetLoadCharacter(this.target);
                } catch {}
            }
        } else {
            setSubscreen(new MainSubscreen());
        }
    }

    protected override onUnload(): void {
        this.cleanup();
    }

    protected override onExit(): void {
        this.cleanup();
    }

    private cleanup(): void {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
        if (this.rootElement) {
            this.rootElement.remove();
            this.rootElement = null;
        }
        this.contentArea = null;
    }

    private getSubjectName(): string {
        if (this.isSelf) {
            return typeof Player !== "undefined" ? (Player.Name || "Player") : "Player";
        }
        return this.target?.Name || (typeof this.target?.MemberNumber === "number" ? `Member #${this.target.MemberNumber}` : "Target");
    }

    private createRootUI(): void {
        this.cleanup();

        const subjectName = this.getSubjectName();

        // 1. Solid Full-Screen Backdrop
        const backdrop = document.createElement("div");
        backdrop.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #191f2b;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: #e0e6ed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            user-select: none;
        `;

        const container = document.createElement("div");
        container.style.cssText = `
            width: ${getRelativeWidth(1800)}px;
            height: ${getRelativeHeight(900)}px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-sizing: border-box;
        `;

        // 2. Header
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.35);
        `;

        const titleBox = document.createElement("div");
        titleBox.innerHTML = `
            <div style="font-size: 22px; font-weight: bold; color: #64b5f6;">
                Quality of Club • ${this.isSelf ? subjectName : `Inspecting ${subjectName}`}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 2px;">
                ${this.isSelf ? "Manage your loaded addons, locked rules, authority roles, and permissions." : `Remote inspector and authority manager for ${subjectName}.`}
            </div>
        `;

        const backBtn = document.createElement("button");
        backBtn.textContent = "✕ Close";
        backBtn.style.cssText = `
            padding: 10px 24px;
            background: rgba(220, 50, 50, 0.85);
            border: 1px solid #ef5350;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
        backBtn.addEventListener("click", () => this.exit());

        header.appendChild(titleBox);
        header.appendChild(backBtn);
        container.appendChild(header);

        // 3. Navigation Tab Bar (100% Identical between Self & Target)
        const tabBar = document.createElement("div");
        tabBar.style.cssText = "display: flex; gap: 10px; flex-wrap: wrap;";

        const tabs = [
            { id: "addons", label: "📦 Addons & Compliance" },
            { id: "rules", label: "🔒 Enforce Rules" },
            { id: "roles", label: "👑 Role Management" },
            { id: "permissions", label: "🛡️ Permission Settings" },
            { id: "settings", label: "⚙️ Preferences" }
        ];

        tabs.forEach(tab => {
            const isSelected = this.activeTab === tab.id;
            const tabBtn = document.createElement("button");
            tabBtn.textContent = tab.label;
            tabBtn.style.cssText = `
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 13.5px;
                font-weight: bold;
                cursor: pointer;
                background: ${isSelected ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSelected ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSelected ? "white" : "#90a4ae"};
                transition: all 0.15s ease;
            `;
            tabBtn.addEventListener("click", () => {
                this.activeTab = tab.id;
                this.createRootUI();
                this.renderTabContent();
            });
            tabBar.appendChild(tabBtn);
        });

        container.appendChild(tabBar);

        // 4. Dynamic Content Area
        const contentArea = document.createElement("div");
        contentArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: rgba(25, 31, 43, 0.95);
            border: 1px solid rgba(80, 100, 140, 0.35);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        `;

        container.appendChild(contentArea);
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        this.rootElement = backdrop;
        this.contentArea = contentArea;
    }

    private async loadTargetData(): Promise<void> {
        if (!this.target || typeof this.target.MemberNumber !== "number") {
            this.errorMessage = "Invalid target character.";
            this.renderTabContent();
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.renderTabContent();

        const res = await requestInspect(this.target.MemberNumber);
        this.isLoading = false;

        if (!res.success || !res.data) {
            this.errorMessage = res.error || "Failed to inspect target player.";
        } else {
            this.targetData = res.data;
            this.targetRulesCopy = structuredClone(res.data.rules || []);
        }

        this.renderTabContent();
    }

    private renderTabContent(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        if (!this.isSelf && this.isLoading) {
            this.contentArea.innerHTML = "<div style='font-size: 16px; color: #64b5f6; padding: 24px; text-align: center;'>Querying Quality of Club manifest and authority from target player...</div>";
            return;
        }

        if (!this.isSelf && this.errorMessage) {
            this.contentArea.innerHTML = `
                <div style='font-size: 15px; color: #ef5350; padding: 18px; background: rgba(239, 83, 80, 0.1); border: 1px solid #ef5350; border-radius: 6px;'>
                    Inspection Error: ${this.errorMessage}
                </div>
                <button id='zc-retry-inspect' style='padding: 10px 22px; border-radius: 6px; background: #1976d2; color: white; border: none; font-weight: bold; width: fit-content; cursor: pointer; margin-top: 10px;'>
                    🔄 Retry Inspection
                </button>
            `;
            const retry = this.contentArea.querySelector("#zc-retry-inspect");
            retry?.addEventListener("click", () => this.loadTargetData());
            return;
        }

        switch (this.activeTab) {
            case "addons":
                this.renderAddonsTab();
                break;
            case "rules":
                this.renderRulesTab();
                break;
            case "roles":
                this.renderRolesTab();
                break;
            case "permissions":
                this.renderPermissionsTab();
                break;
            case "settings":
                this.renderSettingsTab();
                break;
            default:
                this.renderAddonsTab();
                break;
        }
    }

    // ==========================================
    // TAB 1: ADDONS & COMPLIANCE
    // ==========================================

    private renderAddonsTab(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const subjectName = this.getSubjectName();

        // Check permissions
        const canViewAddons = this.isSelf ? checkPermissionAccess("inspect_view_addons") : (this.targetData?.canViewAddons ?? true);
        const canViewRules = this.isSelf ? checkPermissionAccess("inspect_view_rules") : (this.targetData?.canViewRules ?? true);
        const canRemoveRules = this.isSelf ? checkPermissionAccess("rules_remove_rules") : (this.targetData?.callerPermissions?.rules_remove_rules ?? false);
        const canForceCompliance = this.isSelf ? checkPermissionAccess("rules_force_compliance") : (this.targetData?.callerPermissions?.rules_force_compliance ?? false);
        const canForceInjection = this.isSelf ? true : (this.targetData?.callerPermissions?.rules_force_injection ?? false);
        const isForcedInjectionAllowed = this.isSelf ? true : (this.targetData?.preferences?.allowForcedInjection ?? false);

        const mods: DetectedMod[] = this.isSelf ? getLoadedMods() : (this.targetData?.mods || []);
        const rules: ModRule[] = this.isSelf
            ? modStorage.inspector.rules
            : (this.targetRulesCopy.length > 0 ? this.targetRulesCopy : (this.targetData?.rules || []));
        const compliance = checkComplianceAgainstRules(mods, rules);

        // Auto-evaluate compliance for self in background if there are unsatisfied missing rules and Silent auto-load is on
        if (this.isSelf && compliance.hasRules && compliance.missing.length > 0 && modStorage.inspector.autoLoadMode === "Silent") {
            evaluateCompliance().then(rep => {
                if (rep.isCompliant && this.activeTab === "addons") {
                    this.renderAddonsTab();
                }
            });
        }

        // 1. Status Banner (if canViewRules)
        if (canViewRules) {
            const banner = document.createElement("div");
            if (!compliance.hasRules) {
                banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(41, 121, 255, 0.15);
                    border: 1px solid #2979ff;
                    color: #90caf9;
                    margin-bottom: 12px;
                `;
                banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">ℹ️ NO ACTIVE RULES CONFIGURED</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        No mandatory or forbidden addon rules are currently locked on ${subjectName}.
                        Switch to the <b>🔒 Enforce Rules</b> tab to configure rules.
                    </div>
                `;
            } else if (compliance.isCompliant) {
                banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(46, 125, 50, 0.25);
                    border: 1px solid #4caf50;
                    color: #a5d6a7;
                    margin-bottom: 12px;
                `;
                banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">✓ FULLY COMPLIANT: All ${rules.length} active addon rule(s) met.</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        ${subjectName} satisfies all mandatory and forbidden addon requirements.
                    </div>
                `;
            } else {
                banner.style.cssText = `
                    padding: 14px 20px;
                    border-radius: 6px;
                    background: rgba(198, 40, 40, 0.3);
                    border: 1px solid #ef5350;
                    color: #ffcdd2;
                    margin-bottom: 12px;
                `;
                banner.innerHTML = `
                    <div style="font-size: 15px; font-weight: bold;">⚠️ POLICY VIOLATION: ${subjectName} is NON-COMPLIANT!</div>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 4px; color: #cfd8dc;">
                        ${compliance.missing.length > 0 ? `Missing Mandatory: <b>${compliance.missing.map(m => m.modName).join(", ")}</b>. ` : ''}
                        ${compliance.forbidden.length > 0 ? `Running Forbidden: <b>${compliance.forbidden.map(m => m.modName).join(", ")}</b>.` : ''}
                    </div>
                `;
            }
            this.contentArea.appendChild(banner);
        } else {
            const ruleLockBanner = document.createElement("div");
            ruleLockBanner.style.cssText = "padding: 14px 20px; border-radius: 6px; background: rgba(239, 83, 80, 0.15); border: 1px solid #ef5350; color: #ef9a9a; margin-bottom: 12px;";
            ruleLockBanner.innerHTML = `
                <div style="font-size: 15px; font-weight: bold;">🔒 ACTIVE RULES & COMPLIANCE HIDDEN</div>
                <div style="font-size: 13px; margin-top: 4px; color: #ffcdd2;">You do not meet the minimum role required to view active addon rules on ${subjectName}.</div>
            `;
            this.contentArea.appendChild(ruleLockBanner);
        }

        // Action Toolbar (Force Compliance & Clear All)
        if (canViewRules && (canForceCompliance || (canRemoveRules && rules.length > 0))) {
            const toolbar = document.createElement("div");
            toolbar.style.cssText = "display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;";

            if (canForceCompliance) {
                const forceBtn = document.createElement("button");
                forceBtn.textContent = "⚡ Force Compliance Evaluation Now";
                forceBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: #1565c0; border: 1px solid #42a5f5; color: white; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
                forceBtn.addEventListener("click", async () => {
                    forceBtn.disabled = true;
                    forceBtn.textContent = "⏳ Evaluating...";
                    if (this.isSelf) {
                        const report = await evaluateCompliance();
                        toastsManager.info({
                            title: `${MOD_NAME} Compliance Check`,
                            message: report.isCompliant ? "All addon rules are currently satisfied." : `Check complete: ${report.missingRequired.length} missing, ${report.detectedForbidden.length} forbidden.`,
                            duration: 4000
                        });
                        this.renderAddonsTab();
                    } else if (this.target && typeof this.target.MemberNumber === "number") {
                        const res = await requestTriggerCompliance(this.target.MemberNumber);
                        if (res.success && res.data?.report) {
                            toastsManager.info({
                                title: `${MOD_NAME} Compliance Evaluated`,
                                message: res.data.report.isCompliant ? `${subjectName} satisfies all rules!` : `${subjectName} has ${res.data.report.missingCount} missing mandatory, ${res.data.report.forbiddenCount} forbidden addons.`,
                                duration: 5000
                            });
                            this.loadTargetData();
                        } else {
                            toastsManager.error({
                                title: `${MOD_NAME} Trigger Failed`,
                                message: res.error || "Target player rejected compliance trigger.",
                                duration: 4000
                            });
                        }
                    }
                    forceBtn.disabled = false;
                    forceBtn.textContent = "⚡ Force Compliance Evaluation Now";
                });
                toolbar.appendChild(forceBtn);

                if (!this.isSelf && canForceInjection && compliance.missing.length > 0) {
                    const forceInjectAllBtn = document.createElement("button");
                    forceInjectAllBtn.textContent = `💉 Force Inject All Missing Addons (${compliance.missing.length})`;
                    forceInjectAllBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: rgba(76, 175, 80, 0.3); border: 1px solid #4caf50; color: #a5d6a7; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
                    forceInjectAllBtn.addEventListener("click", async () => {
                        if (!this.target || typeof this.target.MemberNumber !== "number") return;
                        forceInjectAllBtn.disabled = true;
                        forceInjectAllBtn.textContent = "⏳ Injecting Addons...";
                        const res = await requestForceInject(this.target.MemberNumber, "all");
                        if (res.success) {
                            toastsManager.success({
                                title: `${MOD_NAME} Injection Complete`,
                                message: `Injected missing addons on ${subjectName}.`,
                                duration: 5000
                            });
                            await this.loadTargetData();
                        } else {
                            toastsManager.error({
                                title: `${MOD_NAME} Injection Failed`,
                                message: res.error || "Failed to inject addons on target.",
                                duration: 5000
                            });
                            forceInjectAllBtn.disabled = false;
                            forceInjectAllBtn.textContent = `💉 Force Inject All Missing Addons (${compliance.missing.length})`;
                        }
                    });
                    toolbar.appendChild(forceInjectAllBtn);
                }
            }

            if (canRemoveRules && rules.length > 0) {
                const clearAllBtn = document.createElement("button");
                clearAllBtn.textContent = "🗑️ Clear All Rules";
                clearAllBtn.style.cssText = "padding: 9px 18px; border-radius: 5px; background: rgba(198, 40, 40, 0.4); border: 1px solid #ef5350; color: #ffcdd2; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.2s;";
                clearAllBtn.addEventListener("click", async () => {
                    if (!confirm(`Are you sure you want to remove ALL active rules from ${subjectName}?`)) return;
                    this.targetRulesCopy = [];
                    if (this.isSelf) {
                        modStorage.inspector.rules = [];
                        saveStorage();
                        syncStorage();
                        toastsManager.info({ title: `${MOD_NAME} Rules Cleared`, message: "All addon rules cleared.", duration: 3000 });
                        this.renderAddonsTab();
                    } else if (this.target && typeof this.target.MemberNumber === "number") {
                        const res = await requestSetRules(this.target.MemberNumber, []);
                        if (res.success) {
                            if (this.targetData) this.targetData.rules = [];
                            toastsManager.info({ title: `${MOD_NAME} Rules Cleared`, message: `All rules cleared from ${subjectName}.`, duration: 3000 });
                            this.renderAddonsTab();
                        } else {
                            toastsManager.error({ title: `${MOD_NAME} Clear Failed`, message: res.error || "Failed to clear rules.", duration: 4000 });
                        }
                    }
                });
                toolbar.appendChild(clearAllBtn);
            }

            this.contentArea.appendChild(toolbar);
        }

        // 2. Active Rule Breakdown (Shows status of every rule)
        if (canViewRules && compliance.hasRules) {
            const rulesSection = document.createElement("div");
            rulesSection.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;";
            rulesSection.innerHTML = `<div style="font-size: 15px; font-weight: bold; color: #64b5f6;">Rule Requirements & Live Status (${rules.length}):</div>`;

            compliance.details.forEach(detail => {
                const isMandatory = detail.rule.type === "required" || (detail.rule.type as string) === "mandatory";
                const isMet = detail.status === "met";
                const card = document.createElement("div");
                card.style.cssText = `
                    background: rgba(35, 43, 60, 0.85);
                    border-left: 5px solid ${isMet ? "#4caf50" : "#ef5350"};
                    border: 1px solid rgba(80, 100, 140, 0.4);
                    border-radius: 6px;
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `;
                const matchedNote = detail.matchedMod ? ` (Matched: ${detail.matchedMod.name}${detail.matchedMod.version ? ` v${detail.matchedMod.version}` : ""})` : "";

                const leftDiv = document.createElement("div");
                leftDiv.innerHTML = `
                    <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${detail.rule.modName}</div>
                    <div style="font-size: 12px; color: ${isMet ? "#81c784" : "#e57373"}; margin-top: 2px;">
                        ${isMandatory
                            ? (isMet ? `✓ Mandatory requirement satisfied${matchedNote}` : "❌ MANDATORY REQUIREMENT VIOLATED: Mod is NOT loaded in session!")
                            : (isMet ? "✓ Forbidden rule satisfied (Mod is not running)" : `🚫 FORBIDDEN RULE VIOLATED: Mod is actively running${matchedNote}!`)
                        }
                    </div>
                `;

                const rightDiv = document.createElement("div");
                rightDiv.style.cssText = "display: flex; align-items: center; gap: 8px;";

                const badge = document.createElement("span");
                badge.style.cssText = `background: ${isMet ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"}; color: ${isMet ? "#81c784" : "#e57373"}; border: 1px solid ${isMet ? "#4caf50" : "#f44336"}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;`;
                badge.textContent = isMet ? "MET" : "VIOLATION";
                rightDiv.appendChild(badge);

                if (isMandatory && !isMet) {
                    if (!this.isSelf && canForceInjection) {
                        const forceInjectBtn = document.createElement("button");
                        forceInjectBtn.textContent = "💉 Force Inject";
                        forceInjectBtn.title = `Remotely force injection of ${detail.rule.modName} on ${subjectName}`;
                        forceInjectBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(76, 175, 80, 0.25); border: 1px solid #4caf50; color: #a5d6a7; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
                        forceInjectBtn.addEventListener("click", async () => {
                            if (!this.target || typeof this.target.MemberNumber !== "number") return;
                            forceInjectBtn.disabled = true;
                            forceInjectBtn.textContent = "⏳ Injecting...";
                            const res = await requestForceInject(this.target.MemberNumber, detail.rule.modId);
                            if (res.success) {
                                toastsManager.success({
                                    title: `${MOD_NAME} Addon Injected`,
                                    message: `${detail.rule.modName} injected on ${subjectName}!`,
                                    duration: 4000
                                });
                                await this.loadTargetData();
                            } else {
                                toastsManager.error({
                                    title: `${MOD_NAME} Injection Failed`,
                                    message: res.error || "Target client rejected addon injection.",
                                    duration: 4000
                                });
                                forceInjectBtn.disabled = false;
                                forceInjectBtn.textContent = "💉 Force Inject";
                            }
                        });
                        rightDiv.appendChild(forceInjectBtn);
                    } else if (this.isSelf) {
                        const injectSelfBtn = document.createElement("button");
                        injectSelfBtn.textContent = "💉 Inject Now";
                        injectSelfBtn.title = `Inject ${detail.rule.modName} into your session now`;
                        injectSelfBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(76, 175, 80, 0.25); border: 1px solid #4caf50; color: #a5d6a7; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
                        injectSelfBtn.addEventListener("click", async () => {
                            injectSelfBtn.disabled = true;
                            injectSelfBtn.textContent = "⏳ Injecting...";
                            const ok = await loadCuratedMod(detail.rule.modId);
                            if (ok) {
                                toastsManager.success({
                                    title: `${MOD_NAME} Addon Injected`,
                                    message: `${detail.rule.modName} has been injected and activated!`,
                                    duration: 3500
                                });
                                await evaluateCompliance();
                                this.renderAddonsTab();
                            } else {
                                toastsManager.error({
                                    title: `${MOD_NAME} Injection Failed`,
                                    message: `Could not load ${detail.rule.modName}. Check URL or network console.`,
                                    duration: 4000
                                });
                                injectSelfBtn.disabled = false;
                                injectSelfBtn.textContent = "💉 Inject Now";
                            }
                        });
                        rightDiv.appendChild(injectSelfBtn);
                    }
                }

                if (canRemoveRules) {
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "🗑️ Remove";
                    removeBtn.title = "Remove this active rule";
                    removeBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
                    removeBtn.addEventListener("click", async () => {
                        this.targetRulesCopy = this.targetRulesCopy.filter(r => r.modId.toLowerCase() !== detail.rule.modId.toLowerCase());
                        if (this.isSelf) {
                            modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                            saveStorage();
                            syncStorage();
                            toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${detail.rule.modName} removed.`, duration: 2500 });
                            this.renderAddonsTab();
                        } else if (this.target && typeof this.target.MemberNumber === "number") {
                            const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                            if (res.success) {
                                if (this.targetData) this.targetData.rules = structuredClone(this.targetRulesCopy);
                                toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${detail.rule.modName} removed from ${subjectName}.`, duration: 2500 });
                                this.renderAddonsTab();
                            } else {
                                toastsManager.error({ title: `${MOD_NAME} Remove Failed`, message: res.error || "Failed to remove rule.", duration: 4000 });
                            }
                        }
                    });
                    rightDiv.appendChild(removeBtn);
                }

                card.appendChild(leftDiv);
                card.appendChild(rightDiv);
                rulesSection.appendChild(card);
            });
            this.contentArea.appendChild(rulesSection);
        }

        // 3. Loaded Addons Manifest (if canViewAddons)
        if (canViewAddons) {
            const modsHeader = document.createElement("div");
            modsHeader.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 8px;";
            modsHeader.textContent = `Loaded Addons in Session (${mods.length}):`;
            this.contentArea.appendChild(modsHeader);

            if (mods.length === 0) {
                const empty = document.createElement("div");
                empty.style.cssText = "color: #90a4ae; padding: 20px; text-align: center; background: rgba(30, 36, 48, 0.6); border-radius: 6px;";
                empty.textContent = "No external addons detected in session.";
                this.contentArea.appendChild(empty);
            } else {
                for (const mod of mods) {
                    const card = document.createElement("div");
                    card.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;";
                    card.innerHTML = `
                        <div>
                            <div style="font-size: 15px; font-weight: bold; color: #64b5f6;">${mod.name}</div>
                            <div style="font-size: 12px; color: #8fa0b5; margin-top: 2px;">ID: ${mod.id}${mod.repository ? ` • Repo: ${mod.repository}` : ""}</div>
                        </div>
                        <span style="background: rgba(41, 121, 255, 0.2); border: 1px solid #2979ff; color: #82b1ff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            v${mod.version || "Active"}
                        </span>
                    `;
                    this.contentArea.appendChild(card);
                }
            }
        } else {
            const addonLockNotice = document.createElement("div");
            addonLockNotice.style.cssText = "padding: 14px 20px; border-radius: 6px; background: rgba(239, 83, 80, 0.15); border: 1px solid #ef5350; color: #ef9a9a;";
            addonLockNotice.innerHTML = `
                <div style="font-size: 15px; font-weight: bold;">🔒 LOADED ADDONS HIDDEN</div>
                <div style="font-size: 13px; margin-top: 4px; color: #ffcdd2;">You do not meet the minimum role required to view loaded addons in ${subjectName}'s session.</div>
            `;
            this.contentArea.appendChild(addonLockNotice);
        }
    }

    // ==========================================
    // TAB 2: ENFORCE RULES
    // ==========================================

    private renderRulesTab(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const subjectName = this.getSubjectName();

        // Target rules copy initialization
        if (this.isSelf) {
            this.targetRulesCopy = structuredClone(modStorage.inspector.rules || []);
        }

        const canMandatory = this.isSelf ? checkPermissionAccess("rules_lock_mandatory") : (this.targetData?.callerPermissions?.rules_lock_mandatory ?? false);
        const canForbidden = this.isSelf ? checkPermissionAccess("rules_lock_forbidden") : (this.targetData?.callerPermissions?.rules_lock_forbidden ?? false);
        const canRemove = this.isSelf ? checkPermissionAccess("rules_remove_rules") : (this.targetData?.callerPermissions?.rules_remove_rules ?? false);

        if (!canMandatory && !canForbidden && !canRemove) {
            const lockNotice = document.createElement("div");
            lockNotice.style.cssText = "color: #ef5350; font-size: 13px; font-weight: bold; padding: 14px; background: rgba(239, 83, 80, 0.12); border: 1px solid #ef5350; border-radius: 6px; margin-bottom: 14px;";
            lockNotice.textContent = this.isSelf
                ? "🔒 Rule management is locked: You do not have self-access to modify addon rules on yourself (controlled by your dominant)."
                : `🔒 Rule enforcement is restricted: You do not meet the minimum role required to lock addon rules on ${subjectName}.`;
            this.contentArea.appendChild(lockNotice);
        }

        // Active Rules Section with direct remove buttons
        if (this.targetRulesCopy.length > 0) {
            const activeHeader = document.createElement("div");
            activeHeader.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 8px;";
            activeHeader.textContent = `Currently Active Rules (${this.targetRulesCopy.length}):`;
            this.contentArea.appendChild(activeHeader);

            const activeList = document.createElement("div");
            activeList.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;";

            for (const rule of this.targetRulesCopy) {
                const isMandatory = rule.type === "required" || (rule.type as string) === "mandatory";
                const card = document.createElement("div");
                card.style.cssText = `
                    background: rgba(35, 43, 60, 0.85);
                    border-left: 5px solid ${isMandatory ? "#4caf50" : "#ef5350"};
                    border: 1px solid rgba(80, 100, 140, 0.4);
                    border-radius: 6px;
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `;

                const left = document.createElement("div");
                left.innerHTML = `
                    <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${rule.modName}</div>
                    <div style="font-size: 12px; color: #8fa0b5; margin-top: 2px;">Enforced by: Member #${rule.enforcedBy}${rule.enforcedByName ? ` (${rule.enforcedByName})` : ""}</div>
                `;

                const right = document.createElement("div");
                right.style.cssText = "display: flex; align-items: center; gap: 8px;";

                const badge = document.createElement("span");
                badge.style.cssText = `background: ${isMandatory ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"}; color: ${isMandatory ? "#81c784" : "#e57373"}; border: 1px solid ${isMandatory ? "#4caf50" : "#f44336"}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;`;
                badge.textContent = isMandatory ? "🔒 MANDATORY" : "🚫 FORBIDDEN";
                right.appendChild(badge);

                if (canRemove) {
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "🗑️ Remove";
                    removeBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer; transition: all 0.15s;";
                    removeBtn.addEventListener("click", async () => {
                        this.targetRulesCopy = this.targetRulesCopy.filter(r => r.modId.toLowerCase() !== rule.modId.toLowerCase());
                        if (this.isSelf) {
                            modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                            saveStorage();
                            syncStorage();
                            toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${rule.modName} removed.`, duration: 2500 });
                            this.renderRulesTab();
                        } else if (this.target && typeof this.target.MemberNumber === "number") {
                            const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                            if (res.success) {
                                if (this.targetData) this.targetData.rules = structuredClone(this.targetRulesCopy);
                                toastsManager.info({ title: `${MOD_NAME} Rule Removed`, message: `Rule for ${rule.modName} removed from ${subjectName}.`, duration: 2500 });
                                this.renderRulesTab();
                            } else {
                                toastsManager.error({ title: `${MOD_NAME} Remove Failed`, message: res.error || "Failed to remove rule.", duration: 4000 });
                            }
                        }
                    });
                    right.appendChild(removeBtn);
                }

                card.appendChild(left);
                card.appendChild(right);
                activeList.appendChild(card);
            }
            this.contentArea.appendChild(activeList);
        }

        // Community & Curated Addon Catalog
        const catalogHeader = document.createElement("div");
        catalogHeader.style.cssText = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;";

        const allCatalogMods = Object.values(getAllCatalogMods());
        catalogHeader.innerHTML = `
            <div style="font-size: 15px; font-weight: bold; color: #64b5f6;">
                Community & Curated Addon Catalog (${allCatalogMods.length}):
            </div>
        `;

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "🔍 Search addons (name, ID, author, tags)...";
        searchInput.value = this.catalogSearchText;
        searchInput.style.cssText = `
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 13px;
            border-radius: 6px;
            width: 340px;
            outline: none;
        `;

        catalogHeader.appendChild(searchInput);
        this.contentArea.appendChild(catalogHeader);

        const catalogContainer = document.createElement("div");
        catalogContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
        this.contentArea.appendChild(catalogContainer);

        const renderCatalogItems = () => {
            catalogContainer.innerHTML = "";
            const query = this.catalogSearchText.toLowerCase().trim();
            const filteredList = allCatalogMods.filter(item => {
                if (!query) return true;
                if (item.name.toLowerCase().includes(query)) return true;
                if (item.id.toLowerCase().includes(query)) return true;
                if (item.description && item.description.toLowerCase().includes(query)) return true;
                if (item.author && item.author.toLowerCase().includes(query)) return true;
                if (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(query))) return true;
                if (Array.isArray(item.detectKeys) && item.detectKeys.some(k => k.toLowerCase().includes(query))) return true;
                return false;
            });

            if (filteredList.length === 0) {
                const emptyNotice = document.createElement("div");
                emptyNotice.style.cssText = "padding: 20px; text-align: center; color: #90a4ae; background: rgba(30, 36, 48, 0.5); border-radius: 6px;";
                emptyNotice.textContent = `No addons match "${this.catalogSearchText}".`;
                catalogContainer.appendChild(emptyNotice);
                return;
            }

            for (const item of filteredList) {
                const row = document.createElement("div");
                row.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;";

                const tagPills = (Array.isArray(item.tags) && item.tags.length > 0)
                    ? item.tags.map(t => `<span style="background: rgba(41, 121, 255, 0.15); border: 1px solid rgba(66, 165, 245, 0.3); color: #90caf9; font-size: 10px; padding: 1px 5px; border-radius: 3px;">${t}</span>`).join(" ")
                    : "";
                const authorNote = item.author ? `<span style="color: #78909c; font-size: 11px;">by ${item.author}</span>` : "";

                const left = document.createElement("div");
                left.style.cssText = "max-width: 65%;";
                left.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 15px; font-weight: bold; color: #64b5f6;">${item.name}</span>
                        ${authorNote}
                        ${item.isCustom ? '<span style="background: rgba(255, 152, 0, 0.2); border: 1px solid #ff9800; color: #ffb74d; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;">CUSTOM</span>' : ''}
                        ${tagPills}
                    </div>
                    <div style="font-size: 12px; color: #8fa0b5; margin-top: 3px; line-height: 1.4;">${item.description}</div>
                `;

                const existingRule = this.targetRulesCopy.find(r => r.modId.toLowerCase() === item.id.toLowerCase());
                const currentState = existingRule ? (existingRule.type === "required" ? "required" : existingRule.type) : "none";

                const btnGroup = document.createElement("div");
                btnGroup.style.cssText = "display: flex; gap: 8px;";

                const createChoiceBtn = (state: "none" | "required" | "forbidden", label: string, color: string, enabled: boolean) => {
                    const b = document.createElement("button");
                    b.textContent = label;
                    b.disabled = !enabled;
                    const isSelected = currentState === state;
                    b.style.cssText = `
                        padding: 7px 16px;
                        border-radius: 4px;
                        font-size: 13px;
                        font-weight: ${isSelected ? "bold" : "normal"};
                        cursor: ${enabled ? "pointer" : "not-allowed"};
                        background: ${isSelected ? color : "rgba(60, 70, 90, 0.4)"};
                        border: 1px solid ${isSelected ? color : "rgba(100, 120, 150, 0.4)"};
                        color: ${isSelected ? "white" : "#b0bec5"};
                        opacity: ${enabled ? "1" : "0.5"};
                        transition: all 0.15s ease;
                    `;
                    b.addEventListener("click", async () => {
                        if (!enabled) return;
                        this.targetRulesCopy = this.targetRulesCopy.filter(r => r.modId.toLowerCase() !== item.id.toLowerCase());
                        if (state !== "none") {
                            this.targetRulesCopy.push({
                                modId: item.id,
                                modName: item.name,
                                type: state,
                                enforcedBy: typeof Player !== "undefined" ? (Player.MemberNumber || 0) : 0,
                                enforcedByName: typeof Player !== "undefined" ? Player.Name : undefined,
                                enforcedAt: Date.now()
                            });
                        }

                        if (this.isSelf) {
                            modStorage.inspector.rules = structuredClone(this.targetRulesCopy);
                            saveStorage();
                            syncStorage();
                            evaluateCompliance();
                            toastsManager.info({
                                title: `${MOD_NAME} Rules`,
                                message: `Rule for ${item.name} set to ${state === "none" ? "Neutral (Removed)" : state.toUpperCase()}.`,
                                duration: 2500
                            });
                            this.renderRulesTab();
                        } else {
                            if (this.targetData) {
                                this.targetData.rules = structuredClone(this.targetRulesCopy);
                            }
                            this.renderRulesTab();

                            if (this.target && typeof this.target.MemberNumber === "number") {
                                const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                                if (res.success) {
                                    toastsManager.info({
                                        title: `${MOD_NAME} Rules`,
                                        message: `Rule for ${item.name} synced to ${subjectName}.`,
                                        duration: 2500
                                    });
                                } else {
                                    toastsManager.error({
                                        title: `${MOD_NAME} Sync Failed`,
                                        message: res.error || "Failed to sync rule to target.",
                                        duration: 4000
                                    });
                                }
                            }
                        }
                    });
                    return b;
                };

                btnGroup.appendChild(createChoiceBtn("none", "🔓 Neutral", "#78909c", canRemove));
                btnGroup.appendChild(createChoiceBtn("required", "🔒 Mandatory", "#2e7d32", canMandatory));
                btnGroup.appendChild(createChoiceBtn("forbidden", "🚫 Forbidden", "#c62828", canForbidden));

                row.appendChild(left);
                row.appendChild(btnGroup);
                catalogContainer.appendChild(row);
            }
        };

        searchInput.addEventListener("input", (e) => {
            this.catalogSearchText = (e.target as HTMLInputElement).value;
            renderCatalogItems();
        });

        renderCatalogItems();

        // Re-sync All button (only for remote targets)
        if (!this.isSelf) {
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "💾 Re-sync All Rules to Target";
            saveBtn.style.cssText = "padding: 12px 28px; border-radius: 6px; background: #2e7d32; border: 1px solid #4caf50; color: white; font-weight: bold; font-size: 15px; cursor: pointer; width: fit-content; margin-top: 14px;";
            saveBtn.addEventListener("click", async () => {
                if (!this.target || typeof this.target.MemberNumber !== "number") return;
                toastsManager.info({
                    title: `${MOD_NAME} Syncing`,
                    message: "Transmitting addon rules to target player...",
                    duration: 3000
                });

                const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
                if (res.success) {
                    if (this.targetData) {
                        this.targetData.rules = structuredClone(this.targetRulesCopy);
                    }
                    toastsManager.success({
                        title: `${MOD_NAME} Rules Synced`,
                        message: "Addon rules successfully locked on target!",
                        duration: 5000
                    });
                } else {
                    toastsManager.error({
                        title: `${MOD_NAME} Sync Failed`,
                        message: res.error || "Target rejected rule sync.",
                        duration: 5000
                    });
                }
            });
            this.contentArea.appendChild(saveBtn);
        }
    }

    // ==========================================
    // TAB 3: ROLE MANAGEMENT
    // ==========================================

    private renderRolesTab(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const subjectName = this.getSubjectName();
        const authority: AuthorityData = this.isSelf
            ? modStorage.authority
            : (this.targetData?.authority || { owners: [], mistresses: [], permissions: structuredClone(DEFAULT_PERMISSIONS) });

        const canEditRoles = this.isSelf
            ? checkPermissionAccess("authority_edit_roles")
            : (this.targetData?.callerPermissions?.authority_edit_roles ?? false);

        const topRow = document.createElement("div");
        topRow.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;";

        const leftCol = document.createElement("div");
        leftCol.style.cssText = "flex: 1; display: flex; flex-direction: column; gap: 16px;";

        // Role Add Card
        const addCard = document.createElement("div");
        addCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px;";
        addCard.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                Assign Custom Dominant Roles for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 14px;">
                Enter a player's Member Number to grant them custom Owner or Mistress authority in Quality of Club.
            </div>
        `;

        const inputRow = document.createElement("div");
        inputRow.style.cssText = "display: flex; align-items: center; gap: 12px; flex-wrap: wrap;";

        const numInput = document.createElement("input");
        numInput.type = "number";
        numInput.placeholder = "Member Number";
        numInput.disabled = !canEditRoles;
        numInput.style.cssText = `
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 14px;
            border-radius: 6px;
            width: 180px;
        `;

        const addOwnerBtn = document.createElement("button");
        addOwnerBtn.textContent = "Add as Owner";
        addOwnerBtn.disabled = !canEditRoles;
        addOwnerBtn.style.cssText = `
            padding: 9px 18px;
            background: ${canEditRoles ? "#1976d2" : "#455a64"};
            border: 1px solid #42a5f5;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: ${canEditRoles ? "pointer" : "not-allowed"};
        `;
        addOwnerBtn.addEventListener("click", async () => {
            const val = parseInt(numInput.value.trim(), 10);
            if (!val) return;

            if (this.isSelf) {
                const res = addRoleMember("owner", val);
                if (res.success) {
                    numInput.value = "";
                    this.renderRolesTab();
                } else {
                    alert(res.message);
                }
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "add_role", role: "owner", memberNumber: val });
                if (res.success && res.data?.authority) {
                    this.targetData!.authority = res.data.authority;
                    numInput.value = "";
                    this.renderRolesTab();
                } else {
                    alert(res.error || "Failed to add role.");
                }
            }
        });

        const addMistressBtn = document.createElement("button");
        addMistressBtn.textContent = "Add as Mistress";
        addMistressBtn.disabled = !canEditRoles;
        addMistressBtn.style.cssText = `
            padding: 9px 18px;
            background: ${canEditRoles ? "#7b1fa2" : "#455a64"};
            border: 1px solid #ba68c8;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: ${canEditRoles ? "pointer" : "not-allowed"};
        `;
        addMistressBtn.addEventListener("click", async () => {
            const val = parseInt(numInput.value.trim(), 10);
            if (!val) return;

            if (this.isSelf) {
                const res = addRoleMember("mistress", val);
                if (res.success) {
                    numInput.value = "";
                    this.renderRolesTab();
                } else {
                    alert(res.message);
                }
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "add_role", role: "mistress", memberNumber: val });
                if (res.success && res.data?.authority) {
                    this.targetData!.authority = res.data.authority;
                    numInput.value = "";
                    this.renderRolesTab();
                } else {
                    alert(res.error || "Failed to add role.");
                }
            }
        });

        inputRow.appendChild(numInput);
        inputRow.appendChild(addOwnerBtn);
        inputRow.appendChild(addMistressBtn);
        addCard.appendChild(inputRow);

        if (!canEditRoles) {
            const lockNotice = document.createElement("div");
            lockNotice.style.cssText = "color: #ef5350; font-size: 12px; margin-top: 8px; font-weight: bold;";
            lockNotice.textContent = "🔒 Role editing is restricted by authority settings.";
            addCard.appendChild(lockNotice);
        }

        leftCol.appendChild(addCard);

        // Active Roles Lists
        const listsCard = document.createElement("div");
        listsCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 14px;";

        // Owners List
        const ownersHeader = document.createElement("div");
        ownersHeader.innerHTML = `<span style="font-weight: bold; color: #64b5f6; font-size: 15px;">QoC Owners (${authority.owners.length})</span>`;
        listsCard.appendChild(ownersHeader);

        const ownersBox = document.createElement("div");
        ownersBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
        if (authority.owners.length === 0) {
            ownersBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom owners assigned.</span>";
        } else {
            authority.owners.forEach(id => {
                const tag = document.createElement("div");
                tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(25, 118, 210, 0.3); border: 1px solid #42a5f5; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
                tag.innerHTML = `<span>Member #${id}</span>`;
                if (canEditRoles) {
                    const rm = document.createElement("button");
                    rm.textContent = "✕";
                    rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
                    rm.addEventListener("click", async () => {
                        if (this.isSelf) {
                            removeRoleMember("owner", id);
                            this.renderRolesTab();
                        } else if (this.target && typeof this.target.MemberNumber === "number") {
                            const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "remove_role", role: "owner", memberNumber: id });
                            if (res.success && res.data?.authority) {
                                this.targetData!.authority = res.data.authority;
                                this.renderRolesTab();
                            }
                        }
                    });
                    tag.appendChild(rm);
                }
                ownersBox.appendChild(tag);
            });
        }
        listsCard.appendChild(ownersBox);

        // Mistresses List
        const mistressHeader = document.createElement("div");
        mistressHeader.style.cssText = "margin-top: 10px;";
        mistressHeader.innerHTML = `<span style="font-weight: bold; color: #ba68c8; font-size: 15px;">QoC Mistresses (${authority.mistresses.length})</span>`;
        listsCard.appendChild(mistressHeader);

        const mistressBox = document.createElement("div");
        mistressBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
        if (authority.mistresses.length === 0) {
            mistressBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom mistresses assigned.</span>";
        } else {
            authority.mistresses.forEach(id => {
                const tag = document.createElement("div");
                tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(123, 31, 162, 0.3); border: 1px solid #ba68c8; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
                tag.innerHTML = `<span>Member #${id}</span>`;
                if (canEditRoles) {
                    const rm = document.createElement("button");
                    rm.textContent = "✕";
                    rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
                    rm.addEventListener("click", async () => {
                        if (this.isSelf) {
                            removeRoleMember("mistress", id);
                            this.renderRolesTab();
                        } else if (this.target && typeof this.target.MemberNumber === "number") {
                            const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "remove_role", role: "mistress", memberNumber: id });
                            if (res.success && res.data?.authority) {
                                this.targetData!.authority = res.data.authority;
                                this.renderRolesTab();
                            }
                        }
                    });
                    tag.appendChild(rm);
                }
                mistressBox.appendChild(tag);
            });
        }
        listsCard.appendChild(mistressBox);
        leftCol.appendChild(listsCard);
        topRow.appendChild(leftCol);

        // Right Col: Role Hierarchy Funnel
        const rightCol = document.createElement("div");
        rightCol.style.cssText = "width: 280px; display: flex; flex-direction: column; align-items: center; background: rgba(30, 36, 48, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";

        const pyramidTitle = document.createElement("div");
        pyramidTitle.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 16px; text-align: center;";
        pyramidTitle.textContent = "Hierarchy of Roles";
        rightCol.appendChild(pyramidTitle);

        const rolesList = [
            { name: subjectName, color: "#00e5ff", width: 140 },
            { name: "Clubowner", color: "#e0e6ed", width: 150 },
            { name: "Owner", color: "#e0e6ed", width: 160 },
            { name: "Lover", color: "#e0e6ed", width: 170 },
            { name: "Mistress", color: "#e0e6ed", width: 180 },
            { name: "Whitelist", color: "#e0e6ed", width: 190 },
            { name: "Friend", color: "#e0e6ed", width: 200 },
            { name: "Public", color: "#e0e6ed", width: 210 }
        ];

        rolesList.forEach((r, idx) => {
            const block = document.createElement("div");
            block.style.cssText = `
                width: ${r.width}px;
                padding: 6px 0;
                margin-bottom: 4px;
                background: ${idx === 0 ? "rgba(0, 229, 255, 0.15)" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${idx === 0 ? "#00e5ff" : "rgba(80, 100, 140, 0.4)"};
                color: ${r.color};
                font-size: 13px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
            `;
            block.textContent = r.name;
            rightCol.appendChild(block);

            if (idx < rolesList.length - 1) {
                const arrow = document.createElement("div");
                arrow.style.cssText = "font-size: 10px; color: #607d8b; line-height: 10px; margin: -2px 0 2px 0;";
                arrow.textContent = "▼";
                rightCol.appendChild(arrow);
            }
        });

        topRow.appendChild(rightCol);
        this.contentArea.appendChild(topRow);
    }

    // ==========================================
    // TAB 4: PERMISSION SETTINGS
    // ==========================================

    private renderPermissionsTab(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const subjectName = this.getSubjectName();

        const canEditMin = this.isSelf
            ? checkPermissionAccess("authority_edit_min_role")
            : (this.targetData?.callerPermissions?.authority_edit_min_role ?? false);

        const canEditSelf = this.isSelf
            ? checkPermissionAccess("authority_edit_self_access")
            : (this.targetData?.callerPermissions?.authority_edit_self_access ?? false);

        // Search Filter
        const filterBar = document.createElement("div");
        filterBar.style.cssText = "display: flex; align-items: center; gap: 12px; margin-bottom: 4px;";

        const filterLabel = document.createElement("span");
        filterLabel.textContent = "Filter:";
        filterLabel.style.cssText = "font-weight: bold; color: #90a4ae; font-size: 14px;";

        const filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.placeholder = "Search permission by name or description...";
        filterInput.value = this.permissionFilter;
        filterInput.style.cssText = `
            flex: 1;
            padding: 8px 14px;
            background: rgba(20, 26, 38, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.4);
            color: white;
            font-size: 14px;
            border-radius: 6px;
        `;
        filterInput.addEventListener("input", () => {
            this.permissionFilter = filterInput.value.toLowerCase().trim();
            this.updatePermissionsList(listContainer, subjectName, canEditMin, canEditSelf);
        });

        filterBar.appendChild(filterLabel);
        filterBar.appendChild(filterInput);
        this.contentArea.appendChild(filterBar);

        // Table Header
        const headerRow = document.createElement("div");
        headerRow.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            background: rgba(30, 36, 48, 0.6);
            border-bottom: 2px solid rgba(80, 100, 140, 0.4);
            font-weight: bold;
            font-size: 13px;
            color: #90caf9;
        `;
        headerRow.innerHTML = `
            <div style="flex: 1;">Permission Name & Scope</div>
            <div style="display: flex; align-items: center; gap: 40px; padding-right: 20px;">
                <span style="min-width: 150px; text-align: center;">${subjectName} is permitted</span>
                <span style="min-width: 160px; text-align: center;">Lowest permitted role</span>
            </div>
        `;
        this.contentArea.appendChild(headerRow);

        const listContainer = document.createElement("div");
        listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
        this.contentArea.appendChild(listContainer);

        this.updatePermissionsList(listContainer, subjectName, canEditMin, canEditSelf);
    }

    private updatePermissionsList(container: HTMLElement, subjectName: string, canEditMin: boolean, canEditSelf: boolean): void {
        container.innerHTML = "";

        const authority: AuthorityData = this.isSelf
            ? modStorage.authority
            : (this.targetData?.authority || { owners: [], mistresses: [], permissions: structuredClone(DEFAULT_PERMISSIONS) });

        const filtered = PERMISSION_DEFINITIONS.filter(def => {
            if (!this.permissionFilter) return true;
            return def.name.toLowerCase().includes(this.permissionFilter) || def.description.toLowerCase().includes(this.permissionFilter);
        });

        if (filtered.length === 0) {
            const empty = document.createElement("div");
            empty.style.cssText = "color: #90a4ae; padding: 24px; text-align: center;";
            empty.textContent = "No matching permissions found.";
            container.appendChild(empty);
            return;
        }

        filtered.forEach(def => {
            const currentSetting = authority.permissions[def.key] || { self: true, min: AccessLevel.owner };

            const row = document.createElement("div");
            row.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: rgba(35, 43, 60, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.35);
                border-radius: 6px;
                gap: 16px;
                transition: background 0.15s ease;
            `;

            // Left: Lock icon + Name + Description
            const left = document.createElement("div");
            left.style.cssText = "flex: 1; display: flex; align-items: center; gap: 12px;";
            left.innerHTML = `
                <span style="font-size: 18px;">🔒</span>
                <div>
                    <div style="font-size: 15px; font-weight: bold; color: #e0e6ed;">${def.name}</div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">${def.description}</div>
                </div>
            `;

            // Right controls
            const right = document.createElement("div");
            right.style.cssText = "display: flex; align-items: center; gap: 40px; padding-right: 10px;";

            // Self checkbox
            const selfBoxContainer = document.createElement("div");
            selfBoxContainer.style.cssText = "min-width: 150px; display: flex; justify-content: center;";

            const selfCheckbox = document.createElement("input");
            selfCheckbox.type = "checkbox";
            selfCheckbox.checked = currentSetting.self;
            selfCheckbox.disabled = !canEditSelf;
            selfCheckbox.style.cssText = `
                width: 22px;
                height: 22px;
                cursor: ${canEditSelf ? "pointer" : "not-allowed"};
                accent-color: #1976d2;
            `;
            selfCheckbox.addEventListener("change", async () => {
                const newVal = selfCheckbox.checked;

                if (this.isSelf) {
                    if (!newVal && (def.key === "authority_edit_self_access" || def.key === "authority_edit_min_role")) {
                        const ok = confirm(`⚠️ Surrendering Self-Access:\n\nAre you sure you want to disable your own access to "${def.name}"?\n\nYou will lose the ability to modify or reclaim this permission yourself — only an authorized Owner or Mistress will be able to restore it.`);
                        if (!ok) {
                            selfCheckbox.checked = true;
                            return;
                        }
                    }
                    setPermissionSelfAccess(def.key, newVal);
                    this.updatePermissionsList(container, subjectName, canEditMin, canEditSelf);
                } else if (this.target && typeof this.target.MemberNumber === "number") {
                    const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "set_self_access", perm: def.key, selfAllowed: newVal });
                    if (res.success && res.data?.authority) {
                        this.targetData!.authority = res.data.authority;
                        this.updatePermissionsList(container, subjectName, canEditMin, canEditSelf);
                    } else {
                        selfCheckbox.checked = !newVal;
                        alert(res.error || "Failed to update target's self access.");
                    }
                }
            });
            selfBoxContainer.appendChild(selfCheckbox);

            // Lowest permitted role button
            const roleBtnContainer = document.createElement("div");
            roleBtnContainer.style.cssText = "min-width: 160px; display: flex; justify-content: center;";

            const roleBtn = document.createElement("button");
            roleBtn.textContent = ACCESS_LEVEL_NAMES[currentSetting.min];
            roleBtn.disabled = !canEditMin;
            roleBtn.style.cssText = `
                padding: 8px 18px;
                width: 130px;
                text-align: center;
                background: ${currentSetting.min === AccessLevel.self ? "#00838f" : currentSetting.min <= AccessLevel.mistress ? "#1565c0" : "#455a64"};
                border: 1px solid ${canEditMin ? "#42a5f5" : "#607d8b"};
                color: white;
                font-size: 13px;
                font-weight: bold;
                border-radius: 4px;
                cursor: ${canEditMin ? "pointer" : "not-allowed"};
                transition: all 0.15s ease;
            `;
            roleBtn.addEventListener("click", () => {
                if (canEditMin) {
                    this.openRoleSelectorModal(def, currentSetting.min, subjectName);
                }
            });
            roleBtnContainer.appendChild(roleBtn);

            right.appendChild(selfBoxContainer);
            right.appendChild(roleBtnContainer);

            row.appendChild(left);
            row.appendChild(right);
            container.appendChild(row);
        });
    }

    // ==========================================
    // ROLE SELECTION MODAL
    // ==========================================

    private openRoleSelectorModal(def: PermissionDefinition, currentMin: AccessLevel, subjectName: string): void {
        if (this.modalElement) this.modalElement.remove();

        let selectedRole = currentMin;

        const modalBackdrop = document.createElement("div");
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            user-select: none;
        `;

        const dialog = document.createElement("div");
        dialog.style.cssText = `
            width: min(90vw, 850px);
            background: #191f2b;
            border: 2px solid #64b5f6;
            border-radius: 8px;
            padding: 28px 32px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            color: #e0e6ed;
            box-sizing: border-box;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        `;

        dialog.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #64b5f6; border-bottom: 1px solid rgba(80,100,140,0.3); padding-bottom: 8px;">
                Authority: Changing minimum access to "${def.name}" for ${subjectName}
            </div>
            <div style="font-size: 14px; text-align: center; color: #cfd8dc; margin-top: 4px;">
                Please select the new lowest role that should still have this permission.
            </div>
            <div id="qoc-role-info" style="font-size: 13px; text-align: center; color: #90a4ae;">
                Currently set role: <b>${ACCESS_LEVEL_NAMES[currentMin]}</b> &nbsp;→&nbsp; Newly selected role: <b id="qoc-selected-label" style="color: #64b5f6;">${ACCESS_LEVEL_NAMES[selectedRole]}</b>
            </div>
            <div style="font-size: 12px; text-align: center; color: #78909c;">
                All roles to the left of the selected one will also automatically get access.
            </div>
        `;

        const chainContainer = document.createElement("div");
        chainContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 10px 0;";

        // Top button: Subject (Self)
        const selfBtn = document.createElement("button");
        selfBtn.textContent = subjectName;
        selfBtn.style.cssText = `
            padding: 10px 28px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 4px;
            background: ${selectedRole === AccessLevel.self ? "#00e5ff" : "rgba(45, 55, 75, 0.8)"};
            border: 1px solid #00e5ff;
            color: ${selectedRole === AccessLevel.self ? "black" : "#00e5ff"};
            transition: all 0.15s ease;
        `;
        selfBtn.addEventListener("click", () => {
            selectedRole = AccessLevel.self;
            updateSelection();
        });
        chainContainer.appendChild(selfBtn);

        // Lower chain: Clubowner > Owner > Lover > Mistress > Whitelist > Friend > Public
        const lowerRow = document.createElement("div");
        lowerRow.style.cssText = "display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px;";

        const chainRoles = [
            AccessLevel.clubowner,
            AccessLevel.owner,
            AccessLevel.lover,
            AccessLevel.mistress,
            AccessLevel.whitelist,
            AccessLevel.friend,
            AccessLevel.public
        ];

        const roleButtons: { level: AccessLevel; btn: HTMLButtonElement }[] = [];

        chainRoles.forEach((lvl, idx) => {
            const b = document.createElement("button");
            b.textContent = ACCESS_LEVEL_NAMES[lvl];
            b.style.cssText = `
                padding: 8px 14px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 4px;
                background: ${selectedRole === lvl ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${selectedRole === lvl ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${selectedRole === lvl ? "white" : "#cfd8dc"};
                transition: all 0.15s ease;
            `;
            b.addEventListener("click", () => {
                selectedRole = lvl;
                updateSelection();
            });
            roleButtons.push({ level: lvl, btn: b });
            lowerRow.appendChild(b);

            if (idx < chainRoles.length - 1) {
                const separator = document.createElement("span");
                separator.textContent = ">";
                separator.style.cssText = "color: #78909c; font-weight: bold; font-size: 14px;";
                lowerRow.appendChild(separator);
            }
        });

        chainContainer.appendChild(lowerRow);
        dialog.appendChild(chainContainer);

        const updateSelection = () => {
            const labelEl = dialog.querySelector("#qoc-selected-label");
            if (labelEl) labelEl.textContent = ACCESS_LEVEL_NAMES[selectedRole];

            selfBtn.style.background = selectedRole === AccessLevel.self ? "#00e5ff" : "rgba(45, 55, 75, 0.8)";
            selfBtn.style.color = selectedRole === AccessLevel.self ? "black" : "#00e5ff";

            roleButtons.forEach(r => {
                const isMatch = r.level === selectedRole;
                r.btn.style.background = isMatch ? "#1976d2" : "rgba(45, 55, 75, 0.8)";
                r.btn.style.borderColor = isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.4)";
                r.btn.style.color = isMatch ? "white" : "#cfd8dc";
            });
        };

        // Actions: Confirm & Cancel
        const actionRow = document.createElement("div");
        actionRow.style.cssText = "display: flex; justify-content: center; gap: 16px; margin-top: 10px;";

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.style.cssText = `
            padding: 10px 32px;
            background: #2e7d32;
            border: 1px solid #4caf50;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        `;
        confirmBtn.addEventListener("click", async () => {
            if (this.isSelf) {
                setPermissionMinRole(def.key, selectedRole);
                modalBackdrop.remove();
                this.modalElement = null;
                this.renderPermissionsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, { action: "set_min_role", perm: def.key, minRole: selectedRole });
                if (res.success && res.data?.authority) {
                    this.targetData!.authority = res.data.authority;
                    modalBackdrop.remove();
                    this.modalElement = null;
                    this.renderPermissionsTab();
                } else {
                    alert(res.error || "Failed to update minimum role on target.");
                }
            }
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.cssText = `
            padding: 10px 32px;
            background: rgba(60, 70, 90, 0.8);
            border: 1px solid rgba(80, 100, 140, 0.5);
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        `;
        cancelBtn.addEventListener("click", () => {
            modalBackdrop.remove();
            this.modalElement = null;
        });

        actionRow.appendChild(confirmBtn);
        actionRow.appendChild(cancelBtn);
        dialog.appendChild(actionRow);

        modalBackdrop.appendChild(dialog);
        document.body.appendChild(modalBackdrop);
        this.modalElement = modalBackdrop;
    }

    // ==========================================
    // TAB 5: PREFERENCES & ENGINE CONFIGURATION
    // ==========================================

    private renderSettingsTab(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const subjectName = this.getSubjectName();
        const canEditPreferences = this.isSelf
            ? checkPermissionAccess("rules_edit_autoload_mode")
            : (this.targetData?.callerPermissions?.rules_edit_autoload_mode ?? false);

        const currentViolationAction: ViolationAction = this.isSelf
            ? (modStorage.inspector.violationAction || "toast")
            : (this.targetData?.preferences?.violationAction || "toast");

        const currentAutoLoadMode: AutoLoadMode = this.isSelf
            ? (modStorage.inspector.autoLoadMode || "Prompt")
            : (this.targetData?.preferences?.autoLoadMode || this.targetData?.autoLoadMode || "Prompt");

        const currentInterval: number = this.isSelf
            ? (typeof modStorage.inspector.evaluationInterval === "number" ? modStorage.inspector.evaluationInterval : 30)
            : (this.targetData?.preferences?.evaluationInterval ?? 30);

        const currentTelemetry: boolean = this.isSelf
            ? (typeof modStorage.inspector.silentTelemetry === "boolean" ? modStorage.inspector.silentTelemetry : true)
            : (this.targetData?.preferences?.silentTelemetry ?? true);

        const currentProfileBtn: boolean = this.isSelf
            ? (typeof modStorage.inspector.showProfileButton === "boolean" ? modStorage.inspector.showProfileButton : true)
            : (this.targetData?.preferences?.showProfileButton ?? true);

        const currentAllowForcedInjection: boolean = this.isSelf
            ? (typeof modStorage.inspector.allowForcedInjection === "boolean" ? modStorage.inspector.allowForcedInjection : false)
            : (this.targetData?.preferences?.allowForcedInjection ?? false);

        const customCatalog: CuratedModInfo[] = this.isSelf
            ? (modStorage.inspector.customCatalog || [])
            : (this.targetData?.customCatalog || []);

        const updatePref = async (newPref: Partial<{
            violationAction: ViolationAction;
            autoLoadMode: AutoLoadMode;
            evaluationInterval: number;
            silentTelemetry: boolean;
            showProfileButton: boolean;
            allowForcedInjection: boolean;
        }>) => {
            if (!canEditPreferences) return;

            if (this.isSelf) {
                if (newPref.violationAction) modStorage.inspector.violationAction = newPref.violationAction;
                if (newPref.autoLoadMode) modStorage.inspector.autoLoadMode = newPref.autoLoadMode;
                if (typeof newPref.evaluationInterval === "number") modStorage.inspector.evaluationInterval = newPref.evaluationInterval;
                if (typeof newPref.silentTelemetry === "boolean") modStorage.inspector.silentTelemetry = newPref.silentTelemetry;
                if (typeof newPref.showProfileButton === "boolean") modStorage.inspector.showProfileButton = newPref.showProfileButton;
                if (typeof newPref.allowForcedInjection === "boolean") modStorage.inspector.allowForcedInjection = newPref.allowForcedInjection;
                saveStorage();
                syncStorage();
                restartPeriodicComplianceTimer();
                toastsManager.info({ title: `${MOD_NAME} Preferences`, message: "Preferences updated.", duration: 2500 });
                this.renderSettingsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, {
                    action: "update_preferences",
                    preferences: newPref
                });
                if (res.success && res.data?.preferences) {
                    this.targetData!.preferences = res.data.preferences;
                    toastsManager.info({ title: `${MOD_NAME} Preferences`, message: `Preferences updated for ${subjectName}.`, duration: 2500 });
                    this.renderSettingsTab();
                } else {
                    toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to update preferences.", duration: 4000 });
                }
            }
        };

        const addCustomMod = async (mod: CuratedModInfo) => {
            if (!canEditPreferences) return;

            if (this.isSelf) {
                modStorage.inspector.customCatalog = modStorage.inspector.customCatalog || [];
                modStorage.inspector.customCatalog = modStorage.inspector.customCatalog.filter(c => c.id.toLowerCase() !== mod.id.toLowerCase());
                modStorage.inspector.customCatalog.push(mod);
                saveStorage();
                syncStorage();
                toastsManager.success({ title: `${MOD_NAME} Catalog`, message: `Added '${mod.name}' to custom catalog.`, duration: 3000 });
                this.renderSettingsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, {
                    action: "add_custom_mod",
                    customMod: mod
                });
                if (res.success && res.data?.customCatalog) {
                    this.targetData!.customCatalog = res.data.customCatalog;
                    toastsManager.success({ title: `${MOD_NAME} Catalog`, message: `Added '${mod.name}' to ${subjectName}'s catalog.`, duration: 3000 });
                    this.renderSettingsTab();
                } else {
                    toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to add custom addon.", duration: 4000 });
                }
            }
        };

        const removeCustomMod = async (modId: string) => {
            if (!canEditPreferences) return;

            if (this.isSelf) {
                modStorage.inspector.customCatalog = (modStorage.inspector.customCatalog || []).filter(c => c.id.toLowerCase() !== modId.toLowerCase());
                saveStorage();
                syncStorage();
                toastsManager.info({ title: `${MOD_NAME} Catalog`, message: "Custom addon removed from catalog.", duration: 2500 });
                this.renderSettingsTab();
            } else if (this.target && typeof this.target.MemberNumber === "number") {
                const res = await requestUpdateAuthority(this.target.MemberNumber, {
                    action: "remove_custom_mod",
                    customModId: modId
                });
                if (res.success && res.data?.customCatalog) {
                    this.targetData!.customCatalog = res.data.customCatalog;
                    toastsManager.info({ title: `${MOD_NAME} Catalog`, message: `Custom addon removed from ${subjectName}'s catalog.`, duration: 2500 });
                    this.renderSettingsTab();
                } else {
                    toastsManager.error({ title: `${MOD_NAME} Error`, message: res.error || "Failed to remove custom addon.", duration: 4000 });
                }
            }
        };

        const container = document.createElement("div");
        container.style.cssText = "display: flex; flex-direction: column; gap: 20px;";

        if (!canEditPreferences) {
            const lockMsg = document.createElement("div");
            lockMsg.style.cssText = "color: #ef5350; font-size: 13px; font-weight: bold; padding: 14px; background: rgba(239, 83, 80, 0.12); border: 1px solid #ef5350; border-radius: 6px;";
            lockMsg.textContent = this.isSelf
                ? "🔒 Preferences are locked: You do not have self-access to modify engine preferences (controlled by your dominant)."
                : `🔒 Preferences are restricted: You do not meet the minimum role required to modify engine preferences on ${subjectName}.`;
            container.appendChild(lockMsg);
        }

        // SECTION 1: Forbidden Addon Violation Action
        const violationSection = document.createElement("div");
        violationSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
        violationSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #ef5350; margin-bottom: 6px;">
                🛑 Forbidden Addon Violation Response for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Configure the enforcement action triggered when a forbidden addon is detected actively running in the player's session.
            </div>
        `;

        const violationModes: { action: ViolationAction; label: string; desc: string; badge: string; color: string }[] = [
            { action: "toast", label: "Local Warning Toast", desc: "Discretely displays high-visibility warning notifications to the player advising them to disable the forbidden addon.", badge: "DISCREET", color: "#64b5f6" },
            { action: "room_alert", label: "Room Chat Public Warning", desc: "Broadcasts a public emote announcement in the room chat alerting room members that the player is violating policy.", badge: "PUBLIC", color: "#ffb74d" },
            { action: "lockout", label: "Screen Lockout Overlay", desc: "Displays a full-screen red lockout barrier blocking game interaction until the page is reloaded without the forbidden mod.", badge: "STRICT ENFORCEMENT", color: "#e57373" },
            { action: "leave_room", label: "Auto-Leave Room", desc: "Immediately ejects the player from the chat room upon detecting a forbidden addon.", badge: "IMMEDIATE EJECTION", color: "#f06292" }
        ];

        const violList = document.createElement("div");
        violList.style.cssText = "display: flex; flex-direction: column; gap: 8px;";

        violationModes.forEach(vm => {
            const isSel = currentViolationAction === vm.action;
            const btn = document.createElement("button");
            btn.disabled = !canEditPreferences;
            btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 18px;
                border-radius: 6px;
                background: ${isSel ? "rgba(239, 83, 80, 0.15)" : "rgba(45, 55, 75, 0.7)"};
                border: 1px solid ${isSel ? "#ef5350" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "#ffcdd2" : "#cfd8dc"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                text-align: left;
                transition: all 0.15s ease;
            `;
            btn.innerHTML = `
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 14px; font-weight: bold; color: ${isSel ? "#ff8a80" : "#e0e6ed"};">${isSel ? "● " : "○ "}${vm.label}</span>
                        <span style="background: rgba(255, 255, 255, 0.08); border: 1px solid ${vm.color}; color: ${vm.color}; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;">${vm.badge}</span>
                    </div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${vm.desc}</div>
                </div>
            `;
            btn.addEventListener("click", () => updatePref({ violationAction: vm.action }));
            violList.appendChild(btn);
        });

        violationSection.appendChild(violList);
        container.appendChild(violationSection);

        // SECTION 2: Mandatory Addon Auto-Injection Behavior
        const autoLoadSection = document.createElement("div");
        autoLoadSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
        autoLoadSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                ⚡ Mandatory Addon Auto-Injection Behavior for ${subjectName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Configure how Quality of Club acts when entering a room or checking compliance if a mandatory addon is missing.
            </div>
        `;

        const autoModes: { mode: AutoLoadMode; label: string; desc: string }[] = [
            { mode: "Prompt", label: "Prompt First (Recommended)", desc: "Prompts with a confirmation dialog before injecting missing addons." },
            { mode: "Silent", label: "Silent Auto-Injection", desc: "Silently auto-injects missing mandatory scripts automatically in the background." },
            { mode: "Alert", label: "Alert Notice Only", desc: "Displays a warning notice that a required addon is missing, but does not attempt script injection." }
        ];

        const autoRow = document.createElement("div");
        autoRow.style.cssText = "display: flex; flex-direction: column; gap: 8px;";

        autoModes.forEach(m => {
            const isSel = currentAutoLoadMode === m.mode;
            const btn = document.createElement("button");
            btn.disabled = !canEditPreferences;
            btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 18px;
                border-radius: 6px;
                background: ${isSel ? "rgba(25, 118, 210, 0.3)" : "rgba(45, 55, 75, 0.7)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "#90caf9" : "#cfd8dc"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                text-align: left;
                transition: all 0.15s ease;
            `;
            btn.innerHTML = `
                <div>
                    <div style="font-size: 14px; font-weight: bold;">${isSel ? "● " : "○ "}${m.label}</div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${m.desc}</div>
                </div>
            `;
            btn.addEventListener("click", () => updatePref({ autoLoadMode: m.mode }));
            autoRow.appendChild(btn);
        });

        autoLoadSection.appendChild(autoRow);

        // Forced Addon Injection by Others Toggle
        const forcedInjectRow = document.createElement("div");
        forcedInjectRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding-top: 14px; margin-top: 14px; border-top: 1px solid rgba(80, 100, 140, 0.3);";
        forcedInjectRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">💉 Allow Remote Forced Addon Injection by Others</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">
                    Permits authorized dominants (governed by the <b>Force Compliance & Injection</b> permission) to remotely inject missing mandatory addons on ${subjectName}, even when auto-injection is set to Prompt or Alert.
                </div>
            </div>
        `;
        const forcedInjectBtn = document.createElement("button");
        forcedInjectBtn.disabled = !canEditPreferences;
        forcedInjectBtn.textContent = currentAllowForcedInjection ? "✓ Enabled" : "✕ Disabled";
        forcedInjectBtn.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentAllowForcedInjection ? "rgba(76, 175, 80, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentAllowForcedInjection ? "#4caf50" : "#78909c"};
            color: ${currentAllowForcedInjection ? "#81c784" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
        forcedInjectBtn.addEventListener("click", () => updatePref({ allowForcedInjection: !currentAllowForcedInjection }));
        forcedInjectRow.appendChild(forcedInjectBtn);
        autoLoadSection.appendChild(forcedInjectRow);

        container.appendChild(autoLoadSection);

        // SECTION 3: Periodic Compliance Polling & Telemetry
        const periodicSection = document.createElement("div");
        periodicSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
        periodicSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                ⏱️ Compliance Evaluation Interval & Dominant Telemetry
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Controls automated background evaluation frequency to catch mid-session addon tampering, and telemetry reporting to room dominants.
            </div>
        `;

        const intervalRow = document.createElement("div");
        intervalRow.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;";

        const intervalHeader = document.createElement("div");
        intervalHeader.style.cssText = "font-size: 13px; font-weight: bold; color: #cfd8dc; margin-bottom: 4px;";
        intervalHeader.textContent = "Evaluation Polling Frequency:";
        intervalRow.appendChild(intervalHeader);

        const intervalBtns = document.createElement("div");
        intervalBtns.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap;";

        const intervals: { sec: number; label: string }[] = [
            { sec: 0, label: "Off (Room Sync Only)" },
            { sec: 15, label: "Every 15s (Aggressive)" },
            { sec: 30, label: "Every 30s (Default)" },
            { sec: 60, label: "Every 60s (Relaxed)" }
        ];

        intervals.forEach(iv => {
            const isSel = currentInterval === iv.sec;
            const b = document.createElement("button");
            b.disabled = !canEditPreferences;
            b.textContent = iv.label;
            b.style.cssText = `
                padding: 8px 14px;
                border-radius: 4px;
                font-size: 12.5px;
                font-weight: ${isSel ? "bold" : "normal"};
                cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
                background: ${isSel ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "white" : "#b0bec5"};
                transition: all 0.15s ease;
            `;
            b.addEventListener("click", () => updatePref({ evaluationInterval: iv.sec }));
            intervalBtns.appendChild(b);
        });
        intervalRow.appendChild(intervalBtns);
        periodicSection.appendChild(intervalRow);

        // Telemetry Row
        const telemRow = document.createElement("div");
        telemRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(80, 100, 140, 0.3);";
        telemRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">📡 Silent Room Telemetry to Dominants</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">Silently broadcasts addon compliance manifests to in-room Owners, Mistresses, and Clubowners.</div>
            </div>
        `;
        const telemBtn = document.createElement("button");
        telemBtn.disabled = !canEditPreferences;
        telemBtn.textContent = currentTelemetry ? "✓ Enabled" : "✕ Disabled";
        telemBtn.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentTelemetry ? "rgba(76, 175, 80, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentTelemetry ? "#4caf50" : "#78909c"};
            color: ${currentTelemetry ? "#81c784" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
        telemBtn.addEventListener("click", () => updatePref({ silentTelemetry: !currentTelemetry }));
        telemRow.appendChild(telemBtn);
        periodicSection.appendChild(telemRow);

        container.appendChild(periodicSection);

        // SECTION 4: UI & Client Features
        const uiSection = document.createElement("div");
        uiSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
        uiSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                🛡️ Interface & Client Preferences
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Visual display toggles and client Quality of Life settings.
            </div>
        `;

        const profileBtnRow = document.createElement("div");
        profileBtnRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;";
        profileBtnRow.innerHTML = `
            <div>
                <div style="font-size: 14px; font-weight: bold; color: #e0e6ed;">Show Inspector Shield on Character Profiles</div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">Renders the blue shield icon on InformationSheet under other mod buttons for 1-click inspection.</div>
            </div>
        `;
        const profileBtnToggle = document.createElement("button");
        profileBtnToggle.disabled = !canEditPreferences;
        profileBtnToggle.textContent = currentProfileBtn ? "✓ Shown" : "✕ Hidden";
        profileBtnToggle.style.cssText = `
            padding: 8px 18px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            cursor: ${canEditPreferences ? "pointer" : "not-allowed"};
            background: ${currentProfileBtn ? "rgba(41, 121, 255, 0.25)" : "rgba(100, 116, 139, 0.2)"};
            border: 1px solid ${currentProfileBtn ? "#2979ff" : "#78909c"};
            color: ${currentProfileBtn ? "#82b1ff" : "#90a4ae"};
            transition: all 0.15s ease;
        `;
        profileBtnToggle.addEventListener("click", () => updatePref({ showProfileButton: !currentProfileBtn }));
        profileBtnRow.appendChild(profileBtnToggle);
        uiSection.appendChild(profileBtnRow);

        // Note about Chat Resizer
        const chatResizerNote = document.createElement("div");
        chatResizerNote.style.cssText = "padding: 12px 16px; border-radius: 6px; background: rgba(30, 45, 65, 0.5); border: 1px dashed rgba(80, 100, 140, 0.5); display: flex; align-items: center; justify-content: space-between;";
        chatResizerNote.innerHTML = `
            <div>
                <div style="font-size: 13px; font-weight: bold; color: #90caf9;">💬 Chat Resizer & Draggable Handle</div>
                <div style="font-size: 12px; color: #78909c; margin-top: 2px;">Local client QoL only (split ratio & divider). Maintained locally and strictly exempt from remote dominant rules.</div>
            </div>
            <span style="font-size: 11px; color: #81c784; background: rgba(76, 175, 80, 0.15); border: 1px solid #4caf50; padding: 3px 8px; border-radius: 4px; font-weight: bold;">LOCAL ONLY</span>
        `;
        uiSection.appendChild(chatResizerNote);

        container.appendChild(uiSection);

        // SECTION 5: Custom Addon Catalog Manager
        const catalogSection = document.createElement("div");
        catalogSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";
        catalogSection.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <div style="font-size: 16px; font-weight: bold; color: #64b5f6;">
                    📚 Custom Addon Catalog (${customCatalog.length})
                </div>
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 16px;">
                Register custom external scripts, mods, or userscripts into the catalog so dominants can mandate or forbid them in the Enforce Rules tab.
            </div>
        `;

        if (customCatalog.length === 0) {
            const noCustom = document.createElement("div");
            noCustom.style.cssText = "color: #78909c; font-size: 13px; padding: 14px; text-align: center; background: rgba(30, 36, 48, 0.5); border-radius: 6px; margin-bottom: 16px;";
            noCustom.textContent = "No custom addons currently registered. Use the form below to add one.";
            catalogSection.appendChild(noCustom);
        } else {
            const list = document.createElement("div");
            list.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;";

            customCatalog.forEach(c => {
                const itemCard = document.createElement("div");
                itemCard.style.cssText = "background: rgba(45, 55, 75, 0.6); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;";
                itemCard.innerHTML = `
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; font-weight: bold; color: #e0e6ed;">${c.name}</span>
                            <span style="font-size: 11px; color: #ffb74d; background: rgba(255, 152, 0, 0.15); border: 1px solid #ff9800; padding: 1px 6px; border-radius: 3px;">ID: ${c.id}</span>
                        </div>
                        <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">
                            ${c.description || "Custom mod"} ${c.detectKeys?.length ? `• Keys: [${c.detectKeys.join(", ")}]` : ""}
                        </div>
                        ${c.scriptUrl ? `<div style="font-size: 11px; color: #81c784; margin-top: 2px; word-break: break-all;">URL: ${c.scriptUrl}</div>` : ""}
                    </div>
                `;

                if (canEditPreferences) {
                    const delBtn = document.createElement("button");
                    delBtn.textContent = "🗑️ Remove";
                    delBtn.title = "Delete custom addon from catalog";
                    delBtn.style.cssText = "padding: 4px 10px; border-radius: 4px; background: rgba(198, 40, 40, 0.2); border: 1px solid #ef5350; color: #ef9a9a; font-size: 11px; font-weight: bold; cursor: pointer;";
                    delBtn.addEventListener("click", () => removeCustomMod(c.id));
                    itemCard.appendChild(delBtn);
                }

                list.appendChild(itemCard);
            });

            catalogSection.appendChild(list);
        }

        // Add Custom Addon Form
        if (canEditPreferences) {
            const formBox = document.createElement("div");
            formBox.style.cssText = "background: rgba(30, 36, 48, 0.7); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 16px;";
            formBox.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: #64b5f6; margin-bottom: 12px;">➕ Register New Custom Addon</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Mod Display Name *</label>
                        <input id="qoc-add-name" type="text" placeholder="e.g. Banned Cheats Script" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Unique ID / Keyword *</label>
                        <input id="qoc-add-id" type="text" placeholder="e.g. BannedCheats" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Description / Purpose</label>
                    <input id="qoc-add-desc" type="text" placeholder="e.g. Third-party automation or tampermonkey script" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Detection Keywords (comma-separated)</label>
                        <input id="qoc-add-keys" type="text" placeholder="e.g. cheat, tampermonkey, hack" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #b0bec5; display: block; margin-bottom: 4px;">Script Injection URL (optional)</label>
                        <input id="qoc-add-url" type="text" placeholder="https://example.com/mod.js" style="width: 100%; box-sizing: border-box; padding: 7px 10px; background: #191f2b; border: 1px solid #546e7a; color: white; border-radius: 4px; font-size: 13px;" />
                    </div>
                </div>
                <button id="qoc-btn-add-mod" style="padding: 8px 20px; background: #1976d2; border: 1px solid #42a5f5; color: white; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    ➕ Add Custom Addon to Catalog
                </button>
            `;

            formBox.querySelector("#qoc-btn-add-mod")?.addEventListener("click", () => {
                const nameInp = formBox.querySelector("#qoc-add-name") as HTMLInputElement;
                const idInp = formBox.querySelector("#qoc-add-id") as HTMLInputElement;
                const descInp = formBox.querySelector("#qoc-add-desc") as HTMLInputElement;
                const keysInp = formBox.querySelector("#qoc-add-keys") as HTMLInputElement;
                const urlInp = formBox.querySelector("#qoc-add-url") as HTMLInputElement;

                const name = nameInp?.value.trim();
                const id = idInp?.value.trim();
                if (!name || !id) {
                    toastsManager.error({ title: "Incomplete Addon", message: "Please provide both Mod Name and Unique ID.", duration: 3000 });
                    return;
                }

                const desc = descInp?.value.trim() || "Custom Addon";
                const rawKeys = keysInp?.value.trim();
                const detectKeys = rawKeys ? rawKeys.split(",").map(k => k.trim()).filter(Boolean) : [id.toLowerCase(), name.toLowerCase()];
                const scriptUrl = urlInp?.value.trim() || "";

                addCustomMod({
                    id,
                    name,
                    description: desc,
                    detectKeys,
                    scriptUrl,
                    isCustom: true
                });
            });

            catalogSection.appendChild(formBox);
        }

        container.appendChild(catalogSection);
        this.contentArea.appendChild(container);
    }
}
