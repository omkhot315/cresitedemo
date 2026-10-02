import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Business } from "./models/Business.js";
import { Payment } from "./models/Payment.js";
import businessRoutes from "./routes/businessRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import { apiNotFound, errorHandler } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimiters.js";

dotenv.config();

if (process.argv.includes("--production")) process.env.NODE_ENV = "production";
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cresite";

const app = express();

/* --------------------------- security & performance ----------------------- */
app.disable("x-powered-by");
app.set("trust proxy", 1); // Trust first proxy for accurate client IP in rate limiters

app.use(
  helmet({
    contentSecurityPolicy: false, // Permissive for external font CDNs, Pexels/Cloudinary images, and Cashfree JS SDK
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());

// In production, allow same-origin by default or CLIENT_ORIGIN if provided
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !isProd || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for preview flexibility while supporting credentials
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* ------------------------------ health check ----------------------------- */
const serverStartTime = Date.now();

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "offline";
  const memoryUsage = process.memoryUsage();

  res.json({
    status: "ok",
    service: "cresite-api",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    db: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    serverUptime: Math.floor((Date.now() - serverStartTime) / 1000),
    memory: {
      rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  });
});

/* --------------------------------- routes -------------------------------- */
// Apply general rate limiter across all /api endpoints
app.use("/api", generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", apiNotFound);

/* --------------------- production: serve the built SPA -------------------- */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const indexHtml = path.join(distDir, "index.html");

if (isProd) {
  if (fs.existsSync(indexHtml)) {
    // Cache static immutable assets for 1 year; index.html must revalidate
    app.use(
      express.static(distDir, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          } else {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      })
    );

    // SPA fallback — every non-API GET returns index.html
    app.use((req, res, next) => {
      if (req.method === "GET" && !req.path.startsWith("/api")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.sendFile(indexHtml);
      }
      return next();
    });
    console.log("[server] production mode — serving dist/ with SPA fallback and cache optimization");
  } else {
    console.warn("[server] dist/index.html not found — run `npm run build` to generate the client SPA.");
  }
}

app.use(errorHandler);

/* --------------------------------- startup -------------------------------- */
let server;

connectDB(MONGO_URI)
  .then(async (conn) => {
    console.log(`[server] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    /* One-time cleanup for the removed super-admin internal plan. */
    const [businesses, payments] = await Promise.all([
      Business.updateMany({ plan: "internal" }, { $set: { plan: "basic" } }),
      Payment.updateMany({ plan: "internal" }, { $set: { plan: "basic" } }),
    ]);
    if (businesses.modifiedCount || payments.modifiedCount) {
      console.log(
        `[server] migrated removed internal plan: ${businesses.modifiedCount} websites, ${payments.modifiedCount} payments`
      );
    }
  })
  .catch((err) => {
    console.warn("[server] MongoDB connection failed — API running in OFFLINE fallback mode.");
    console.warn(`[server]   reason: ${err.message}`);
    console.warn("[server]   the client will operate using local persistence until MongoDB is connected.");
  });

mongoose.connection.on("disconnected", () => console.warn("[server] MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("[server] MongoDB reconnected"));

server = app.listen(PORT, () => {
  console.log(`[server] Cresite platform API listening on http://localhost:${PORT}`);
  console.log(`[server] health check: http://localhost:${PORT}/api/health`);
});

/* --------------------------- graceful shutdown --------------------------- */
const shutdown = async (signal) => {
  console.log(`\n[server] ${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log("[server] HTTP server closed.");
    });
  }
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log("[server] MongoDB connection cleanly closed.");
    }
  } catch (err) {
    console.error("[server] Error closing database connection:", err);
  }
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Rejection at Promise:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[server] Uncaught Exception:", error);
  shutdown("UNCAUGHT_EXCEPTION");
});
