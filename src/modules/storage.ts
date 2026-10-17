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
    menu_open_settings: { self: true, min: AccessLevel.owner }
};

export type AutoLoadMode = "Silent" | "Prompt";

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
    chatResizer: {
        enabled: boolean;
        splitPercent: number; // 50 to 80 (graphic view percentage of canvas)
        showDivider: boolean; // whether to show the in-room drag handle
    };
    authority: AuthorityData;
    inspector: {
        enabled: boolean;
        autoLoadMode: AutoLoadMode;
        rules: ModRule[];
    };
    managedRules: Record<number, ModRule[]>;
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
        rules: []
    },
    managedRules: {}
};

export let modStorage: QoCSettings = structuredClone(DEFAULT_SETTINGS);

export function loadStorage(): void {
    let loadedData: Partial<QoCSettings> | null = null;

    // 1. Try loading from Bondage Club server account extension settings (DOGS model)
    try {
        if (typeof Player !== "undefined" && Player.ExtensionSettings && Player.ExtensionSettings[EXTENSION_SETTINGS_KEY]) {
            const rawCompressed = Player.ExtensionSettings[EXTENSION_SETTINGS_KEY];
            if (typeof rawCompressed === "string" && typeof LZString !== "undefined") {
                const decompressed = LZString.decompressFromBase64(rawCompressed);
                if (decompressed) {
                    loadedData = JSON.parse(decompressed);
                }
            }
        }
    } catch (e) {
        console.warn("[QoC] Failed to decompress server ExtensionSettings, falling back to localStorage", e);
    }

    // 2. Fallback to localStorage if server settings not yet populated
    if (!loadedData) {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                loadedData = JSON.parse(raw);
            }
        } catch (e) {
            console.warn("[QoC] Failed to load settings from localStorage", e);
        }
    }

    // Merge loaded data with defaults
    if (loadedData) {
        modStorage = {
            ...DEFAULT_SETTINGS,
            ...loadedData,
            chatResizer: {
                ...DEFAULT_SETTINGS.chatResizer,
                ...(loadedData.chatResizer || {})
            },
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
                rules: Array.isArray(loadedData.inspector?.rules) ? loadedData.inspector.rules : []
            },
            managedRules: loadedData.managedRules || {}
        };
    } else {
        modStorage = structuredClone(DEFAULT_SETTINGS);
    }
}

export function saveStorage(): void {
    // 1. Save to localStorage for instant local retrieval
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modStorage));
    } catch (e) {
        console.error("[QoC] Failed to save settings to localStorage", e);
    }

    // 2. Save to BC server account ExtensionSettings (DOGS model)
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
