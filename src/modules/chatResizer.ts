import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_SPLIT_PERCENT, MIN_SPLIT_PERCENT, MAX_SPLIT_PERCENT } from "src/constants";
import { modStorage, saveStorage } from "./storage";
import { hookFunction, HookPriority } from "zois-core/mod-sdk";

let dividerElement: HTMLDivElement | null = null;
let isDragging = false;

/**
 * Returns the currently configured graphic view width in canvas units (1000 to 1600).
 */
export function getGraphicWidth(): number {
    if (!modStorage.chatResizer.enabled) return 1000;
    const pct = Math.max(MIN_SPLIT_PERCENT, Math.min(MAX_SPLIT_PERCENT, modStorage.chatResizer.splitPercent));
    return Math.round((pct / 100) * CANVAS_WIDTH);
}

/**
 * Sets the split percentage and applies the new dimensions immediately.
 */
export function setSplitPercent(percent: number): void {
    const clamped = Math.max(MIN_SPLIT_PERCENT, Math.min(MAX_SPLIT_PERCENT, Math.round(percent)));
    modStorage.chatResizer.splitPercent = clamped;
    saveStorage();
    applyChatDimensions();
}

/**
 * Updates ChatRoomDivRect and triggers BC's native element positioning.
 */
export function applyChatDimensions(): void {
    const graphicWidth = getGraphicWidth();

    // In Bondage Club, ChatRoomDivRect defines [x, y, width, height] for #chat-room-div
    // Default vanilla is [1005, 2, 988, 998]
    if (typeof ChatRoomDivRect !== "undefined" && Array.isArray(ChatRoomDivRect)) {
        ChatRoomDivRect[0] = graphicWidth + 5;
        ChatRoomDivRect[1] = 2;
        ChatRoomDivRect[2] = CANVAS_WIDTH - graphicWidth - 12;
        ChatRoomDivRect[3] = 998;
    }

    if (typeof CurrentScreen !== "undefined" && CurrentScreen === "ChatRoom") {
        if (typeof ChatRoomResize === "function") {
            try {
                ChatRoomResize(false);
            } catch (e) {
                console.warn("[QoC] Error running ChatRoomResize", e);
            }
        }
    }

    updateDividerPosition();
}

/**
 * Updates the physical DOM position of the draggable divider bar.
 */
export function updateDividerPosition(): void {
    if (!dividerElement) return;

    if (typeof CurrentScreen === "undefined" || CurrentScreen !== "ChatRoom" || !modStorage.chatResizer.enabled || !modStorage.chatResizer.showDivider) {
        dividerElement.style.display = "none";
        return;
    }

    const canvas = typeof MainCanvas !== "undefined" ? MainCanvas.canvas : document.getElementById("MainCanvas");
    if (!canvas) {
        dividerElement.style.display = "none";
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const graphicWidth = getGraphicWidth();
    const scaleX = rect.width / CANVAS_WIDTH;
    const dividerX = rect.left + graphicWidth * scaleX;

    dividerElement.style.display = "flex";
    dividerElement.style.left = `${dividerX - 4}px`;
    dividerElement.style.top = `${rect.top}px`;
    dividerElement.style.height = `${rect.height}px`;
}

/**
 * Creates and mounts the interactive draggable divider element.
 */
function createDividerElement(): void {
    if (dividerElement && dividerElement.parentElement) return;

    dividerElement = document.createElement("div");
    dividerElement.id = "qoc-chat-divider";
    dividerElement.title = "Drag to resize Chat & Graphic view. Double-click to reset (50/50).";

    Object.assign(dividerElement.style, {
        position: "fixed",
        width: "10px",
        zIndex: "9999",
        cursor: "col-resize",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "none"
    });

    const innerLine = document.createElement("div");
    innerLine.id = "qoc-chat-divider-line";
    Object.assign(innerLine.style, {
        width: "3px",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.7)",
        transition: "background-color 0.15s ease, width 0.15s ease",
        borderRadius: "2px",
        pointerEvents: "none"
    });

    dividerElement.appendChild(innerLine);

    // Hover styling
    dividerElement.addEventListener("mouseenter", () => {
        if (!isDragging) {
            innerLine.style.backgroundColor = "rgba(100, 180, 255, 0.85)";
            innerLine.style.width = "4px";
        }
    });

    dividerElement.addEventListener("mouseleave", () => {
        if (!isDragging) {
            innerLine.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
            innerLine.style.width = "3px";
        }
    });

    // Drag handling via PointerEvents
    dividerElement.addEventListener("pointerdown", (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        dividerElement?.setPointerCapture(e.pointerId);
        innerLine.style.backgroundColor = "rgba(100, 220, 255, 1)";
        innerLine.style.width = "5px";
    });

    dividerElement.addEventListener("pointermove", (e: PointerEvent) => {
        if (!isDragging) return;
        const canvas = typeof MainCanvas !== "undefined" ? MainCanvas.canvas : document.getElementById("MainCanvas");
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const canvasX = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
        const pct = (canvasX / CANVAS_WIDTH) * 100;
        setSplitPercent(pct);
    });

    const endDrag = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        try {
            dividerElement?.releasePointerCapture(e.pointerId);
        } catch (_) {}
        innerLine.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
        innerLine.style.width = "3px";
        saveStorage();
    };

    dividerElement.addEventListener("pointerup", endDrag);
    dividerElement.addEventListener("pointercancel", endDrag);

    // Double-click resets to default
    dividerElement.addEventListener("dblclick", (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSplitPercent(DEFAULT_SPLIT_PERCENT);
    });

    document.body.appendChild(dividerElement);
}

