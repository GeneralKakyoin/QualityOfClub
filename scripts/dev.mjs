import http from "http";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import chalk from "chalk";

const PORT = 8000;
const DIST_DIR = path.resolve("./dist");

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
};

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".map": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || "application/octet-stream";
}

function send404(res) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS });
    res.end("404 Not Found");
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) return send404(res);
        res.writeHead(200, {
            "Content-Type": getMimeType(filePath),
            "Cache-Control": "no-cache",
            ...CORS_HEADERS
        });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204, CORS_HEADERS);
        res.end();
        return;
    }

    const safeUrl = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(DIST_DIR, safeUrl === "/" ? "bundle.js" : safeUrl);
    filePath = path.normalize(filePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return send404(res);
        }
        serveFile(filePath, res);
    });
});

server.listen(PORT, () => {
    console.log(chalk.cyan(`\n[QoC Dev Server] Listening on http://localhost:${PORT}`));
    console.log(chalk.gray(`Bundle URL: http://localhost:${PORT}/bundle.js`));
    console.log(chalk.green(`Userscript and bookmarklet can load from this URL.\n`));
});
