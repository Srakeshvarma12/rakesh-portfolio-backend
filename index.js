import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(
  cors({
    origin: "https://rakesh-portfolio-wheat.vercel.app",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// ✅ Email route
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["srvarma2004@gmail.com"],
      reply_to: email,
      subject: "New Portfolio Contact Message",
      text: `From: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
