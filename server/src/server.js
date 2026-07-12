import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";

const startServer = async (port = Number(process.env.PORT || 5000), attempts = 0) => {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`InterviewGPT server running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempts < 10) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort} instead...`);
      server.close(() => startServer(nextPort, attempts + 1));
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
