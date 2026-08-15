import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT as string, 10) || 5173;

  app.use(express.json());

  // Proxy /api requests to the Render backend
  app.all("/api/*", async (req, res) => {
    const targetUrl = `https://cropfit-werx.onrender.com${req.originalUrl}`;
    try {
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          headers[key] = Array.isArray(value) ? value.join(", ") : value;
        }
      }
      delete headers["host"];
      delete headers["connection"];

      const options: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        options.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, options);
      
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== "content-encoding" && lowerKey !== "content-length" && lowerKey !== "transfer-encoding") {
          res.setHeader(key, value);
        }
      });

      res.status(response.status);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        res.json(json);
      } else {
        const text = await response.text();
        res.send(text);
      }
    } catch (err) {
      console.error(`Proxy error for ${targetUrl}:`, err);
      res.status(502).json({ error: "Failed to connect to local backend service" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini API client initialization
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }

  // AI Farm Assistant Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, farmContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      // If Gemini client is available, call Gemini 3.6 Flash
      if (ai) {
        try {
          const systemInstruction = `You are a friendly, expert digital climate-smart farming assistant named "Kishan Mitra".
You speak directly to farmers in simple, respectful, clear, and highly practical language.
Keep your answers structured, easy to read, and actionable.

Farmer context:
Location: ${farmContext?.location || "Rajpura, Punjab"}
Crops: ${farmContext?.crops || "Wheat (4.5 Acres), Rice (5 Acres), Vegetables (3 Acres)"}
Current Situation: High heat stress alert (+35°C expected tomorrow), low soil moisture in Wheat field.

Always structure your responses with:
1. Quick Direct Answer
2. Actionable Steps (bulleted with simple emojis)
3. "Why" Reason (soil/weather physics in 1 simple sentence)
4. Recommended Timing or Window`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Farmer question: "${message}"`,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          const replyText = response.text || "I recommend inspecting your soil moisture in Field 01 and scheduling early morning irrigation (6:00-8:00 AM) to shield crops from high heat.";
          return res.json({ reply: replyText });
        } catch (genError) {
          console.error("Gemini API call error:", genError);
          // Fallback to intelligent local response generator if API key fails or throttles
        }
      }

      // Smart fallback responses if API key is not active
      let replyText = "";
      const lower = message.toLowerCase();

      if (lower.includes("irrigate") || lower.includes("water")) {
        replyText = `💧 **Irrigation Recommendation**:

• **Action**: Apply light irrigation to Field 01 (Wheat) within the next 12 hours.
• **Best Time Window**: 6:00 AM – 8:00 AM tomorrow morning.
• **Why**: Irrigating early avoids high solar evaporation and cools the root zone before peak 36°C afternoon temperatures hit.
• **Water Volume**: 25–30mm recommended for current flowering stage.`;
      } else if (lower.includes("temperature") || lower.includes("heat") || lower.includes("hot")) {
        replyText = `🌡️ **Heat Stress Management**:

• **Situation**: Temperatures will hit 36°C tomorrow afternoon between 1:00 PM – 4:00 PM.
• **Risk**: Wheat in flowering stage is sensitive to heat shock.
• **Recommended Steps**:
  1. Ensure soil moisture is kept at >60% to allow transpirational cooling.
  2. Avoid applying nitrogen fertilizers during extreme heat.
  3. Spray potassium nitrate (1%) or anti-transpirant if heat persists above 37°C.`;
      } else if (lower.includes("crop") || lower.includes("suitable") || lower.includes("suggest") || lower.includes("plant")) {
        replyText = `🌱 **Climate Smart Crop Recommendations**:

Based on expected heat and low rainfall in Rajpura:
1. **Pearl Millet (Bajra)**: High climate suitability, low water need (250mm), 85-90 day duration.
2. **Sorghum (Jowar)**: Excellent drought tolerance, medium water need, high yield stability.
3. **Short-Duration Pulses (Moong/Urad)**: Fast 65-day crop, enriches soil nitrogen, low risk.`;
      } else if (lower.includes("stress") || lower.includes("why") || lower.includes("yellow")) {
        replyText = `🔍 **Stress Diagnosis & Explanation**:

• **Primary Cause**: Combination of low soil moisture (38%) + ambient humidity drop + 34°C solar radiation.
• **Field Zone**: Zone 03 & Zone 05 in Field 01.
• **Validation**: 3 out of 4 data sources (Soil Sensor, Weather Station, Satellite NDVI) agree on stress state.
• **Action**: Targeted spot-irrigation in Zone 03/05 will arrest crop yield loss.`;
      } else {
        replyText = `🌱 **Farm Assistant Advice**:

Thank you for your question, Farmer. Based on your current farm conditions in Rajpura:
• **Field Status**: Wheat field needs moisture attention before tomorrow's 36°C heat wave.
• **Recommended Action**: Inspect field irrigation lines and schedule early morning watering.
• **Weather Alert**: 20% rain probability today; heat wave expected in 24h.

Feel free to ask about irrigation windows, fertilizer timing, or crop selection!`;
      }

      return res.json({ reply: replyText });
    } catch (err) {
      console.error("Chat endpoint error:", err);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware in dev mode / static serve in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 Farm Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
