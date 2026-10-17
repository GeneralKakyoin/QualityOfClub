import { BaseSubscreen, getRelativeX, getRelativeY, getRelativeWidth, getRelativeHeight, setSubscreen, setPreviousSubscreen } from "zois-core/ui";
import { toastsManager } from "zois-core/toasts";
import { modStorage, saveStorage, syncStorage, ModRule, AutoLoadMode, ACCESS_LEVEL_NAMES, AccessLevel } from "modules/storage";
import { getLoadedMods, CURATED_MOD_CATALOG } from "modules/modDetection";
import { checkComplianceAgainstRules } from "modules/compliance";
import { requestInspect, requestSetRules, hasRuleAuthorityOver, InspectResponseData } from "modules/networkSync";
import { checkPermissionAccess } from "modules/authority";
import { MOD_NAME } from "src/constants";
import { MainSubscreen } from "./mainSubscreen";
import { AuthoritySubscreen } from "./authoritySubscreen";

export class InspectorSubscreen extends BaseSubscreen {
    private target: Character | null = null;
    private isSelf: boolean = true;
    private targetData: InspectResponseData | null = null;
    private isLoading: boolean = false;
    private errorMessage: string | null = null;

    // Working copy of rules being edited on a target
    private targetRulesCopy: ModRule[] = [];

    // Root UI container
    private rootElement: HTMLDivElement | null = null;
    private contentArea: HTMLDivElement | null = null;
    private activeTab: string = "addons";

    constructor(target: Character | null = null) {
        super();
        this.target = target;
        this.isSelf = !target || (typeof target.IsPlayer === "function" && target.IsPlayer());
        this.activeTab = this.isSelf ? "addons" : "target_addons";
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
        if (this.rootElement) {
            this.rootElement.remove();
            this.rootElement = null;
        }
        this.contentArea = null;
    }

    private createRootUI(): void {
        this.cleanup();

        // Full-screen solid backdrop that completely covers any underlying game elements
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
            font-family: inherit;
            box-sizing: border-box;
            user-select: none;
        `;

        const container = document.createElement("div");
        container.style.cssText = `
            width: ${getRelativeWidth(1800)}px;
            height: ${getRelativeHeight(880)}px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        `;

        // 1. Header (Title + Back Button)
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.4);
        `;

        const titleText = document.createElement("div");
        titleText.style.cssText = "font-size: calc(6px * var(--size-unit, 4px)); font-weight: bold; color: #64b5f6; letter-spacing: 1px;";
        const targetName = this.target?.Name || `Member #${this.target?.MemberNumber}`;
        titleText.textContent = this.isSelf
            ? `${MOD_NAME} • My Addons & Policy Manager`
            : `${MOD_NAME} • Inspecting ${targetName}`;

        const backBtn = document.createElement("button");
        backBtn.textContent = "✕ Close";
        backBtn.style.cssText = `
            padding: 10px 24px;
            background: rgba(220, 50, 50, 0.85);
            border: 1px solid #ef5350;
            color: white;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
        backBtn.addEventListener("click", () => this.exit());

        header.appendChild(titleText);
        header.appendChild(backBtn);
        container.appendChild(header);

        // 2. Navigation Tab Bar
        const tabBar = document.createElement("div");
        tabBar.style.cssText = `
            display: flex;
            gap: 12px;
        `;

        const tabs = this.isSelf ? [
            { id: "addons", label: "📦 My Loaded Addons" },
            { id: "rules", label: "🛡️ Rules on Me & Compliance" },
            { id: "settings", label: "⚙️ Consent & Preferences" }
        ] : [
            { id: "target_addons", label: "📦 Inspected Addons" },
            { id: "enforce_rules", label: "🔒 Enforce Rules" }
        ];

        tabs.forEach(tab => {
            const tabBtn = document.createElement("button");
            tabBtn.textContent = tab.label;
            const isSelected = this.activeTab === tab.id;
            tabBtn.style.cssText = `
                padding: 10px 22px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                background: ${isSelected ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSelected ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSelected ? "white" : "#90a4ae"};
                transition: background 0.15s ease;
            `;
            tabBtn.addEventListener("click", () => {
                this.activeTab = tab.id;
                this.createRootUI();
                this.renderTabContent();
            });
            tabBar.appendChild(tabBtn);
        });

        container.appendChild(tabBar);

        // 3. Dynamic Content Area
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
            gap: 14px;
            box-sizing: border-box;
        `;

        container.appendChild(contentArea);
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        this.rootElement = backdrop;
        this.contentArea = contentArea;
    }

