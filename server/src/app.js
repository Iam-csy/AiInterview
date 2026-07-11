const express = require("express");
const cors = require("cors");
const interviewRoutes = require("./routes/interviewRoutes");
const apiLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/interview", apiLimiter, interviewRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
