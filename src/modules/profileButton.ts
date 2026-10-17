import { hookFunction, HookPriority } from "zois-core/mod-sdk";
import { getCurrentSubscreen, setSubscreen } from "zois-core/ui";
import { createElement, ShieldCheck } from "lucide";
import { PROFILE_BUTTON_POSITION, MOD_NAME } from "src/constants";
import { InspectorSubscreen } from "subscreens/inspectorSubscreen";
import { modStorage } from "./storage";

let shieldIconDataUrl: string | null = null;

function getIconDataUrl(): string {
    if (!shieldIconDataUrl) {
        const svg = createElement(ShieldCheck);
        svg.setAttribute("stroke", "#1976d2");
        svg.setAttribute("fill", "#e3f2fd");
        svg.setAttribute("width", "64");
        svg.setAttribute("height", "64");
        const serializer = new XMLSerializer();
        shieldIconDataUrl = "data:image/svg+xml," + encodeURIComponent(serializer.serializeToString(svg));
    }
    return shieldIconDataUrl;
}

/**
 * Checks whether the profile button can be drawn on InformationSheet.
 */
function canDrawProfileButton(): boolean {
    if (!modStorage.inspector.showProfileButton) {
        return false;
    }
    if (typeof InformationSheetSelection === "undefined" || !InformationSheetSelection) {
        return false;
    }

    const win = window as any;

    // Don't draw if another mod's full subscreen/remote window is open
    if (win.bcx?.inBcxSubscreen && win.bcx.inBcxSubscreen()) return false;
    if (win.LSCG_REMOTE_WINDOW_OPEN) return false;
    if (win.LITTLISH_CLUB?.inModSubscreen && win.LITTLISH_CLUB.inModSubscreen()) return false;
    if (win.MPA?.menuLoaded) return false;

    // Don't draw if a zois-core subscreen is currently active
    if (getCurrentSubscreen() !== null) return false;

    return true;
}

/**
 * Initializes hooks for InformationSheet to render the QoC Addon Inspector button
 * directly under LSCG's button.
 */
export function initProfileButton(): void {
    hookFunction("InformationSheetRun", HookPriority.TOP, (args, next) => {
        if (canDrawProfileButton()) {
            DrawButton(
                ...PROFILE_BUTTON_POSITION,
                "",
                "White",
                getIconDataUrl(),
                `${MOD_NAME} - Addon Inspector`
            );
        }

        const subscreen = getCurrentSubscreen();
        if (subscreen instanceof InspectorSubscreen) {
            return subscreen.run();
        }

        return next(args);
    });

    hookFunction("InformationSheetClick", HookPriority.OBSERVE, (args, next) => {
        if (canDrawProfileButton() && MouseIn(...PROFILE_BUTTON_POSITION)) {
            const target = InformationSheetSelection;
            if (typeof InformationSheetUnload === "function") {
                InformationSheetUnload();
            }
            setSubscreen(new InspectorSubscreen(target));
            return;
        }

        const subscreen = getCurrentSubscreen();
        if (subscreen instanceof InspectorSubscreen) {
            return subscreen.click();
        }

        return next(args);
    });

    hookFunction("InformationSheetExit", HookPriority.OBSERVE, (args, next) => {
        const subscreen = getCurrentSubscreen();
        if (subscreen instanceof InspectorSubscreen) {
            return subscreen.exit();
        }

        return next(args);
    });
}
