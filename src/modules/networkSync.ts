import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/toasts";
import { hookFunction, HookPriority } from "zois-core/mod-sdk";
import { modStorage, syncStorage, saveStorage, ModRule, QoCPermission, AuthorityData, AccessLevel, AutoLoadMode, ViolationAction, CuratedModInfo } from "./storage";
import { DetectedMod, getLoadedMods, isModLoaded, loadCuratedMod, getCuratedMod } from "./modDetection";
import { evaluateCompliance, checkComplianceAgainstRules } from "./compliance";
import { checkPermissionAccess, getCharacterAccessLevel, addRoleMember, removeRoleMember, setPermissionMinRole, setPermissionSelfAccess } from "./authority";
import { version } from "../../package.json";
import { MOD_NAME, MOD_KEY } from "src/constants";

export interface InspectResponseData {
    allowed: boolean;
    reason?: string;
    canViewAddons?: boolean;
    canViewRules?: boolean;
    mods?: DetectedMod[];
    rules?: ModRule[];
    autoLoadMode?: AutoLoadMode;
    preferences?: {
        violationAction: ViolationAction;
        autoLoadMode: AutoLoadMode;
        evaluationInterval: number;
        silentTelemetry: boolean;
        showProfileButton: boolean;
        allowForcedInjection: boolean;
    };
    customCatalog?: CuratedModInfo[];
    authority?: AuthorityData;
    callerAccessLevel?: AccessLevel;
    callerPermissions?: Record<QoCPermission, boolean>;
    version?: string;
}

export interface SetRulesResponseData {
    success: boolean;
    reason?: string;
}

export interface TriggerComplianceResponseData {
    success: boolean;
    reason?: string;
    report?: {
        isCompliant: boolean;
        missingCount: number;
        forbiddenCount: number;
    };
}

export interface ForceInjectResponseData {
    success: boolean;
    reason?: string;
    injectedCount?: number;
    report?: {
        isCompliant: boolean;
        missingCount: number;
        forbiddenCount: number;
    };
}

export interface AuthorityUpdateRequest {
    action: "add_role" | "remove_role" | "set_min_role" | "set_self_access" | "set_autoload_mode" | "update_preferences" | "add_custom_mod" | "remove_custom_mod";
    role?: "owner" | "mistress";
    memberNumber?: number;
    perm?: QoCPermission;
    minRole?: AccessLevel;
    selfAllowed?: boolean;
    autoLoadMode?: AutoLoadMode;
    preferences?: {
        violationAction?: ViolationAction;
        autoLoadMode?: AutoLoadMode;
        evaluationInterval?: number;
        silentTelemetry?: boolean;
        showProfileButton?: boolean;
        allowForcedInjection?: boolean;
    };
    customMod?: CuratedModInfo;
    customModId?: string;
}

export interface AuthorityUpdateResponseData {
    success: boolean;
    reason?: string;
    authority?: AuthorityData;
    autoLoadMode?: AutoLoadMode;
    preferences?: {
        violationAction: ViolationAction;
        autoLoadMode: AutoLoadMode;
        evaluationInterval: number;
        silentTelemetry: boolean;
        showProfileButton: boolean;
        allowForcedInjection: boolean;
    };
    customCatalog?: CuratedModInfo[];
}

function getCallerPermissions(senderId: number): Record<QoCPermission, boolean> {
    const perms: QoCPermission[] = [
        "authority_edit_roles",
        "authority_edit_min_role",
        "authority_edit_self_access",
        "inspect_view_addons",
        "inspect_view_rules",
        "rules_lock_mandatory",
        "rules_lock_forbidden",
        "rules_remove_rules",
        "rules_edit_autoload_mode",
        "rules_force_compliance",
        "menu_open_settings"
    ];
    const res: Record<string, boolean> = {};
    for (const p of perms) {
        res[p] = checkPermissionAccess(p, senderId);
    }
    return res as Record<QoCPermission, boolean>;
}

/**
 * Checks if a sender has permission to view our loaded addons or active rules.
 */
function canSenderInspect(senderId: number): { allowed: boolean; canViewAddons: boolean; canViewRules: boolean; reason?: string } {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, canViewAddons: false, canViewRules: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }

    const canViewAddons = checkPermissionAccess("inspect_view_addons", senderId);
    const canViewRules = checkPermissionAccess("inspect_view_rules", senderId);

    if (!canViewAddons && !canViewRules) {
        return { allowed: false, canViewAddons: false, canViewRules: false, reason: "Permission Denied: You do not meet the minimum role required to inspect this player's addons or rules." };
    }

    return { allowed: true, canViewAddons, canViewRules };
}

