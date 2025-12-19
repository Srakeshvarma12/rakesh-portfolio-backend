const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ IMPORTANT: Use dynamic PORT for deployment
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://YOUR_FRONTEND_DOMAIN.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());

// ✅ TEST ROUTE
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// ✅ EMAIL ROUTE
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
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

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false });
  }
});

// ✅ START SERVER (LAST LINE)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
