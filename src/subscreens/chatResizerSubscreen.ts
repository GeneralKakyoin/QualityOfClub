import { BaseSubscreen, setSubscreen } from "zois-core/ui";
import { modStorage, saveStorage } from "modules/storage";
import { applyChatDimensions, setSplitPercent } from "modules/chatResizer";
import { DEFAULT_SPLIT_PERCENT, MIN_SPLIT_PERCENT, MAX_SPLIT_PERCENT } from "src/constants";
import { MainSubscreen } from "./mainSubscreen";

export class ChatResizerSubscreen extends BaseSubscreen {
    private rootElement: HTMLElement | null = null;
    private sliderInput: HTMLInputElement | null = null;
    private sliderValueLabel: HTMLSpanElement | null = null;

    public override get name(): string {
        return "";
    }

    protected override onRun(): void {
        DrawRect(0, 0, 2000, 1000, "#191f2b");
    }

    public override onLoad(): void {
        this.createUI();
    }

    public override exit(): void {
        this.cleanup();
        setSubscreen(new MainSubscreen());
    }

    protected override onUnload(): void {
        this.cleanup();
    }

    protected override onExit(): void {
        this.cleanup();
    }

    private cleanup(): void {
        if (this.rootElement) {
            this.rootElement.remove();
            this.rootElement = null;
        }
        this.sliderInput = null;
        this.sliderValueLabel = null;
    }

