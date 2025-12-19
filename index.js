const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS (Frontend → Backend)
app.use(
  cors({
    origin: "https://rakesh-portfolio-wheat.vercel.app",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ✅ Health Check
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Send Email Route
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing email or message",
    });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["srvarma2004@gmail.com"],
      subject: "New Contact Message from Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Portfolio Message</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false });
  }
});

// ✅ Start Server (LAST)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});