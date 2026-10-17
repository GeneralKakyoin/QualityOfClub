import { build } from "esbuild";
import fs from "fs";
import chalk from "chalk";
import path from "path";

const args = process.argv.slice(2);

if (fs.existsSync("dist")) fs.rmSync("dist", { recursive: true, force: true });
else fs.mkdirSync("dist");

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

await build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    sourcemap: true,
    outfile: "./dist/bundle.js",
    loader: {
        ".ts": "ts",
        ".css": "text",
        ".png": "dataurl",
        ".svg": "dataurl",
        ".ttf": "dataurl",
    },
    platform: "browser",
    format: "iife",
    tsconfig: "./tsconfig.json",
    define: {
        IS_DEV: args.includes("--dev") ? "true" : "false"
    }
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

// Read the generated bundle
const bundleContent = fs.readFileSync("./dist/bundle.js", "utf-8");

// Generate self-contained Tampermonkey/Violentmonkey userscript
const userScriptHeader = `// ==UserScript==
// @name         Quality of Club
// @namespace    https://www.bondageprojects.com/
// @version      1.0.0
// @description  Quality-of-life enhancements for Bondage Club (Chat Resizer and more)
// @author       Matti
// @match        https://bondageprojects.elementfx.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @match        https://bondage-europe.com/*
// @match        https://www.bondage-europe.com/*
// @match        https://bondageprojects.com/*
// @match        https://www.bondageprojects.com/*
// @match        http://localhost:*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function launchQoC() {
        if (typeof window.bcModSdk !== "undefined" || typeof window.CommonDraw !== "undefined" || typeof window.ServerSend !== "undefined" || typeof window.Player !== "undefined") {
            try {
${bundleContent}
            } catch (e) {
                console.error("[Quality of Club] Startup error:", e);
            }
        } else {
            setTimeout(launchQoC, 400);
        }
    }
    launchQoC();
})();
`;

fs.writeFileSync("./dist/QualityOfClub.user.js", userScriptHeader, "utf-8");

// Generate one-line bookmarklet
const bookmarkletCode = `javascript:(function(){${encodeURIComponent(
    `function launchQoC(){if(typeof window.bcModSdk!=="undefined"||typeof window.CommonDraw!=="undefined"||typeof window.ServerSend!=="undefined"){${bundleContent}}else{setTimeout(launchQoC,400);}}launchQoC();`
)}})();`;
fs.writeFileSync("./dist/QualityOfClub.bookmark.txt", bookmarkletCode, "utf-8");

console.log(chalk.green("Build completed successfully:\n"));
const files = fs.readdirSync("dist", { recursive: true, withFileTypes: true });
for (const file of files) {
    if (file.isFile()) {
        const filePath = path.join(file.parentPath || "dist", file.name);
        const { size } = fs.statSync(filePath);
        console.log(chalk.magenta("+") + " " + chalk.yellow(filePath) + " " + chalk.grey(formatSize(size)));
    }
}
