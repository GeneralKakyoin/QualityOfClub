import { modStorage, CuratedModInfo } from "./storage";
export { CuratedModInfo };

export interface DetectedMod {
    id: string;
    name: string;
    fullName?: string;
    version?: string;
    repository?: string;
}

export const CURATED_MOD_CATALOG: Record<string, CuratedModInfo> = {
    BCX: {
        id: "BCX",
        name: "Bondage Club Extended (BCX)",
        description: "Rules, curses, statistics, extended room tools",
        scriptUrl: "https://jomshir98.github.io/bondage-club-extended/bcx.js",
        detectKeys: ["bcx", "bondage club extended", "bondage-club-extended", "bondage club extended (bcx)"],
        repositoryMatch: "jomshir98/bondage-club-extended"
    },
    LSCG: {
        id: "LSCG",
        name: "Littlish Club (LSCG)",
        description: "Little Sister's Club overhaul & dynamics",
        scriptUrl: "https://furryzoi.github.io/Littlish-Club/bundle.js",
        detectKeys: ["lscg", "littlish club", "littlish-club"],
        repositoryMatch: "furryzoi/littlish-club"
    },
    BCT: {
        id: "BCT",
        name: "Bondage Club Tools (BCT)",
        description: "Inventory searching, poses, quick actions",
        scriptUrl: "https://sidiousious.gitlab.io/bct/bundle.js",
        detectKeys: ["bct", "bondage club tools", "bondage-club-tools"],
        repositoryMatch: "bct"
    },
    DOGS: {
        id: "DOGS",
        name: "Devious-Obligate-Great-Stuff (DOGS)",
        description: "Devious padlocks, remote controls, timers",
        scriptUrl: "https://furryzoi.github.io/Devious-Obligate-Great-Stuff/bundle.js",
        detectKeys: ["dogs", "devious-obligate-great-stuff", "devious obligate great stuff"],
        repositoryMatch: "devious-obligate-great-stuff"
    },
    ClubChaos: {
        id: "ClubChaos",
        name: "Club Chaos",
        description: "Interactive chaos curses & toys",
        scriptUrl: "https://sidiousious.gitlab.io/bc-chaos/bundle.js",
        detectKeys: ["clubchaos", "club chaos"],
        repositoryMatch: "bc-chaos"
    }
};

/**
 * Returns all catalog mods including default curated mods and user-defined custom mods.
 */
export function getAllCatalogMods(): Record<string, CuratedModInfo> {
    const combined: Record<string, CuratedModInfo> = { ...CURATED_MOD_CATALOG };
    if (modStorage?.inspector?.customCatalog && Array.isArray(modStorage.inspector.customCatalog)) {
        for (const item of modStorage.inspector.customCatalog) {
            if (item && item.id) {
                combined[item.id] = { ...item, isCustom: true };
            }
        }
    }
    return combined;
}

/**
 * Resolves a curated or custom catalog mod entry case-insensitively by ID, name, or detect keys.
 */
export function getCuratedMod(idOrName: string): CuratedModInfo | null {
    if (!idOrName) return null;
    const target = idOrName.toLowerCase().trim();
    const all = getAllCatalogMods();
    if (all[idOrName]) return all[idOrName];

    for (const item of Object.values(all)) {
        if (item.id.toLowerCase() === target || item.name.toLowerCase() === target) {
            return item;
        }
        if (Array.isArray(item.detectKeys)) {
            for (const k of item.detectKeys) {
                if (k.toLowerCase() === target) return item;
            }
        }
    }
    return null;
}

/**
 * Accurately determines if a detected mod matches an identifier or curated mod.
 * Avoids false positive partial substring matching on companion or similarly named addons.
 */
