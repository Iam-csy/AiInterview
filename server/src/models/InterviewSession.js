const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    config: {
      type: Object,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          default: "",
        },
      },
    ],
    questionNumber: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "interview_sessions",
  }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
