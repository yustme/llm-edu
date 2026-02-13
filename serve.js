import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { existsSync } from "node:fs";

const PORT = 8050;
const DIST_DIR = join(import.meta.dirname, "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

async function handler(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = join(DIST_DIR, url.pathname);

  // If path maps to an existing file, serve it
  if (existsSync(filePath) && !filePath.endsWith("/")) {
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
    return;
  }

  // SPA fallback: serve index.html for all other routes
  const indexPath = join(DIST_DIR, "index.html");
  const data = await readFile(indexPath);
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(data);
}

const server = createServer(handler);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Static server running on port ${PORT}`);
});
