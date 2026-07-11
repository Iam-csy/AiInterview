const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interviewgpt";

let connectionPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
  }

  try {
    await connectionPromise;
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (err) {
    console.warn("MongoDB unavailable, falling back to in-memory sessions:", err.message);
    return null;
  }
}

module.exports = { connectToDatabase };
