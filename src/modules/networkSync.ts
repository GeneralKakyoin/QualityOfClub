import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/toasts";
import { dialogsManager } from "zois-core/dialogs";
import { hookFunction, HookPriority } from "zois-core/mod-sdk";
import { modStorage, syncStorage, ModRule } from "./storage";
import { DetectedMod, getLoadedMods } from "./modDetection";
import { evaluateCompliance } from "./compliance";
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
 * Checks if a sender has permission to view our loaded addons according to settings.
 */
async function canSenderInspect(senderId: number, senderName?: string): Promise<{ allowed: boolean; reason?: string }> {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }

    const perm = modStorage.inspector.viewPermission;

    if (perm === "Disabled") {
        return { allowed: false, reason: "Player has disabled addon inspection." };
    }

    // Owner always has access unless completely Disabled
    if (typeof Player !== "undefined" && Player.IsOwnedByMemberNumber(senderId)) {
        return { allowed: true };
    }

    if (perm === "Owner") {
        return { allowed: false, reason: "Player allows only their Owner to inspect addons." };
    }

    if (perm === "Lovers") {
        if (typeof Player !== "undefined" && Player.IsLoverOfMemberNumber(senderId)) {
            return { allowed: true };
        }
        return { allowed: false, reason: "Player allows only Lovers or Owner to inspect addons." };
    }

    if (perm === "Whitelist") {
        if (typeof Player !== "undefined" && (Player.WhiteList.includes(senderId) || Player.IsLoverOfMemberNumber(senderId))) {
            return { allowed: true };
        }
        return { allowed: false, reason: "Player allows only Whitelisted members or Lovers/Owner to inspect addons." };
    }

    if (perm === "Anyone") {
        return { allowed: true };
    }

    if (perm === "Prompt") {
        const name = senderName || `Member #${senderId}`;
        try {
            const confirmed = await dialogsManager.confirm({
                message: `${name} wants to inspect your loaded addons. Allow?`
            });
            if (confirmed) {
                return { allowed: true };
            } else {
                return { allowed: false, reason: "Inspection request declined by player." };
            }
        } catch {
            return { allowed: false, reason: "Inspection request timed out or was dismissed." };
        }
    }

    return { allowed: false, reason: "Permission denied." };
}

/**
 * Checks if a sender has authority to set rules on us.
 */
function canSenderEnforceRules(senderId: number): { allowed: boolean; reason?: string } {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, reason: "Quality of Club Addon Inspector is disabled." };
    }

    if (!modStorage.inspector.allowOwnerRules) {
        return { allowed: false, reason: "Player has disabled external rule enforcement in QoC settings." };
    }

    const isOwner = typeof Player !== "undefined" && Player.IsOwnedByMemberNumber(senderId);
    if (isOwner) {
        return { allowed: true };
    }

    if (modStorage.inspector.allowLoversRules) {
        const isLover = typeof Player !== "undefined" && Player.IsLoverOfMemberNumber(senderId);
        const isWhitelisted = typeof Player !== "undefined" && Player.WhiteList.includes(senderId);
        if (isLover || isWhitelisted) {
            return { allowed: true };
        }
    }

    return { allowed: false, reason: "You do not have rule enforcement authority over this player." };
}

/**
 * Checks if the current local Player has authority to enforce rules on target.
 */
export function hasRuleAuthorityOver(target: Character | number): boolean {
    if (typeof Player === "undefined") return false;
    const targetChar = typeof target === "number" ? (typeof Character !== "undefined" ? Character.find((c: Character) => c.MemberNumber === target) : null) : target;

    if (!targetChar) {
        return false;
    }

    if (targetChar.IsPlayer && targetChar.IsPlayer()) {
        return true; // Can configure self-enforced rules
    }

    // Check if target is owned by Player
    if (typeof targetChar.IsOwnedByPlayer === "function" && targetChar.IsOwnedByPlayer()) {
        return true;
    }

    // Fallback: check target.Ownership or target.Owner
    if (targetChar.Ownership && targetChar.Ownership.MemberNumber === Player.MemberNumber) {
        return true;
    }
    if (targetChar.Owner && targetChar.Owner === Player.Name) {
        return true;
    }

    // Check if target is lover of player
    if (typeof targetChar.IsLoverOfPlayer === "function" && targetChar.IsLoverOfPlayer()) {
        return true;
    }

    return false;
}

/**
 * Initializes network message handlers and room sync listeners.
 */
export function initNetworkSync(): void {
    // 1. Direct packet request listener for ChatRoomMessage (supports async permission checks & avoids zois-core unawaited Promise bug)
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
            if (typeof senderId !== "number") {
                return next(args);
            }
            if (typeof Player !== "undefined" && senderId === Player.MemberNumber) {
                return next(args);
            }

            const senderChar = typeof Character !== "undefined" && typeof Character.find === "function"
                ? Character.find((c: Character) => c.MemberNumber === senderId)
                : null;
            const senderName = senderChar?.Name || `Member #${senderId}`;

            if (dictData.message === "qoc_inspect") {
                const permCheck = await canSenderInspect(senderId, senderName);
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

            if (dictData.message === "qoc_setRules") {
                const authCheck = canSenderEnforceRules(senderId);
                let responseData: SetRulesResponseData;
                if (!authCheck.allowed) {
                    responseData = {
                        success: false,
                        reason: authCheck.reason
                    };
                } else {
                    const newRules = Array.isArray(dictData.data?.rules) ? (dictData.data.rules as ModRule[]) : [];
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
            const senderName = beep.MemberName || `Member #${senderId}`;

            if (data.message === "qoc_inspect") {
                const permCheck = await canSenderInspect(senderId, senderName);
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
                const authCheck = canSenderEnforceRules(senderId);
                let responseData: SetRulesResponseData;
                if (!authCheck.allowed) {
                    responseData = { success: false, reason: authCheck.reason };
                } else {
                    const newRules = Array.isArray(data.data?.rules) ? (data.data.rules as ModRule[]) : [];
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

    // 3. Periodic / room sync hook for compliance
    hookFunction("ChatRoomSync", HookPriority.OBSERVE, (args, next) => {
        const ret = next(args);
        evaluateCompliance();
        return ret;
    });
}

/**
 * Sends a request to inspect a target player's loaded addons.
 */
export async function requestInspect(targetMemberNumber: number): Promise<{ success: boolean; data?: InspectResponseData; error?: string }> {
    try {
        console.log(`[${MOD_NAME}] Sending qoc_inspect request to member #${targetMemberNumber}...`);
        let res = await messagesManager.sendRequest<InspectResponseData>({
            message: "qoc_inspect",
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            console.log(`[${MOD_NAME}] Packet request to #${targetMemberNumber} failed or timed out. Trying beep fallback...`);
            res = await messagesManager.sendRequest<InspectResponseData>({
                message: "qoc_inspect",
                target: targetMemberNumber,
                type: "beep"
            });
        }

        console.log(`[${MOD_NAME}] Inspection response from #${targetMemberNumber}:`, res);

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
        const res = await messagesManager.sendRequest<SetRulesResponseData>({
            message: "qoc_setRules",
            data: { rules },
            target: targetMemberNumber,
            type: "packet"
        });

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
