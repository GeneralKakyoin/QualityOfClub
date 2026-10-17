import { BaseSubscreen, getRelativeX, getRelativeY, getRelativeWidth, getRelativeHeight, setSubscreen } from "zois-core/ui";
import { toastsManager } from "zois-core/toasts";
import { dialogsManager } from "zois-core/dialogs";
import { modStorage, saveStorage, syncStorage, ModRule, InspectViewPermission, AutoLoadMode } from "modules/storage";
import { getLoadedMods, DetectedMod, CURATED_MOD_CATALOG } from "modules/modDetection";
import { checkComplianceAgainstRules, evaluateCompliance } from "modules/compliance";
import { requestInspect, requestSetRules, hasRuleAuthorityOver, InspectResponseData } from "modules/networkSync";
import { MOD_NAME } from "src/constants";

export class InspectorSubscreen extends BaseSubscreen {
    private target: Character | null = null;
    private isSelf: boolean = true;
    private targetData: InspectResponseData | null = null;
    private isLoading: boolean = false;
    private errorMessage: string | null = null;

    // Working copy of rules being edited on a target
    private targetRulesCopy: ModRule[] = [];
    private customModInputText: string = "";

    // DOM containers
    private activeContainers: HTMLElement[] = [];

    constructor(target: Character | null = null) {
        super();
        this.target = target;
        this.isSelf = !target || (typeof target.IsPlayer === "function" && target.IsPlayer());
    }

