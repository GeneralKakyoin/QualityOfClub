import { modStorage, ModRule } from "./storage";
import { isModLoaded, loadCuratedMod, CURATED_MOD_CATALOG, DetectedMod, getCuratedMod, isDetectedModMatch } from "./modDetection";
import { toastsManager } from "zois-core/toasts";
import { dialogsManager } from "zois-core/dialogs";
import { MOD_NAME } from "src/constants";

export { getCuratedMod };

export interface ComplianceReport {
    isCompliant: boolean;
    missingRequired: ModRule[];
    detectedForbidden: ModRule[];
}

let isEvaluating = false;
export const promptedMods = new Set<string>();

export interface ComplianceCheckResult {
    hasRules: boolean;
    isCompliant: boolean;
    missing: ModRule[];
    forbidden: ModRule[];
    details: {
        rule: ModRule;
        status: "met" | "violated";
        matchedMod?: DetectedMod;
    }[];
}

/**
 * Checks compliance for a given list of mods against a set of rules.
 */
export function checkComplianceAgainstRules(mods: DetectedMod[], rules: ModRule[]): ComplianceCheckResult {
    const missing: ModRule[] = [];
    const forbidden: ModRule[] = [];
    const details: { rule: ModRule; status: "met" | "violated"; matchedMod?: DetectedMod }[] = [];

    const findLoadedMatch = (rule: ModRule): DetectedMod | undefined => {
        return mods.find(m => isDetectedModMatch(m, rule.modId) || (rule.modName && isDetectedModMatch(m, rule.modName)));
    };

    const hasRules = Array.isArray(rules) && rules.length > 0;

    if (hasRules) {
        for (const rule of rules) {
            const isMandatory = rule.type === "required" || (rule.type as string) === "mandatory";
            const isForbidden = rule.type === "forbidden";
            const matchedMod = findLoadedMatch(rule);

            if (isMandatory) {
                if (!matchedMod) {
                    missing.push(rule);
                    details.push({ rule, status: "violated" });
                } else {
                    details.push({ rule, status: "met", matchedMod });
                }
            } else if (isForbidden) {
                if (matchedMod) {
                    forbidden.push(rule);
                    details.push({ rule, status: "violated", matchedMod });
                } else {
                    details.push({ rule, status: "met" });
                }
            }
        }
    }

    return {
        hasRules,
        isCompliant: hasRules ? (missing.length === 0 && forbidden.length === 0) : true,
        missing,
        forbidden,
        details
    };
}

/**
 * Evaluates active rules on the local player and initiates auto-loading or prompts.
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

                const curated = getCuratedMod(rule.modId) || getCuratedMod(rule.modName);
                if (curated) {
                    if (modStorage.inspector.autoLoadMode === "Silent") {
                        toastsManager.info({
                            title: `${MOD_NAME} Auto-Loader`,
                            message: `Auto-injecting mandatory addon: ${curated.name}...`,
                            duration: 4000
                        });
                        const success = await loadCuratedMod(curated.id);
                        if (success) {
                            toastsManager.success({
                                title: `${MOD_NAME} Injected`,
                                message: `Successfully loaded ${curated.name}!`,
                                duration: 4000
                            });
                        }
                    } else if (modStorage.inspector.autoLoadMode === "Prompt") {
                        if (!promptedMods.has(curated.id)) {
                            promptedMods.add(curated.id);
                            const name = rule.enforcedByName || `Member #${rule.enforcedBy}`;
                            const promptMsg = `[${MOD_NAME}] Mandatory Addon: ${curated.name} is required by ${name}. Load it now?`;
                            try {
                                dialogsManager.confirm({
                                    message: promptMsg
                                }).then(async (ok) => {
                                    if (ok) {
                                        await loadCuratedMod(curated.id);
                                    }
                                }).catch(async () => {
                                    if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                                        await loadCuratedMod(curated.id);
                                    }
                                });
                            } catch {
                                if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                                    await loadCuratedMod(curated.id);
                                }
                            }
                        }
                    }
                } else {
                    toastsManager.warn({
                        title: `${MOD_NAME} Compliance Notice`,
                        message: `Mandatory addon '${rule.modName}' is not loaded. Please load it.`,
                        duration: 6000
                    });
                }
            } else if (rule.type === "forbidden" && loaded) {
                detectedForbidden.push(rule);
                const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;
                toastsManager.error({
                    title: `${MOD_NAME} Policy Violation`,
                    message: `Addon '${rule.modName}' is FORBIDDEN by ${enforcer}. Please disable it immediately!`,
                    duration: 9000
                });
            }
        }
    } catch (e) {
        console.error("[QoC] Error evaluating compliance:", e);
    } finally {
        isEvaluating = false;
    }

    return {
        isCompliant: missingRequired.length === 0 && detectedForbidden.length === 0,
        missingRequired,
        detectedForbidden
    };
}
