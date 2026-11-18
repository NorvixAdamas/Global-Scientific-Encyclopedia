// server.js — static file server cho preview
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  ".html":"text/html", ".css":"text/css", ".js":"application/javascript",
  ".json":"application/json", ".png":"image/png", ".svg":"image/svg+xml",
  ".ico":"image/x-icon"
};

const server = http.createServer((req, res) => {
  let filePath = path.join(root, req.url === "/" ? "index.html" : req.url.replace(/^\/+/, ""));
  const ext = path.extname(filePath);
  res.setHeader("Content-Type", MIME[ext] || "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  fs.readFile(filePath, (err, data) => {
    if (err) { res.statusCode = 404; res.end("Not Found"); return; }
    res.statusCode = 200; res.end(data);
  });
});

server.listen(8765, () => console.log("Server: http://127.0.0.1:8765"));