    public get name(): string {
        if (this.isSelf) {
            return `${MOD_NAME} - My Addons & Policy`;
        }
        const targetName = this.target?.Name || `Member #${this.target?.MemberNumber}`;
        return `${MOD_NAME} - Inspecting ${targetName}`;
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public onLoad(): void {
        if (this.isSelf) {
            this.setupSelfTabs();
        } else {
            this.setupTargetTabs();
            this.loadTargetData();
        }
    }

    protected onExit(): void {
        this.cleanupContainers();
        setSubscreen(null);
        if (this.target && typeof InformationSheetLoadCharacter === "function") {
            try {
                InformationSheetLoadCharacter(this.target);
            } catch {}
        } else if (typeof InformationSheetLoad === "function") {
            try {
                InformationSheetLoad();
            } catch {}
        }
    }

    private cleanupContainers(): void {
        for (const el of this.activeContainers) {
            try {
                el.remove();
            } catch {}
        }
        this.activeContainers = [];
    }

    private registerContainer(el: HTMLElement): HTMLElement {
        this.activeContainers.push(el);
        document.body.appendChild(el);
        return el;
    }

    // ==========================================
    // SELF MODE TABS
    // ==========================================

    private setupSelfTabs(): void {
        this.createTabs({
            x: 100,
            y: 130,
            width: 1800,
            currentTabName: "My Addons",
            tabs: [
                {
                    name: "My Addons",
                    load: () => this.renderMyAddonsTab(),
                    unload: () => this.cleanupContainers()
                },
                {
                    name: "Rules On Me",
                    load: () => this.renderMyRulesTab(),
                    unload: () => this.cleanupContainers()
                },
                {
                    name: "Permissions & Settings",
                    load: () => this.renderMySettingsTab(),
                    unload: () => this.cleanupContainers()
                }
            ]
        });
    }

    private renderMyAddonsTab(): void {
        const loadedMods = getLoadedMods();

        this.createText({
            x: 120,
            y: 220,
            fontSize: 4,
            text: `Currently Detected Addons (${loadedMods.length})`
        });

        const listContainer = document.createElement("div");
        listContainer.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(270)}px;
            width: ${getRelativeWidth(1760)}px;
            height: ${getRelativeHeight(600)}px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding-right: 15px;
            box-sizing: border-box;
            z-index: 5;
        `;
        this.registerContainer(listContainer);

        if (loadedMods.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.style.cssText = "color: #aaa; font-size: 18px; padding: 20px;";
            emptyMsg.textContent = "No external addons detected in this browser session.";
            listContainer.appendChild(emptyMsg);
            return;
        }

        for (const mod of loadedMods) {
            const card = document.createElement("div");
            card.style.cssText = `
                background: rgba(30, 36, 48, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.4);
                border-radius: 8px;
                padding: 14px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #e0e6ed;
                font-family: inherit;
            `;

            const left = document.createElement("div");
            left.style.cssText = "display: flex; flex-direction: column; gap: 4px;";

            const title = document.createElement("div");
            title.style.cssText = "font-size: 17px; font-weight: bold; color: #64b5f6;";
            title.textContent = mod.name;

            const sub = document.createElement("div");
            sub.style.cssText = "font-size: 13px; color: #8fa0b5;";
            sub.textContent = `ID: ${mod.id}${mod.repository ? ` • Repo: ${mod.repository}` : ""}`;

            left.appendChild(title);
            left.appendChild(sub);

            const right = document.createElement("div");
            right.style.cssText = "display: flex; align-items: center; gap: 12px;";

            const versionBadge = document.createElement("span");
            versionBadge.style.cssText = `
                background: rgba(41, 121, 255, 0.2);
                border: 1px solid #2979ff;
                color: #82b1ff;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
            `;
            versionBadge.textContent = `v${mod.version || "1.0.0"}`;

            const activeBadge = document.createElement("span");
            activeBadge.style.cssText = `
                background: rgba(46, 125, 50, 0.25);
                border: 1px solid #4caf50;
                color: #81c784;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
            `;
            activeBadge.textContent = "ACTIVE";

            right.appendChild(versionBadge);
            right.appendChild(activeBadge);

            card.appendChild(left);
            card.appendChild(right);
            listContainer.appendChild(card);
        }
    }

    private renderMyRulesTab(): void {
        const rules = modStorage.inspector.rules;
        const loadedMods = getLoadedMods();
        const compliance = checkComplianceAgainstRules(loadedMods, rules);

        this.createText({
            x: 120,
            y: 220,
            fontSize: 4,
            text: `Enforced Rules on You (${rules.length})`
        });

        // Overall status banner
        const statusBanner = document.createElement("div");
        statusBanner.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(270)}px;
            width: ${getRelativeWidth(1760)}px;
            padding: 12px 20px;
            border-radius: 6px;
            box-sizing: border-box;
            font-weight: bold;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: ${compliance.isCompliant ? "rgba(46, 125, 50, 0.25)" : "rgba(198, 40, 40, 0.3)"};
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            color: ${compliance.isCompliant ? "#a5d6a7" : "#ffcdd2"};
            z-index: 5;
        `;
        statusBanner.textContent = compliance.isCompliant
            ? "✓ COMPLIANT: All mandatory addons are loaded, and no forbidden addons are detected."
            : `⚠️ NON-COMPLIANT: ${compliance.missing.length} missing mandatory addons, ${compliance.forbidden.length} forbidden addons detected.`;

        this.registerContainer(statusBanner);

        const listContainer = document.createElement("div");
        listContainer.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(340)}px;
            width: ${getRelativeWidth(1760)}px;
            height: ${getRelativeHeight(530)}px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 5;
        `;
        this.registerContainer(listContainer);

        if (rules.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.style.cssText = "color: #90a4ae; font-size: 16px; padding: 25px;";
            emptyMsg.textContent = "No addon rules are currently locked on you by your Owner or yourself.";
            listContainer.appendChild(emptyMsg);
            return;
        }

        for (const rule of rules) {
            const card = document.createElement("div");
            const isMandatory = rule.type === "required";
            card.style.cssText = `
                background: rgba(30, 36, 48, 0.85);
                border-left: 5px solid ${isMandatory ? "#4caf50" : "#ef5350"};
                border-top: 1px solid rgba(80, 100, 140, 0.3);
                border-right: 1px solid rgba(80, 100, 140, 0.3);
                border-bottom: 1px solid rgba(80, 100, 140, 0.3);
                border-radius: 6px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #e0e6ed;
            `;

            const left = document.createElement("div");
            left.style.cssText = "display: flex; flex-direction: column; gap: 3px;";

            const title = document.createElement("div");
            title.style.cssText = "font-size: 16px; font-weight: bold;";
            title.textContent = rule.modName;

            const meta = document.createElement("div");
            meta.style.cssText = "font-size: 12px; color: #8fa0b5;";
            meta.textContent = `Enforced by: Member #${rule.enforcedBy}${rule.enforcedByName ? ` (${rule.enforcedByName})` : ""}`;

