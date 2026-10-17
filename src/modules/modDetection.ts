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
    repositoryMatch?: string;
}

export const CURATED_MOD_CATALOG: Record<string, CuratedModInfo> = {
    BCX: {
        id: "BCX",
        name: "Bondage Club Extended (BCX)",
        description: "Rules, curses, statistics, extended room tools",
        scriptUrl: "https://jomshir98.github.io/bondage-club-extended/bcx.js",
        detectKeys: ["bcx", "bondage club extended", "bondage-club-extended"],
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
 * Resolves a curated mod entry case-insensitively by ID, name, or detect keys.
 */
export function getCuratedMod(idOrName: string): CuratedModInfo | null {
    if (!idOrName) return null;
    const target = idOrName.toLowerCase().trim();
    if (CURATED_MOD_CATALOG[idOrName]) return CURATED_MOD_CATALOG[idOrName];

    for (const item of Object.values(CURATED_MOD_CATALOG)) {
        if (item.id.toLowerCase() === target || item.name.toLowerCase() === target) {
            return item;
        }
        for (const k of item.detectKeys) {
            if (k.toLowerCase() === target) return item;
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

    const clean = (s: string) => s.replace(/[^a-z0-9]/g, "");

    if (curated) {
        // 1. Exact ID match (case-insensitive)
        if (mId === curated.id.toLowerCase() || clean(mId) === clean(curated.id)) return true;
        if (clean(mName) === clean(curated.id)) return true;

        // 2. Official repository match
        if (curated.repositoryMatch && mRepo && mRepo.includes(curated.repositoryMatch.toLowerCase())) {
            return true;
        }

        // 3. Exact matching against detect keys
        const cleanCuratedId = clean(curated.id);
        for (const rawKey of curated.detectKeys) {
            const key = rawKey.toLowerCase().trim();
            const cleanKey = clean(key);

            if (mId === key || mName === key || mFull === key) return true;
            if (clean(mId) === cleanKey || clean(mName) === cleanKey || clean(mFull) === cleanKey) return true;

            // Multi-word title match with stripped version/parentheses (e.g. "Bondage Club Extended (BCX)" -> "Bondage Club Extended")
            if (key.includes(" ") || key.includes("-")) {
                const strippedName = mName.replace(/\bv?\d+(\.\d+)*\b/gi, "").trim();
                const strippedFull = mFull.replace(/\bv?\d+(\.\d+)*\b/gi, "").trim();
                if (clean(strippedName) === cleanKey || clean(strippedFull) === cleanKey) return true;
                if (clean(strippedName).startsWith(cleanKey) && clean(strippedName).includes(cleanCuratedId)) return true;
            }
        }
        return false;
    }

    // Custom mod fallback: exact ID, exact Name, or exact FullName match
    const target = (typeof identifierOrCurated === "string" ? identifierOrCurated : "").toLowerCase().trim();
    if (!target) return false;
    return mId === target || mName === target || mFull === target || clean(mId) === clean(target) || clean(mName) === clean(target);
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

    // BCX: BCX sets window.BCX_Loaded (never window.bcx!)
    const hasBcx = win.BCX_Loaded === true ||
        (typeof win.BCX_Loaded !== "undefined" && win.BCX_Loaded !== false) ||
        (isRealGlobalObject(win.bcx) && typeof win.bcx.getApi === "function");

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