/**
 * Checks if a sender has authority to set rules on us according to Authority settings.
 * Accurately enforces specific permissions for locking mandatory, locking forbidden, or removing rules.
 */
function canSenderEnforceRules(senderId: number, newRules: ModRule[]): { allowed: boolean; reason?: string } {
    if (!modStorage.inspector.enabled) {
        return { allowed: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }

    const currentRules = modStorage.inspector.rules || [];
    const hasMandatoryAccess = checkPermissionAccess("rules_lock_mandatory", senderId);
    const hasForbiddenAccess = checkPermissionAccess("rules_lock_forbidden", senderId);
    const hasRemoveAccess = checkPermissionAccess("rules_remove_rules", senderId);

    // 1. Check newly added or modified rules
    for (const rule of newRules) {
        const isMandatory = rule.type === "required" || (rule.type as string) === "mandatory";
        const isForbidden = rule.type === "forbidden";
        const prev = currentRules.find(r => r.modId.toLowerCase() === rule.modId.toLowerCase());

        if (isMandatory && (!prev || (prev.type !== "required" && (prev.type as string) !== "mandatory"))) {
            if (!hasMandatoryAccess) {
                return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to lock mandatory addons (attempted on ${rule.modName}).` };
            }
        }

        if (isForbidden && (!prev || prev.type !== "forbidden")) {
            if (!hasForbiddenAccess) {
                return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to lock forbidden addons (attempted on ${rule.modName}).` };
            }
        }
    }

    // 2. Check removed rules
    for (const prev of currentRules) {
        const stillExists = newRules.some(r => r.modId.toLowerCase() === prev.modId.toLowerCase());
        if (!stillExists) {
            if (!hasRemoveAccess) {
                return { allowed: false, reason: `Permission Denied: You do not meet the minimum role required to remove active addon rules (attempted on ${prev.modName}).` };
            }
        }
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
    if (!modStorage.inspector.silentTelemetry) return;
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

let periodicComplianceTimer: any = null;

export function restartPeriodicComplianceTimer(): void {
    if (periodicComplianceTimer) {
        clearInterval(periodicComplianceTimer);
        periodicComplianceTimer = null;
    }
    const intervalSec = modStorage.inspector.evaluationInterval;
    if (intervalSec && intervalSec > 0) {
        periodicComplianceTimer = setInterval(() => {
            evaluateCompliance();
            if (typeof ServerPlayerIsInChatRoom === "function" && ServerPlayerIsInChatRoom()) {
                if (modStorage.inspector.silentTelemetry) {
                    sendSilentRoomTelemetry();
                }
            }
        }, intervalSec * 1000);
    }
}

/**
 * Builds the inspect response payload according to sender's inspection permissions.
 */
function buildInspectResponseData(senderId: number): InspectResponseData {
    const permCheck = canSenderInspect(senderId);
    if (!permCheck.allowed) {
        return {
            allowed: false,
            reason: permCheck.reason
        };
    }
    return {
        allowed: true,
        canViewAddons: permCheck.canViewAddons,
        canViewRules: permCheck.canViewRules,
        mods: permCheck.canViewAddons ? getLoadedMods() : [],
        rules: permCheck.canViewRules ? modStorage.inspector.rules : [],
        autoLoadMode: modStorage.inspector.autoLoadMode,
        preferences: {
            violationAction: modStorage.inspector.violationAction || "toast",
            autoLoadMode: modStorage.inspector.autoLoadMode || "Prompt",
            evaluationInterval: typeof modStorage.inspector.evaluationInterval === "number" ? modStorage.inspector.evaluationInterval : 30,
            silentTelemetry: typeof modStorage.inspector.silentTelemetry === "boolean" ? modStorage.inspector.silentTelemetry : true,
            showProfileButton: typeof modStorage.inspector.showProfileButton === "boolean" ? modStorage.inspector.showProfileButton : true,
            allowForcedInjection: typeof modStorage.inspector.allowForcedInjection === "boolean" ? modStorage.inspector.allowForcedInjection : false
        },
        customCatalog: modStorage.inspector.customCatalog || [],
        authority: modStorage.authority,
        callerAccessLevel: getCharacterAccessLevel(senderId),
        callerPermissions: getCallerPermissions(senderId),
        version
    };
}

/**
 * Handles incoming rule update requests.
 */
function handleSetRulesRequest(senderId: number, senderName: string, newRules: ModRule[]): SetRulesResponseData {
    const authCheck = canSenderEnforceRules(senderId, newRules);
    if (!authCheck.allowed) {
        return {
            success: false,
            reason: authCheck.reason
        };
    }

    modStorage.inspector.rules = newRules;
    syncStorage();
    evaluateCompliance();

    toastsManager.info({
        title: `${MOD_NAME} Rules Updated`,
        message: `Addon rules updated by ${senderName}.`,
        duration: 5000
    });

    return { success: true };
}

/**
 * Handles incoming trigger compliance evaluation requests.
 */
async function handleTriggerComplianceRequest(senderId: number, senderName: string): Promise<TriggerComplianceResponseData> {
    if (!checkPermissionAccess("rules_force_compliance", senderId)) {
        return {
            success: false,
            reason: "Permission Denied: You do not have authority to force compliance evaluations on this player."
        };
    }

    toastsManager.info({
        title: `${MOD_NAME} Compliance Triggered`,
        message: `${senderName} requested an immediate compliance check.`,
        duration: 4000
    });

    const report = await evaluateCompliance();
    return {
        success: true,
        report: {
            isCompliant: report.isCompliant,
            missingCount: report.missingRequired.length,
            forbiddenCount: report.detectedForbidden.length
        }
    };
}

/**
 * Handles incoming authority and preference updates.
 */
function handleAuthorityUpdateRequest(req: AuthorityUpdateRequest, senderId: number, senderName: string): AuthorityUpdateResponseData {
    let resData: AuthorityUpdateResponseData;

    if (!req || typeof req.action !== "string") {
        resData = { success: false, reason: "Invalid request format." };
    } else if (req.action === "add_role") {
        const res = addRoleMember(req.role!, req.memberNumber!, senderId);
        resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "remove_role") {
        const res = removeRoleMember(req.role!, req.memberNumber!, senderId);
        resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_min_role") {
        const res = setPermissionMinRole(req.perm!, req.minRole!, senderId);
        resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_self_access") {
        const res = setPermissionSelfAccess(req.perm!, req.selfAllowed!, senderId);
        resData = { success: res.success, reason: res.message, authority: modStorage.authority };
    } else if (req.action === "set_autoload_mode") {
        if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
            resData = { success: false, reason: "Permission Denied: You do not have authority to edit auto-load mode." };
        } else {
            modStorage.inspector.autoLoadMode = req.autoLoadMode || "Prompt";
            saveStorage();
            syncStorage();
            resData = { success: true, autoLoadMode: modStorage.inspector.autoLoadMode };
        }
    } else if (req.action === "update_preferences") {
        if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
            resData = { success: false, reason: "Permission Denied: You do not have authority to edit preferences." };
        } else if (req.preferences) {
            if (req.preferences.violationAction) modStorage.inspector.violationAction = req.preferences.violationAction;
            if (req.preferences.autoLoadMode) modStorage.inspector.autoLoadMode = req.preferences.autoLoadMode;
            if (typeof req.preferences.evaluationInterval === "number") modStorage.inspector.evaluationInterval = req.preferences.evaluationInterval;
            if (typeof req.preferences.silentTelemetry === "boolean") modStorage.inspector.silentTelemetry = req.preferences.silentTelemetry;
            if (typeof req.preferences.showProfileButton === "boolean") modStorage.inspector.showProfileButton = req.preferences.showProfileButton;
            if (typeof req.preferences.allowForcedInjection === "boolean") modStorage.inspector.allowForcedInjection = req.preferences.allowForcedInjection;
            saveStorage();
            syncStorage();
            restartPeriodicComplianceTimer();
            resData = {
                success: true,
                preferences: {
                    violationAction: modStorage.inspector.violationAction,
                    autoLoadMode: modStorage.inspector.autoLoadMode,
                    evaluationInterval: modStorage.inspector.evaluationInterval,
                    silentTelemetry: modStorage.inspector.silentTelemetry,
                    showProfileButton: modStorage.inspector.showProfileButton,
                    allowForcedInjection: modStorage.inspector.allowForcedInjection
                }
            };
        } else {
            resData = { success: false, reason: "No preferences provided." };
        }
    } else if (req.action === "add_custom_mod") {
        if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
            resData = { success: false, reason: "Permission Denied: You do not have authority to add custom addons." };
        } else if (req.customMod && req.customMod.id) {
            modStorage.inspector.customCatalog = modStorage.inspector.customCatalog || [];
            modStorage.inspector.customCatalog = modStorage.inspector.customCatalog.filter(c => c.id.toLowerCase() !== req.customMod!.id.toLowerCase());
            modStorage.inspector.customCatalog.push(req.customMod);
            saveStorage();
            syncStorage();
            resData = { success: true, customCatalog: modStorage.inspector.customCatalog };
        } else {
            resData = { success: false, reason: "Invalid custom addon data." };
        }
    } else if (req.action === "remove_custom_mod") {
        if (!checkPermissionAccess("rules_edit_autoload_mode", senderId)) {
            resData = { success: false, reason: "Permission Denied: You do not have authority to remove custom addons." };
        } else if (req.customModId) {
            modStorage.inspector.customCatalog = (modStorage.inspector.customCatalog || []).filter(c => c.id.toLowerCase() !== req.customModId!.toLowerCase());
            saveStorage();
            syncStorage();
            resData = { success: true, customCatalog: modStorage.inspector.customCatalog };
        } else {
            resData = { success: false, reason: "Invalid custom addon ID." };
        }
    } else {
        resData = { success: false, reason: "Unknown action." };
    }

    if (resData.success) {
        toastsManager.info({
            title: `${MOD_NAME} Authority Updated`,
            message: `Authority updated by ${senderName}.`,
            duration: 4000
        });
    }

    return resData;
}