/**
 * Initializes the Chat Resizer module, hooks, and responsive CSS styling.
 */
export function initChatResizer(): void {
    // 1. Inject responsive CSS adjustments to ensure narrow chat doesn't clip
    const styleEl = document.createElement("style");
    styleEl.id = "qoc-resizer-styles";
    styleEl.innerHTML = `
        #chat-room-top-menu {
            flex-wrap: wrap !important;
            overflow-x: hidden !important;
        }
        .chat-room-top-menu-btn {
            min-width: 2.2em !important;
            padding: 2px 4px !important;
        }
        #chat-room-buttons {
            gap: 2px !important;
            padding: 2px !important;
        }
        #InputChat {
            font-size: 0.95em;
        }
    `;
    document.head.appendChild(styleEl);

    // 2. Setup the DOM divider
    createDividerElement();

    // 3. Hook ChatRoomResize to enforce our rect dimensions
    hookFunction("ChatRoomResize", HookPriority.ADD_BEHAVIOR, (args, next) => {
        if (modStorage.chatResizer.enabled) {
            const w = getGraphicWidth();
            if (typeof ChatRoomDivRect !== "undefined" && Array.isArray(ChatRoomDivRect)) {
                ChatRoomDivRect[0] = w + 5;
                ChatRoomDivRect[1] = 2;
                ChatRoomDivRect[2] = CANVAS_WIDTH - w - 12;
                ChatRoomDivRect[3] = 998;
            }
        }
        const result = next(args);
        updateDividerPosition();
        return result;
    });

    // 4. Hook ChatRoomClick to allow avatar clicking across the entire graphic width
    hookFunction("ChatRoomClick", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const event = args[0];

        // Orgasm mini-game check from vanilla BC
        if (
            Player.ArousalSettings != null &&
            Player.ArousalSettings.OrgasmTimer != null &&
            typeof Player.ArousalSettings.OrgasmTimer === "number" &&
            !isNaN(Player.ArousalSettings.OrgasmTimer) &&
            Player.ArousalSettings.OrgasmTimer > 0
        ) {
            return next(args);
        }

        const graphicWidth = getGraphicWidth();
        if (MouseIn(0, 0, graphicWidth, CANVAS_HEIGHT)) {
            if (typeof ChatRoomActiveView !== "undefined" && ChatRoomActiveView && ChatRoomActiveView.Click) {
                return ChatRoomActiveView.Click(event);
            }
        }
    });

    // 5. Hook ChatRoomCharacterViewLoopCharacters to dynamically distribute & scale avatars
    hookFunction("ChatRoomCharacterViewLoopCharacters", HookPriority.OVERRIDE_BEHAVIOR, (args) => {
        const callback = args[0] as (charIdx: number, charX: number, charY: number, space: number, zoom: number) => boolean | void;

        const charCount = ChatRoomCharacterViewCharacterCount;
        const charsPerRow = ChatRoomCharacterViewCharactersPerRow;
        const viewWidth = getGraphicWidth();
        const viewHeight = ChatRoomCharacterViewHeight;

        // Space dynamically calculated using the wider viewWidth
        const Space = charCount >= 2 ? viewWidth / Math.min(charCount, 5) : viewWidth / 2;

        let weight = ChatRoomCharacterViewSlideWeight;
        const frametimeAdjustment = TimerRunInterval / (1000 / 30);
        if (ChatRoomCharacterViewInitialize || !(Player.GraphicsSettings && Player.GraphicsSettings.SmoothZoom)) {
            ChatRoomCharacterViewInitialize = false;
            weight = 0;
        }

        const zoomFrameStep = (current: number) => (current * weight + (charCount >= 3 ? Space / 400 : 1)) / (weight + 1);
        const slideUpperFrameStep = (current: number) => (current * weight + (viewWidth / 2) - 0.5 * Space * Math.min(charCount, charsPerRow)) / (weight + 1);
        const slideLowerFrameStep = (current: number) => (current * weight + (viewWidth / 2) - 0.5 * Space * Math.max(1, charCount - charsPerRow)) / (weight + 1);

        let zoom = ChatRoomCharacterViewZoom;
        let upperX = ChatRoomCharacterViewX_Upper;
        let lowerX = ChatRoomCharacterViewX_Lower;

        for (let i = 0; i < frametimeAdjustment; i++) {
            const nextZoom = zoomFrameStep(zoom);
            const nextUpperX = slideUpperFrameStep(upperX);
            const nextLowerX = slideLowerFrameStep(lowerX);

            if (weight === 0) {
                zoom = nextZoom;
                upperX = nextUpperX;
                lowerX = nextLowerX;
                break;
            }

            const frametimeRemainder = frametimeAdjustment - i;
            if (frametimeRemainder >= 1) {
                zoom = nextZoom;
                upperX = nextUpperX;
                lowerX = nextLowerX;
            } else {
                zoom += (nextZoom - zoom) * frametimeRemainder;
                upperX += (nextUpperX - upperX) * frametimeRemainder;
                lowerX += (nextLowerX - lowerX) * frametimeRemainder;
            }
        }

        ChatRoomCharacterViewZoom = zoom;
        ChatRoomCharacterViewX_Upper = upperX;
        ChatRoomCharacterViewX_Lower = lowerX;

        const Zoom = zoom;
        const X = charCount >= 3 ? (Space - (viewWidth / 2) * Zoom) / 2 : 0;
        const Y = charCount <= 5 ? viewHeight * (1 - Zoom) / 2 : 0;

        for (let C = 0; C < ChatRoomCharacterDrawlist.length; C++) {
            let offsetX = 0;
            if (Player.GraphicsSettings?.CenterChatrooms) {
                offsetX = C >= charsPerRow ? lowerX : upperX;
            }
            const CharX = offsetX + (charCount === 1 ? (viewWidth - 500 * Zoom) / 2 : X + (C % charsPerRow) * Space);
            const CharY = charCount === 1 ? 0 : Y + Math.floor(C / charsPerRow) * CanvasDrawWidth;

            if (charCount === 1 && ChatRoomCharacterViewCharacterCountTotal <= 10 && !ChatRoomCharacterDrawlist[C].IsPlayer()) {
                continue;
            }

            if (callback(C, CharX, CharY, Space, Zoom)) break;
        }
    });

    // 6. Hook ChatRoomCharacterViewDraw to draw the background filling the wider view
    hookFunction("ChatRoomCharacterViewDraw", HookPriority.OVERRIDE_BEHAVIOR, () => {
        const backgroundURL = DrawGetBackgroundURL(false);
        const charCount = ChatRoomCharacterViewCharacterCount;
        const charsPerRow = ChatRoomCharacterViewCharactersPerRow;
        const viewWidth = getGraphicWidth();
        const viewHeight = ChatRoomCharacterViewHeight;
        const opts = {
            inverted: Player.GraphicsSettings?.InvertRoom && Player.IsInverted(),
            blur: typeof Player.GetBlurLevel === "function" ? Player.GetBlurLevel() : 0,
            darken: typeof DrawGetDarkFactor === "function" ? DrawGetDarkFactor() : 0,
            tints: typeof Player.GetTints === "function" ? Player.GetTints() : [],
            sizeMode: ChatRoomData?.Custom?.SizeMode,
        };

        let hasDrawnBackground = false;

        ChatRoomCharacterViewLoopCharacters((charIdx, charX, charY, _space, roomZoom) => {
            if (backgroundURL && charIdx % charsPerRow === 0) {
                const Y = charCount <= charsPerRow ? viewHeight * (1 - roomZoom) / 2 : 0;
                const bgRect = RectMakeRect(0, Y + charIdx * 100, viewWidth, viewHeight * roomZoom);
                DrawRoomBackground(backgroundURL, bgRect, opts);
                hasDrawnBackground = true;
            }

            DrawCharacter(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
            DrawStatus(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
            if (ChatRoomCharacterDrawlist[charIdx].MemberNumber != null) {
                ChatRoomCharacterViewDrawOverlay(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
            }
        });

        // Fallback if no characters or room background not yet drawn
        if (!hasDrawnBackground && backgroundURL) {
            const bgRect = RectMakeRect(0, 0, viewWidth, viewHeight);
            DrawRoomBackground(backgroundURL, bgRect, opts);
        }
    });

    // 7. Update divider on room load / screen load / window resize
    hookFunction("ChatRoomLoad", HookPriority.ADD_BEHAVIOR, (args, next) => {
        const result = next(args);
        applyChatDimensions();
        return result;
    });

    window.addEventListener("resize", () => {
        updateDividerPosition();
    });
}
