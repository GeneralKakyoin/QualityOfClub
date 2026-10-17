import { BaseSubscreen, getRelativeX, getRelativeY, getRelativeWidth, setSubscreen } from "zois-core/ui";
import { modStorage, saveStorage } from "modules/storage";
import { applyChatDimensions, setSplitPercent } from "modules/chatResizer";
import { MOD_NAME, MOD_VERSION, DEFAULT_SPLIT_PERCENT, MIN_SPLIT_PERCENT, MAX_SPLIT_PERCENT } from "src/constants";

export class MainSubscreen extends BaseSubscreen {
    private sliderContainer: HTMLDivElement | null = null;
    private sliderInput: HTMLInputElement | null = null;
    private sliderValueLabel: HTMLSpanElement | null = null;

    public get name(): string {
        return `${MOD_NAME} (v${MOD_VERSION})`;
    }

    public onLoad(): void {
        this.createTabs({
            x: 100,
            y: 130,
            width: 1800,
            currentTabName: "Interface",
            tabs: [
                {
                    name: "Interface",
                    load: () => this.loadInterfaceTab(),
                    unload: () => this.unloadInterfaceTab()
                }
            ]
        });
    }

    protected onExit(): void {
        this.unloadInterfaceTab();
        setSubscreen(null);
        if (typeof PreferenceSubscreenExtensionsClear === "function") {
            try {
                PreferenceSubscreenExtensionsClear();
            } catch (e) {
                console.warn("[QoC] Error clearing extension screen", e);
            }
        } else if (typeof PreferenceOpenSubscreen === "function") {
            PreferenceOpenSubscreen("Extensions");
        }
    }

    private loadInterfaceTab(): void {
        // 1. Enable Chat Resizer Checkbox
        this.createCheckbox({
            x: 120,
            y: 220,
            width: 800,
            height: 45,
            text: "Enable Chat Window Resizer",
            isChecked: modStorage.chatResizer.enabled,
            tooltip: {
                position: "right",
                text: "Shrinks chat width to give more room for avatars and room graphics."
            },
            onChange: () => {
                modStorage.chatResizer.enabled = !modStorage.chatResizer.enabled;
                saveStorage();
                applyChatDimensions();
            }
        });

        // 2. Show In-Game Draggable Divider Checkbox
        this.createCheckbox({
            x: 120,
            y: 280,
            width: 800,
            height: 45,
            text: "Show Draggable Divider in Chatrooms",
            isChecked: modStorage.chatResizer.showDivider,
            tooltip: {
                position: "right",
                text: "Shows an interactive vertical line between the canvas and chat to drag-resize directly."
            },
            onChange: () => {
                modStorage.chatResizer.showDivider = !modStorage.chatResizer.showDivider;
                saveStorage();
                applyChatDimensions();
            }
        });

        // 3. Proportions Section Header
        this.createText({
            x: 120,
            y: 355,
            fontSize: 4,
            text: "Graphic View Size Proportions"
        });

        // 4. Custom Slider Container
        this.createSliderControl(120, 400);

        // 5. Presets Label
        this.createText({
            x: 120,
            y: 500,
            fontSize: 3.5,
            text: "Quick Presets:"
        });

        // 6. Preset Buttons
        const presets = [
            { label: "50% (Default)", val: 50 },
            { label: "60% Graphic", val: 60 },
            { label: "65% Graphic", val: 65 },
            { label: "70% Graphic", val: 70 },
            { label: "75% Graphic", val: 75 },
            { label: "80% Graphic", val: 80 }
        ];

        presets.forEach((preset, idx) => {
            const btn = this.createButton({
                x: 120 + (idx % 3) * 280,
                y: 545 + Math.floor(idx / 3) * 65,
                width: 260,
                height: 52,
                text: preset.label,
                onClick: () => {
                    this.updateSliderValue(preset.val);
                }
            });
            btn.style.fontWeight = "bold";
        });

        // 7. Informational Hint
        const hint = this.createText({
            x: 120,
            y: 720,
            fontSize: 3,
            text: "Tip: In any chatroom, drag the vertical line between the canvas and chat to resize live! Double-click the line to reset to 50/50."
        });
        hint.style.color = "#777";
    }

    private unloadInterfaceTab(): void {
        if (this.sliderContainer) {
            this.sliderContainer.remove();
            this.sliderContainer = null;
        }
        this.sliderInput = null;
        this.sliderValueLabel = null;
    }

    private createSliderControl(x: number, y: number): void {
        if (this.sliderContainer) {
            this.sliderContainer.remove();
        }

        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            left: `${getRelativeX(x)}px`,
            top: `${getRelativeY(y)}px`,
            width: `${getRelativeWidth(800)}px`,
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: "10"
        });

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = `${MIN_SPLIT_PERCENT}`;
        slider.max = `${MAX_SPLIT_PERCENT}`;
        slider.value = `${modStorage.chatResizer.splitPercent}`;
        Object.assign(slider.style, {
            flex: "1",
            cursor: "pointer",
            height: "8px",
            accentColor: "#3a7bd5"
        });

        const label = document.createElement("span");
        label.textContent = `${slider.value}% Graphic / ${100 - Number(slider.value)}% Chat`;
        Object.assign(label.style, {
            minWidth: "220px",
            fontWeight: "bold",
            fontSize: "calc(2.5px * var(--size-unit, 4px))",
            color: "var(--tmd-text, black)"
        });

        slider.addEventListener("input", () => {
            const val = Number(slider.value);
            label.textContent = `${val}% Graphic / ${100 - val}% Chat`;
            setSplitPercent(val);
        });

        container.appendChild(slider);
        container.appendChild(label);
        document.body.appendChild(container);

        this.sliderContainer = container;
        this.sliderInput = slider;
        this.sliderValueLabel = label;
    }

    private updateSliderValue(val: number): void {
        setSplitPercent(val);
        if (this.sliderInput) {
            this.sliderInput.value = `${val}`;
        }
        if (this.sliderValueLabel) {
            this.sliderValueLabel.textContent = `${val}% Graphic / ${100 - val}% Chat`;
        }
    }
}
