import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Default config
const defaultConfig = {
  productPrice: 2000,
  fbPixelId: "",
  tiktokPixelId: ""
};

const firebaseApp = initializeApp();
const db = getFirestore(firebaseApp);

async function getConfig() {
  try {
    const doc = await db.collection("config").doc("main").get();
    if (doc.exists) {
      return { ...defaultConfig, ...doc.data() };
    }
  } catch (error) {
    console.error("Error reading config from Firestore:", error);
  }
  return defaultConfig;
}

async function saveConfig(config: any) {
  await db.collection("config").doc("main").set(config, { merge: true });
}

// Auth Middleware
function authMiddleware(req: any, res: any, next: any) {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API routes FIRST
  app.get("/api/config", async (req, res) => {
    const config = await getConfig();
    res.json(config);
  });

  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    if (password === adminPassword) {
      const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
      res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid password" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.post("/api/config", authMiddleware, async (req, res) => {
    const currentConfig = await getConfig();
    const newConfig = { ...currentConfig, ...req.body };
    await saveConfig(newConfig);
    res.json({ success: true, config: newConfig });
  });

  app.post("/api/submitOrder", async (req, res) => {
    try {
      const { name, phone, wilaya, commune, deliveryType, price } = req.body;
      
      // Save order to Firestore
      try {
        await db.collection("orders").add({
          name,
          phone,
          wilaya,
          commune,
          deliveryType,
          price,
          createdAt: FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving order to Firestore:", err);
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.warn("Telegram credentials not configured. Order received but not sent to Telegram.");
        // We still return success to the user so they don't see an error if the owner hasn't set up the bot yet
        return res.json({ success: true, warning: "Telegram not configured" });
      }

      const text = `🛒 *طلبية جديدة!*\n👤 *الاسم:* ${name}\n📞 *رقم الهاتف:* ${phone}\n📍 *الولاية:* ${wilaya}\n🏙️ *البلدية:* ${commune}\n🚚 *نوع التوصيل:* ${deliveryType === 'home' ? 'لباب المنزل' : 'للمكتب (Stop Desk)'}\n💰 *السعر الإجمالي:* ${price} د.ج`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Telegram API Error:", errorData);
        return res.status(500).json({ success: false, error: "Failed to send to Telegram" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Order processing error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
