import { BaseSubscreen, setSubscreen } from "zois-core/ui";
import { modStorage, saveStorage, syncStorage, InspectViewPermission, AutoLoadMode } from "modules/storage";
import { getLoadedMods } from "modules/modDetection";
import { checkComplianceAgainstRules } from "modules/compliance";
import { InspectorSubscreen } from "./inspectorSubscreen";
import { MainSubscreen } from "./mainSubscreen";

export class AddonPolicySubscreen extends BaseSubscreen {
    private rootElement: HTMLElement | null = null;

    public override get name(): string {
        return "";
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public override onLoad(): void {
        this.createUI();
    }

    public override exit(): void {
        this.cleanup();
        setSubscreen(new MainSubscreen());
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
    }

    private createUI(): void {
        this.cleanup();

        // 1. Full-screen solid backdrop
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

        // 2. Container
        const container = document.createElement("div");
        container.style.cssText = `
            width: min(92vw, 1300px);
            height: min(92vh, 900px);
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-sizing: border-box;
        `;

        // 3. Header
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.35);
        `;

        const titleBox = document.createElement("div");
        titleBox.innerHTML = `
            <div style="font-size: 24px; font-weight: bold; color: #64b5f6; letter-spacing: 0.5px;">
                🛡️ Addon Policy & Sharing Settings
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 4px;">
                Control who can view your active addons and who is authorized to lock mandatory or forbidden addon rules.
            </div>
        `;

        const backBtn = document.createElement("button");
        backBtn.textContent = "✕ Back to Menu";
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
        backBtn.addEventListener("mouseover", () => { backBtn.style.background = "#d32f2f"; });
        backBtn.addEventListener("mouseout", () => { backBtn.style.background = "rgba(220, 50, 50, 0.85)"; });
        backBtn.addEventListener("click", () => this.exit());

        header.appendChild(titleBox);
        header.appendChild(backBtn);
        container.appendChild(header);

        // 4. Scrollable Body
        const body = document.createElement("div");
        body.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding-right: 6px;
            box-sizing: border-box;
        `;

        // Section A: General Consent & Permissions
        const consentCard = this.createCardElement("🔒 General Permissions & Consent");
        const toggles = [
            {
                title: "Enable Addon Inspector & Sharing System",
                desc: "Master switch. Allows checking addon compliance and exchanging addon status with other players in chatrooms.",
                checked: modStorage.inspector.enabled,
                toggle: () => {
                    modStorage.inspector.enabled = !modStorage.inspector.enabled;
                    saveStorage();
                    syncStorage();
                    this.createUI();
                }
            },
            {
                title: "Allow Club Owner to Lock Rules",
                desc: "Permits your Club Owner to set mandatory or forbidden addon requirements on your character.",
                checked: modStorage.inspector.allowOwnerRules,
                toggle: () => {
                    modStorage.inspector.allowOwnerRules = !modStorage.inspector.allowOwnerRules;
                    saveStorage();
                    syncStorage();
                    this.createUI();
                }
            },
            {
                title: "Allow Lovers & Whitelist to Lock Rules",
                desc: "Permits your Lovers or Whitelisted partners to enforce addon rules on your character.",
                checked: modStorage.inspector.allowLoversRules,
                toggle: () => {
                    modStorage.inspector.allowLoversRules = !modStorage.inspector.allowLoversRules;
                    saveStorage();
                    syncStorage();
                    this.createUI();
                }
            }
        ];

        toggles.forEach(t => {
            consentCard.appendChild(this.createToggleRow(t.title, t.desc, t.checked, t.toggle));
        });
        body.appendChild(consentCard);

        // Section B: Missing Mandatory Addon Auto-Load Behavior
        const autoLoadCard = this.createCardElement("⚙️ Missing Mandatory Addon Behavior", "What happens when an authorized owner or room requires an addon you don't have loaded:");
        const autoLoadGrid = document.createElement("div");
        autoLoadGrid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 8px;
        `;

        const autoLoadOptions: { mode: AutoLoadMode; label: string; desc: string }[] = [
            {
                mode: "Prompt",
                label: "Prompt First (Recommended)",
                desc: "Displays an in-game confirmation toast before loading any missing addon."
            },
            {
                mode: "Silent",
                label: "Silent Auto-Load",
                desc: "Automatically injects verified addons (BCX, LSCG, BCT, ClubChaos) without prompting."
            }
        ];

        autoLoadOptions.forEach(opt => {
            const isSelected = modStorage.inspector.autoLoadMode === opt.mode;
            const btn = document.createElement("div");
            btn.style.cssText = `
                padding: 14px 18px;
                border-radius: 8px;
                cursor: pointer;
                background: ${isSelected ? "rgba(25, 118, 210, 0.25)" : "rgba(35, 45, 60, 0.6)"};
                border: 1px solid ${isSelected ? "#42a5f5" : "rgba(80, 100, 140, 0.35)"};
                transition: all 0.15s ease;
            `;
            btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 15px; color: ${isSelected ? "#64b5f6" : "#e0e6ed"};">
                    <span style="font-size: 16px;">${isSelected ? "●" : "○"}</span>
                    <span>${opt.label}</span>
                </div>
                <div style="font-size: 12px; color: #90a4ae; margin-top: 5px; margin-left: 24px;">
                    ${opt.desc}
                </div>
            `;
            btn.addEventListener("click", () => {
                modStorage.inspector.autoLoadMode = opt.mode;
                saveStorage();
                syncStorage();
                this.createUI();
            });
            autoLoadGrid.appendChild(btn);
        });
        autoLoadCard.appendChild(autoLoadGrid);
        body.appendChild(autoLoadCard);

        // Section C: Who May Inspect Your Loaded Addons
        const permCard = this.createCardElement("👁️ Who May Inspect Your Loaded Addons", "Choose who in your chatroom has permission to query and view your loaded addons:");
        const permGrid = document.createElement("div");
        permGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 8px;
        `;

        const permOptions: { perm: InspectViewPermission; label: string; desc: string }[] = [
            { perm: "Prompt", label: "Prompt Me (Recommended)", desc: "Asks you each time someone requests inspection" },
            { perm: "Owner", label: "Owner Only", desc: "Only your Club Owner can inspect" },
            { perm: "Lovers", label: "Owner & Lovers", desc: "Your Owner and Lovers can inspect" },
            { perm: "Whitelist", label: "Whitelist / Friends", desc: "Only players on your whitelist can inspect" },
            { perm: "Anyone", label: "Anyone in Room", desc: "Any player in the same room can inspect" },
            { perm: "Disabled", label: "Disabled (Nobody)", desc: "Blocks all remote inspection queries" }
        ];

        permOptions.forEach(opt => {
            const isSelected = modStorage.inspector.viewPermission === opt.perm;
            const btn = document.createElement("div");
            btn.style.cssText = `
                padding: 12px 14px;
                border-radius: 6px;
                cursor: pointer;
                background: ${isSelected ? "rgba(25, 118, 210, 0.25)" : "rgba(35, 45, 60, 0.6)"};
                border: 1px solid ${isSelected ? "#42a5f5" : "rgba(80, 100, 140, 0.35)"};
                transition: all 0.15s ease;
            `;
            btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 14px; color: ${isSelected ? "#64b5f6" : "#e0e6ed"};">
                    <span>${isSelected ? "●" : "○"}</span>
                    <span>${opt.label}</span>
                </div>
                <div style="font-size: 11px; color: #90a4ae; margin-top: 4px; margin-left: 20px;">
                    ${opt.desc}
                </div>
            `;
            btn.addEventListener("click", () => {
                modStorage.inspector.viewPermission = opt.perm;
                saveStorage();
                syncStorage();
                this.createUI();
            });
            permGrid.appendChild(btn);
        });
        permCard.appendChild(permGrid);
        body.appendChild(permCard);

        // Section D: Status & Full Manager Launcher
        const loadedMods = getLoadedMods();
        const rules = modStorage.inspector.rules;
        const compliance = checkComplianceAgainstRules(loadedMods, rules);

        const statusBanner = document.createElement("div");
        statusBanner.style.cssText = `
            background: rgba(30, 36, 48, 0.9);
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            border-radius: 8px;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
        `;

        const statusInfo = document.createElement("div");
        statusInfo.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: ${compliance.isCompliant ? "#81c784" : "#ef5350"};">
                ${compliance.isCompliant ? "✓ Compliant with All Addon Rules" : `⚠️ Non-Compliant (${compliance.missing.length} missing, ${compliance.forbidden.length} forbidden)`}
            </div>
            <div style="font-size: 13px; color: #b0bec5; margin-top: 4px;">
                <b>${loadedMods.length}</b> addons loaded &nbsp;•&nbsp; <b>${rules.length}</b> rules active on your character
            </div>
        `;

        const openManagerBtn = document.createElement("button");
        openManagerBtn.textContent = "🔍 Open Full Addon & Policy Manager";
        openManagerBtn.style.cssText = `
            padding: 12px 24px;
            background: #1976d2;
            border: 1px solid #42a5f5;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
            white-space: nowrap;
        `;
        openManagerBtn.addEventListener("mouseover", () => { openManagerBtn.style.background = "#1e88e5"; });
        openManagerBtn.addEventListener("mouseout", () => { openManagerBtn.style.background = "#1976d2"; });
        openManagerBtn.addEventListener("click", () => {
            this.cleanup();
            setSubscreen(new InspectorSubscreen(typeof Player !== "undefined" ? Player : null));
        });

        statusBanner.appendChild(statusInfo);
        statusBanner.appendChild(openManagerBtn);
        body.appendChild(statusBanner);

        // Footer Tip
        const tip = document.createElement("div");
        tip.style.cssText = `
            font-size: 12px;
            color: #8fa0b5;
            text-align: center;
            padding: 4px 0;
        `;
        tip.innerHTML = `💡 <b>Tip:</b> You can also inspect other players in your room by opening their character profile and clicking the <b>Shield icon</b> under the LSCG button!`;
        body.appendChild(tip);

        container.appendChild(body);
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        this.rootElement = backdrop;
    }

    private createCardElement(title: string, subtitle?: string): HTMLElement {
        const card = document.createElement("div");
        card.style.cssText = `
            background: rgba(30, 36, 48, 0.85);
            border: 1px solid rgba(80, 100, 140, 0.35);
            border-radius: 8px;
            padding: 16px 20px;
            box-sizing: border-box;
        `;
        let headerHtml = `<div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${title}</div>`;
        if (subtitle) {
            headerHtml += `<div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${subtitle}</div>`;
        }
        card.innerHTML = headerHtml;
        return card;
    }

    private createToggleRow(title: string, desc: string, isChecked: boolean, onToggle: () => void): HTMLElement {
        const row = document.createElement("div");
        row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(80, 100, 140, 0.2);
            cursor: pointer;
        `;
        row.addEventListener("click", onToggle);

        const textBox = document.createElement("div");
        textBox.style.cssText = "padding-right: 16px;";
        textBox.innerHTML = `
            <div style="font-size: 15px; font-weight: 600; color: #e0e6ed;">${title}</div>
            <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${desc}</div>
        `;

        const switchEl = document.createElement("div");
        switchEl.style.cssText = `
            width: 48px;
            height: 26px;
            background: ${isChecked ? "#1976d2" : "rgba(60, 70, 90, 0.7)"};
            border-radius: 13px;
            position: relative;
            flex-shrink: 0;
            transition: background 0.2s ease;
            border: 1px solid ${isChecked ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
        `;

        const knob = document.createElement("div");
        knob.style.cssText = `
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: ${isChecked ? "24px" : "3px"};
            transition: left 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        `;
        switchEl.appendChild(knob);

        row.appendChild(textBox);
        row.appendChild(switchEl);
        return row;
    }
}
