import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/toasts";
import { hookFunction, HookPriority } from "zois-core/mod-sdk";
import { modStorage, syncStorage, ModRule, QoCPermission } from "./storage";
import { DetectedMod, getLoadedMods } from "./modDetection";
import { evaluateCompliance, checkComplianceAgainstRules } from "./compliance";
import { checkPermissionAccess, getCharacterAccessLevel } from "./authority";
import { version } from "../../package.json";
import { MOD_NAME, MOD_KEY } from "src/constants";

export interface InspectResponseData {
    allowed: boolean;
    reason?: string;
    mods?: DetectedMod[];
    rules?: ModRule[];
    version?: string;
}

export interface SetRulesResponseData {
    success: boolean;
    reason?: string;
}

/**
 * Checks if a sender has permission to view our loaded addons according to Authority settings.
 */
function canSenderInspect(senderId: number): { allowed: boolean; reason?: string } {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }

    const hasAccess = checkPermissionAccess("inspect_view_addons", senderId);
    if (!hasAccess) {
        return { allowed: false, reason: "Permission Denied: You do not meet the minimum role required to inspect this player's addons." };
    }

    return { allowed: true };
}

/**
 * Checks if a sender has authority to set rules on us according to Authority settings.
 */
function canSenderEnforceRules(senderId: number, rules?: ModRule[]): { allowed: boolean; reason?: string } {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, reason: "Quality of Club Addon Inspector is disabled." };
    }

    const hasMandatoryAccess = checkPermissionAccess("rules_lock_mandatory", senderId);
    const hasForbiddenAccess = checkPermissionAccess("rules_lock_forbidden", senderId);
    const hasRemoveAccess = checkPermissionAccess("rules_remove_rules", senderId);

    if (!hasMandatoryAccess && !hasForbiddenAccess && !hasRemoveAccess) {
        return { allowed: false, reason: "Permission Denied: You do not meet the minimum role required to enforce addon rules on this player." };
    }

    return { allowed: true };
}

/**
 * Checks if the current local Player has authority to configure rules for target.
 */
export function hasRuleAuthorityOver(target: Character | number): boolean {
    return true;
}

/**
 * Sends a silent telemetry report to any dominant in the room.
 */
function sendSilentRoomTelemetry(): void {
    if (typeof ChatRoomCharacter === "undefined" || !Array.isArray(ChatRoomCharacter)) return;
    if (typeof Player === "undefined") return;

    const loadedMods = getLoadedMods();
    const rules = modStorage.inspector.rules;
    const compliance = checkComplianceAgainstRules(loadedMods, rules);

    for (const char of ChatRoomCharacter) {
        if (!char || char.MemberNumber === Player.MemberNumber) continue;
        const access = getCharacterAccessLevel(char.MemberNumber);
        // If char is Clubowner (1), Owner (2), or Mistress (4):
        if (access === 1 || access === 2 || access === 4) {
            messagesManager.sendPacket("qoc_telemetry", {
                mods: loadedMods,
                rules,
                isCompliant: compliance.isCompliant,
                missingCount: compliance.missing.length,
                forbiddenCount: compliance.forbidden.length
            }, char.MemberNumber);
        }
    }
}

/**
 * Initializes network message handlers and room sync listeners.
 */
