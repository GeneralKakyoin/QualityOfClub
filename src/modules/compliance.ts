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

const lastRoomAlertTimes = new Map<string, number>();
let lockoutElement: HTMLElement | null = null;

export function triggerLockoutOverlay(rule: ModRule): void {
    const existing = document.getElementById("qoc-lockout-overlay");
    if (existing) {
        lockoutElement = existing;
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
        background: rgba(15, 6, 9, 0.96);
        backdrop-filter: blur(8px);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ff5252;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
        user-select: none;
        pointer-events: auto;
    `;

    // Stop events from leaking into BC canvas underneath
    overlay.addEventListener("mousedown", (e) => e.stopPropagation());
    overlay.addEventListener("mouseup", (e) => e.stopPropagation());
    overlay.addEventListener("click", (e) => e.stopPropagation());

    const enforcer = rule.enforcedByName || `Member #${rule.enforcedBy}`;

    overlay.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(255, 82, 82, 0.6));">🚫</div>
        <div style="font-size: 28px; font-weight: bold; color: #ff5252; margin-bottom: 12px; letter-spacing: 1.5px;">
            QUALITY OF CLUB POLICY VIOLATION: INTERFACE LOCKED
        </div>
        <div style="font-size: 17px; color: #ffcdd2; max-width: 650px; line-height: 1.6; margin-bottom: 16px;">
            You are actively running the forbidden addon: <b style="color: #ff8a80; background: rgba(255, 82, 82, 0.15); padding: 2px 8px; border-radius: 4px; border: 1px solid #ff5252;">${rule.modName}</b>.<br>
            Game interface interaction is locked until this forbidden addon is disabled or uninstalled.
        </div>
        <div style="font-size: 14px; color: #ef9a9a; margin-bottom: 24px;">
            Policy enforced by: <b>${enforcer}</b>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <button id="qoc-lockout-reload" style="padding: 12px 28px; background: #c62828; border: 1px solid #ff5252; color: white; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                🔄 Reload Game Page
            </button>
            <button id="qoc-lockout-recheck" style="padding: 12px 28px; background: rgba(55, 71, 79, 0.95); border: 1px solid #78909c; color: white; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                ⚡ Re-check Compliance
            </button>
        </div>
        <div id="qoc-lockout-status" style="font-size: 13.5px; min-height: 24px; color: #ffb74d; font-weight: 500; max-width: 600px;"></div>
    `;

    overlay.querySelector("#qoc-lockout-reload")?.addEventListener("click", () => {
        window.location.reload();
    });

    const statusEl = overlay.querySelector("#qoc-lockout-status") as HTMLElement;

    overlay.querySelector("#qoc-lockout-recheck")?.addEventListener("click", async () => {
        if (statusEl) {
            statusEl.style.color = "#90caf9";
            statusEl.textContent = "⏳ Evaluating loaded addons...";
        }
        const report = await evaluateCompliance();
        if (report.detectedForbidden.length === 0) {
            clearLockoutOverlay();
            toastsManager.success({
                title: `${MOD_NAME} Unlocked`,
                message: "Forbidden addon no longer detected. Access restored!",
                duration: 4000
            });
        } else {
            if (statusEl) {
                statusEl.style.color = "#ef5350";
                const forbiddenNames = report.detectedForbidden.map(f => f.modName || f.modId).join(", ");
                statusEl.textContent = `❌ Still non-compliant: [${forbiddenNames}] is still detected running. Disable it in your userscript manager or addons, then re-check or reload.`;
            }
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
    const existing = document.getElementById("qoc-lockout-overlay");
    if (existing) {
        existing.remove();
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
                        if (success && (isModLoaded(rule.modId) || isModLoaded(rule.modName))) {
                            toastsManager.success({
                                title: `${MOD_NAME} Injected`,
                                message: `Successfully loaded ${curated.name}!`,
                                duration: 4000
                            });
                            const idx = missingRequired.indexOf(rule);
                            if (idx !== -1) missingRequired.splice(idx, 1);
                        } else if (success) {
                            toastsManager.warn({
                                title: `${MOD_NAME} Injection Notice`,
                                message: `Injected ${curated.name}, but it has not initialized yet.`,
                                duration: 4500
                            });
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
                    if (typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
                        const now = Date.now();
                        const lastSent = lastRoomAlertTimes.get(rule.modId) || 0;
                        if (now - lastSent > 45000) {
                            lastRoomAlertTimes.set(rule.modId, now);
                            const pName = typeof Player !== "undefined" && Player.Name ? Player.Name : "Player";
                            const alertMsg = `* [${MOD_NAME} Violation] ${pName} is actively running forbidden addon '${rule.modName}'! *`;
                            if (typeof (window as any).ChatRoomSendChat === "function") {
                                (window as any).ChatRoomSendChat(alertMsg);
                            } else if (typeof (window as any).ChatRoomSendEmote === "function") {
                                (window as any).ChatRoomSendEmote(alertMsg);
                            } else if (typeof ServerSend === "function") {
                                ServerSend("ChatRoomChat", {
                                    Content: alertMsg,
                                    Type: "Chat"
                                });
                            }
                        }
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

        // If no forbidden addons detected OR violationAction is not lockout, dismiss any existing lockout overlay
        const currentAction = modStorage.inspector.violationAction || "toast";
        if (detectedForbidden.length === 0 || currentAction !== "lockout") {
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
