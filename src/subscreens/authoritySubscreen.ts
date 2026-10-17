import { BaseSubscreen, setSubscreen } from "zois-core/ui";
import {
    modStorage,
    saveStorage,
    syncStorage,
    AccessLevel,
    ACCESS_LEVEL_NAMES,
    QoCPermission
} from "modules/storage";
import {
    PermissionDefinition,
    PERMISSION_DEFINITIONS,
    getCharacterAccessLevel,
    checkPermissionAccess,
    addRoleMember,
    removeRoleMember,
    setPermissionMinRole,
    setPermissionSelfAccess
} from "modules/authority";
import { MainSubscreen } from "./mainSubscreen";

export class AuthoritySubscreen extends BaseSubscreen {
    private rootElement: HTMLElement | null = null;
    private activeTab: "roles" | "permissions" = "roles";
    private filterText: string = "";
    private modalElement: HTMLElement | null = null;

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
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
        if (this.rootElement) {
            this.rootElement.remove();
            this.rootElement = null;
        }
    }

    private createUI(): void {
        this.cleanup();

        const playerName = typeof Player !== "undefined" ? (Player.Name || "Player") : "Player";

        // Full-screen backdrop
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
            width: min(94vw, 1350px);
            height: min(92vh, 920px);
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-sizing: border-box;
        `;

        // 1. Header
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
            <div style="font-size: 24px; font-weight: bold; color: #64b5f6;">
                Authority & Permissions Management for ${playerName}
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 3px;">
                Configure hierarchical roles, manage Owners/Mistresses, and set access thresholds.
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

        // 2. Tab Bar
        const tabBar = document.createElement("div");
        tabBar.style.cssText = "display: flex; gap: 12px;";

        const tabs: { id: "roles" | "permissions"; label: string }[] = [
            { id: "roles", label: "👑 Role Management" },
            { id: "permissions", label: "🛡️ Permission Settings" }
        ];

        tabs.forEach(t => {
            const isSel = this.activeTab === t.id;
            const b = document.createElement("button");
            b.textContent = t.label;
            b.style.cssText = `
                padding: 10px 22px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                background: ${isSel ? "#1976d2" : "rgba(45, 55, 75, 0.8)"};
                border: 1px solid ${isSel ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
                color: ${isSel ? "white" : "#90a4ae"};
                transition: all 0.15s ease;
            `;
            b.addEventListener("click", () => {
                this.activeTab = t.id;
                this.createUI();
            });
            tabBar.appendChild(b);
        });
        container.appendChild(tabBar);

        // 3. Dynamic Content
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

        if (this.activeTab === "roles") {
            this.renderRoleManagement(contentArea, playerName);
        } else {
            this.renderPermissionSettings(contentArea, playerName);
        }

        container.appendChild(contentArea);
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        this.rootElement = backdrop;
    }

    // ==========================================
    // TAB 1: ROLE MANAGEMENT (BCX Image 1 Style)
    // ==========================================

    private renderRoleManagement(content: HTMLElement, playerName: string): void {
        const canEditRoles = checkPermissionAccess("authority_edit_roles");

        // Top info header
        const topRow = document.createElement("div");
        topRow.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;";

        const leftCol = document.createElement("div");
        leftCol.style.cssText = "flex: 1; display: flex; flex-direction: column; gap: 16px;";

        // Role Add Controls
        const addCard = document.createElement("div");
        addCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px;";
        addCard.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; color: #64b5f6; margin-bottom: 6px;">
                Assign Custom Dominant Roles
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
        addOwnerBtn.addEventListener("click", () => {
            const val = parseInt(numInput.value.trim(), 10);
            if (!val) return;
            const res = addRoleMember("owner", val);
            if (res.success) {
                numInput.value = "";
                this.createUI();
            } else {
                alert(res.message);
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
        addMistressBtn.addEventListener("click", () => {
            const val = parseInt(numInput.value.trim(), 10);
            if (!val) return;
            const res = addRoleMember("mistress", val);
            if (res.success) {
                numInput.value = "";
                this.createUI();
            } else {
                alert(res.message);
            }
        });

        inputRow.appendChild(numInput);
        inputRow.appendChild(addOwnerBtn);
        inputRow.appendChild(addMistressBtn);
        addCard.appendChild(inputRow);

        if (!canEditRoles) {
            const lockNotice = document.createElement("div");
            lockNotice.style.cssText = "color: #ef5350; font-size: 12px; margin-top: 8px; font-weight: bold;";
            lockNotice.textContent = "🔒 Role editing is restricted by your current authority settings.";
            addCard.appendChild(lockNotice);
        }

        leftCol.appendChild(addCard);

        // Active Roles Lists
        const listsCard = document.createElement("div");
        listsCard.style.cssText = "background: rgba(35, 43, 60, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 14px;";

        // Owners List
        const ownersHeader = document.createElement("div");
        ownersHeader.innerHTML = `<span style="font-weight: bold; color: #64b5f6; font-size: 15px;">QoC Owners (${modStorage.authority.owners.length})</span>`;
        listsCard.appendChild(ownersHeader);

        const ownersBox = document.createElement("div");
        ownersBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
        if (modStorage.authority.owners.length === 0) {
            ownersBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom owners assigned.</span>";
        } else {
            modStorage.authority.owners.forEach(id => {
                const tag = document.createElement("div");
                tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(25, 118, 210, 0.3); border: 1px solid #42a5f5; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
                tag.innerHTML = `<span>Member #${id}</span>`;
                if (canEditRoles) {
                    const rm = document.createElement("button");
                    rm.textContent = "✕";
                    rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
                    rm.addEventListener("click", () => {
                        removeRoleMember("owner", id);
                        this.createUI();
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
        mistressHeader.innerHTML = `<span style="font-weight: bold; color: #ba68c8; font-size: 15px;">QoC Mistresses (${modStorage.authority.mistresses.length})</span>`;
        listsCard.appendChild(mistressHeader);

        const mistressBox = document.createElement("div");
        mistressBox.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
        if (modStorage.authority.mistresses.length === 0) {
            mistressBox.innerHTML = "<span style='color: #8fa0b5; font-size: 13px;'>No custom mistresses assigned.</span>";
        } else {
            modStorage.authority.mistresses.forEach(id => {
                const tag = document.createElement("div");
                tag.style.cssText = "display: flex; align-items: center; gap: 8px; background: rgba(123, 31, 162, 0.3); border: 1px solid #ba68c8; padding: 4px 12px; border-radius: 4px; font-size: 13px;";
                tag.innerHTML = `<span>Member #${id}</span>`;
                if (canEditRoles) {
                    const rm = document.createElement("button");
                    rm.textContent = "✕";
                    rm.style.cssText = "background: none; border: none; color: #ef5350; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 4px;";
                    rm.addEventListener("click", () => {
                        removeRoleMember("mistress", id);
                        this.createUI();
                    });
                    tag.appendChild(rm);
                }
                mistressBox.appendChild(tag);
            });
        }
        listsCard.appendChild(mistressBox);
        leftCol.appendChild(listsCard);
        topRow.appendChild(leftCol);

        // Right Col: Visual Role Hierarchy Funnel (Image 1 replica)
        const rightCol = document.createElement("div");
        rightCol.style.cssText = "width: 280px; display: flex; flex-direction: column; align-items: center; background: rgba(30, 36, 48, 0.85); border: 1px solid rgba(80, 100, 140, 0.4); border-radius: 8px; padding: 20px;";

        const pyramidTitle = document.createElement("div");
        pyramidTitle.style.cssText = "font-size: 15px; font-weight: bold; color: #64b5f6; margin-bottom: 16px; text-align: center;";
        pyramidTitle.textContent = "Hierarchy of Roles";
        rightCol.appendChild(pyramidTitle);

        const rolesList = [
            { name: playerName, color: "#00e5ff", width: 140 },
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
        content.appendChild(topRow);
    }

    // ==========================================
    // TAB 2: PERMISSION SETTINGS (BCX Image 2 & 3)
    // ==========================================

    private renderPermissionSettings(content: HTMLElement, playerName: string): void {
        const canEditMin = checkPermissionAccess("authority_edit_min_role");
        const canEditSelf = checkPermissionAccess("authority_edit_self_access");

        // Search Filter
        const filterBar = document.createElement("div");
        filterBar.style.cssText = "display: flex; align-items: center; gap: 12px; margin-bottom: 6px;";

        const filterLabel = document.createElement("span");
        filterLabel.textContent = "Filter:";
        filterLabel.style.cssText = "font-weight: bold; color: #90a4ae; font-size: 14px;";

        const filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.placeholder = "Search permission by name or description...";
        filterInput.value = this.filterText;
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
            this.filterText = filterInput.value.toLowerCase().trim();
            this.updatePermissionsList(listContainer, playerName, canEditMin, canEditSelf);
        });

        filterBar.appendChild(filterLabel);
        filterBar.appendChild(filterInput);
        content.appendChild(filterBar);

        // Header Table Labels
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
                <span style="min-width: 140px; text-align: center;">${playerName} is permitted</span>
                <span style="min-width: 160px; text-align: center;">Lowest permitted role</span>
            </div>
        `;
        content.appendChild(headerRow);

        const listContainer = document.createElement("div");
        listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";
        content.appendChild(listContainer);

        this.updatePermissionsList(listContainer, playerName, canEditMin, canEditSelf);
    }

    private updatePermissionsList(container: HTMLElement, playerName: string, canEditMin: boolean, canEditSelf: boolean): void {
        container.innerHTML = "";

        const filtered = PERMISSION_DEFINITIONS.filter(def => {
            if (!this.filterText) return true;
            return def.name.toLowerCase().includes(this.filterText) || def.description.toLowerCase().includes(this.filterText);
        });

        if (filtered.length === 0) {
            const empty = document.createElement("div");
            empty.style.cssText = "color: #90a4ae; padding: 24px; text-align: center;";
            empty.textContent = "No matching permissions found.";
            container.appendChild(empty);
            return;
        }

        filtered.forEach(def => {
            const currentSetting = modStorage.authority.permissions[def.key] || { self: true, min: AccessLevel.owner };

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
            selfBoxContainer.style.cssText = "min-width: 140px; display: flex; justify-content: center;";

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
            selfCheckbox.addEventListener("change", () => {
                const newVal = selfCheckbox.checked;

                // Gifting / Lockout confirmation warning
                if (!newVal && (def.key === "authority_edit_self_access" || def.key === "authority_edit_min_role")) {
                    const ok = confirm(`⚠️ Surrendering Self-Access:\n\nAre you sure you want to disable your own access to "${def.name}"?\n\nYou will lose the ability to modify or reclaim this permission yourself — only an authorized Owner or Mistress will be able to restore it.`);
                    if (!ok) {
                        selfCheckbox.checked = true;
                        return;
                    }
                }

                setPermissionSelfAccess(def.key, newVal);
                this.updatePermissionsList(container, playerName, checkPermissionAccess("authority_edit_min_role"), checkPermissionAccess("authority_edit_self_access"));
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
                    this.openRoleSelectorModal(def, currentSetting.min, playerName);
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
    // ROLE SELECTION MODAL (BCX Image 3 Style)
    // ==========================================

    private openRoleSelectorModal(def: PermissionDefinition, currentMin: AccessLevel, playerName: string): void {
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
                Authority: Changing minimum access to "${def.name}"
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

        // Horizontal Role Chain
        const chainContainer = document.createElement("div");
        chainContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 10px 0;";

        // Top button: Self
        const selfBtn = document.createElement("button");
        selfBtn.textContent = playerName;
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
        confirmBtn.addEventListener("click", () => {
            setPermissionMinRole(def.key, selectedRole);
            modalBackdrop.remove();
            this.modalElement = null;
            this.createUI();
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
}
