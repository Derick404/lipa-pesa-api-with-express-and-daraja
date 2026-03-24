
//  M-Pesa Express System — Entry Point
//  Supports: STK Push (Till), Pochi la Biashara,
//            B2C Send Money, Transaction Status


require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const mpesaRoutes = require("./routes/mpesa");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // HTTP request logger

//  Serve frontend 
app.use(express.static(path.join(__dirname, "public")));

// Routes 
app.use("/api/mpesa", mpesaRoutes);

//  Health Check (API) 
app.get("/api", (req, res) => {
  res.json({
    service: "M-Pesa Express System 🚀",
    status: "running",
    environment: process.env.MPESA_ENV || "sandbox",
    endpoints: {
      "GET  /api/mpesa/token":      "Test credentials & get access token",
      "POST /api/mpesa/till":       "STK Push → Till Number (Buy Goods)",
      "POST /api/mpesa/pochi":      "STK Push → Pochi la Biashara",
      "POST /api/mpesa/send":       "B2C → Send Money to Phone",
      "POST /api/mpesa/query":      "Check Transaction Status",
      "POST /api/mpesa/stk-query":  "Check STK Push Status",
    },
    callbacks: {
      "POST /api/mpesa/callback/stk":          "STK Push callback (Daraja)",
      "POST /api/mpesa/callback/b2c/result":   "B2C result callback (Daraja)",
      "POST /api/mpesa/callback/b2c/timeout":  "B2C timeout callback (Daraja)",
      "POST /api/mpesa/callback/query/result": "Query result callback (Daraja)",
    },
  });
});

//  404 Handler 
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` });
});

//  Error Handler 
app.use((err, req, res, next) => {
  console.error(" Unhandled error:", err.message);
  res.status(500).json({ success: false, error: "Internal server error" });
});

//  Start Server 
app.listen(PORT, () => {
  console.log(`
  
      lipa-Pesa Express System         
 
    Server   : http://localhost:${PORT}     
    Env      : ${(process.env.MPESA_ENV || "sandbox").padEnd(27)}║
    Callback : ${(process.env.BASE_CALLBACK_URL || "not set").slice(0, 27).padEnd(27)}║
  
  `);
});

module.exports = app;