    private renderTabContent(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        if (this.isSelf) {
            if (this.activeTab === "addons") this.renderSelfAddons();
            else if (this.activeTab === "rules") this.renderSelfRules();
            else if (this.activeTab === "settings") this.renderSelfSettings();
        } else {
            if (this.activeTab === "target_addons") this.renderTargetAddons();
            else if (this.activeTab === "enforce_rules") this.renderTargetRules();
        }
    }

    // ==========================================
    // SELF TAB RENDERING
    // ==========================================

    private renderSelfAddons(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";
        const loadedMods = getLoadedMods();

        const countHeader = document.createElement("div");
        countHeader.style.cssText = "font-size: 16px; font-weight: bold; color: #90caf9; margin-bottom: 6px;";
        countHeader.textContent = `Detected Addons in Current Session (${loadedMods.length})`;
        this.contentArea.appendChild(countHeader);

        if (loadedMods.length === 0) {
            const empty = document.createElement("div");
            empty.style.cssText = "color: #90a4ae; padding: 20px;";
            empty.textContent = "No external addons detected in this browser session.";
            this.contentArea.appendChild(empty);
            return;
        }

        for (const mod of loadedMods) {
            const card = document.createElement("div");
            card.style.cssText = `
                background: rgba(35, 43, 60, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.4);
                border-radius: 6px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;

            const left = document.createElement("div");
            left.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${mod.name}</div>
                <div style="font-size: 12px; color: #8fa0b5; margin-top: 2px;">ID: ${mod.id}${mod.repository ? ` • Repo: ${mod.repository}` : ""}</div>
            `;

            const right = document.createElement("div");
            right.style.cssText = "display: flex; gap: 10px;";
            right.innerHTML = `
                <span style="background: rgba(41, 121, 255, 0.2); border: 1px solid #2979ff; color: #82b1ff; padding: 4px 10px; border-radius: 4px; font-size: 12px;">v${mod.version || "1.0.0"}</span>
                <span style="background: rgba(46, 125, 50, 0.25); border: 1px solid #4caf50; color: #81c784; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">ACTIVE</span>
            `;

            card.appendChild(left);
            card.appendChild(right);
            this.contentArea.appendChild(card);
        }
    }

