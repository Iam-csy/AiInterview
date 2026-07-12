import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
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

export default mongoose.model("InterviewSession", interviewSessionSchema);
