import { BaseSubscreen, getRelativeX, getRelativeY, getRelativeWidth, setSubscreen } from "zois-core/ui";
import { modStorage, saveStorage, syncStorage, InspectViewPermission, AutoLoadMode } from "modules/storage";
import { getLoadedMods } from "modules/modDetection";
import { checkComplianceAgainstRules } from "modules/compliance";
import { InspectorSubscreen } from "./inspectorSubscreen";
import { MainSubscreen } from "./mainSubscreen";

export class AddonPolicySubscreen extends BaseSubscreen {
    private domElements: HTMLElement[] = [];

    public override get name(): string {
        return "Addon Policy & Sharing";
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public override onLoad(): void {
        this.createText({
            x: 120,
            y: 180,
            fontSize: 4,
            text: "Addon Inspection & Sharing Settings"
        });

        // 1. Enable Addon Inspector & Sharing
        this.createCheckbox({
            x: 120,
            y: 230,
            width: 800,
            height: 44,
            text: "Enable Addon Inspector & Sharing System",
            isChecked: modStorage.inspector.enabled,
            onChange: () => {
                modStorage.inspector.enabled = !modStorage.inspector.enabled;
                saveStorage();
                syncStorage();
            }
        });

        // 2. Allow Owner to lock rules
        this.createCheckbox({
            x: 120,
            y: 285,
            width: 800,
            height: 44,
            text: "Allow Owner to lock mandatory / forbidden addon rules on me",
            isChecked: modStorage.inspector.allowOwnerRules,
            onChange: () => {
                modStorage.inspector.allowOwnerRules = !modStorage.inspector.allowOwnerRules;
                saveStorage();
                syncStorage();
            }
        });

        // 3. Allow Lovers/Whitelist to lock rules
        this.createCheckbox({
            x: 120,
            y: 340,
            width: 800,
            height: 44,
            text: "Allow Lovers / Whitelisted partners to lock addon rules",
            isChecked: modStorage.inspector.allowLoversRules,
            onChange: () => {
                modStorage.inspector.allowLoversRules = !modStorage.inspector.allowLoversRules;
                saveStorage();
                syncStorage();
            }
        });

        // 4. Auto-Load Behavior Selection
        this.createText({
            x: 120,
            y: 410,
            fontSize: 3.5,
            text: "Missing Mandatory Addon Behavior:"
        });

        const autoLoadModes: { mode: AutoLoadMode; label: string }[] = [
            { mode: "Prompt", label: "Prompt First (Recommended)" },
            { mode: "Silent", label: "Silent Auto-Load" }
        ];

        autoLoadModes.forEach((item, idx) => {
            const isSelected = modStorage.inspector.autoLoadMode === item.mode;
            const btn = this.createButton({
                x: 120 + idx * 360,
                y: 445,
                width: 340,
                height: 48,
                text: `${isSelected ? "● " : "○ "}${item.label}`,
                onClick: () => {
                    modStorage.inspector.autoLoadMode = item.mode;
                    saveStorage();
                    syncStorage();
                    setSubscreen(new AddonPolicySubscreen());
                }
            });
            btn.style.fontWeight = isSelected ? "bold" : "normal";
        });

        // 5. Viewing Permission Selection
        this.createText({
            x: 120,
            y: 520,
            fontSize: 3.5,
            text: "Who May Inspect Your Loaded Addons:"
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
                y: 555 + row * 55,
                width: 300,
                height: 46,
                text: `${isSelected ? "● " : "○ "}${item.label}`,
                onClick: () => {
                    modStorage.inspector.viewPermission = item.perm;
                    saveStorage();
                    syncStorage();
                    setSubscreen(new AddonPolicySubscreen());
                }
            });
            btn.style.fontWeight = isSelected ? "bold" : "normal";
        });

        // 6. Status Summary Card & Full Inspector Launcher Button
        const loadedMods = getLoadedMods();
        const rules = modStorage.inspector.rules;
        const compliance = checkComplianceAgainstRules(loadedMods, rules);

        const summaryCard = document.createElement("div");
        summaryCard.style.cssText = `
            position: absolute;
            left: ${getRelativeX(120)}px;
            top: ${getRelativeY(690)}px;
            width: ${getRelativeWidth(920)}px;
            padding: 12px 18px;
            background: rgba(30, 36, 48, 0.85);
            border: 1px solid ${compliance.isCompliant ? "#4caf50" : "#ef5350"};
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #e0e6ed;
            font-size: 14px;
            z-index: 10;
        `;

        const statusText = document.createElement("div");
        statusText.innerHTML = `
            <div><b>Active Addons:</b> ${loadedMods.length} detected • <b>Rules on You:</b> ${rules.length}</div>
            <div style="font-size: 12px; color: ${compliance.isCompliant ? "#81c784" : "#e57373"}; margin-top: 3px;">
                ${compliance.isCompliant ? "✓ Compliant with all addon rules" : `⚠️ Non-compliant (${compliance.missing.length} missing, ${compliance.forbidden.length} forbidden)`}
            </div>
        `;
        summaryCard.appendChild(statusText);
        this.domElements.push(summaryCard);
        document.body.appendChild(summaryCard);

        const openManagerBtn = this.createButton({
            x: 1070,
            y: 690,
            width: 450,
            height: 52,
            text: "🔍 Open Full Addon & Policy Manager",
            onClick: () => {
                this.cleanup();
                setSubscreen(new InspectorSubscreen(typeof Player !== "undefined" ? Player : null));
            }
        });
        openManagerBtn.style.fontWeight = "bold";

        // Hint
        const hint = this.createText({
            x: 120,
            y: 775,
            fontSize: 2.8,
            text: "Tip: You can also inspect other players in your room by opening their profile and clicking the Shield icon under the LSCG button!"
        });
        hint.style.color = "#8fa0b5";
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
        for (const el of this.domElements) {
            try {
                el.remove();
            } catch {}
        }
        this.domElements = [];
    }
}
