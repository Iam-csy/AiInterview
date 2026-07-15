import "dotenv/config";
import app from "./app.js";

const startServer = (port = Number(process.env.PORT || 5000)) => {
  app.listen(port, () => {
    console.log(`InterviewGPT server running on http://localhost:${port}`);
  });
};

startServer();
