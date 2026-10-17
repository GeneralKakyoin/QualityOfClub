import { DEFAULT_SPLIT_PERCENT, STORAGE_KEY } from "src/constants";
import { version } from "../../package.json";

export interface QoCSettings {
    version: string;
    chatResizer: {
        enabled: boolean;
        splitPercent: number; // 50 to 80 (graphic view percentage of canvas)
        showDivider: boolean; // whether to show the in-room drag handle
    };
}

const DEFAULT_SETTINGS: QoCSettings = {
    version,
    chatResizer: {
        enabled: true,
        splitPercent: DEFAULT_SPLIT_PERCENT,
        showDivider: true
    }
};

export let modStorage: QoCSettings = structuredClone(DEFAULT_SETTINGS);

export function loadStorage(): void {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            modStorage = {
                ...DEFAULT_SETTINGS,
                ...parsed,
                chatResizer: {
                    ...DEFAULT_SETTINGS.chatResizer,
                    ...(parsed.chatResizer || {})
                }
            };
            return;
        }
    } catch (e) {
        console.warn("[QoC] Failed to load settings from localStorage, using defaults", e);
    }
    modStorage = structuredClone(DEFAULT_SETTINGS);
}

export function saveStorage(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(modStorage));
    } catch (e) {
        console.error("[QoC] Failed to save settings to localStorage", e);
    }
}
