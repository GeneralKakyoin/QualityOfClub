import { DEFAULT_SPLIT_PERCENT, STORAGE_KEY, EXTENSION_SETTINGS_KEY } from "src/constants";
import { version } from "../../package.json";

declare const LZString: any;

export enum AccessLevel {
    self = 0,
    clubowner = 1,
    owner = 2,
    lover = 3,
    mistress = 4,
    whitelist = 5,
    friend = 6,
    public = 7,
}

export const ACCESS_LEVEL_NAMES: Record<AccessLevel, string> = {
    [AccessLevel.self]: "Self",
    [AccessLevel.clubowner]: "Clubowner",
    [AccessLevel.owner]: "Owner",
    [AccessLevel.lover]: "Lover",
    [AccessLevel.mistress]: "Mistress",
    [AccessLevel.whitelist]: "Whitelist",
    [AccessLevel.friend]: "Friend",
    [AccessLevel.public]: "Public"
};

export type QoCPermission =
    | "authority_edit_roles"         // Add/remove QoC Owners & Mistresses
    | "authority_edit_min_role"      // Change lowest permitted role
    | "authority_edit_self_access"   // Grant or revoke self-access
    | "inspect_view_addons"          // Query and view active loaded addons
    | "inspect_view_rules"           // Query and view active rules and compliance
    | "rules_lock_mandatory"         // Set mandatory addon requirements
    | "rules_lock_forbidden"         // Set forbidden addon bans
    | "rules_remove_rules"           // Remove or clear active rules
    | "rules_edit_autoload_mode"     // Change auto-load behavior (Silent vs Prompt)
    | "rules_force_compliance"       // Force immediate compliance check & reload
    | "rules_force_injection"        // Force remote injection of missing mandatory addons
    | "menu_open_settings";          // Open and view QoC settings menu

export interface PermissionSetting {
    self: boolean;
    min: AccessLevel;
}

export interface AuthorityData {
    owners: number[];
    mistresses: number[];
    permissions: Record<QoCPermission, PermissionSetting>;
}

export const DEFAULT_PERMISSIONS: Record<QoCPermission, PermissionSetting> = {
    authority_edit_roles: { self: true, min: AccessLevel.owner },
    authority_edit_min_role: { self: true, min: AccessLevel.owner },
    authority_edit_self_access: { self: true, min: AccessLevel.owner },
    inspect_view_addons: { self: true, min: AccessLevel.public },
    inspect_view_rules: { self: true, min: AccessLevel.whitelist },
    rules_lock_mandatory: { self: true, min: AccessLevel.owner },
    rules_lock_forbidden: { self: true, min: AccessLevel.owner },
    rules_remove_rules: { self: true, min: AccessLevel.owner },
    rules_edit_autoload_mode: { self: true, min: AccessLevel.owner },
    rules_force_compliance: { self: true, min: AccessLevel.owner },
    rules_force_injection: { self: true, min: AccessLevel.owner },
    menu_open_settings: { self: true, min: AccessLevel.owner }
};

export type AutoLoadMode = "Silent" | "Prompt" | "Alert";

export type ViolationAction = "toast" | "room_alert" | "lockout" | "leave_room";

export interface CuratedModInfo {
    id: string;
    name: string;
    description: string;
    scriptUrl: string;
    detectKeys: string[];
    repositoryMatch?: string;
    isCustom?: boolean;
    author?: string;
    tags?: string[];
    scriptType?: "script" | "module" | "eval";
    noCacheBusting?: boolean;
}

export interface ModRule {
    modId: string;
    modName: string;
    type: "required" | "forbidden";
    enforcedBy: number;
    enforcedByName?: string;
    enforcedAt: number;
}

export interface QoCSettings {
    version: string;
    memberNumber?: number;
    chatResizer: {
        enabled: boolean;
        splitPercent: number; // 50 to 80 (graphic view percentage of canvas)
        showDivider: boolean; // whether to show the in-room drag handle
    };
    authority: AuthorityData;
    inspector: {
        enabled: boolean;
        autoLoadMode: AutoLoadMode;
        violationAction: ViolationAction;
        evaluationInterval: number; // seconds: 0 = manual/room sync only, 15, 30, 60
        silentTelemetry: boolean; // broadcast manifest to dominants in room
        showProfileButton: boolean; // show shield button on info sheet
        allowForcedInjection: boolean; // allow authorized dominants to force inject missing addons
        customCatalog: CuratedModInfo[];
        rules: ModRule[];
    };
    managedRules: Record<number, ModRule[]>;
}

