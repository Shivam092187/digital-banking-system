const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/**
 *  MIDDLEWARES
 */
app.use(express.json());
app.use(cookieParser());

/**
 * 🔥 CORS FIX (PRODUCTION SAFE)
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digital-banking-system-2.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/**
 * 🔥 PRE-FLIGHT FIX (IMPORTANT FOR NETWORK ERROR)
 */
app.options("*", cors());

/**
 * ROUTES
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");

app.get("/", (req, res) => {
  res.send("🚀 Ledger Service Running");
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRoutes);

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

module.exports = app;