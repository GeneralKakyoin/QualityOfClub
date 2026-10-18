import { modStorage, saveStorage, syncStorage, AccessLevel, QoCPermission, PermissionSetting, ACCESS_LEVEL_NAMES } from "./storage";

export interface PermissionDefinition {
    key: QoCPermission;
    name: string;
    description: string;
    category: "Authority" | "Inspection" | "Rules" | "General";
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
    // Authority module
    {
        key: "authority_edit_roles",
        name: "Allow managing Owner & Mistress roles",
        description: "Permits adding or removing member numbers from the custom QoC Owner and Mistress lists.",
        category: "Authority"
    },
    {
        key: "authority_edit_min_role",
        name: "Allow lowest access modification",
        description: "Permits modifying the lowest permitted role required for any permission.",
        category: "Authority"
    },
    {
        key: "authority_edit_self_access",
        name: "Allow modifying self access",
        description: "Permits granting or revoking self-access on permissions (required to gift or reclaim control).",
        category: "Authority"
    },

    // Inspection
    {
        key: "inspect_view_addons",
        name: "Allow inspecting loaded addons",
        description: "Permits querying and viewing the list of external addons loaded in this character's browser session.",
        category: "Inspection"
    },
    {
        key: "inspect_view_rules",
        name: "Allow viewing active addon rules",
        description: "Permits viewing the active mandatory and forbidden addon rules currently locked on this character.",
        category: "Inspection"
    },

    // Rules & Compliance
    {
        key: "rules_lock_mandatory",
        name: "Allow locking mandatory addons",
        description: "Permits locking mandatory addon requirements and forcing auto-injection on this character.",
        category: "Rules"
    },
    {
        key: "rules_lock_forbidden",
        name: "Allow locking forbidden addons",
        description: "Permits locking forbidden addon bans and policy violation notices on this character.",
        category: "Rules"
    },
    {
        key: "rules_remove_rules",
        name: "Allow removing active rules",
        description: "Permits removing, resetting, or clearing active addon rules from this character.",
        category: "Rules"
    },
    {
        key: "rules_edit_autoload_mode",
        name: "Allow changing auto-load behavior",
        description: "Permits toggling between Silent Auto-Load and Prompt First confirmation for missing addons.",
        category: "Rules"
    },
    {
        key: "rules_force_compliance",
        name: "Allow forcing compliance evaluations",
        description: "Permits commanding this character's game to immediately evaluate all active rules and alert on violations.",
        category: "Rules"
    },
    {
        key: "rules_force_injection",
        name: "Allow forcing addon injection",
        description: "Permits remotely commanding this character's game to force-inject missing mandatory addons, even if auto-injection is off.",
        category: "Rules"
    },

    // General
    {
        key: "menu_open_settings",
        name: "Allow opening QoC settings menu",
        description: "Controls whether this character is allowed to open the Quality of Club configuration menu.",
        category: "General"
    }
];

/**
 * Resolves the hierarchical AccessLevel of a character relative to the local Player.
 */
export function getCharacterAccessLevel(character: Character | number | null | undefined): AccessLevel {
    if (character === null || character === undefined) return AccessLevel.public;
    const memberNumber = typeof character === "number" ? character : character.MemberNumber;

    if (typeof Player !== "undefined" && Player.MemberNumber === memberNumber) {
        return AccessLevel.self;
    }

    if (memberNumber !== null && typeof memberNumber === "number") {
        // 1. Clubowner (Native BC collar owner)
        if (typeof Player !== "undefined") {
            if (Player.Ownership && typeof Player.Ownership.MemberNumber === "number" && Player.Ownership.MemberNumber === memberNumber && Player.Ownership.Stage === 1) {
                return AccessLevel.clubowner;
            }
            if (typeof Player.IsOwnedByMemberNumber === "function" && Player.IsOwnedByMemberNumber(memberNumber)) {
                return AccessLevel.clubowner;
            }
        }

        // 2. Custom QoC Owners list
        if (Array.isArray(modStorage.authority?.owners) && modStorage.authority.owners.includes(memberNumber)) {
            return AccessLevel.owner;
        }

        // 3. Lover (Native BC Lover)
        if (typeof Player !== "undefined") {
            if (Array.isArray(Player.Lovership) && Player.Lovership.some(l => l && l.MemberNumber === memberNumber && l.Stage === 1)) {
                return AccessLevel.lover;
            }
            if (typeof Player.GetLoversNumbers === "function") {
                const lovers = Player.GetLoversNumbers(true);
                if (Array.isArray(lovers) && lovers.includes(memberNumber)) {
                    return AccessLevel.lover;
                }
            }
            if (typeof Player.IsLoverOfMemberNumber === "function" && Player.IsLoverOfMemberNumber(memberNumber)) {
                return AccessLevel.lover;
            }
        }

        // 4. Custom QoC Mistresses list
        if (Array.isArray(modStorage.authority?.mistresses) && modStorage.authority.mistresses.includes(memberNumber)) {
            return AccessLevel.mistress;
        }

        // 5. Whitelist (Native BC Whitelist)
        if (typeof Player !== "undefined" && Array.isArray(Player.WhiteList) && Player.WhiteList.includes(memberNumber)) {
            return AccessLevel.whitelist;
        }

        // 6. Friend (Native BC FriendList)
        if (typeof Player !== "undefined" && Array.isArray((Player as any).FriendList) && (Player as any).FriendList.includes(memberNumber)) {
            return AccessLevel.friend;
        }
    }

    return AccessLevel.public;
}

