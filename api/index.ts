import express from "express";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("STRIPE_SECRET_KEY is missing. Checkout will not work.");
      return null;
    }
    stripe = new Stripe(key);
  }
  return stripe;
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Luna API", environment: "Vercel Serverless" });
});

app.post("/api/chat-with-luna", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const model = "gemini-3.5-flash";

    const language = context.language || 'pt';
    const langName = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese (Portugal/Angola)';

    const sysInstruction = `You are Luna, an intelligent, empathetic, and highly expert women's health and wellness assistant.
User Profile:
- Name: ${context.userName}
- Nickname: ${context.nickname || 'None'}
- Age: ${context.age || 'unknown'} years
- Cycle Length: ${context.cycleLength || 28} days
- Period Length: ${context.periodLength || 5} days
- Current Cycle Day: Day ${context.currentCycleDay} of their active cycle.
- Today's Symptoms: ${context.todaySymptoms && context.todaySymptoms.length > 0 ? context.todaySymptoms.join(', ') : 'No physical symptoms reported yet today.'}
- Today's Mood: ${context.todayMood || 'Great'}

Guidelines:
1. Empathy & Tone: Always be warm, supportive, and understanding. You are a conversational sister and health advocate.
2. Personalization: Address the user directly by their first name (${context.userName.split(' ')[0]}) or their nickname (${context.nickname || 'none'}). If you don't know what they prefer, ask them nicely in ${langName}.
3. Cycle Phase Tips: Tailor your responses dynamically to their current cycle day and logs. Highlight their hormone levels or phase-aligned health tips (e.g., nutrition, training, rest) for Day ${context.currentCycleDay}.
4. Markdown: Use clean, readable markdown (bolding, headers, bullet points).
5. Disclaimer: You are an AI companion, not a licensed medical professional. Always include a brief, humble, and polite disclaimer at the end if offering advice on severe symptoms or medication.
6. Concise Responses: Keep responses structured, elegant, concise, and easy to read on mobile.
7. LANGUAGE: You MUST respond strictly in ${langName}. Even if they ask questions in another language, translate your feedback to ${langName} and proceed. Ensure natural, fluent, and caring language.`;

    const contents = [
      ...history.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: sysInstruction,
      },
    });

    res.json({ text: response.text || "Sorry, I could not retrieve a response." });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: "Failed to communicate with Luna AI." });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const s = getStripe();
    if (!s) {
      return res.status(500).json({ error: "Stripe is not configured on the server." });
    }

    const { priceId, userId, userEmail } = req.body;

    const isYearly = priceId === "luna_pro_yearly" || priceId === "yearly";
    const amount = isYearly ? 1999 : 1299; // 19.99 EUR or 12.99 EUR
    const productName = isYearly ? "Luna Premium Anual" : "Luna Premium Promensal";
    const productDesc = isYearly 
      ? "Plano Anual Elite - Acesso Ilimitado de Saúde (Poupa 87%)" 
      : "Plano Mensal Elite - Acesso Ilimitado de Saúde e Bem-estar";

    const session = await s.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDesc,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/?payment_success=true`,
      cancel_url: `${req.headers.origin}/?payment_cancel=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const s = getStripe();
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!s || !sig || !webhookSecret) {
    return res.status(400).send("Webhook Error: Missing configuration");
  }

  let event;

  try {
    event = s.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`Payment confirmed for user: ${userId}. Plan upgraded to Pro.`);
    }
  }

  res.json({ received: true });
});

export default app;
