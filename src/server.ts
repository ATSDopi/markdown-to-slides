import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFileSync, watchFile, existsSync } from "fs";
import { resolve, extname, join } from "path";
import { WebSocketServer, WebSocket } from "ws";
import { parseMarkdown, parseFrontmatter, buildConfig } from "./parser.js";
import { generateHTML } from "./converter.js";
import { Slide, PresentationConfig } from "./types.js";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export interface ServerOptions {
  input: string;
  port?: number;
  theme?: string;
  title?: string;
  author?: string;
  watch?: boolean;
}

export async function startDevServer(options: ServerOptions): Promise<void> {
  const port = options.port || 3000;
  const inputPath = resolve(options.input);

  if (!existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  let currentSlides: Slide[] = [];
  let currentConfig: PresentationConfig;
  let currentHtml: string = "";

  function rebuild(): void {
    const markdown = readFileSync(inputPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(markdown);
    currentConfig = buildConfig(frontmatter, {
      theme: options.theme,
      title: options.title,
      author: options.author,
    });
    currentSlides = parseMarkdown(body);
    currentHtml = generateHTML(currentSlides, currentConfig);
  }

  rebuild();

  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url || "/";

    if (url === "/" || url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(currentHtml);
      return;
    }

    const filePath = join(resolve(inputPath, ".."), url);
    if (existsSync(filePath) && !filePath.includes("..")) {
      const ext = extname(filePath);
      const mimeType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(readFileSync(filePath));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  function broadcastReload(): void {
    const message = JSON.stringify({ type: "reload" });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  if (options.watch !== false) {
    watchFile(inputPath, { interval: 500 }, () => {
      rebuild();
      broadcastReload();
    });
  }

  httpServer.listen(port, () => {
    console.log(`\n  🎯 md2slides dev server running at http://localhost:${port}`);
    console.log(`  📄 Watching: ${inputPath}`);
    console.log(`  🎨 Theme: ${currentConfig.theme}`);
    console.log(`  📊 Slides: ${currentSlides.length}`);
    console.log(`  \n  Press Ctrl+C to stop\n`);
  });
}
