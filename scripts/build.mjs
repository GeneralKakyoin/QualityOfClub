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

// Generate standard FurryZoi-style userscript loader
const userScript = `// ==UserScript==
// @name Quality of Club
// @namespace https://www.bondageprojects.com/
// @version 1.0.7
// @description Quality of life improvements for Bondage Club
// @author Matti
// @match *://*.bondageeurope.com/*
// @match *://bondageeurope.com/*
// @match *://*.bondage-europe.com/*
// @match *://bondage-europe.com/*
// @match *://*.bondageprojects.com/*
// @match *://bondageprojects.com/*
// @match *://*.bondageprojects.elementfx.com/*
// @match *://bondageprojects.elementfx.com/*
// @match https://www.bondageeurope.com/*
// @match https://www.bondageeurope.com/R*/*
// @include *://*bondage*/*
// @run-at document-end
// @grant none
// @updateURL https://raw.githubusercontent.com/GeneralKakyoin/QualityOfClub/main/qoc.user.js
// @downloadURL https://raw.githubusercontent.com/GeneralKakyoin/QualityOfClub/main/qoc.user.js
// ==/UserScript==

setTimeout(function () {
    let n = document.createElement("script");
    n.setAttribute("language", "JavaScript");
    n.setAttribute("crossorigin", "anonymous");
    n.setAttribute("src", "https://generalkakyoin.github.io/QualityOfClub/bundle.js?v=" + Date.now());
    n.onload = () => n.remove();
    document.head.appendChild(n);
}, 1000);
`;

fs.writeFileSync("./dist/QualityOfClub.user.js", userScript, "utf-8");

// Generate bookmarklet with dynamic reload cache-busting
const bookmarklet = `javascript:(function(){let n=document.createElement("script");n.setAttribute("language","JavaScript");n.setAttribute("crossorigin","anonymous");n.setAttribute("src","https://generalkakyoin.github.io/QualityOfClub/bundle.js?v="+Date.now());n.onload=()=>n.remove();document.head.appendChild(n);})();`;
fs.writeFileSync("./dist/QualityOfClub.bookmark.txt", bookmarklet, "utf-8");


console.log(chalk.green("Build completed successfully:\n"));
const files = fs.readdirSync("dist", { recursive: true, withFileTypes: true });
for (const file of files) {
    if (file.isFile()) {
        const filePath = path.join(file.parentPath || "dist", file.name);
        const { size } = fs.statSync(filePath);
        console.log(chalk.magenta("+") + " " + chalk.yellow(filePath) + " " + chalk.grey(formatSize(size)));
    }
}
