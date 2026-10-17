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

    if (
        typeof CurrentScreen === "undefined" ||
        CurrentScreen !== "ChatRoom" ||
        !modStorage.chatResizer.enabled ||
        !modStorage.chatResizer.showDivider
    ) {
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

    createDividerElement();

    // Hook ChatRoomResize to enforce our rect dimensions
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

    // Hook ChatRoomClick to allow avatar clicking across the entire graphic width
    hookFunction("ChatRoomClick", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const event = args[0];

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

    /**
     * SINGLE-LINE CHARACTER LAYOUT:
     * Keeps all characters on a single, continuous ground line side-by-side.
     * Prevents any multi-row stacking or out-of-bounds zoom.
     */
    hookFunction("ChatRoomCharacterViewLoopCharacters", HookPriority.OVERRIDE_BEHAVIOR, (args) => {
        const callback = args[0] as (charIdx: number, charX: number, charY: number, space: number, zoom: number) => boolean | void;

        const charCount = typeof ChatRoomCharacterDrawlist !== "undefined" ? ChatRoomCharacterDrawlist.length : 0;
        if (charCount === 0) return;

        const viewWidth = getGraphicWidth();
        const viewHeight = typeof ChatRoomCharacterViewHeight !== "undefined" ? ChatRoomCharacterViewHeight : 1000;

        let targetZoom: number;
        let Space: number;
        let startX: number;

        if (charCount === 1) {
            targetZoom = 1.0;
            Space = viewWidth / 2;
            startX = (viewWidth - 500 * targetZoom) / 2;
        } else {
            // Space per character evenly distributed across viewWidth
            Space = viewWidth / charCount;

            // Target zoom: keeps characters proportional to available space without overlapping excessively
            targetZoom = Math.min(1.0, Math.max(0.35, Space / 380));

            const totalVisualWidth = (charCount - 1) * Space + 500 * targetZoom;

            if (totalVisualWidth > viewWidth) {
                Space = (viewWidth - 500 * targetZoom) / (charCount - 1);
                startX = 0;
            } else {
                startX = (viewWidth - totalVisualWidth) / 2;
            }
        }

        // Smooth zoom interpolation
        let weight = typeof ChatRoomCharacterViewSlideWeight !== "undefined" ? ChatRoomCharacterViewSlideWeight : 9;
        const frametimeAdjustment = typeof TimerRunInterval !== "undefined" ? TimerRunInterval / (1000 / 30) : 1;

        if (ChatRoomCharacterViewInitialize || !(Player.GraphicsSettings && Player.GraphicsSettings.SmoothZoom)) {
            ChatRoomCharacterViewInitialize = false;
            weight = 0;
        }

        const zoomFrameStep = (current: number) => (current * weight + targetZoom) / (weight + 1);

        let zoom = typeof ChatRoomCharacterViewZoom !== "undefined" ? ChatRoomCharacterViewZoom : targetZoom;
        for (let i = 0; i < frametimeAdjustment; i++) {
            const nextZoom = zoomFrameStep(zoom);
            if (weight === 0) {
                zoom = nextZoom;
                break;
            }
            const remainder = frametimeAdjustment - i;
            if (remainder >= 1) {
                zoom = nextZoom;
            } else {
                zoom += (nextZoom - zoom) * remainder;
            }
        }

        ChatRoomCharacterViewZoom = zoom;

        // Position feet naturally near the floor, vertically centering the avatar safely
        const Y = Math.max(0, (viewHeight * (1 - zoom)) / 2);

        for (let C = 0; C < charCount; C++) {
            const CharX = startX + C * Space;
            const CharY = Y;

            if (callback(C, CharX, CharY, Space, zoom)) break;
        }
    });

    /**
     * SINGLE FULL-HEIGHT ROOM BACKGROUND:
     * Draws the room background once across the entire expanded canvas width.
     */
    hookFunction("ChatRoomCharacterViewDraw", HookPriority.OVERRIDE_BEHAVIOR, () => {
        const backgroundURL = DrawGetBackgroundURL(false);
        const viewWidth = getGraphicWidth();
        const viewHeight = typeof ChatRoomCharacterViewHeight !== "undefined" ? ChatRoomCharacterViewHeight : 1000;
        const opts = {
            inverted: Player.GraphicsSettings?.InvertRoom && Player.IsInverted(),
            blur: typeof Player.GetBlurLevel === "function" ? Player.GetBlurLevel() : 0,
            darken: typeof DrawGetDarkFactor === "function" ? DrawGetDarkFactor() : 0,
            tints: typeof Player.GetTints === "function" ? Player.GetTints() : [],
            sizeMode: ChatRoomData?.Custom?.SizeMode,
        };

        // Draw the background once across the whole graphic area
        if (backgroundURL) {
            const bgRect = RectMakeRect(0, 0, viewWidth, viewHeight);
            DrawRoomBackground(backgroundURL, bgRect, opts);
        }

        // Draw all characters along the single line
        ChatRoomCharacterViewLoopCharacters((charIdx, charX, charY, _space, roomZoom) => {
            if (ChatRoomCharacterDrawlist && ChatRoomCharacterDrawlist[charIdx]) {
                DrawCharacter(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
                DrawStatus(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
                if (ChatRoomCharacterDrawlist[charIdx].MemberNumber != null) {
                    ChatRoomCharacterViewDrawOverlay(ChatRoomCharacterDrawlist[charIdx], charX, charY, roomZoom);
                }
            }
        });
    });

    hookFunction("ChatRoomLoad", HookPriority.ADD_BEHAVIOR, (args, next) => {
        const result = next(args);
        applyChatDimensions();
        return result;
    });

    window.addEventListener("resize", () => {
        updateDividerPosition();
    });
}