export function initNetworkSync(): void {
    // 1. Direct packet request listener for ChatRoomMessage
    hookFunction("ChatRoomMessage", HookPriority.ADD_BEHAVIOR, async (args, next) => {
        const msg = args[0];
        if (!msg || msg.Content !== MOD_KEY || !msg.Dictionary) {
            return next(args);
        }

        const dict = msg.Dictionary as any;
        const dictMsg = dict?.msg;
        const dictData = dict?.data;

        if (dictMsg === "request" && dictData && typeof dictData.requestId === "string") {
            const senderId = msg.Sender;
            if (typeof senderId !== "number") return next(args);
            if (typeof Player !== "undefined" && senderId === Player.MemberNumber) return next(args);

            const senderChar = typeof Character !== "undefined" && typeof Character.find === "function"
                ? Character.find((c: Character) => c.MemberNumber === senderId)
                : null;
            const senderName = senderChar?.Name || `Member #${senderId}`;

            // Incoming Inspection Query
            if (dictData.message === "qoc_inspect") {
                const permCheck = canSenderInspect(senderId);
                const responseData: InspectResponseData = permCheck.allowed ? {
                    allowed: true,
                    mods: getLoadedMods(),
                    rules: modStorage.inspector.rules,
                    version
                } : {
                    allowed: false,
                    reason: permCheck.reason
                };

                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: responseData
                }, senderId);
                return;
            }

            // Incoming Rule Update
            if (dictData.message === "qoc_setRules") {
                const newRules = Array.isArray(dictData.data?.rules) ? (dictData.data.rules as ModRule[]) : [];
                const authCheck = canSenderEnforceRules(senderId, newRules);
                let responseData: SetRulesResponseData;

                if (!authCheck.allowed) {
                    responseData = {
                        success: false,
                        reason: authCheck.reason
                    };
                } else {
                    modStorage.inspector.rules = newRules;
                    syncStorage();
                    evaluateCompliance();

                    toastsManager.info({
                        title: `${MOD_NAME} Rules Updated`,
                        message: `Addon rules updated by ${senderName}.`,
                        duration: 5000
                    });

                    responseData = { success: true };
                }

                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: responseData
                }, senderId);
                return;
            }
        }

        // Silent Telemetry Packet from Submissive
        if (dictMsg === "qoc_telemetry" && dictData) {
            const senderId = msg.Sender;
            const senderChar = typeof Character !== "undefined" && typeof Character.find === "function"
                ? Character.find((c: Character) => c.MemberNumber === senderId)
                : null;
            const senderName = senderChar?.Name || `Member #${senderId}`;

            if (dictData.isCompliant) {
                toastsManager.info({
                    title: `QoC Telemetry: ${senderName}`,
                    message: `✓ In-room manifest verified: All ${dictData.mods?.length || 0} addons compliant.`,
                    duration: 4000
                });
            } else {
                toastsManager.error({
                    title: `⚠️ QoC Rule Violation: ${senderName}`,
                    message: `Policy violation: ${dictData.missingCount || 0} missing mandatory, ${dictData.forbiddenCount || 0} forbidden!`,
                    duration: 8000
                });
            }
        }

        return next(args);
    });

    // 2. Direct beep request listener for ServerAccountBeep
    hookFunction("ServerAccountBeep", HookPriority.ADD_BEHAVIOR, async (args, next) => {
        const beep = args[0];
        if (!beep || beep.BeepType !== "Leash") return next(args);
        let data: any;
        try {
            data = JSON.parse(beep.Message);
        } catch {
            return next(args);
        }

        if (data && data.type === `${MOD_KEY}_request` && typeof data.requestId === "string") {
            const senderId = beep.MemberNumber;

            if (data.message === "qoc_inspect") {
                const permCheck = canSenderInspect(senderId);
                const responseData: InspectResponseData = permCheck.allowed ? {
                    allowed: true,
                    mods: getLoadedMods(),
                    rules: modStorage.inspector.rules,
                    version
                } : {
                    allowed: false,
                    reason: permCheck.reason
                };

                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: responseData
                }, senderId);
                return;
            }

            if (data.message === "qoc_setRules") {
                const newRules = Array.isArray(data.data?.rules) ? (data.data.rules as ModRule[]) : [];
                const authCheck = canSenderEnforceRules(senderId, newRules);
                let responseData: SetRulesResponseData;
                if (!authCheck.allowed) {
                    responseData = { success: false, reason: authCheck.reason };
                } else {
                    modStorage.inspector.rules = newRules;
                    syncStorage();
                    evaluateCompliance();
                    responseData = { success: true };
                }

                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: responseData
                }, senderId);
                return;
            }
        }

        return next(args);
    });

    // 3. Periodic / room sync hook for compliance & telemetry
    hookFunction("ChatRoomSync", HookPriority.OBSERVE, (args, next) => {
        const ret = next(args);
        evaluateCompliance();
        sendSilentRoomTelemetry();
        return ret;
    });

    // Periodic compliance check every 20 seconds while in a room
    setInterval(() => {
        if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
            evaluateCompliance();
        }
    }, 20000);
}

/**
 * Sends a request to inspect a target player's loaded addons.
 */
export async function requestInspect(targetMemberNumber: number): Promise<{ success: boolean; data?: InspectResponseData; error?: string }> {
    try {
        let res = await messagesManager.sendRequest<InspectResponseData>({
            message: "qoc_inspect",
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            res = await messagesManager.sendRequest<InspectResponseData>({
                message: "qoc_inspect",
                target: targetMemberNumber,
                type: "beep"
            });
        }

        if (res.isError || !res.data) {
            return {
                success: false,
                error: "Target player did not respond. They may not have Quality of Club loaded."
            };
        }

        if (!res.data.allowed) {
            return {
                success: false,
                error: res.data.reason || "Inspection permission denied by target player."
            };
        }

        return {
            success: true,
            data: res.data
        };
    } catch (err: any) {
        return {
            success: false,
            error: err?.message || "Failed to communicate with target player."
        };
    }
}

/**
 * Sends an update to set/lock rules on a submissive target.
 */
export async function requestSetRules(targetMemberNumber: number, rules: ModRule[]): Promise<{ success: boolean; error?: string }> {
    try {
        let res = await messagesManager.sendRequest<SetRulesResponseData>({
            message: "qoc_setRules",
            data: { rules },
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            res = await messagesManager.sendRequest<SetRulesResponseData>({
                message: "qoc_setRules",
                data: { rules },
                target: targetMemberNumber,
                type: "beep"
            });
        }

        if (res.isError || !res.data) {
            return {
                success: false,
                error: "Target player did not respond. Rules could not be synced."
            };
        }

        if (!res.data.success) {
            return {
                success: false,
                error: res.data.reason || "Target rejected rule update."
            };
        }

        return {
            success: true
        };
    } catch (err: any) {
        return {
            success: false,
            error: err?.message || "Failed to send rule update to target."
        };
    }
}
