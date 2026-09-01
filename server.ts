import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    resort: "Alon & Aninag Boutique Beach Resort",
    location: "Poblacion Beach, Sipalay City, Negros Occidental",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Live Chat Support API (Aninag AI Concierge)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    const systemPrompt = `You are "Ate Sol", the warm, soulful, and exceptionally knowledgeable local concierge and guest host at Alon & Aninag Boutique Beach Resort, located right on the beachfront of Poblacion Beach, Sipalay City, Negros Occidental, Philippines.

Resort Key Facts:
- Slogan: "Where Waves Rest and Souls Glow" ("Rest. Glow. Repeat.")
- Concept: A cozy, aesthetic beachfront boutique resort with 12 intimate sea-facing rooms (Sunset Balcony Villa, Aninag Seaview Suite, Wavefront Deluxe, Barkada Beachfront Loft, etc.). Price ranges from ₱1,800 to ₱3,500/night.
- Highlight 1: "Aninag Hour" every afternoon at sunset (5:15 PM - 6:00 PM) featuring free artisan Negrense brewed coffee, glowing amber paper lanterns, acoustic beach music, and golden hour photo sessions.
- Highlight 2: Nightly beachfront bonfire on the wooden sunset deck with storytelling and local acoustic music.
- Cuisine: Fresh Negrense specialties (Negros Chicken Inasal, KBL - Kadyos Baboy Langka, Fresh Sipalay Tuna Kinilaw, Sizzling Cansil, warm Piaya, fresh coconut).
- Nearby Sipalay Attractions: Sugar Beach, Tinagong Dagat (islets connected by bridges), Perth Paradise Resort infinity pool view, Campomanes Bay diving & Julian's Wreck dive site, Punta Ballo white sand beach, Danjugan Island Marine Sanctuary.
- Transport: 4 hours scenic drive/bus from Bacolod City (Silay Airport BCD) or 3.5 hours from Dumaguete City (DGT). Resort offers private van transfer and shuttle from Sipalay Ceres Bus terminal.
- Payment Methods: GCash, Maya, Debit/Credit Card, QR PH, Bank Transfer, Cash upon arrival.

Personality & Tone:
- Warm, hospitable, helpful, and proudly Negrense ("Palangga", "Maayong adlaw", "Madamo gid nga salamat").
- Help guests with room recommendations, booking inquiries, dining advice, island hopping itineraries, diving tips, and local dialect translations.
- Keep responses engaging, well-formatted, friendly, and concise.

User context: ${JSON.stringify(userContext || {})}`;

    if (!ai) {
      // Fallback response if no API key is set
      const lastMessage = messages?.[messages.length - 1]?.content?.toLowerCase() || "";
      let fallbackText = "Maayong adlaw! Welcome to Alon & Aninag Boutique Beach Resort in Sipalay City! ";
      if (lastMessage.includes("room") || lastMessage.includes("price") || lastMessage.includes("rate")) {
        fallbackText += "Our 12 cozy beachfront rooms range from ₱1,800 to ₱3,500/night, including our popular Sunset Balcony Villa and Barkada Loft. Breakfast and our sunset Aninag Hour coffee are included!";
      } else if (lastMessage.includes("how to get") || lastMessage.includes("transport") || lastMessage.includes("airport")) {
        fallbackText += "We are located at Poblacion Beach, Sipalay City. You can fly to Bacolod (BCD) or Dumaguete (DGT) and take a Ceres Bus or book our resort private van transfer (4 hrs from Bacolod, 3.5 hrs from Dumaguete).";
      } else if (lastMessage.includes("food") || lastMessage.includes("dinner") || lastMessage.includes("dining")) {
        fallbackText += "Our Beachfront Bistro serves authentic Negrense Chicken Inasal, fresh Sipalay Tuna Kinilaw, KBL, and artisan Piaya with sunset brewed drip coffee!";
      } else if (lastMessage.includes("dive") || lastMessage.includes("tour") || lastMessage.includes("activity")) {
        fallbackText += "We arrange island hopping to Tinagong Dagat, Perth Paradise, Sugar Beach, and diving trips to Julian's Wreck and Punta Ballo reef!";
      } else {
        fallbackText += "I would love to help you plan your relaxing escape where waves rest and souls glow. How can I assist your booking or Sipalay adventure today?";
      }
      return res.json({ reply: fallbackText });
    }

    // Format chat history for @google/genai
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Welcome to Alon & Aninag! How may I assist your stay in Sipalay today?";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return res.status(500).json({
      reply: "Maayong adlaw! We are delighted you reached out to Alon & Aninag. Please check our Rooms and Booking sections or let us know how we can make your Sipalay stay unforgettable!",
      error: error.message,
    });
  }
});

// Real-Time Translator API with Hiligaynon/Ilonggo & Multi-language Support
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Basic dictionary fallback
      const phraseMap: Record<string, Record<string, string>> = {
        "hello": { "hil": "Maayong adlaw", "tl": "Kumusta", "es": "Hola", "ja": "こんにちは" },
        "thank you": { "hil": "Madamo gid nga salamat", "tl": "Maraming salamat", "es": "Muchas gracias", "ja": "ありがとうございます" },
        "how much": { "hil": "Tagpila ini?", "tl": "Magkano ito?", "es": "¿Cuánto cuesta?", "ja": "いくらですか？" },
        "delicious": { "hil": "Namanamian / Manamit gid!", "tl": "Napakasarap!", "es": "¡Delicioso!", "ja": "とても美味しいです" },
        "where is the beach": { "hil": "Diin ang baybayon?", "tl": "Nasaan ang dalampasigan?", "es": "¿Dónde está la playa?", "ja": "ビーチはどこですか？" },
      };
      const clean = (text || "").toLowerCase().trim();
      const match = phraseMap[clean]?.[targetLang] || `[Translation to ${targetLang}]: ${text}`;
      return res.json({
        translatedText: match,
        pronunciation: "Natural local accent",
        notes: "Negrense / Western Visayas dialect context",
      });
    }

    const prompt = `Translate the following phrase accurately for a traveler visiting Sipalay City, Negros Occidental, Philippines.
Source Language: ${sourceLang}
Target Language: ${targetLang} (Note: If 'hil', translate to Hiligaynon / Ilonggo dialect spoken in Negros Occidental. If 'tl', Tagalog. If 'en', English).
Phrase: "${text}"

Respond in valid JSON format only:
{
  "translatedText": "the translated phrase",
  "pronunciation": "phonetic guide for natural pronunciation",
  "notes": "short cultural etiquette tip or dialect nuance in Negros"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    return res.json({
      translatedText: req.body.text || "",
      pronunciation: "",
      notes: "Direct phrase preserved",
    });
  }
});

// Vite Middleware for development & Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Alon & Aninag Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