export const CLIENT_PREFERENCES_KEY = "QOC_CLIENT_PREFERENCES";

export function getAccountStorageKey(memberNumber?: number): string {
    const mn = memberNumber ?? (typeof Player !== "undefined" && typeof Player.MemberNumber === "number" && Player.MemberNumber > 0 ? Player.MemberNumber : undefined);
    return mn ? `${STORAGE_KEY}_${mn}` : STORAGE_KEY;
}

const DEFAULT_SETTINGS: QoCSettings = {
    version,
    chatResizer: {
        enabled: false,
        splitPercent: DEFAULT_SPLIT_PERCENT,
        showDivider: true
    },
    authority: {
        owners: [],
        mistresses: [],
        permissions: structuredClone(DEFAULT_PERMISSIONS)
    },
    inspector: {
        enabled: true,
        autoLoadMode: "Prompt",
        violationAction: "toast",
        evaluationInterval: 30,
        silentTelemetry: true,
        showProfileButton: true,
        allowForcedInjection: false,
        customCatalog: [],
        rules: []
    },
    managedRules: {}
};

export let modStorage: QoCSettings = structuredClone(DEFAULT_SETTINGS);

function loadClientPreferences(): void {
    try {
        if (typeof localStorage !== "undefined") {
            const raw = localStorage.getItem(CLIENT_PREFERENCES_KEY);
            if (raw) {
                const clientPrefs = JSON.parse(raw);
                if (clientPrefs && typeof clientPrefs === "object") {
                    if (clientPrefs.chatResizer && typeof clientPrefs.chatResizer === "object") {
                        modStorage.chatResizer = {
                            ...modStorage.chatResizer,
                            ...clientPrefs.chatResizer
                        };
                    }
                }
            }
        }
    } catch (_) {}
}

function saveClientPreferences(): void {
    try {
        if (typeof localStorage !== "undefined") {
            const clientPrefs = {
                chatResizer: modStorage.chatResizer
            };
            localStorage.setItem(CLIENT_PREFERENCES_KEY, JSON.stringify(clientPrefs));
        }
    } catch (_) {}
}

/**
 * Loads storage strictly scoped to the currently logged in character.
 * Prevents any crosstalk or data leak between multiple accounts on the same PC.
 */
