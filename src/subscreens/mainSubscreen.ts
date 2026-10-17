import { BaseSubscreen, setSubscreen } from "zois-core/ui";
import { Bug, CodeXml, createElement, GitPullRequest, Lock, Search, ShieldCheck, Sliders } from "lucide";
import { version } from "../../package.json";
import { MOD_NAME, MOD_REPOSITORY } from "src/constants";
import { syncStorage, modStorage, ACCESS_LEVEL_NAMES, AccessLevel } from "modules/storage";
import { ChatResizerSubscreen } from "./chatResizerSubscreen";
import { AuthoritySubscreen } from "./authoritySubscreen";
import { InspectorSubscreen } from "./inspectorSubscreen";
import { getLoadedMods } from "modules/modDetection";
import { checkComplianceAgainstRules } from "modules/compliance";
import { checkPermissionAccess } from "modules/authority";

export class MainSubscreen extends BaseSubscreen {
    public override get name(): string {
        return "";
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public override onLoad(): void {
        // Version card (bottom-right, BCC style)
        this.createCard({
            anchor: "bottom-right",
            x: 90,
            y: 65,
            width: 220,
            name: "Version",
            value: `v${version}`,
            icon: createElement(GitPullRequest)
        });

        // Main Title
        const title = this.createText({
            text: "QUALITY OF CLUB",
            fontSize: 10,
            x: 165,
            y: 75,
            width: 1600
        });
        title.style.fontWeight = "bold";
        title.style.color = "#64b5f6";
        title.style.letterSpacing = "2px";

        // Check if settings menu is locked for self
        const canOpenSettings = checkPermissionAccess("menu_open_settings");
        if (!canOpenSettings) {
            this.renderLockoutScreen();
            return;
        }

        // Subtitle
        const subtitle = this.createText({
            text: "Quality-of-Life & Addon Compliance Suite for Bondage Club",
            fontSize: 3.2,
            x: 165,
            y: 195,
            width: 1200
        });
        subtitle.style.color = "#90a4ae";

        // Navigation Menu Buttons (Left Column, exactly like BCC)
        const menuItems = [
            {
                name: "Chat Window Resizer",
                icon: createElement(Sliders),
                subscreen: () => new ChatResizerSubscreen()
            },
            {
                name: "Authority & Roles",
                icon: createElement(ShieldCheck),
                subscreen: () => new AuthoritySubscreen()
            },
            {
                name: "My Addons & Compliance",
                icon: createElement(Search),
                subscreen: () => new InspectorSubscreen(typeof Player !== "undefined" ? Player : null)
            }
        ];

        menuItems.forEach((item, i) => {
            const btn = this.createButton({
                text: item.name,
                icon: item.icon,
                x: 165,
                y: 280 + (125 * i),
                width: 620,
                height: 85,
                padding: 2,
                onClick: () => this.setSubscreen(item.subscreen())
            });
            btn.style.fontWeight = "bold";
            btn.style.fontSize = "calc(3.5px * var(--size-unit, 4px))";
        });

        // Quick Overview Card (Right Column)
        const loadedMods = getLoadedMods();
        const rules = modStorage.inspector.rules;
        const compliance = checkComplianceAgainstRules(loadedMods, rules);
        const permSetting = modStorage.authority?.permissions?.inspect_view_addons;
        const viewMinRoleName = permSetting ? ACCESS_LEVEL_NAMES[permSetting.min] : "Public";

        const card = document.createElement("div");
        card.style.cssText = `
            position: absolute;
            left: calc(1050px * (var(--canvas-width, 2000px) / 2000));
            top: calc(280px * (var(--canvas-height, 1000px) / 1000));
            width: calc(650px * (var(--canvas-width, 2000px) / 2000));
            background: rgba(30, 36, 48, 0.9);
            border: 1px solid rgba(80, 100, 140, 0.4);
            border-radius: 8px;
            padding: 20px 24px;
            color: #e0e6ed;
            box-sizing: border-box;
            z-index: 5;
        `;
        card.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; color: #64b5f6; margin-bottom: 12px; border-bottom: 1px solid rgba(80,100,140,0.3); padding-bottom: 8px;">
                Current System Overview
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Chat Resizer:</span>
                <b style="color: ${modStorage.chatResizer.enabled ? '#81c784' : '#ef5350'};">${modStorage.chatResizer.enabled ? 'Enabled (' + modStorage.chatResizer.splitPercent + '%)' : 'Disabled (Off)'}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Authority Roles:</span>
                <b style="color: #64b5f6;">${modStorage.authority.owners.length} Owners / ${modStorage.authority.mistresses.length} Mistresses</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Addon Sharing:</span>
                <b style="color: ${modStorage.inspector.enabled ? '#81c784' : '#ef5350'};">${modStorage.inspector.enabled ? 'Active (' + viewMinRoleName + ')' : 'Disabled'}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #90a4ae;">Detected Addons:</span>
                <b>${loadedMods.length} loaded</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(80,100,140,0.3);">
                <span style="color: #90a4ae;">Rule Compliance:</span>
                <b style="color: ${compliance.isCompliant ? '#81c784' : '#ef5350'};">${compliance.isCompliant ? '✓ COMPLIANT' : '⚠️ ' + compliance.missing.length + ' MISSING / ' + compliance.forbidden.length + ' FORBIDDEN'}</b>
            </div>
        `;
        document.body.appendChild(card);
        this.domElements.push(card);

        // Source Code & Issues Link Buttons (BCC style)
        this.createButton({
            text: "Source Code (GitHub)",
            icon: createElement(CodeXml),
            href: MOD_REPOSITORY,
            x: 1050,
            y: 535,
            width: 480,
            height: 60,
            padding: 2
        });

        this.createButton({
            text: "Report Issues / Feedback",
            icon: createElement(Bug),
            href: MOD_REPOSITORY ? `${MOD_REPOSITORY}/issues` : undefined,
            x: 1050,
            y: 615,
            width: 480,
            height: 60,
            padding: 2
        });
    }

    private renderLockoutScreen(): void {
        const lockCard = document.createElement("div");
        lockCard.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(85vw, 680px);
            background: rgba(30, 36, 48, 0.95);
            border: 2px solid #ef5350;
            border-radius: 10px;
            padding: 36px 40px;
            color: #e0e6ed;
            box-sizing: border-box;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        `;

        const minRole = modStorage.authority?.permissions?.menu_open_settings?.min ?? AccessLevel.owner;
        const minRoleName = ACCESS_LEVEL_NAMES[minRole];

        lockCard.innerHTML = `
            <div style="font-size: 48px; line-height: 1;">🔒</div>
            <div style="font-size: 22px; font-weight: bold; color: #ef5350;">Quality of Club Access Locked</div>
            <div style="font-size: 15px; color: #cfd8dc; line-height: 1.5; max-width: 500px;">
                Access to the Quality of Club configuration menu has been surrendered or locked.
            </div>
            <div style="font-size: 13px; color: #90a4ae; background: rgba(20, 26, 38, 0.6); padding: 10px 18px; border-radius: 6px; border: 1px solid rgba(80, 100, 140, 0.3);">
                Lowest authorized role required to open this menu: <b style="color: #64b5f6;">${minRoleName}</b>
            </div>
            <div style="font-size: 12px; color: #78909c; margin-top: 6px;">
                Only an authorized Owner or Mistress can modify these permissions or restore your access.
            </div>
        `;

        const exitBtn = document.createElement("button");
        exitBtn.textContent = "✕ Return to Club";
        exitBtn.style.cssText = `
            margin-top: 14px;
            padding: 12px 36px;
            background: #1976d2;
            border: 1px solid #42a5f5;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
        exitBtn.addEventListener("click", () => this.exit());

        lockCard.appendChild(exitBtn);
        document.body.appendChild(lockCard);
        this.domElements.push(lockCard);
    }

    private domElements: HTMLElement[] = [];

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

    public override exit(): void {
        this.cleanup();
        setSubscreen(null);
        syncStorage();
        if (typeof CurrentScreen !== "undefined" && CurrentScreen === "Preference" && typeof PreferenceSubscreenExtensionsClear === "function") {
            PreferenceSubscreenExtensionsClear();
        }
    }
}
