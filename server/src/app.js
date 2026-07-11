import express from "express";
import cors from "cors";
import interviewRoutes from "./routes/interviewRoutes.js";
import apiLimiter from "./middleware/rateLimiter.js";

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

app.use(cors(corsOptions));
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

export default app;