export function loadStorage(): void {
    const currentMemberNumber = typeof Player !== "undefined" && typeof Player.MemberNumber === "number" && Player.MemberNumber > 0
        ? Player.MemberNumber
        : undefined;

    // If player is not logged in yet, load client preferences only and keep clean DEFAULT_SETTINGS
    if (!currentMemberNumber) {
        modStorage = structuredClone(DEFAULT_SETTINGS);
        loadClientPreferences();
        return;
    }

    let loadedData: Partial<QoCSettings> | null = null;

    // 1. Try loading from Bondage Club server account extension settings (authoritative per-account)
    try {
        if (Player.ExtensionSettings && Player.ExtensionSettings[EXTENSION_SETTINGS_KEY]) {
            const rawCompressed = Player.ExtensionSettings[EXTENSION_SETTINGS_KEY];
            if (typeof rawCompressed === "string" && typeof LZString !== "undefined") {
                const decompressed = LZString.decompressFromBase64(rawCompressed);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);
                    if (!parsed.memberNumber || parsed.memberNumber === currentMemberNumber) {
                        loadedData = parsed;
                    } else {
                        console.warn(`[QoC] Discarding ExtensionSettings because memberNumber ${parsed.memberNumber} does not match current player ${currentMemberNumber}.`);
                    }
                }
            }
        }
    } catch (e) {
        console.warn("[QoC] Failed to decompress server ExtensionSettings", e);
    }

    // 2. Fallback to account-scoped localStorage if server settings not yet populated
    if (!loadedData) {
        try {
            const accountKey = getAccountStorageKey(currentMemberNumber);
            const raw = localStorage.getItem(accountKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (!parsed.memberNumber || parsed.memberNumber === currentMemberNumber) {
                    loadedData = parsed;
                }
            }
        } catch (e) {
            console.warn("[QoC] Failed to load settings from account localStorage", e);
        }
    }

    // Merge loaded data with defaults
    if (loadedData) {
        modStorage = {
            ...DEFAULT_SETTINGS,
            ...loadedData,
            memberNumber: currentMemberNumber,
            authority: {
                owners: Array.isArray(loadedData.authority?.owners) ? loadedData.authority.owners : [],
                mistresses: Array.isArray(loadedData.authority?.mistresses) ? loadedData.authority.mistresses : [],
                permissions: {
                    ...DEFAULT_PERMISSIONS,
                    ...(loadedData.authority?.permissions || {})
                }
            },
            inspector: {
                ...DEFAULT_SETTINGS.inspector,
                ...(loadedData.inspector || {}),
                rules: Array.isArray(loadedData.inspector?.rules) ? loadedData.inspector.rules : [],
                customCatalog: Array.isArray(loadedData.inspector?.customCatalog) ? loadedData.inspector.customCatalog : [],
                violationAction: loadedData.inspector?.violationAction || "toast",
                autoLoadMode: loadedData.inspector?.autoLoadMode || "Prompt",
                evaluationInterval: typeof loadedData.inspector?.evaluationInterval === "number" ? loadedData.inspector.evaluationInterval : 30,
                silentTelemetry: typeof loadedData.inspector?.silentTelemetry === "boolean" ? loadedData.inspector.silentTelemetry : true,
                showProfileButton: typeof loadedData.inspector?.showProfileButton === "boolean" ? loadedData.inspector.showProfileButton : true,
                allowForcedInjection: typeof loadedData.inspector?.allowForcedInjection === "boolean" ? loadedData.inspector.allowForcedInjection : false
            },
            managedRules: loadedData.managedRules || {}
        };
    } else {
        modStorage = structuredClone(DEFAULT_SETTINGS);
        modStorage.memberNumber = currentMemberNumber;
    }

    // Apply device-level client preferences (e.g. chat resizer)
    loadClientPreferences();
}

/**
 * Saves storage scoped strictly to the current account.
 */
export function saveStorage(): void {
    const currentMemberNumber = typeof Player !== "undefined" && typeof Player.MemberNumber === "number" && Player.MemberNumber > 0
        ? Player.MemberNumber
        : undefined;

    // Save device-level client preferences
    saveClientPreferences();

    if (!currentMemberNumber) {
        return;
    }

    modStorage.memberNumber = currentMemberNumber;

    // 1. Save to account-scoped localStorage
    try {
        const accountKey = getAccountStorageKey(currentMemberNumber);
        localStorage.setItem(accountKey, JSON.stringify(modStorage));
    } catch (e) {
        console.error("[QoC] Failed to save settings to account localStorage", e);
    }

    // 2. Save to BC server account ExtensionSettings (authoritative per-account)
    try {
        if (typeof Player !== "undefined" && Player.ExtensionSettings && typeof LZString !== "undefined") {
            Player.ExtensionSettings[EXTENSION_SETTINGS_KEY] = LZString.compressToBase64(JSON.stringify(modStorage));
            if (typeof ServerPlayerExtensionSettingsSync === "function") {
                ServerPlayerExtensionSettingsSync(EXTENSION_SETTINGS_KEY);
            }
        }
    } catch (e) {
        console.warn("[QoC] Failed to sync settings to BC ServerPlayerExtensionSettingsSync", e);
    }
}

export function syncStorage(): void {
    saveStorage();
}

/**
 * Completely resets the current account's QoC storage to clean factory defaults.
 */
export function resetStorageToDefaults(): void {
    const currentMemberNumber = typeof Player !== "undefined" && typeof Player.MemberNumber === "number" && Player.MemberNumber > 0
        ? Player.MemberNumber
        : undefined;

    modStorage = structuredClone(DEFAULT_SETTINGS);
    if (currentMemberNumber) {
        modStorage.memberNumber = currentMemberNumber;
    }
    saveStorage();
}