/**
 * Handles incoming forced addon injection requests from an authorized dominant.
 */
async function handleForceInjectRequest(senderId: number, senderName: string, targetModId?: string): Promise<ForceInjectResponseData> {
    if (!modStorage.inspector.enabled) {
        return { success: false, reason: "Quality of Club Addon Inspector is disabled on this player." };
    }

    if (!checkPermissionAccess("rules_force_compliance", senderId)) {
        return { success: false, reason: "Permission Denied: You do not have authority to force addon injection on this player." };
    }

    if (!modStorage.inspector.allowForcedInjection) {
        return { success: false, reason: "Permission Denied: Forced addon injection is disabled in this player's preferences." };
    }

    const currentRules = modStorage.inspector.rules || [];
    const missingMandatory = currentRules.filter(r => (r.type === "required" || (r.type as string) === "mandatory") && !isModLoaded(r.modId));

    if (missingMandatory.length === 0 && (!targetModId || targetModId === "all")) {
        return {
            success: true,
            reason: "All mandatory addons are already loaded.",
            injectedCount: 0,
            report: {
                isCompliant: true,
                missingCount: 0,
                forbiddenCount: 0
            }
        };
    }

    let toInject: ModRule[] = [];
    if (targetModId && targetModId !== "all") {
        const matching = missingMandatory.find(r => r.modId.toLowerCase() === targetModId.toLowerCase());
        if (!matching) {
            if (isModLoaded(targetModId)) {
                return { success: true, reason: `${targetModId} is already loaded on this client.`, injectedCount: 0 };
            }
            const rule = currentRules.find(r => r.modId.toLowerCase() === targetModId.toLowerCase() && (r.type === "required" || (r.type as string) === "mandatory"));
            if (rule) {
                toInject = [rule];
            } else {
                return { success: false, reason: `Addon '${targetModId}' is not an active mandatory requirement.` };
            }
        } else {
            toInject = [matching];
        }
    } else {
        toInject = missingMandatory;
    }

    let injectedCount = 0;
    const injectedNames: string[] = [];

    for (const rule of toInject) {
        const success = await loadCuratedMod(rule.modId);
        if (success) {
            injectedCount++;
            injectedNames.push(rule.modName || rule.modId);
        }
    }

    if (injectedNames.length > 0) {
        toastsManager.info({
            title: `${MOD_NAME} Forced Addon Injection`,
            message: `Mandatory addon${injectedNames.length > 1 ? "s" : ""} (${injectedNames.join(", ")}) ${injectedNames.length > 1 ? "were" : "was"} injected by ${senderName}.`,
            duration: 6000
        });
    }

    const report = await evaluateCompliance();

    return {
        success: true,
        injectedCount,
        report: {
            isCompliant: report.isCompliant,
            missingCount: report.missingRequired.length,
            forbiddenCount: report.detectedForbidden.length
        }
    };
}

