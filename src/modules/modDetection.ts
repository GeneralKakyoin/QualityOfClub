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

function cleanStr(s: string): string {
    return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Tracks addons that were successfully injected during the current browser session.
 */
export const sessionInjectedMods = new Set<string>();

/**
 * Accurately determines if a detected mod matches an identifier or curated mod.
 * Uses exact case-insensitive equality matching against IDs, names, full names,
 * official detectKeys, and repository URLs, with normalized alphanumeric fallbacks.
 */
export function isDetectedModMatch(mod: DetectedMod, identifierOrCurated: string | CuratedModInfo): boolean {
    if (!mod || !identifierOrCurated) return false;

    const mId = (mod.id || "").trim().toLowerCase();
    const mName = (mod.name || "").trim().toLowerCase();
    const mFull = (mod.fullName || "").trim().toLowerCase();
    const mRepo = (mod.repository || "").trim().toLowerCase();

    const mCleanId = cleanStr(mId);
    const mCleanName = cleanStr(mName);
    const mCleanFull = cleanStr(mFull);
    const mCleanRepo = cleanStr(mRepo);

    const curated = typeof identifierOrCurated === "object"
        ? identifierOrCurated
        : getCuratedMod(identifierOrCurated);

    if (curated) {
        const cId = (curated.id || "").trim().toLowerCase();
        const cName = (curated.name || "").trim().toLowerCase();
        const cCleanId = cleanStr(cId);
        const cCleanName = cleanStr(cName);

        // 1. Direct equality on mod ID or name vs curated ID/name
        if (cId && (mId === cId || mName === cId || mCleanId === cCleanId || mCleanName === cCleanId)) return true;
        if (cName && (mId === cName || mName === cName || mFull === cName || mCleanId === cCleanName || mCleanName === cCleanName || mCleanFull === cCleanName)) return true;

        // 2. Official repository match
        if (curated.repositoryMatch && mRepo) {
            const expectedRepo = cleanStr(curated.repositoryMatch);
            if (expectedRepo && mCleanRepo.includes(expectedRepo)) return true;
        }

        // 3. Known official detectKeys (exact and normalized)
        if (Array.isArray(curated.detectKeys)) {
            for (const rawKey of curated.detectKeys) {
                const key = (rawKey || "").trim().toLowerCase();
                if (!key) continue;
                const cleanKey = cleanStr(key);
                if (mId === key || mName === key || mFull === key) return true;
                if (cleanKey && (mCleanId === cleanKey || mCleanName === cleanKey || mCleanFull === cleanKey)) return true;
            }
        }

        return false;
    }

    // Custom mod matching
    const target = (typeof identifierOrCurated === "string" ? identifierOrCurated : "").trim().toLowerCase();
    if (!target) return false;
    const cleanTarget = cleanStr(target);

    return mId === target || mName === target || mFull === target ||
        (!!cleanTarget && (mCleanId === cleanTarget || mCleanName === cleanTarget || mCleanFull === cleanTarget));
}

/**
 * Returns a list of all currently loaded mods detected in the browser session.
 * Queries bcModSdk, session-injected mods, FUSAM addons, and global window fallbacks.
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

        // BCX
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

        // FUSAM loaded addons integration
        if (hasFusam && win.FUSAM.addons && typeof win.FUSAM.addons === "object") {
            for (const [fId, fVal] of Object.entries(win.FUSAM.addons)) {
                if (!fId) continue;
                const val = fVal as any;
                if (val && (val.status === "loaded" || val.status === "loading" || val.distribution)) {
                    const k = fId.toLowerCase();
                    if (!modsMap.has(k)) {
                        const curated = getCuratedMod(fId);
                        modsMap.set(k, {
                            id: curated?.id || fId,
                            name: curated?.name || fId,
                            fullName: curated?.name || fId,
                            version: typeof val.distribution === "string" ? val.distribution : "Active"
                        });
                    }
                }
            }
        }
    }

    // 3. Session-injected mods integration
    for (const injectedId of sessionInjectedMods) {
        const k = injectedId.toLowerCase();
        if (!modsMap.has(k)) {
            const curated = getCuratedMod(injectedId);
            modsMap.set(k, {
                id: curated?.id || injectedId,
                name: curated?.name || injectedId,
                fullName: curated?.name || injectedId,
                version: "Injected"
            });
        }
    }

    return Array.from(modsMap.values());
}

/**
 * Checks whether a specific mod is currently loaded, checking against
 * exact names, catalog IDs, detect keys, FUSAM, and session injection records.
 */
export function isModLoaded(identifier: string): boolean {
    if (!identifier) return false;
    const target = identifier.trim().toLowerCase();
    const cleanTarget = cleanStr(target);

    // 1. Session-injected check
    if (sessionInjectedMods.has(target) || (cleanTarget && Array.from(sessionInjectedMods).some(m => cleanStr(m) === cleanTarget))) {
        return true;
    }

    // 2. FUSAM addons direct check
    if (typeof window !== "undefined" && (window as any).FUSAM && typeof (window as any).FUSAM.addons === "object") {
        const fAddons = (window as any).FUSAM.addons;
        for (const [fId, fVal] of Object.entries(fAddons)) {
            if (!fId) continue;
            const val = fVal as any;
            if (val && (val.status === "loaded" || val.status === "loading" || val.distribution)) {
                if (fId.toLowerCase() === target || cleanStr(fId) === cleanTarget) {
                    return true;
                }
            }
        }
    }

    // 3. Check loaded mods from bcModSdk and globals
    const loaded = getLoadedMods();
    return loaded.some(mod => isDetectedModMatch(mod, identifier));
}

/**
 * Safely and robustly loads a curated or verified custom mod script into the browser session.
 * Handles "eval" (fetch+eval for strict MIME text/plain), "module" (dynamic import),
 * and standard "script" tags with automated fallback mechanisms.
 */
export async function loadCuratedMod(catalogId: string): Promise<boolean> {
    if (!catalogId) return false;
    const target = catalogId.toLowerCase().trim();
    const all = getAllCatalogMods();
    const mod = all[catalogId] || Object.values(all).find(c =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target ||
        (Array.isArray(c.detectKeys) && c.detectKeys.some(k => k.toLowerCase() === target))
    );
    if (!mod || !mod.scriptUrl) {
        console.warn(`[QoC] Cannot auto-load mod '${catalogId}'. No valid script URL found.`);
        return false;
    }

    if (isModLoaded(catalogId)) {
        return true;
    }

    const scriptUrl = mod.noCacheBusting
        ? mod.scriptUrl
        : (mod.scriptUrl.includes("?") ? `${mod.scriptUrl}&_=${Date.now()}` : `${mod.scriptUrl}?_=${Date.now()}`);

    console.log(`[QoC] Injecting verified mod script for ${mod.name}: ${scriptUrl} (type: ${mod.scriptType || "script"})`);

    let executionSuccess = false;

    // Strategy 1: "eval" type OR raw.githubusercontent.com URLs (strict MIME type text/plain requires fetch+eval)
    const isGithubRaw = scriptUrl.includes("raw.githubusercontent.com");
    if (mod.scriptType === "eval" || isGithubRaw) {
        try {
            const resp = await fetch(scriptUrl);
            if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
            let code = await resp.text();
            code = code.replace(/sourceMappingURL=.*?.map/u, "");
            (1, eval)(code);
            executionSuccess = true;
            console.log(`[QoC] Successfully evaluated script for ${mod.name}`);
        } catch (err) {
            console.error(`[QoC] Error evaluating ${mod.name}:`, err);
        }
    }
    // Strategy 2: "module" type
    else if (mod.scriptType === "module") {
        try {
            // Dynamic import natively runs ES modules in page context
            await (new Function("u", "return import(u)"))(scriptUrl);
            executionSuccess = true;
            console.log(`[QoC] Successfully imported module for ${mod.name}`);
        } catch (err) {
            console.warn(`[QoC] Dynamic import failed for ${mod.name}, falling back to <script type="module">:`, err);
            try {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script");
                    script.type = "module";
                    script.src = scriptUrl;
                    script.onload = () => resolve();
                    script.onerror = (e) => reject(e);
                    document.head.appendChild(script);
                });
                executionSuccess = true;
            } catch (scriptErr) {
                console.error(`[QoC] Script module tag also failed for ${mod.name}:`, scriptErr);
            }
        }
    }
    // Strategy 3: Standard script
    else {
        // Try standard <script> first without crossOrigin (avoids CORS failures on non-CORS servers)
        try {
            await new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = scriptUrl;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = (e) => reject(e);
                document.head.appendChild(script);
            });
            executionSuccess = true;
            console.log(`[QoC] Successfully loaded script tag for ${mod.name}`);
        } catch (scriptErr) {
            console.warn(`[QoC] Standard script tag failed for ${mod.name}, falling back to fetch/eval:`, scriptErr);
            // Fallback: fetch & eval
            try {
                const resp = await fetch(scriptUrl);
                if (resp.ok) {
                    let code = await resp.text();
                    code = code.replace(/sourceMappingURL=.*?.map/u, "");
                    (1, eval)(code);
                    executionSuccess = true;
                    console.log(`[QoC] Successfully loaded ${mod.name} via fetch/eval fallback`);
                }
            } catch (fetchErr) {
                console.error(`[QoC] Both script tag and fetch/eval failed for ${mod.name}:`, fetchErr);
            }
        }
    }

    if (!executionSuccess) {
        return false;
    }

    // Register into session-injected cache
    sessionInjectedMods.add(mod.id.toLowerCase());
    sessionInjectedMods.add(catalogId.toLowerCase());
    if (mod.name) sessionInjectedMods.add(mod.name.toLowerCase());
    if (Array.isArray(mod.detectKeys)) {
        for (const k of mod.detectKeys) sessionInjectedMods.add(k.toLowerCase());
    }

    // Poll up to 5 seconds for the mod to register in session
    for (let i = 0; i < 25; i++) {
        if (isModLoaded(catalogId)) {
            console.log(`[QoC] Confirmed active in session: ${mod.name}`);
            return true;
        }
        await new Promise(r => setTimeout(r, 200));
    }

    return true;
}
