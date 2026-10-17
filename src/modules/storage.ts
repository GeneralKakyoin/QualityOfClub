import { DEFAULT_SPLIT_PERCENT, STORAGE_KEY, EXTENSION_SETTINGS_KEY } from "src/constants";
import { version } from "../../package.json";

declare const LZString: any;

export type InspectViewPermission = "Owner" | "Lovers" | "Whitelist" | "Prompt" | "Anyone" | "Disabled";
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
    inspector: {
        enabled: boolean;
        viewPermission: InspectViewPermission;
        allowOwnerRules: boolean;
        allowLoversRules: boolean;
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
    inspector: {
        enabled: true,
        viewPermission: "Prompt",
        allowOwnerRules: true,
        allowLoversRules: false,
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
