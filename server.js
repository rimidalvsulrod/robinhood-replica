// Local-only static server. Binds to 127.0.0.1 so nothing outside this PC can reach it.
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = Number(process.env.PORT) || 5178;
const HOST = "127.0.0.1";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(PORT, HOST, () => console.log(`Replica running at http://localhost:${PORT}`));