    private createUI(): void {
        this.cleanup();

        // 1. Full-screen solid backdrop
        const backdrop = document.createElement("div");
        backdrop.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #191f2b;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            color: #e0e6ed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            user-select: none;
        `;

        // 2. Container
        const container = document.createElement("div");
        container.style.cssText = `
            width: min(92vw, 1200px);
            height: min(90vh, 850px);
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-sizing: border-box;
        `;

        // 3. Header
        const header = document.createElement("div");
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(80, 100, 140, 0.35);
        `;

        const titleBox = document.createElement("div");
        titleBox.innerHTML = `
            <div style="font-size: 24px; font-weight: bold; color: #64b5f6; letter-spacing: 0.5px;">
                📐 Chat Window Resizer Settings
            </div>
            <div style="font-size: 13px; color: #90a4ae; margin-top: 4px;">
                Adjust the balance between character graphics and the chatroom message log.
            </div>
        `;

        const backBtn = document.createElement("button");
        backBtn.textContent = "✕ Back to Menu";
        backBtn.style.cssText = `
            padding: 10px 24px;
            background: rgba(220, 50, 50, 0.85);
            border: 1px solid #ef5350;
            color: white;
            font-size: 15px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s ease;
        `;
        backBtn.addEventListener("mouseover", () => { backBtn.style.background = "#d32f2f"; });
        backBtn.addEventListener("mouseout", () => { backBtn.style.background = "rgba(220, 50, 50, 0.85)"; });
        backBtn.addEventListener("click", () => this.exit());

        header.appendChild(titleBox);
        header.appendChild(backBtn);
        container.appendChild(header);

        // 4. Content Body
        const body = document.createElement("div");
        body.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-right: 6px;
            box-sizing: border-box;
        `;

        // Card 1: Features & Toggles
        const togglesCard = this.createCardElement("⚙️ Feature Toggles");
        const toggles = [
            {
                title: "Enable Chat Window Resizer",
                desc: "Activates custom chat dimensions. When off, Bondage Club uses default 50/50 sizing.",
                checked: modStorage.chatResizer.enabled,
                toggle: () => {
                    modStorage.chatResizer.enabled = !modStorage.chatResizer.enabled;
                    saveStorage();
                    applyChatDimensions();
                    this.createUI();
                }
            },
            {
                title: "Show Draggable Divider in Chatrooms",
                desc: "Draws an interactive vertical separator bar in chatrooms allowing live drag-and-drop resizing.",
                checked: modStorage.chatResizer.showDivider,
                toggle: () => {
                    modStorage.chatResizer.showDivider = !modStorage.chatResizer.showDivider;
                    saveStorage();
                    applyChatDimensions();
                    this.createUI();
                }
            }
        ];

        toggles.forEach(t => {
            togglesCard.appendChild(this.createToggleRow(t.title, t.desc, t.checked, t.toggle));
        });
        body.appendChild(togglesCard);

        // Card 2: Proportions Slider
        const sliderCard = this.createCardElement("📏 Screen Size Proportion", "Drag the slider to adjust how much screen space is allocated to graphics vs chat:");
        const currentPercent = modStorage.chatResizer.splitPercent || DEFAULT_SPLIT_PERCENT;

        const sliderContainer = document.createElement("div");
        sliderContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 20px;
            margin-top: 14px;
            padding: 8px 0;
        `;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = `${MIN_SPLIT_PERCENT}`;
        slider.max = `${MAX_SPLIT_PERCENT}`;
        slider.value = `${currentPercent}`;
        slider.style.cssText = `
            flex: 1;
            height: 10px;
            cursor: pointer;
            accent-color: #2196f3;
            border-radius: 5px;
        `;

        const label = document.createElement("div");
        label.style.cssText = `
            min-width: 240px;
            font-size: 16px;
            font-weight: bold;
            color: #64b5f6;
            text-align: right;
            padding-right: 8px;
        `;
        label.textContent = `${currentPercent}% Graphic / ${100 - currentPercent}% Chat`;

        slider.addEventListener("input", () => {
            const val = Number(slider.value);
            label.textContent = `${val}% Graphic / ${100 - val}% Chat`;
            setSplitPercent(val);
            this.highlightActivePreset(val);
        });

        this.sliderInput = slider;
        this.sliderValueLabel = label;

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(label);
        sliderCard.appendChild(sliderContainer);
        body.appendChild(sliderCard);

        // Card 3: Quick Presets
        const presetsCard = this.createCardElement("⚡ Quick Presets", "Click a preset to instantly apply proportions:");
        const presetsGrid = document.createElement("div");
        presetsGrid.id = "qoc-presets-grid";
        presetsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 10px;
        `;

        const presets = [
            { label: "50% (Default)", val: 50 },
            { label: "60% Graphic / 40% Chat", val: 60 },
            { label: "65% Graphic / 35% Chat", val: 65 },
            { label: "70% Graphic / 30% Chat", val: 70 },
            { label: "75% Graphic / 25% Chat", val: 75 },
            { label: "80% Graphic / 20% Chat", val: 80 }
        ];

        presets.forEach(p => {
            const isMatch = currentPercent === p.val;
            const btn = document.createElement("button");
            btn.dataset.val = `${p.val}`;
            btn.style.cssText = `
                padding: 14px 18px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                background: ${isMatch ? "rgba(25, 118, 210, 0.4)" : "rgba(35, 45, 60, 0.6)"};
                border: 1px solid ${isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.35)"};
                color: ${isMatch ? "#64b5f6" : "#e0e6ed"};
                transition: all 0.15s ease;
            `;
            btn.textContent = p.label;
            btn.addEventListener("click", () => {
                this.updateSliderValue(p.val);
            });
            presetsGrid.appendChild(btn);
        });
        presetsCard.appendChild(presetsGrid);
        body.appendChild(presetsCard);

        // Footer Tip
        const tip = document.createElement("div");
        tip.style.cssText = `
            font-size: 12px;
            color: #8fa0b5;
            text-align: center;
            padding: 8px 0;
        `;
        tip.innerHTML = `💡 <b>Tip:</b> When enabled, drag the vertical line between the canvas and chat to resize live! <b>Double-click</b> the line to reset to 50/50.`;
        body.appendChild(tip);

        container.appendChild(body);
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);

        this.rootElement = backdrop;
    }

    private updateSliderValue(val: number): void {
        setSplitPercent(val);
        if (this.sliderInput) {
            this.sliderInput.value = `${val}`;
        }
        if (this.sliderValueLabel) {
            this.sliderValueLabel.textContent = `${val}% Graphic / ${100 - val}% Chat`;
        }
        this.highlightActivePreset(val);
    }

    private highlightActivePreset(val: number): void {
        const grid = document.getElementById("qoc-presets-grid");
        if (!grid) return;
        const buttons = grid.querySelectorAll("button");
        buttons.forEach(btn => {
            const btnVal = Number(btn.dataset.val);
            const isMatch = btnVal === val;
            btn.style.background = isMatch ? "rgba(25, 118, 210, 0.4)" : "rgba(35, 45, 60, 0.6)";
            btn.style.borderColor = isMatch ? "#42a5f5" : "rgba(80, 100, 140, 0.35)";
            btn.style.color = isMatch ? "#64b5f6" : "#e0e6ed";
        });
    }

    private createCardElement(title: string, subtitle?: string): HTMLElement {
        const card = document.createElement("div");
        card.style.cssText = `
            background: rgba(30, 36, 48, 0.85);
            border: 1px solid rgba(80, 100, 140, 0.35);
            border-radius: 8px;
            padding: 16px 20px;
            box-sizing: border-box;
        `;
        let headerHtml = `<div style="font-size: 16px; font-weight: bold; color: #64b5f6;">${title}</div>`;
        if (subtitle) {
            headerHtml += `<div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${subtitle}</div>`;
        }
        card.innerHTML = headerHtml;
        return card;
    }

    private createToggleRow(title: string, desc: string, isChecked: boolean, onToggle: () => void): HTMLElement {
        const row = document.createElement("div");
        row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(80, 100, 140, 0.2);
            cursor: pointer;
        `;
        row.addEventListener("click", onToggle);

        const textBox = document.createElement("div");
        textBox.style.cssText = "padding-right: 16px;";
        textBox.innerHTML = `
            <div style="font-size: 15px; font-weight: 600; color: #e0e6ed;">${title}</div>
            <div style="font-size: 12px; color: #90a4ae; margin-top: 3px;">${desc}</div>
        `;

        const switchEl = document.createElement("div");
        switchEl.style.cssText = `
            width: 48px;
            height: 26px;
            background: ${isChecked ? "#1976d2" : "rgba(60, 70, 90, 0.7)"};
            border-radius: 13px;
            position: relative;
            flex-shrink: 0;
            transition: background 0.2s ease;
            border: 1px solid ${isChecked ? "#42a5f5" : "rgba(80, 100, 140, 0.4)"};
        `;

        const knob = document.createElement("div");
        knob.style.cssText = `
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: ${isChecked ? "24px" : "3px"};
            transition: left 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        `;
        switchEl.appendChild(knob);

        row.appendChild(textBox);
        row.appendChild(switchEl);
        return row;
    }
}
