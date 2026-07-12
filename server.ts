import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/order", async (req, res) => {
    try {
      const { name, phone, wilaya, commune, deliveryType, price } = req.body;
      
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        console.warn("Telegram credentials not configured. Order received but not sent to Telegram.");
        // We still return success to the user so they don't see an error if the owner hasn't set up the bot yet
        return res.json({ success: true, warning: "Telegram not configured" });
      }

      const text = `
🛒 *طلبية جديدة!*

👤 *الاسم:* ${name}
📞 *رقم الهاتف:* ${phone}
📍 *الولاية:* ${wilaya}
🏙️ *البلدية:* ${commune}
🚚 *نوع التوصيل:* ${deliveryType === 'home' ? 'لباب المنزل' : 'للمكتب (Stop Desk)'}
💰 *السعر الإجمالي:* ${price} د.ج
      `;

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
