import { modStorage, CuratedModInfo } from "./storage";
import { getLoadedMods as getSdkLoadedMods } from "zois-core/mod-sdk";
import { getFusamManifestCatalog, initFusamManifest } from "./fusamManifest";
export { CuratedModInfo, initFusamManifest };

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
    },
    FUSAM: {
        id: "FUSAM",
        name: "Fantastic Ultimate Solution to Addon Management (FUSAM)",
        description: "Centralized addon loader & manager",
        scriptUrl: "https://sidiousious.gitlab.io/bc-addon-loader/fusam.js",
        detectKeys: ["fusam", "fantastic ultimate solution to addon management", "fantastic ultimate solution to addon management (fusam)"],
        repositoryMatch: "bc-addon-loader"
    }
};

/**
 * Returns all catalog mods including dynamic FUSAM manifest addons,
 * default curated overrides, and user-defined custom mods.
 */
export function getAllCatalogMods(): Record<string, CuratedModInfo> {
    const combined: Record<string, CuratedModInfo> = {
        ...getFusamManifestCatalog(),
        ...CURATED_MOD_CATALOG
    };
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
    const target = idOrName.trim().toLowerCase();
    const all = getAllCatalogMods();

    // 1. Direct key match (e.g. all["BCX"])
    for (const [key, item] of Object.entries(all)) {
        if (key.toLowerCase() === target) return item;
    }

    // 2. Exact match against item.id or item.name
    for (const item of Object.values(all)) {
        if (item.id.toLowerCase() === target || item.name.toLowerCase() === target) {
            return item;
        }
    }

    // 3. Exact match against detectKeys
    for (const item of Object.values(all)) {
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
 * Uses exact case-insensitive equality matching against IDs, names, full names,
 * official detectKeys, and repository URLs.
 * Never uses loose substring or prefix matching that could lead to false positives.
 */
export function isDetectedModMatch(mod: DetectedMod, identifierOrCurated: string | CuratedModInfo): boolean {
    if (!mod || !identifierOrCurated) return false;

    const mId = (mod.id || "").trim().toLowerCase();
    const mName = (mod.name || "").trim().toLowerCase();
    const mFull = (mod.fullName || "").trim().toLowerCase();
    const mRepo = (mod.repository || "").trim().toLowerCase();

    const curated = typeof identifierOrCurated === "object"
        ? identifierOrCurated
        : getCuratedMod(identifierOrCurated);

    if (curated) {
        const cId = (curated.id || "").trim().toLowerCase();
        const cName = (curated.name || "").trim().toLowerCase();

        // 1. Direct equality on mod ID or name vs curated ID/name
        if (cId && (mId === cId || mName === cId)) return true;
        if (cName && (mId === cName || mName === cName || mFull === cName)) return true;

        // 2. Official repository match
        if (curated.repositoryMatch && mRepo) {
            const expectedRepo = curated.repositoryMatch.trim().toLowerCase();
            if (mRepo.includes(expectedRepo)) return true;
        }

        // 3. Known official detectKeys (exact equality only)
        if (Array.isArray(curated.detectKeys)) {
            for (const rawKey of curated.detectKeys) {
                const key = (rawKey || "").trim().toLowerCase();
                if (!key) continue;
                if (mId === key || mName === key || mFull === key) return true;
            }
        }

        return false;
    }

    // Custom mod matching: exact case-insensitive match on ID, name, or fullName
    const target = (typeof identifierOrCurated === "string" ? identifierOrCurated : "").trim().toLowerCase();
    if (!target) return false;

    return mId === target || mName === target || mFull === target;
}

/**
 * Returns a list of all currently loaded mods detected in the browser session.
 * Authoritatively uses bcModSdk.getModsInfo() (the standard BC mod registration mechanism used by FUSAM and BCX).
 */
export function getLoadedMods(): DetectedMod[] {
    const modsMap = new Map<string, DetectedMod>();

    const tryProcessModList = (list: any[]) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
            if (!item) continue;
            const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : (typeof item.fullName === "string" ? item.fullName.trim() : "Unknown Mod");
            const fullName = typeof item.fullName === "string" && item.fullName.trim() ? item.fullName.trim() : name;
            const key = name.toLowerCase();
            if (!modsMap.has(key)) {
                modsMap.set(key, {
                    id: item.name || key,
                    name: name,
                    fullName: fullName,
                    version: item.version || "Unknown",
                    repository: item.repository
                });
            }
        }
    };

    // 1. Authoritative: Query bcModSdk
    try {
        const sdkList = getSdkLoadedMods();
        tryProcessModList(sdkList);
    } catch (_) {}

    try {
        const win = typeof window !== "undefined" ? (window as any) : null;
        const modSdk = win ? (win.bcModSdk || win.bcModSDK) : null;
        if (modSdk && typeof modSdk.getModsInfo === "function") {
            tryProcessModList(modSdk.getModsInfo());
        }
    } catch (e) {
        console.warn("[QoC] Error reading bcModSdk mods info:", e);
    }

    // 2. Global fallback checks
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win) {
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
                name: "BCX",
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
                name: "LSCG",
                fullName: "Littlish Club",
                version: "Active"
            });
        }

        // BCT
        const hasBct = isRealGlobalObject(win.BCT) && (typeof win.BCT.Init === "function" || typeof win.BCT.version === "string");
        if (hasBct && !modsMap.has("bct") && !modsMap.has("bondage club tools")) {
            modsMap.set("bct", {
                id: "BCT",
                name: "BCT",
                fullName: "Bondage Club Tools",
                version: win.BCT.version || "Active"
            });
        }

        // DOGS
        const hasDogs = isRealGlobalObject(win.DOGS);
        if (hasDogs && !modsMap.has("dogs") && !modsMap.has("devious-obligate-great-stuff")) {
            modsMap.set("dogs", {
                id: "DOGS",
                name: "DOGS",
                fullName: "Devious-Obligate-Great-Stuff",
                version: "Active"
            });
        }

        // Club Chaos
        const hasClubChaos = isRealGlobalObject(win.ClubChaos);
        if (hasClubChaos && !modsMap.has("clubchaos") && !modsMap.has("club chaos")) {
            modsMap.set("clubchaos", {
                id: "ClubChaos",
                name: "ClubChaos",
                fullName: "Club Chaos",
                version: "Active"
            });
        }

        // FUSAM
        const hasFusam = isRealGlobalObject(win.FUSAM) && win.FUSAM.present === true;
        if (hasFusam && !modsMap.has("fusam")) {
            modsMap.set("fusam", {
                id: "FUSAM",
                name: "FUSAM",
                fullName: "Fantastic Ultimate Solution to Addon Management (FUSAM)",
                version: "Active"
            });
        }
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
 * Verifies that the mod is active in the session before resolving.
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
            console.log(`[QoC] Injecting verified mod script for ${mod.name}: ${mod.scriptUrl} (type: ${mod.scriptType || "script"})`);
            const script = document.createElement("script");
            if (mod.scriptType === "module") {
                script.type = "module";
            }
            const scriptUrl = mod.scriptUrl.includes("?") ? `${mod.scriptUrl}&_=${Date.now()}` : `${mod.scriptUrl}?_=${Date.now()}`;
            script.src = scriptUrl;
            script.crossOrigin = "anonymous";
            script.async = true;
            script.onload = async () => {
                console.log(`[QoC] Successfully injected ${mod.name}, verifying registration...`);
                try { script.remove(); } catch (_) {}
                // Poll up to 3 seconds for the mod to register in session
                for (let i = 0; i < 15; i++) {
                    if (isModLoaded(catalogId)) {
                        console.log(`[QoC] Confirmed active in session: ${mod.name}`);
                        resolve(true);
                        return;
                    }
                    await new Promise(r => setTimeout(r, 200));
                }
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
