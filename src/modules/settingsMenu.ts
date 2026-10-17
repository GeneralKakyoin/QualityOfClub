import { MainSubscreen } from "subscreens/mainSubscreen";
import { getCurrentSubscreen, setSubscreen } from "zois-core/ui";
import { createElement, Sliders } from "lucide";
import { MOD_KEY, MOD_NAME } from "src/constants";

export function loadSettingsMenu(): void {
    PreferenceRegisterExtensionSetting({
        Identifier: MOD_KEY,
        ButtonText: MOD_NAME,
        Image: () => {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(createElement(Sliders));
            return "data:image/svg+xml," + encodeURIComponent(svgString);
        },
        click: () => {
            getCurrentSubscreen()?.click();
        },
        run: () => {
            getCurrentSubscreen()?.run();
        },
        resize: () => {
            getCurrentSubscreen()?.resize();
        },
        exit: () => {
            const current = getCurrentSubscreen();
            if (current) {
                current.exit();
            }
            return true;
        },
        load: () => {
            setSubscreen(new MainSubscreen());
        },
        unload: () => {
            const current = getCurrentSubscreen();
            if (current) {
                setSubscreen(null);
            }
        }
    });
}
