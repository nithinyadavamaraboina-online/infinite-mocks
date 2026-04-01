import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cookieParser());

  // Kindle Detection Middleware
  app.use((req, res, next) => {
    const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
    const isLiteModeCookie = req.cookies["lite_mode"];
    const isApiRequest = req.path.startsWith("/api/");
    const isStaticAsset = req.path.includes(".") && !req.path.endsWith(".html");
    const isLiteRoute = req.path === "/lite";

    // Skip for API, static assets, or if already on /lite
    if (isApiRequest || isStaticAsset || isLiteRoute) {
      return next();
    }

    // Check for manual override (cookie)
    if (isLiteModeCookie === "true") {
      return res.redirect(307, "/lite" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""));
    } else if (isLiteModeCookie === "false") {
      return next();
    }

    // Kindle Detection Rules
    const kindlePatterns = [
      "kindle",
      "silk",
      "kfapwi", "kftt", "kfot", "kfthwi" // Kindle Fire models
    ];

    const isKindle = kindlePatterns.some(pattern => userAgent.includes(pattern));

    if (isKindle) {
      // Redirect to /lite, preserving query params
      const queryParams = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      return res.redirect(307, "/lite" + queryParams);
    }

    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
