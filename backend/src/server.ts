/**
 * CropFit Backend Server
 * 
 * Refactored from a single-endpoint demo into a modular backend
 * with 30+ API endpoints across weather, climate stress, disease,
 * soil, chat, journal, crop passport, alerts, and bio-product advisory.
 * 
 * External API integrations:
 * - Meteoblue Dataset API (historical weather)
 * - Syngenta CE Hub (forecast, disease, soil, alerts, agronomic)
 * - Google Gemini AI (chat, image analysis, translation)
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

// Route imports
import { weatherRoutes } from "./routes/weatherRoutes";
import { stressRoutes } from "./routes/stressRoutes";
import { chatRoutes } from "./routes/chatRoutes";
import { journalRoutes } from "./routes/journalRoutes";
import { passportRoutes } from "./routes/passportRoutes";
import { soilRoutes } from "./routes/soilRoutes";
import { diseaseRoutes } from "./routes/diseaseRoutes";
import { alertRoutes } from "./routes/alertRoutes";
import { advisorRoutes } from "./routes/advisorRoutes";
import { connectDB } from "./services/database/connection";

// Middleware imports
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

async function startServer() {
  await connectDB();
  
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // ──────────────────────────────────────────────
  // Middleware
  // ──────────────────────────────────────────────

  app.use(express.json({ limit: '10mb' }));  // Support image uploads
  app.use(express.urlencoded({ extended: true }));

  // CORS for development
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Request logging
  app.use((req, _res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // ──────────────────────────────────────────────
  // Health Check
  // ──────────────────────────────────────────────

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      services: {
        weather: "active",
        climateStress: "active",
        diseaseAnalysis: "active",
        soilAnalysis: "active",
        chatAssistant: "active",
        journal: "active",
        cropPassport: "active",
        alerts: "active",
        bioAdvisor: "active",
      },
      apis: {
        meteoblue: process.env.METEOBLUE_API_KEY ? "configured" : "simulated",
        cehub: process.env.CEHUB_API_KEY ? "configured" : "simulated",
        gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" ? "configured" : "fallback",
      },
    });
  });

  // ──────────────────────────────────────────────
  // API Routes
  // ──────────────────────────────────────────────

  // PS-02: Climate Stress Early Warning
  app.use("/api/weather", weatherRoutes);
  app.use("/api/stress", stressRoutes);

  // PS-03: Personalised Biological Product Advisor
  app.use("/api/advisor", advisorRoutes);

  // PS-04: Multilingual Conversational Assistant
  app.use("/api/chat", chatRoutes);

  // PS-05: Season Journal
  app.use("/api/journal", journalRoutes);

  // Additional Services
  app.use("/api/soil", soilRoutes);
  app.use("/api/disease", diseaseRoutes);
  app.use("/api/alerts", alertRoutes);
  app.use("/api/passport", passportRoutes);

  // ──────────────────────────────────────────────
  // API Discovery Endpoint
  // ──────────────────────────────────────────────

  app.get("/api", (_req, res) => {
    res.json({
      name: "CropFit API",
      version: "2.0.0",
      description: "Climate-Smart Farm Intelligence Platform API",
      endpoints: {
        health: "GET /api/health",
        weather: {
          current: "GET /api/weather/current?lat=&lon=",
          forecast: "GET /api/weather/forecast?lat=&lon=",
          historical: "GET /api/weather/historical?lat=&lon=&start=&end=",
          anomaly: "GET /api/weather/anomaly?lat=&lon=",
          irrigationClock: "GET /api/weather/irrigation-clock",
        },
        stress: {
          composite: "GET /api/stress/composite?fieldId=&crop=&days=&moisture=",
          heat: "GET /api/stress/heat?crop=&days=&moisture=",
          generateAlerts: "POST /api/stress/alerts/generate",
        },
        chat: {
          message: "POST /api/chat/message",
          image: "POST /api/chat/image",
          history: "GET /api/chat/history/:sessionId",
        },
        soil: {
          analyze: "POST /api/soil/analyze",
          cropRecommendations: "POST /api/soil/crop-recommendations",
          parseReport: "POST /api/soil/report/parse",
        },
        disease: {
          diagnose: "POST /api/disease/diagnose",
          risk: "GET /api/disease/risk?lat=&lon=&crop=&stage=",
        },
        journal: {
          createEntry: "POST /api/journal/entry",
          getEntries: "GET /api/journal/entries?farmerId=",
          recordFeedback: "PUT /api/journal/entry/:id/feedback",
          followUps: "GET /api/journal/follow-ups?farmerId=",
          missingData: "GET /api/journal/missing-data?farmerId=&fieldId=",
          timeline: "GET /api/journal/timeline?farmerId=",
        },
        passport: {
          create: "POST /api/passport/create",
          get: "GET /api/passport/:cropId",
          qr: "GET /api/passport/:cropId/qr",
          addEvent: "POST /api/passport/:cropId/event",
          updateStage: "PUT /api/passport/:cropId/stage",
          recordHarvest: "POST /api/passport/:cropId/harvest",
        },
        alerts: {
          active: "GET /api/alerts/active?lat=&lon=&crop=",
        },
        advisor: {
          recommend: "POST /api/advisor/recommend",
          agronomic: "GET /api/advisor/agronomic?crop=&stage=",
        },
      },
    });
  });

  // ──────────────────────────────────────────────
  // Error Handling
  // ──────────────────────────────────────────────

  app.use(notFoundHandler);
  app.use(errorHandler);

  // ──────────────────────────────────────────────
  // Frontend Serving (Vite dev / Static prod)
  // ──────────────────────────────────────────────

  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found. Skipping dev middleware.");
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ──────────────────────────────────────────────
  // Start Server
  // ──────────────────────────────────────────────

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🌾 ═══════════════════════════════════════════════════`);
    console.log(`🌾  CropFit Backend Server v2.0`);
    console.log(`🌾  Running on http://0.0.0.0:${PORT}`);
    console.log(`🌾  API Discovery: http://localhost:${PORT}/api`);
    console.log(`🌾  Health Check:  http://localhost:${PORT}/api/health`);
    console.log(`🌾 ═══════════════════════════════════════════════════`);
    console.log(`📡 APIs: Meteoblue ${process.env.METEOBLUE_API_KEY ? '✅' : '⚠️ simulated'} | CE Hub ${process.env.CEHUB_API_KEY ? '✅' : '⚠️ simulated'} | Gemini ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? '✅' : '⚠️ fallback'}`);
    console.log(`\n`);
  });
}

startServer();
