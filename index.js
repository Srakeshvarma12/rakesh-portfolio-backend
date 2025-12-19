const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

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

// ✅ Send Email route
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  console.log("📩 /send-email hit");
  console.log("Body received:", req.body);

  if (!email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message from Portfolio",
      text: `From: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false });
  }
});

// ✅ Start server (MUST be last)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