/**
 * Checks whether a given character (or local player if omitted) has access to a specific permission.
 */
export function checkPermissionAccess(perm: QoCPermission, character?: Character | number | null): boolean {
    const permSetting = modStorage.authority?.permissions?.[perm];
    if (!permSetting) return true;

    const accessLevel = getCharacterAccessLevel(character !== undefined ? character : Player?.MemberNumber);

    // If evaluating self:
    if (accessLevel === AccessLevel.self) {
        return permSetting.self || permSetting.min === AccessLevel.self;
    }

    // Role hierarchy: 0 = Self, 1 = Clubowner, 2 = Owner, 3 = Lover, 4 = Mistress, 5 = Whitelist, 6 = Friend, 7 = Public
    // A role has access if accessLevel <= min permitted role
    return accessLevel <= permSetting.min;
}

/**
 * Adds a member number to the custom Owner or Mistress role list.
 */
export function addRoleMember(role: "owner" | "mistress", memberNumber: number, byCharacter?: Character | number): { success: boolean; message: string } {
    if (!checkPermissionAccess("authority_edit_roles", byCharacter)) {
        return { success: false, message: "Permission Denied: You do not have authority to edit roles." };
    }

    if (!Number.isInteger(memberNumber) || memberNumber <= 0) {
        return { success: false, message: "Invalid Member Number." };
    }

    if (typeof Player !== "undefined" && memberNumber === Player.MemberNumber) {
        return { success: false, message: "You cannot add yourself to an external role list." };
    }

    const listKey = role === "owner" ? "owners" : "mistresses";
    if (!Array.isArray(modStorage.authority[listKey])) {
        modStorage.authority[listKey] = [];
    }

    if (modStorage.authority[listKey].includes(memberNumber)) {
        return { success: false, message: `Member #${memberNumber} is already in the ${role} list.` };
    }

    modStorage.authority[listKey].push(memberNumber);
    saveStorage();
    syncStorage();

    return { success: true, message: `Added Member #${memberNumber} as ${role === "owner" ? "Owner" : "Mistress"}.` };
}

/**
 * Removes a member number from the custom Owner or Mistress role list.
 */
export function removeRoleMember(role: "owner" | "mistress", memberNumber: number, byCharacter?: Character | number): { success: boolean; message: string } {
    if (!checkPermissionAccess("authority_edit_roles", byCharacter)) {
        return { success: false, message: "Permission Denied: You do not have authority to edit roles." };
    }

    const listKey = role === "owner" ? "owners" : "mistresses";
    if (!Array.isArray(modStorage.authority[listKey])) {
        return { success: false, message: "List is empty." };
    }

    modStorage.authority[listKey] = modStorage.authority[listKey].filter(id => id !== memberNumber);
    saveStorage();
    syncStorage();

    return { success: true, message: `Removed Member #${memberNumber} from ${role} list.` };
}

/**
 * Updates the minimum role requirement for a permission.
 */
export function setPermissionMinRole(perm: QoCPermission, minRole: AccessLevel, byCharacter?: Character | number): { success: boolean; message: string } {
    if (!checkPermissionAccess("authority_edit_min_role", byCharacter)) {
        return { success: false, message: "Permission Denied: You do not have authority to modify minimum access roles." };
    }

    if (!modStorage.authority.permissions[perm]) {
        return { success: false, message: "Invalid permission." };
    }

    modStorage.authority.permissions[perm].min = minRole;
    saveStorage();
    syncStorage();

    return { success: true, message: `Updated lowest permitted role for ${perm} to ${ACCESS_LEVEL_NAMES[minRole]}.` };
}

/**
 * Grants or revokes self-access for a permission.
 */
export function setPermissionSelfAccess(perm: QoCPermission, selfAllowed: boolean, byCharacter?: Character | number): { success: boolean; message: string } {
    if (!checkPermissionAccess("authority_edit_self_access", byCharacter)) {
        return { success: false, message: "Permission Denied: You do not have authority to modify self-access." };
    }

    if (!modStorage.authority.permissions[perm]) {
        return { success: false, message: "Invalid permission." };
    }

    modStorage.authority.permissions[perm].self = selfAllowed;
    saveStorage();
    syncStorage();

    return { success: true, message: `Updated self-access for ${perm} to ${selfAllowed ? "permitted" : "forbidden"}.` };
}