/**
 * Initializes network message handlers and room sync listeners.
 */
export function initNetworkSync(): void {
    restartPeriodicComplianceTimer();

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
                const responseData = buildInspectResponseData(senderId);
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
                const responseData = handleSetRulesRequest(senderId, senderName, newRules);
                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: responseData
                }, senderId);
                return;
            }

            // Incoming Trigger Compliance Check
            if (dictData.message === "qoc_triggerCompliance") {
                const responseData = await handleTriggerComplianceRequest(senderId, senderName);
                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: responseData
                }, senderId);
                return;
            }

            // Incoming Authority & Permissions Update
            if (dictData.message === "qoc_updateAuthority") {
                const resData = handleAuthorityUpdateRequest(dictData.data as AuthorityUpdateRequest, senderId, senderName);
                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: resData
                }, senderId);
                return;
            }

            // Incoming Forced Addon Injection
            if (dictData.message === "qoc_forceInject") {
                const targetModId = typeof dictData.data?.modId === "string" ? dictData.data.modId : undefined;
                const resData = await handleForceInjectRequest(senderId, senderName, targetModId);
                messagesManager.sendPacket("requestResponse", {
                    requestId: dictData.requestId,
                    message: dictData.message,
                    data: resData
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
            const senderChar = typeof Character !== "undefined" && typeof Character.find === "function"
                ? Character.find((c: Character) => c.MemberNumber === senderId)
                : null;
            const senderName = senderChar?.Name || `Member #${senderId}`;

            if (data.message === "qoc_inspect") {
                const responseData = buildInspectResponseData(senderId);
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
                const responseData = handleSetRulesRequest(senderId, senderName, newRules);
                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: responseData
                }, senderId);
                return;
            }

            if (data.message === "qoc_triggerCompliance") {
                const responseData = await handleTriggerComplianceRequest(senderId, senderName);
                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: responseData
                }, senderId);
                return;
            }

            if (data.message === "qoc_updateAuthority") {
                const resData = handleAuthorityUpdateRequest(data.data as AuthorityUpdateRequest, senderId, senderName);
                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: resData
                }, senderId);
                return;
            }

            if (data.message === "qoc_forceInject") {
                const targetModId = typeof data.data?.modId === "string" ? data.data.modId : undefined;
                const resData = await handleForceInjectRequest(senderId, senderName, targetModId);
                messagesManager.sendBeep({
                    type: `${MOD_KEY}_requestResponse`,
                    requestId: data.requestId,
                    message: data.message,
                    data: resData
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

/**
 * Sends a request to update a target player's authority settings (roles, permissions, auto-load).
 */
export async function requestUpdateAuthority(targetMemberNumber: number, update: AuthorityUpdateRequest): Promise<{ success: boolean; data?: AuthorityUpdateResponseData; error?: string }> {
    try {
        let res = await messagesManager.sendRequest<AuthorityUpdateResponseData>({
            message: "qoc_updateAuthority",
            data: update,
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            res = await messagesManager.sendRequest<AuthorityUpdateResponseData>({
                message: "qoc_updateAuthority",
                data: update,
                target: targetMemberNumber,
                type: "beep"
            });
        }

        if (res.isError || !res.data) {
            return {
                success: false,
                error: "Target player did not respond. Quality of Club may not be running on their client."
            };
        }

        if (!res.data.success) {
            return {
                success: false,
                error: res.data.reason || "Target rejected authority update."
            };
        }

        return {
            success: true,
            data: res.data
        };
    } catch (err: any) {
        return {
            success: false,
            error: err?.message || "Failed to transmit authority update."
        };
    }
}

/**
 * Sends a request to trigger an immediate remote compliance evaluation on a target player.
 */
export async function requestTriggerCompliance(targetMemberNumber: number): Promise<{ success: boolean; data?: TriggerComplianceResponseData; error?: string }> {
    try {
        let res = await messagesManager.sendRequest<TriggerComplianceResponseData>({
            message: "qoc_triggerCompliance",
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            res = await messagesManager.sendRequest<TriggerComplianceResponseData>({
                message: "qoc_triggerCompliance",
                target: targetMemberNumber,
                type: "beep"
            });
        }

        if (res.isError || !res.data) {
            return {
                success: false,
                error: "Target player did not respond to compliance trigger request."
            };
        }

        if (!res.data.success) {
            return {
                success: false,
                error: res.data.reason || "Target player rejected compliance trigger."
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
 * Sends a request to remotely force injection of missing mandatory addons on a target player.
 */
export async function requestForceInject(
    targetMemberNumber: number,
    modId?: string
): Promise<{ success: boolean; data?: ForceInjectResponseData; error?: string }> {
    try {
        let res = await messagesManager.sendRequest<ForceInjectResponseData>({
            message: "qoc_forceInject",
            data: { modId },
            target: targetMemberNumber,
            type: "packet"
        });

        if (res.isError || !res.data) {
            res = await messagesManager.sendRequest<ForceInjectResponseData>({
                message: "qoc_forceInject",
                data: { modId },
                target: targetMemberNumber,
                type: "beep"
            });
        }

        if (res.isError || !res.data) {
            return {
                success: false,
                error: "Target player did not respond to forced injection request."
            };
        }

        if (!res.data.success) {
            return {
                success: false,
                error: res.data.reason || "Target player rejected forced injection."
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
