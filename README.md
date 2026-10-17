# Quality of Club (QoC)

A modern, lightweight Quality-of-Life (QoL) extension for **Bondage Club**, built on top of TypeScript, `esbuild`, and `zois-core`.

---

## Features

### 1. Chat Window Resizer
- **Custom Graphic / Chat Split**: Shrinks the chat window to grant more screen real estate to character avatars and the room background.
- **Dynamic Avatar Scaling**: Avatars scale up dynamically to be larger, sharper, and clearer, filling the wider view instead of staying cramped.
- **In-Game Draggable Divider**: A subtle vertical divider between the canvas and chat log allows real-time dragging directly in chatrooms.
  - **Double-click** the divider line to instantly reset back to standard 50/50.
- **Responsive Chat Adapting**: Adapts the chat input, top menu buttons, and action buttons so nothing clips or overflows in narrower modes.
- **Presets & Slider**: Choose from quick presets (`50/50`, `60/40`, `65/35`, `70/30`, `75/25`, `80/20`) or use the slider in the settings menu.

### 2. Extensible Tab-Based Settings Menu
- Accessible directly from in-game **Club Settings -> Extensions -> Quality of Club**.
- Tabbed layout starting with the **Interface** tab, ready to add more categories and QoL features in the future.
- Persistent preferences saved to `localStorage`.

---

## Installation & Testing

### Option A: Local Development Server (Recommended for testing)
1. In the `QualityOfClub` folder, build the bundle:
   ```bash
   pnpm run build
   ```
2. Start the local server:
   ```bash
   node ./scripts/dev.mjs
   ```
3. Load it in your browser:
   - **Tampermonkey / Userscript**: Install [`qoc.user.js`](file:///c:/Users/Matti/Documents/antigravity/eager-lovelace/QualityOfClub/qoc.user.js) in Tampermonkey or Violentmonkey.
   - **Bookmarklet**: Create a browser bookmark with the contents of [`qoc.bookmark.js`](file:///c:/Users/Matti/Documents/antigravity/eager-lovelace/QualityOfClub/qoc.bookmark.js) and click it while on Bondage Club.
   - **Browser DevTools Console**: Open the browser console on Bondage Club and paste:
     ```javascript
     let s = document.createElement("script");
     s.src = "http://localhost:8000/bundle.js";
     document.head.appendChild(s);
     ```

### Option B: Hosting online (GitHub Pages / FUSAM)
1. Push this repository to GitHub.
2. Enable GitHub Pages to serve `dist/bundle.js`.
3. Add the script URL to FUSAM, BMM, or userscript.

---

## Project Structure

```
QualityOfClub/
├── package.json               # Dependencies (zois-core, bc-stubs, lucide, esbuild)
├── tsconfig.json              # TypeScript compilation setup
├── scripts/
│   ├── build.mjs              # esbuild bundler (IIFE output to dist/bundle.js)
│   └── dev.mjs                # Local dev HTTP server with CORS
├── qoc.user.js                # Userscript loader
├── qoc.bookmark.js            # Browser bookmarklet loader
└── src/
    ├── index.ts               # Mod bootstrap, lifecycle & ready handlers
    ├── constants.ts           # Global constants & default split bounds
    ├── modules/
    │   ├── storage.ts         # Persistent settings via localStorage
    │   ├── settingsMenu.ts    # PreferenceRegisterExtensionSetting registration
    │   └── chatResizer.ts     # Resizing math, canvas hooks & draggable divider
    └── subscreens/
        └── mainSubscreen.ts   # Tabbed UI settings menu
```
