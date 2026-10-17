import { modStorage, ModRule } from "./storage";
import { isModLoaded, loadCuratedMod, CURATED_MOD_CATALOG, DetectedMod } from "./modDetection";
import { toastsManager } from "zois-core/toasts";
import { dialogsManager } from "zois-core/dialogs";
import { MOD_NAME } from "src/constants";

export interface ComplianceReport {
    isCompliant: boolean;
    missingRequired: ModRule[];
    detectedForbidden: ModRule[];
}

let isEvaluating = false;
const promptedMods = new Set<string>();

/**
 * Checks compliance for a given list of mods against a set of rules.
 * Used for inspecting both ourselves and remote targets.
 */
export function checkComplianceAgainstRules(mods: DetectedMod[], rules: ModRule[]): {
    isCompliant: boolean;
    missing: ModRule[];
    forbidden: ModRule[];
} {
    const missing: ModRule[] = [];
    const forbidden: ModRule[] = [];

    const isLoadedInList = (idOrName: string) => {
        const target = idOrName.toLowerCase().trim();
        return mods.some(m => {
            const mId = m.id.toLowerCase();
            const mName = m.name.toLowerCase();
            const mFull = (m.fullName || "").toLowerCase();
            return mId === target || mName === target || mFull === target;
        });
    };

    for (const rule of rules) {
        const loaded = isLoadedInList(rule.modId) || isLoadedInList(rule.modName);
        if (rule.type === "required" && !loaded) {
            missing.push(rule);
        } else if (rule.type === "forbidden" && loaded) {
            forbidden.push(rule);
        }
    }

    return {
        isCompliant: missing.length === 0 && forbidden.length === 0,
        missing,
        forbidden
    };
}

/**
 * Evaluates active rules on the local player and initiates auto-loading
 * or prompts if required.
 */
export async function evaluateCompliance(): Promise<ComplianceReport> {
    if (isEvaluating || !modStorage.inspector.enabled) {
        return { isCompliant: true, missingRequired: [], detectedForbidden: [] };
    }

    isEvaluating = true;
    const missingRequired: ModRule[] = [];
    const detectedForbidden: ModRule[] = [];

    try {
        const rules = modStorage.inspector.rules;
        if (!rules || rules.length === 0) {
            return { isCompliant: true, missingRequired: [], detectedForbidden: [] };
        }

        for (const rule of rules) {
            const loaded = isModLoaded(rule.modId) || isModLoaded(rule.modName);

            if (rule.type === "required" && !loaded) {
                missingRequired.push(rule);

                const isCurated = !!CURATED_MOD_CATALOG[rule.modId];
                if (modStorage.inspector.autoLoadMode === "Silent" && isCurated) {
                    toastsManager.info({
                        title: `${MOD_NAME} Auto-Loader`,
                        message: `Auto-loading required addon: ${rule.modName}...`,
                        duration: 3500
                    });
                    await loadCuratedMod(rule.modId);
                } else if (modStorage.inspector.autoLoadMode === "Prompt" && isCurated) {
                    if (!promptedMods.has(rule.modId)) {
                        promptedMods.add(rule.modId);
                        dialogsManager.confirm({
                            message: `[${MOD_NAME}] Mandatory Addon: ${rule.modName} is required by your Owner. Load it now?`
                        }).then((ok) => {
                            if (ok) {
                                loadCuratedMod(rule.modId);
                            }
                        }).catch(() => {});
                    }
                } else {
                    toastsManager.warn({
                        title: `${MOD_NAME} Compliance Notice`,
                        message: `Mandatory addon '${rule.modName}' is not loaded. Please load it manually.`,
                        duration: 6000
                    });
                }
            } else if (rule.type === "forbidden" && loaded) {
                detectedForbidden.push(rule);
                toastsManager.warn({
                    title: `${MOD_NAME} Policy Violation`,
                    message: `Addon '${rule.modName}' is FORBIDDEN by your Owner (#${rule.enforcedBy}). Please disable it and reload.`,
                    duration: 8000
                });
            }
        }
    } finally {
        isEvaluating = false;
    }

    return {
        isCompliant: missingRequired.length === 0 && detectedForbidden.length === 0,
        missingRequired,
        detectedForbidden
    };
}