export function isDetectedModMatch(mod: DetectedMod, identifierOrCurated: string | CuratedModInfo): boolean {
    if (!mod || !identifierOrCurated) return false;
    const curated = typeof identifierOrCurated === "object" ? identifierOrCurated : getCuratedMod(identifierOrCurated);

    const mId = (mod.id || "").toLowerCase().trim();
    const mName = (mod.name || "").toLowerCase().trim();
    const mFull = (mod.fullName || "").toLowerCase().trim();
    const mRepo = (mod.repository || "").toLowerCase().trim();

    // Normalizes strings by removing spaces, brackets, and standard punctuation while preserving Unicode/CJK characters and numbers
    const clean = (s: string) => (s || "").toLowerCase().replace(/[\s\-_()[\]{}.,:;!?'"\/\\~`@#$%^&*+=<>]/g, "");

    const cleanMId = clean(mId);
    const cleanMName = clean(mName);
    const cleanMFull = clean(mFull);

    if (curated) {
        const curatedId = (curated.id || "").toLowerCase().trim();
        const cleanCuratedId = clean(curated.id);

        // 1. Exact ID match (case-insensitive)
        if (curatedId && (mId === curatedId || (cleanCuratedId && cleanMId === cleanCuratedId))) return true;
        if (cleanCuratedId && cleanMName === cleanCuratedId) return true;

        // 2. Official repository match
        if (curated.repositoryMatch && mRepo && mRepo.includes(curated.repositoryMatch.toLowerCase())) {
            return true;
        }

        // 3. Exact matching against detect keys
        if (Array.isArray(curated.detectKeys)) {
            for (const rawKey of curated.detectKeys) {
                const key = (rawKey || "").toLowerCase().trim();
                const cleanKey = clean(key);
                if (!cleanKey) continue;

                if (mId === key || mName === key || mFull === key) return true;
                if (cleanMId === cleanKey || cleanMName === cleanKey || cleanMFull === cleanKey) return true;

                // Multi-word title match with stripped version numbers (e.g. "Bondage Club Extended (BCX) v1.0.8" -> "bondageclubextendedbcx")
                const strippedName = clean(mName.replace(/\bv?\d+(\.\d+)*\b/gi, "").trim());
                const strippedFull = clean(mFull.replace(/\bv?\d+(\.\d+)*\b/gi, "").trim());
                if (strippedName && strippedName === cleanKey) return true;
                if (strippedFull && strippedFull === cleanKey) return true;
            }
        }
        return false;
    }

    // Custom mod fallback: exact ID, exact Name, or exact FullName match
    const target = (typeof identifierOrCurated === "string" ? identifierOrCurated : "").toLowerCase().trim();
    if (!target) return false;
    const cleanTarget = clean(target);
    if (mId === target || mName === target || mFull === target) return true;
    if (cleanTarget && (cleanMId === cleanTarget || cleanMName === cleanTarget || cleanMFull === cleanTarget)) return true;
    return false;
}

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

    // Helper: Verify an object is not an HTMLElement or DOM node masquerading via window[id]
    const isRealGlobalObject = (obj: any): boolean => {
        if (!obj || typeof obj !== "object") return false;
        if (typeof obj.nodeType === "number") return false;
        if (typeof win.HTMLElement !== "undefined" && obj instanceof win.HTMLElement) return false;
        return true;
    };

    // BCX: BCX sets window.BCX_Loaded = true on complete init, and window.bcx = consoleInterface
    const hasBcx = win.BCX_Loaded === true ||
        (isRealGlobalObject(win.bcx) && (typeof win.bcx.getModApi === "function" || typeof win.bcx.inBcxSubscreen === "function"));

    if (hasBcx && !modsMap.has("bcx") && !modsMap.has("bondage club extended")) {
        modsMap.set("bcx", {
            id: "BCX",
            name: "Bondage Club Extended (BCX)",
            fullName: "Bondage Club Extended",
            version: typeof win.bcx?.version === "string" ? win.bcx.version : "Active"
        });
    }

    // LSCG
    const hasLscg = (isRealGlobalObject(win.LITTLISH_CLUB) && typeof win.LITTLISH_CLUB.inModSubscreen === "function") ||
        isRealGlobalObject(win.LSCG);

    if (hasLscg && !modsMap.has("lscg") && !modsMap.has("littlish club")) {
        modsMap.set("lscg", {
            id: "LSCG",
            name: "Littlish Club (LSCG)",
            fullName: "Littlish Club",
            version: "Active"
        });
    }

    // BCT
    const hasBct = isRealGlobalObject(win.BCT) && (typeof win.BCT.Init === "function" || typeof win.BCT.version === "string");
    if (hasBct && !modsMap.has("bct") && !modsMap.has("bondage club tools")) {
        modsMap.set("bct", {
            id: "BCT",
            name: "Bondage Club Tools (BCT)",
            fullName: "Bondage Club Tools",
            version: win.BCT.version || "Active"
        });
    }

    // DOGS
    const hasDogs = isRealGlobalObject(win.DOGS);
    if (hasDogs && !modsMap.has("dogs") && !modsMap.has("devious-obligate-great-stuff")) {
        modsMap.set("dogs", {
            id: "DOGS",
            name: "Devious-Obligate-Great-Stuff (DOGS)",
            fullName: "Devious-Obligate-Great-Stuff",
            version: "Active"
        });
    }

    // Club Chaos
    const hasClubChaos = isRealGlobalObject(win.ClubChaos);
    if (hasClubChaos && !modsMap.has("clubchaos") && !modsMap.has("club chaos")) {
        modsMap.set("clubchaos", {
            id: "ClubChaos",
            name: "Club Chaos",
            fullName: "Club Chaos",
            version: "Active"
        });
    }

    // FUSAM
    const hasFusam = isRealGlobalObject(win.FUSAM);
    if (hasFusam && !modsMap.has("fusam")) {
        modsMap.set("fusam", {
            id: "FUSAM",
            name: "FUSAM",
            fullName: "FUSAM",
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
    const loaded = getLoadedMods();
    return loaded.some(mod => isDetectedModMatch(mod, identifier));
}

/**
 * Safely loads a mod if and only if it belongs to the curated whitelist.
 */
export function loadCuratedMod(catalogId: string): Promise<boolean> {
    if (!catalogId) return Promise.resolve(false);
    const target = catalogId.toLowerCase().trim();
    const all = getAllCatalogMods();
    const mod = all[catalogId] || Object.values(all).find(c =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target ||
        (Array.isArray(c.detectKeys) && c.detectKeys.some(k => k.toLowerCase() === target))
    );
    if (!mod || !mod.scriptUrl) {
        console.warn(`[QoC] Cannot auto-load mod '${catalogId}'. No valid script URL found.`);
        return Promise.resolve(false);
    }

    if (isModLoaded(catalogId)) {
        return Promise.resolve(true);
    }

    return new Promise((resolve) => {
        try {
            console.log(`[QoC] Injecting verified mod script for ${mod.name}: ${mod.scriptUrl}`);
            const script = document.createElement("script");
            const scriptUrl = mod.scriptUrl.includes("?") ? `${mod.scriptUrl}&_=${Date.now()}` : `${mod.scriptUrl}?_=${Date.now()}`;
            script.src = scriptUrl;
            script.crossOrigin = "anonymous";
            script.async = true;
            script.onload = () => {
                console.log(`[QoC] Successfully loaded ${mod.name}`);
                try { script.remove(); } catch (_) {}
                resolve(true);
            };
            script.onerror = (err) => {
                console.error(`[QoC] Failed to load ${mod.name}:`, err);
                try { script.remove(); } catch (_) {}
                resolve(false);
            };
            document.head.appendChild(script);
        } catch (e) {
            console.error(`[QoC] Error injecting script for ${mod.name}:`, e);
            resolve(false);
        }
    });
}