    private renderSelfRules(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";
        const loadedMods = getLoadedMods();
        const rules = modStorage.inspector.rules;
        const compliance = checkComplianceAgainstRules(loadedMods, rules);

        const banner = document.createElement("div");
        banner.style.cssText = `
            padding: 14px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            background: ${compliance.isCompliant ? "rgba(46, 125, 50, 0.25)" : "rgba(198, 40, 40, 0.3)"};
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            color: ${compliance.isCompliant ? "#a5d6a7" : "#ffcdd2"};
            margin-bottom: 10px;
        `;
        banner.textContent = compliance.isCompliant
            ? "✓ COMPLIANT: All mandatory addons are loaded, and no forbidden addons are detected."
            : `⚠️ NON-COMPLIANT: ${compliance.missing.length} missing mandatory addons, ${compliance.forbidden.length} forbidden addons detected.`;
        this.contentArea.appendChild(banner);

        const countHeader = document.createElement("div");
        countHeader.style.cssText = "font-size: 16px; font-weight: bold; color: #90caf9;";
        countHeader.textContent = `Active Addon Policies on You (${rules.length})`;
        this.contentArea.appendChild(countHeader);

        if (rules.length === 0) {
            const empty = document.createElement("div");
            empty.style.cssText = "color: #90a4ae; padding: 20px;";
            empty.textContent = "No mandatory or forbidden addon rules are currently placed on you.";
            this.contentArea.appendChild(empty);
            return;
        }

        for (const rule of rules) {
            const card = document.createElement("div");
            const isMandatory = rule.type === "required";
            card.style.cssText = `
                background: rgba(35, 43, 60, 0.85);
                border-left: 5px solid ${isMandatory ? "#4caf50" : "#ef5350"};
                border: 1px solid rgba(80, 100, 140, 0.4);
                border-radius: 6px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;

            const left = document.createElement("div");
            left.innerHTML = `
                <div style="font-size: 16px; font-weight: bold;">${rule.modName}</div>
                <div style="font-size: 12px; color: #8fa0b5;">Enforced by: Member #${rule.enforcedBy}${rule.enforcedByName ? ` (${rule.enforcedByName})` : ""}</div>
            `;

            const badge = document.createElement("span");
            badge.style.cssText = `
                background: ${isMandatory ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"};
                color: ${isMandatory ? "#81c784" : "#e57373"};
                border: 1px solid ${isMandatory ? "#4caf50" : "#f44336"};
                padding: 5px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
            `;
            badge.textContent = isMandatory ? "MANDATORY" : "FORBIDDEN";

            card.appendChild(left);
            card.appendChild(badge);
            this.contentArea.appendChild(card);
        }
    }

    private renderSelfSettings(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        const container = document.createElement("div");
        container.style.cssText = "display: flex; flex-direction: column; gap: 20px;";

        const canEditAutoLoad = checkPermissionAccess("rules_edit_autoload_mode");

        // 1. Auto-load behavior Card
        const autoLoadSection = document.createElement("div");
        autoLoadSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px;";
        autoLoadSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                Mandatory Addon Auto-Injection Behavior
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 14px;">
                Choose how Quality of Club acts when entering a room or checking compliance if a mandatory addon is missing.
            </div>
        `;

        const autoModes: { mode: AutoLoadMode; label: string; desc: string }[] = [
            { mode: "Prompt", label: "Prompt First (Recommended)", desc: "Prompts you with a confirmation dialog before loading missing addons." },
            { mode: "Silent", label: "Silent Auto-Injection", desc: "Silently auto-injects missing mandatory scripts automatically in the background." }
        ];

        const autoRow = document.createElement("div");
        autoRow.style.cssText = "display: flex; flex-direction: column; gap: 10px;";

        autoModes.forEach(m => {
            const isSel = modStorage.inspector.autoLoadMode === m.mode;
            const btn = document.createElement("button");
            btn.disabled = !canEditAutoLoad;
            btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 18px;
                border-radius: 6px;
                background: ${isSel ? "rgba(25, 118, 210, 0.3)" : "rgba(45, 55, 75, 0.7)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "#90caf9" : "#cfd8dc"};
                cursor: ${canEditAutoLoad ? "pointer" : "not-allowed"};
                text-align: left;
                transition: all 0.15s ease;
            `;
            btn.innerHTML = `
                <div>
                    <div style="font-size: 14px; font-weight: bold;">${isSel ? "● " : "○ "}${m.label}</div>
                    <div style="font-size: 12px; color: #90a4ae; margin-top: 2px;">${m.desc}</div>
                </div>
            `;
            btn.addEventListener("click", () => {
                if (!canEditAutoLoad) return;
                modStorage.inspector.autoLoadMode = m.mode;
                saveStorage();
                syncStorage();
                this.renderTabContent();
            });
            autoRow.appendChild(btn);
        });

        autoLoadSection.appendChild(autoRow);

        if (!canEditAutoLoad) {
            const lockMsg = document.createElement("div");
            lockMsg.style.cssText = "color: #ef5350; font-size: 12px; margin-top: 10px; font-weight: bold;";
            lockMsg.textContent = "🔒 Auto-Load modification is restricted by your Owner / Mistress.";
            autoLoadSection.appendChild(lockMsg);
        }

        container.appendChild(autoLoadSection);

        // 2. Authority & Permissions Summary Card
        const authSection = document.createElement("div");
        authSection.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px;";
        authSection.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                Authority & Addon Policy Settings
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-bottom: 14px;">
                Addon inspection permissions, mandatory/forbidden rule enforcement, and Owner/Mistress lists are managed in the Authority system.
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; background: rgba(20, 26, 38, 0.6); padding: 12px 16px; border-radius: 6px; border: 1px solid rgba(80, 100, 140, 0.3); margin-bottom: 16px;">
                <div><span style="color: #90a4ae;">Inspect Addons:</span> <b>${ACCESS_LEVEL_NAMES[modStorage.authority.permissions.inspect_view_addons?.min ?? AccessLevel.public]}</b></div>
                <div><span style="color: #90a4ae;">Lock Mandatory Rules:</span> <b>${ACCESS_LEVEL_NAMES[modStorage.authority.permissions.rules_lock_mandatory?.min ?? AccessLevel.owner]}</b></div>
                <div><span style="color: #90a4ae;">Lock Forbidden Rules:</span> <b>${ACCESS_LEVEL_NAMES[modStorage.authority.permissions.rules_lock_forbidden?.min ?? AccessLevel.owner]}</b></div>
                <div><span style="color: #90a4ae;">Remove / Reset Rules:</span> <b>${ACCESS_LEVEL_NAMES[modStorage.authority.permissions.rules_remove_rules?.min ?? AccessLevel.owner]}</b></div>
            </div>
        `;

        const openAuthBtn = document.createElement("button");
        openAuthBtn.textContent = "🛡️ Open Authority & Role Management Subscreen";
        openAuthBtn.style.cssText = `
            padding: 12px 24px;
            background: #1976d2;
            border: 1px solid #42a5f5;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
        openAuthBtn.addEventListener("click", () => {
            this.cleanup();
            setSubscreen(new AuthoritySubscreen());
        });
        authSection.appendChild(openAuthBtn);

        container.appendChild(authSection);
        this.contentArea.appendChild(container);
    }

    // ==========================================
    // TARGET TAB RENDERING
    // ==========================================

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

    private renderTargetAddons(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";

        if (this.isLoading) {
            this.contentArea.innerHTML = "<div style='font-size: 16px; color: #64b5f6; padding: 20px;'>Querying target player's Quality of Club manifest...</div>";
            return;
        }

        if (this.errorMessage) {
            this.contentArea.innerHTML = `
                <div style='font-size: 15px; color: #ef5350; padding: 15px;'>Inspection Error: ${this.errorMessage}</div>
                <button id='zc-retry-inspect' style='padding: 8px 18px; border-radius: 4px; background: #1976d2; color: white; border: none; font-weight: bold; width: fit-content; cursor: pointer;'>Retry Inspection</button>
            `;
            const retry = this.contentArea.querySelector("#zc-retry-inspect");
            retry?.addEventListener("click", () => this.loadTargetData());
            return;
        }

        const mods = this.targetData?.mods || [];
        const rules = this.targetData?.rules || [];
        const compliance = checkComplianceAgainstRules(mods, rules);

        const banner = document.createElement("div");
        banner.style.cssText = `
            padding: 12px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            background: ${compliance.isCompliant ? "rgba(46, 125, 50, 0.25)" : "rgba(198, 40, 40, 0.3)"};
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            color: ${compliance.isCompliant ? "#a5d6a7" : "#ffcdd2"};
            margin-bottom: 8px;
        `;
        banner.textContent = compliance.isCompliant
            ? "✓ COMPLIANT: Player meets all active addon rules."
            : `⚠️ NON-COMPLIANT: ${compliance.missing.length} missing mandatory addons, ${compliance.forbidden.length} forbidden addons detected.`;
        this.contentArea.appendChild(banner);

        for (const mod of mods) {
            const card = document.createElement("div");
            card.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;";
            card.innerHTML = `
                <div>
                    <div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${mod.name}</div>
                    <div style="font-size: 12px; color: #8fa0b5;">ID: ${mod.id}${mod.repository ? ` • Repo: ${mod.repository}` : ""}</div>
                </div>
                <span style="background: rgba(41, 121, 255, 0.2); border: 1px solid #2979ff; color: #82b1ff; padding: 4px 10px; border-radius: 4px; font-size: 12px;">v${mod.version || "Active"}</span>
            `;
            this.contentArea.appendChild(card);
        }
    }

    private renderTargetRules(): void {
        if (!this.contentArea) return;
        this.contentArea.innerHTML = "";
        const canEnforce = this.target && hasRuleAuthorityOver(this.target);

        if (!canEnforce) {
            this.contentArea.innerHTML = "<div style='font-size: 15px; color: #ffa726; padding: 20px;'>Permission Restricted: Only an Owner (or Lover/Whitelisted partner if enabled by target) can set locked addon rules.</div>";
            return;
        }

        const curatedList = Object.values(CURATED_MOD_CATALOG);
        for (const item of curatedList) {
            const row = document.createElement("div");
            row.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 6px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;";

            const left = document.createElement("div");
            left.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${item.name}</div>
                <div style="font-size: 12px; color: #8fa0b5;">${item.description}</div>
            `;

            const existingRule = this.targetRulesCopy.find(r => r.modId === item.id);
            const currentState = existingRule ? existingRule.type : "none";

            const btnGroup = document.createElement("div");
            btnGroup.style.cssText = "display: flex; gap: 8px;";

            const createChoiceBtn = (state: "none" | "required" | "forbidden", label: string, color: string) => {
                const b = document.createElement("button");
                b.textContent = label;
                const isSelected = currentState === state;
                b.style.cssText = `
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: ${isSelected ? "bold" : "normal"};
                    cursor: pointer;
                    background: ${isSelected ? color : "rgba(60, 70, 90, 0.4)"};
                    border: 1px solid ${isSelected ? color : "rgba(100, 120, 150, 0.4)"};
                    color: ${isSelected ? "white" : "#b0bec5"};
                `;
                b.addEventListener("click", () => {
                    this.targetRulesCopy = this.targetRulesCopy.filter(r => r.modId !== item.id);
                    if (state !== "none") {
                        this.targetRulesCopy.push({
                            modId: item.id,
                            modName: item.name,
                            type: state,
                            enforcedBy: Player.MemberNumber!,
                            enforcedByName: Player.Name,
                            enforcedAt: Date.now()
                        });
                    }
                    this.renderTargetRules();
                });
                return b;
            };

            btnGroup.appendChild(createChoiceBtn("none", "Neutral", "#78909c"));
            btnGroup.appendChild(createChoiceBtn("required", "Mandatory", "#2e7d32"));
            btnGroup.appendChild(createChoiceBtn("forbidden", "Forbidden", "#c62828"));

            row.appendChild(left);
            row.appendChild(btnGroup);
            this.contentArea.appendChild(row);
        }

        // Save & Sync button
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "💾 Save & Sync Rules to Target";
        saveBtn.style.cssText = "padding: 12px 24px; border-radius: 6px; background: #2e7d32; border: 1px solid #4caf50; color: white; font-weight: bold; font-size: 15px; cursor: pointer; width: fit-content; margin-top: 10px;";
        saveBtn.addEventListener("click", async () => {
            if (!this.target || typeof this.target.MemberNumber !== "number") return;
            toastsManager.info({
                title: `${MOD_NAME} Syncing`,
                message: "Transmitting addon rules to target player...",
                duration: 3000
            });

            const res = await requestSetRules(this.target.MemberNumber, this.targetRulesCopy);
            if (res.success) {
                modStorage.managedRules[this.target.MemberNumber] = structuredClone(this.targetRulesCopy);
                saveStorage();
                syncStorage();

                toastsManager.success({
                    title: `${MOD_NAME} Rules Synced`,
                    message: "Addon rules successfully locked on target!",
                    duration: 5000
                });
            } else {
                toastsManager.error({
                    title: `${MOD_NAME} Sync Failed`,
                    message: res.error || "Target rejected rule sync.",
                    duration: 6000
                });
            }
        });

        this.contentArea.appendChild(saveBtn);
    }
}
