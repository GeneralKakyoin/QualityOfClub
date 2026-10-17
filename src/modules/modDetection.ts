export interface DetectedMod {
    id: string;
    name: string;
    fullName?: string;
    version?: string;
    repository?: string;
}

export interface CuratedModInfo {
    id: string;
    name: string;
    description: string;
    scriptUrl: string;
    detectKeys: string[];
}

export const CURATED_MOD_CATALOG: Record<string, CuratedModInfo> = {
    BCX: {
        id: "BCX",
        name: "Bondage Club Extended (BCX)",
        description: "Rules, curses, statistics, extended room tools",
        scriptUrl: "https://jomshir98.github.io/bondage-club-extended/bcx.js",
        detectKeys: ["bcx", "bondage club extended", "bondage-club-extended"]
    },
    LSCG: {
        id: "LSCG",
        name: "Littlish Club (LSCG)",
        description: "Little Sister's Club overhaul & dynamics",
        scriptUrl: "https://furryzoi.github.io/Littlish-Club/bundle.js",
        detectKeys: ["lscg", "littlish club", "littlish-club"]
    },
    BCT: {
        id: "BCT",
        name: "Bondage Club Tools (BCT)",
        description: "Inventory searching, poses, quick actions",
        scriptUrl: "https://sidiousious.gitlab.io/bct/bundle.js",
        detectKeys: ["bct", "bondage club tools"]
    },
    DOGS: {
        id: "DOGS",
        name: "Devious-Obligate-Great-Stuff (DOGS)",
        description: "Devious padlocks, remote controls, timers",
        scriptUrl: "https://furryzoi.github.io/Devious-Obligate-Great-Stuff/bundle.js",
        detectKeys: ["dogs", "devious-obligate-great-stuff", "devious obligate great stuff"]
    },
    ClubChaos: {
        id: "ClubChaos",
        name: "Club Chaos",
        description: "Interactive chaos curses & toys",
        scriptUrl: "https://sidiousious.gitlab.io/bc-chaos/bundle.js",
        detectKeys: ["clubchaos", "club chaos"]
    }
};

/**
 * Returns a list of all currently loaded mods detected in the browser session.
 */
export function getLoadedMods(): DetectedMod[] {
    const modsMap = new Map<string, DetectedMod>();

    // 1. Query bcModSdk if available
    try {
        const modSdk = (window as any).bcModSdk;
        if (modSdk && typeof modSdk.getModsInfo === "function") {
            const list = modSdk.getModsInfo();
            if (Array.isArray(list)) {
                for (const item of list) {
                    if (!item) continue;
                    const name = item.name || item.fullName || "Unknown Mod";
                    const key = name.toLowerCase().trim();
                    modsMap.set(key, {
                        id: item.name || key,
                        name: item.name || name,
                        fullName: item.fullName || name,
                        version: item.version || "Unknown",
                        repository: item.repository
                    });
                }
            }
        }
    } catch (e) {
        console.warn("[QoC] Error reading bcModSdk mods info:", e);
    }

    // 2. Global fallback checks
    const win = window as any;
    if (win.bcx && !modsMap.has("bcx") && !modsMap.has("bondage club extended")) {
        modsMap.set("bcx", {
            id: "BCX",
            name: "Bondage Club Extended (BCX)",
            version: win.bcx.version || "Active"
        });
    }

    if (win.LITTLISH_CLUB && !modsMap.has("lscg") && !modsMap.has("littlish club")) {
        modsMap.set("lscg", {
            id: "LSCG",
            name: "Littlish Club (LSCG)",
            version: "Active"
        });
    }

    if (win.BCT && !modsMap.has("bct") && !modsMap.has("bondage club tools")) {
        modsMap.set("bct", {
            id: "BCT",
            name: "Bondage Club Tools",
            version: win.BCT.version || "Active"
        });
    }

    if (win.DOGS && !modsMap.has("dogs") && !modsMap.has("devious-obligate-great-stuff")) {
        modsMap.set("dogs", {
            id: "DOGS",
            name: "Devious-Obligate-Great-Stuff (DOGS)",
            version: "Active"
        });
    }

    if (win.ClubChaos && !modsMap.has("clubchaos") && !modsMap.has("club chaos")) {
        modsMap.set("clubchaos", {
            id: "ClubChaos",
            name: "Club Chaos",
            version: "Active"
        });
    }

    if (win.FUSAM && !modsMap.has("fusam")) {
        modsMap.set("fusam", {
            id: "FUSAM",
            name: "FUSAM",
            version: "Active"
        });
    }

    return Array.from(modsMap.values());
}

/**
 * Checks whether a specific mod is currently loaded, checking against
 * exact names, catalog IDs, and aliases.
 */
export function isModLoaded(identifier: string): boolean {
    if (!identifier) return false;
    const target = identifier.toLowerCase().trim();
    const loaded = getLoadedMods();

    for (const mod of loaded) {
        const modName = mod.name.toLowerCase();
        const modId = mod.id.toLowerCase();
        const modFull = (mod.fullName || "").toLowerCase();

        if (modName === target || modId === target || modFull === target) {
            return true;
        }

        // Check curated aliases
        const curated = CURATED_MOD_CATALOG[identifier] || Object.values(CURATED_MOD_CATALOG).find(c => c.id.toLowerCase() === target || c.name.toLowerCase() === target);
        if (curated) {
            for (const key of curated.detectKeys) {
                if (modName.includes(key) || modId.includes(key) || modFull.includes(key)) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Safely loads a mod if and only if it belongs to the curated whitelist.
 */
export function loadCuratedMod(catalogId: string): Promise<boolean> {
    if (!catalogId) return Promise.resolve(false);
    const target = catalogId.toLowerCase().trim();
    const mod = CURATED_MOD_CATALOG[catalogId] || Object.values(CURATED_MOD_CATALOG).find(c =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target ||
        c.detectKeys.some(k => k.toLowerCase() === target)
    );
    if (!mod) {
        console.warn(`[QoC] Cannot auto-load unverified mod '${catalogId}'. Only curated catalog mods can be auto-loaded.`);
        return Promise.resolve(false);
    }

    if (isModLoaded(catalogId)) {
        return Promise.resolve(true);
    }

    return new Promise((resolve) => {
        try {
            console.log(`[QoC] Injecting verified mod script for ${mod.name}: ${mod.scriptUrl}`);
            const script = document.createElement("script");
            script.src = mod.scriptUrl;
            script.async = true;
            script.onload = () => {
                console.log(`[QoC] Successfully loaded ${mod.name}`);
                resolve(true);
            };
            script.onerror = (err) => {
                console.error(`[QoC] Failed to load ${mod.name}:`, err);
                resolve(false);
            };
            document.head.appendChild(script);
        } catch (e) {
            console.error(`[QoC] Error injecting script for ${mod.name}:`, e);
            resolve(false);
        }
    });
}
