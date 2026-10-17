import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/toasts";
import { dialogsManager } from "zois-core/dialogs";
import { hookFunction, HookPriority } from "zois-core/mod-sdk";
import { modStorage, syncStorage, ModRule } from "./storage";
import { DetectedMod, getLoadedMods } from "./modDetection";
import { evaluateCompliance } from "./compliance";
import { version } from "../../package.json";
import { MOD_NAME } from "src/constants";

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
    // 1. Handle incoming inspection requests
    messagesManager.onRequest("qoc_inspect", async (data: any, sender: Character | number, senderName?: string) => {
        const senderId = typeof sender === "number" ? sender : (sender.MemberNumber ?? -1);
        const permCheck = await canSenderInspect(senderId, senderName);

        if (!permCheck.allowed) {
            return {
                allowed: false,
                reason: permCheck.reason
            };
        }

        return {
            allowed: true,
            mods: getLoadedMods(),
            rules: modStorage.inspector.rules,
            version
        };
    });

    // 2. Handle incoming rule updates
    messagesManager.onRequest("qoc_setRules", (data: any, sender: Character | number, senderName?: string) => {
        const senderId = typeof sender === "number" ? sender : (sender.MemberNumber ?? -1);
        const authCheck = canSenderEnforceRules(senderId);

        if (!authCheck.allowed) {
            return {
                success: false,
                reason: authCheck.reason
            };
        }

        const newRules = Array.isArray(data?.rules) ? (data.rules as ModRule[]) : [];
        modStorage.inspector.rules = newRules;
        syncStorage();

        // Re-evaluate compliance immediately on the client
        evaluateCompliance();

        toastsManager.info({
            title: `${MOD_NAME} Rules Updated`,
            message: `Addon rules updated by ${senderName || `Member #${senderId}`}.`,
            duration: 5000
        });

        return {
            success: true
        };
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
        const res = await messagesManager.sendRequest<InspectResponseData>({
            message: "qoc_inspect",
            target: targetMemberNumber,
            type: "packet"
        });

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
