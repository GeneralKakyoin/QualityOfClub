import "reflect-metadata";
import { bootstrap } from "zois-core";
import { toastsManager } from "zois-core/toasts";
import { logger } from "zois-core/logging";
import { version } from "../package.json";
import { MOD_KEY, MOD_NAME, MOD_FULL_NAME, MOD_REPOSITORY } from "./constants";
import { MainSubscreen } from "./subscreens/mainSubscreen";
import { InspectorSubscreen } from "./subscreens/inspectorSubscreen";
import { loadStorage } from "./modules/storage";
import { loadSettingsMenu } from "./modules/settingsMenu";
import { initChatResizer, applyChatDimensions } from "./modules/chatResizer";
import { initNetworkSync } from "./modules/networkSync";
import { initProfileButton } from "./modules/profileButton";
import { evaluateCompliance } from "./modules/compliance";

let hasInitialized = false;

export function initializeQoC(): void {
    if (hasInitialized) return;
    hasInitialized = true;

    try {
        loadStorage();
        loadSettingsMenu();
        initChatResizer();
        initNetworkSync();
        initProfileButton();
        evaluateCompliance();

        console.log(`%c[${MOD_NAME}] v${version} loaded successfully!`, "color: #3a7bd5; font-weight: bold; font-size: 13px;");

        try {
            toastsManager.success({
                title: `${MOD_NAME} Loaded`,
                message: `v${version} ready`,
                duration: 4000
            });
        } catch (_) {}

        if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
            applyChatDimensions();
        }
    } catch (err) {
        console.error(`[${MOD_NAME}] Initialization error:`, err);
    }
}

import { ChatResizerSubscreen } from "./subscreens/chatResizerSubscreen";
import { AddonPolicySubscreen } from "./subscreens/addonPolicySubscreen";

// Bootstrap with zois-core
bootstrap({
    name: MOD_KEY,
    fullName: MOD_FULL_NAME,
    key: MOD_KEY,
    version,
    repository: MOD_REPOSITORY,
    subscreens: {
        MainSubscreen,
        ChatResizerSubscreen,
        AddonPolicySubscreen,
        InspectorSubscreen
    },
    onReady: initializeQoC
});


// Run immediately if already logged in or game is loaded
if (typeof ServerIsLoggedIn === "function" && ServerIsLoggedIn()) {
    setTimeout(initializeQoC, 500);
}
