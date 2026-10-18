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

let lockoutElement: HTMLElement | null = null;

export function triggerLockoutOverlay(rule: ModRule): void {
    if (lockoutElement && document.body.contains(lockoutElement)) {
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "qoc-lockout-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(18, 5, 8, 0.96);
        z-index: 100000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ff5252;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
        user-select: none;
    `;

    const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;

    overlay.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(255, 82, 82, 0.6));">🚫</div>
        <div style="font-size: 28px; font-weight: bold; color: #ff5252; margin-bottom: 12px; letter-spacing: 1.5px;">
            QUALITY OF CLUB POLICY VIOLATION: INTERFACE LOCKED
        </div>
        <div style="font-size: 17px; color: #ffcdd2; max-width: 650px; line-height: 1.6; margin-bottom: 20px;">
            You are actively running the forbidden addon: <b style="color: #ff8a80;">${rule.modName}</b>.<br>
            Access to Bondage Club has been locked until this forbidden addon is disabled or uninstalled.
        </div>
        <div style="font-size: 14px; color: #ef9a9a; margin-bottom: 30px;">
            Policy enforced by: <b>${enforcer}</b>
        </div>
        <div style="display: flex; gap: 16px;">
            <button id="qoc-lockout-reload" style="padding: 12px 30px; background: #c62828; border: 1px solid #ff5252; color: white; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                🔄 Reload Game Page
            </button>
            <button id="qoc-lockout-recheck" style="padding: 12px 30px; background: rgba(55, 71, 79, 0.9); border: 1px solid #78909c; color: white; font-size: 15px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                ⚡ Re-check Compliance
            </button>
        </div>
    `;

    overlay.querySelector("#qoc-lockout-reload")?.addEventListener("click", () => {
        window.location.reload();
    });

    overlay.querySelector("#qoc-lockout-recheck")?.addEventListener("click", async () => {
        const report = await evaluateCompliance();
        if (report.detectedForbidden.length === 0) {
            clearLockoutOverlay();
            toastsManager.success({
                title: `${MOD_NAME} Unlocked`,
                message: "Forbidden addon no longer detected. Access restored!",
                duration: 4000
            });
        } else {
            toastsManager.error({
                title: `${MOD_NAME} Still Non-Compliant`,
                message: "Forbidden addon is still running in this session.",
                duration: 4000
            });
        }
    });

    document.body.appendChild(overlay);
    lockoutElement = overlay;
}

export function clearLockoutOverlay(): void {
    if (lockoutElement) {
        lockoutElement.remove();
        lockoutElement = null;
    }
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
            clearLockoutOverlay();
            return { isCompliant: true, missingRequired: [], detectedForbidden: [] };
        }

        for (const rule of rules) {
            const loaded = isModLoaded(rule.modId) || isModLoaded(rule.modName);

            if (rule.type === "required" && !loaded) {
                missingRequired.push(rule);
                const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;

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
                            if (isModLoaded(rule.modId) || isModLoaded(rule.modName)) {
                                const idx = missingRequired.indexOf(rule);
                                if (idx !== -1) missingRequired.splice(idx, 1);
                            }
                        }
                    } else if (modStorage.inspector.autoLoadMode === "Prompt") {
                        if (!promptedMods.has(curated.id)) {
                            promptedMods.add(curated.id);
                            const promptMsg = `[${MOD_NAME}] Mandatory Addon: ${curated.name} is required by ${enforcer}. Load it now?`;
                            try {
                                dialogsManager.confirm({
                                    message: promptMsg
                                }).then(async (ok) => {
                                    if (ok) {
                                        await loadCuratedMod(curated.id);
                                        evaluateCompliance();
                                    }
                                }).catch(async () => {
                                    if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                                        await loadCuratedMod(curated.id);
                                        evaluateCompliance();
                                    }
                                });
                            } catch {
                                if (typeof window !== "undefined" && window.confirm(promptMsg)) {
                                    await loadCuratedMod(curated.id);
                                    evaluateCompliance();
                                }
                            }
                        }
                    } else if (modStorage.inspector.autoLoadMode === "Alert") {
                        toastsManager.warn({
                            title: `${MOD_NAME} Mandatory Notice`,
                            message: `Mandatory addon '${curated.name}' required by ${enforcer} is missing.`,
                            duration: 6000
                        });
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
                const violationAction = modStorage.inspector.violationAction || "toast";

                if (violationAction === "toast") {
                    toastsManager.error({
                        title: `${MOD_NAME} Policy Violation`,
                        message: `Addon '${rule.modName}' is FORBIDDEN by ${enforcer}. Please disable it immediately!`,
                        duration: 9000
                    });
                } else if (violationAction === "room_alert") {
                    toastsManager.error({
                        title: `${MOD_NAME} Policy Violation`,
                        message: `Addon '${rule.modName}' is FORBIDDEN! Public room alert announced.`,
                        duration: 9000
                    });
                    if (typeof ServerSend === "function" && typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
                        const pName = typeof Player !== "undefined" ? Player.Name : "Player";
                        ServerSend("ChatRoomChat", {
                            Content: `* [${MOD_NAME} Violation] ${pName} is actively running forbidden addon '${rule.modName}'! *`,
                            Type: "Emote"
                        });
                    }
                } else if (violationAction === "lockout") {
                    triggerLockoutOverlay(rule);
                } else if (violationAction === "leave_room") {
                    toastsManager.error({
                        title: `${MOD_NAME} Room Ejection`,
                        message: `Ejected from room: Addon '${rule.modName}' is FORBIDDEN by ${enforcer}!`,
                        duration: 9000
                    });
                    if (typeof ChatRoomLeave === "function" && typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
                        ChatRoomLeave();
                    }
                }
            }
        }

        // If no forbidden addons detected, dismiss any existing lockout overlay
        if (detectedForbidden.length === 0) {
            clearLockoutOverlay();
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