            left.appendChild(title);
            left.appendChild(meta);

            const badge = document.createElement("span");
            badge.style.cssText = `
                background: ${isMandatory ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"};
                color: ${isMandatory ? "#81c784" : "#e57373"};
                border: 1px solid ${isMandatory ? "#4caf50" : "#f44336"};
                padding: 5px 12px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
            `;
            badge.textContent = isMandatory ? "MANDATORY" : "FORBIDDEN";

            card.appendChild(left);
            card.appendChild(badge);
            listContainer.appendChild(card);
        }
    }

    private renderMySettingsTab(): void {
        this.createText({
            x: 120,
            y: 220,
            fontSize: 4,
            text: "Consent & Inspection Settings"
        });

        // 1. Master toggle: Allow Owner to enforce rules
        this.createCheckbox({
            x: 120,
            y: 275,
            width: 800,
            height: 45,
            text: "Allow Owner to lock mandatory / forbidden addon rules on me",
            isChecked: modStorage.inspector.allowOwnerRules,
            onChange: () => {
                modStorage.inspector.allowOwnerRules = !modStorage.inspector.allowOwnerRules;
                saveStorage();
                syncStorage();
            }
        });

        // 2. Allow Lovers to enforce rules
        this.createCheckbox({
            x: 120,
            y: 330,
            width: 800,
            height: 45,
            text: "Allow Lovers / Whitelisted partners to lock addon rules",
            isChecked: modStorage.inspector.allowLoversRules,
            onChange: () => {
                modStorage.inspector.allowLoversRules = !modStorage.inspector.allowLoversRules;
                saveStorage();
                syncStorage();
            }
        });

        // 3. Auto-load preference
        this.createText({
            x: 120,
            y: 410,
            fontSize: 3.5,
            text: "Mandatory Addon Remediation Behavior:"
        });

        const autoLoadModes: { mode: AutoLoadMode; label: string; desc: string }[] = [
            { mode: "Prompt", label: "Prompt First (Recommended)", desc: "Shows a 1-click confirmation popup before loading missing verified addons." },
            { mode: "Silent", label: "Silent Auto-Load", desc: "Silently injects missing verified addons (BCX, LSCG, etc.) in background." }
        ];

        autoLoadModes.forEach((item, idx) => {
            const isSelected = modStorage.inspector.autoLoadMode === item.mode;
            const btn = this.createButton({
                x: 120 + idx * 360,
                y: 450,
                width: 340,
                height: 50,
                text: `${isSelected ? "● " : "○ "}${item.label}`,
                onClick: () => {
                    modStorage.inspector.autoLoadMode = item.mode;
                    saveStorage();
                    syncStorage();
                    this.cleanupContainers();
                    this.renderMySettingsTab();
                }
            });
            btn.style.fontWeight = isSelected ? "bold" : "normal";
        });

        // 4. View Permissions
        this.createText({
            x: 120,
            y: 540,
            fontSize: 3.5,
            text: "Who may inspect your loaded addons:"
        });

        const permissions: { perm: InspectViewPermission; label: string }[] = [
            { perm: "Prompt", label: "Prompt Me (Recommended)" },
            { perm: "Owner", label: "Owner Only" },
            { perm: "Lovers", label: "Owner & Lovers" },
            { perm: "Whitelist", label: "Whitelist / Friends" },
            { perm: "Anyone", label: "Anyone in Room" },
            { perm: "Disabled", label: "Disabled (Nobody)" }
        ];

        permissions.forEach((item, idx) => {
            const isSelected = modStorage.inspector.viewPermission === item.perm;
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const btn = this.createButton({
                x: 120 + col * 320,
                y: 580 + row * 60,
                width: 300,
                height: 48,
                text: `${isSelected ? "● " : "○ "}${item.label}`,
                onClick: () => {
                    modStorage.inspector.viewPermission = item.perm;
                    saveStorage();
                    syncStorage();
                    this.cleanupContainers();
                    this.renderMySettingsTab();
                }
            });
            btn.style.fontWeight = isSelected ? "bold" : "normal";
        });
    }

    // ==========================================
    // TARGET MODE TABS
    // ==========================================

    private setupTargetTabs(): void {
        const targetName = this.target?.Name || "Target";
        this.createTabs({
            x: 100,
            y: 130,
            width: 1800,
            currentTabName: "Target Addons",
            tabs: [
                {
                    name: "Target Addons",
                    load: () => this.renderTargetAddonsTab(),
                    unload: () => this.cleanupContainers()
                },
                {
                    name: "Enforce Rules",
                    load: () => this.renderTargetRulesTab(),
                    unload: () => this.cleanupContainers()
                }
            ]
        });
    }

    private async loadTargetData(): Promise<void> {
        if (!this.target || typeof this.target.MemberNumber !== "number") {
            this.errorMessage = "Invalid target character.";
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        const res = await requestInspect(this.target.MemberNumber);
        this.isLoading = false;

        if (!res.success || !res.data) {
            this.errorMessage = res.error || "Failed to inspect target.";
        } else {
            this.targetData = res.data;
            this.targetRulesCopy = structuredClone(res.data.rules || []);
        }

        this.cleanupContainers();
        this.renderTargetAddonsTab();
    }

    private renderTargetAddonsTab(): void {
        if (this.isLoading) {
            this.createText({
                x: 120,
                y: 250,
                fontSize: 4,
                text: "Querying target player's Quality of Club addon manifest..."
            });
            return;
        }

        if (this.errorMessage) {
            this.createText({
                x: 120,
                y: 250,
                fontSize: 4,
                text: `Inspection Error: ${this.errorMessage}`
            });

            const retryBtn = this.createButton({
                x: 120,
                y: 320,
                width: 200,
                height: 50,
                text: "Retry Inspection",
                onClick: () => {
                    this.loadTargetData();
                }
            });
            return;
        }

        const mods = this.targetData?.mods || [];
        const rules = this.targetData?.rules || [];
        const compliance = checkComplianceAgainstRules(mods, rules);

        // Header info
        this.createText({
            x: 120,
            y: 205,
            fontSize: 4,
            text: `Detected Addons on ${this.target?.Name || "Target"} (${mods.length})`
        });

        // Compliance status bar
        const statusBanner = document.createElement("div");
        statusBanner.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(250)}px;
            width: ${getRelativeWidth(1760)}px;
            padding: 10px 18px;
            border-radius: 6px;
            box-sizing: border-box;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: ${compliance.isCompliant ? "rgba(46, 125, 50, 0.25)" : "rgba(198, 40, 40, 0.3)"};
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            color: ${compliance.isCompliant ? "#a5d6a7" : "#ffcdd2"};
            z-index: 5;
        `;
        statusBanner.textContent = compliance.isCompliant
            ? "✓ COMPLIANT: Player meets all active addon rules."
            : `⚠️ NON-COMPLIANT: ${compliance.missing.length} missing mandatory addons, ${compliance.forbidden.length} forbidden addons detected.`;

        this.registerContainer(statusBanner);

        // Mod list
        const listContainer = document.createElement("div");
        listContainer.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(310)}px;
            width: ${getRelativeWidth(1760)}px;
            height: ${getRelativeHeight(560)}px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 5;
        `;
        this.registerContainer(listContainer);

        if (mods.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.style.cssText = "color: #90a4ae; font-size: 16px; padding: 20px;";
            emptyMsg.textContent = "Target reported no active addons.";
            listContainer.appendChild(emptyMsg);
            return;
        }

        for (const mod of mods) {
            const card = document.createElement("div");
            card.style.cssText = `
                background: rgba(30, 36, 48, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.4);
                border-radius: 6px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #e0e6ed;
            `;

            const left = document.createElement("div");
            left.style.cssText = "display: flex; flex-direction: column; gap: 3px;";

            const title = document.createElement("div");
            title.style.cssText = "font-size: 16px; font-weight: bold; color: #64b5f6;";
            title.textContent = mod.name;

            const sub = document.createElement("div");
            sub.style.cssText = "font-size: 12px; color: #8fa0b5;";
            sub.textContent = `ID: ${mod.id}${mod.repository ? ` • Repo: ${mod.repository}` : ""}`;

            left.appendChild(title);
            left.appendChild(sub);

            const badge = document.createElement("span");
            badge.style.cssText = `
                background: rgba(41, 121, 255, 0.2);
                border: 1px solid #2979ff;
                color: #82b1ff;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            `;
            badge.textContent = `v${mod.version || "Active"}`;

            card.appendChild(left);
            card.appendChild(badge);
            listContainer.appendChild(card);
        }
    }

    private renderTargetRulesTab(): void {
        const canEnforce = this.target && hasRuleAuthorityOver(this.target);

        if (!canEnforce) {
            this.createText({
                x: 120,
                y: 240,
                fontSize: 4,
                text: "Permission Restricted"
            });

            const notice = this.createText({
                x: 120,
                y: 300,
                fontSize: 3.5,
                text: "Only an Owner (or Lover/Whitelisted partner if permitted by target) can set locked addon rules."
            });
            notice.style.color = "#aaa";
            return;
        }

        this.createText({
            x: 120,
            y: 200,
            fontSize: 4,
            text: `Manage Locked Addons on ${this.target?.Name || "Target"}`
        });

        // Curated presets container
        const presetsContainer = document.createElement("div");
        presetsContainer.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(240)}px;
            width: ${getRelativeWidth(1760)}px;
            height: ${getRelativeHeight(480)}px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 5;
        `;
        this.registerContainer(presetsContainer);

        const curatedList = Object.values(CURATED_MOD_CATALOG);

        for (const item of curatedList) {
            const row = document.createElement("div");
            row.style.cssText = `
                background: rgba(30, 36, 48, 0.85);
                border: 1px solid rgba(80, 100, 140, 0.4);
                border-radius: 6px;
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #e0e6ed;
            `;

            const left = document.createElement("div");
            left.style.cssText = "display: flex; flex-direction: column; gap: 3px;";

            const name = document.createElement("div");
            name.style.cssText = "font-size: 16px; font-weight: bold; color: #64b5f6;";
            name.textContent = item.name;

            const desc = document.createElement("div");
            desc.style.cssText = "font-size: 12px; color: #8fa0b5;";
            desc.textContent = item.description;

            left.appendChild(name);
            left.appendChild(desc);

            // Three-state buttons: Neutral / Mandatory / Forbidden
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
                    this.cleanupContainers();
                    this.renderTargetRulesTab();
                });
                return b;
            };

            btnGroup.appendChild(createChoiceBtn("none", "Neutral", "#78909c"));
            btnGroup.appendChild(createChoiceBtn("required", "Mandatory", "#2e7d32"));
            btnGroup.appendChild(createChoiceBtn("forbidden", "Forbidden", "#c62828"));

            row.appendChild(left);
            row.appendChild(btnGroup);
            presetsContainer.appendChild(row);
        }

        // Save & Sync button
        const saveBtn = this.createButton({
            x: 120,
            y: 750,
            width: 380,
            height: 60,
            text: "💾 Save & Sync Rules to Target",
            onClick: async () => {
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
            }
        });
        saveBtn.style.fontWeight = "bold";
    }
}
