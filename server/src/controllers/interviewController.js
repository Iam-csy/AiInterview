import * as pdfParseModule from "pdf-parse";
import { getInterviewerReply } from "../services/claudeService.js";
import InterviewSession from "../models/InterviewSession.js";

const pdfParse = pdfParseModule?.default || pdfParseModule;

const extractResumeText = async (file) => {
  if (!file) {
    return "";
  }

  const name = file.originalname?.toLowerCase() || "";
  const mimeType = file.mimetype || "";

  if (mimeType === "application/pdf" || name.endsWith(".pdf")) {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || "";
  }

  if (mimeType.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    return file.buffer.toString("utf8");
  }

  throw new Error("Unsupported resume file type. Please upload a PDF or a text file.");
};

const startInterview = async (req, res) => {
  try {
    const { role = "", experience = "", difficulty = "", type = "", resume = "" } = req.body || {};
    const resumeText = req.file ? await extractResumeText(req.file) : typeof resume === "string" ? resume : "";

    const reply = await getInterviewerReply({
      config: { role, experience, difficulty, type, resume: resumeText },
      history: [],
      message: "Please begin the interview with introductions and a warm-up question.",
    });

    const session = await InterviewSession.create({
      sessionId: `session-${Date.now()}`,
      userId: req.user?.id || null,
      config: { role, experience, difficulty, type, resume: resumeText },
      history: [{ role: "assistant", content: reply }],
      questionNumber: 1,
    });

    res.json({ sessionId: session.sessionId, message: reply, resumeText });
  } catch (error) {
    console.error("startInterview error:", error);
    res.status(500).json({ error: error.message || "Failed to start interview." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId = "", message = "" } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    const session = await InterviewSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    const reply = await getInterviewerReply({
      config: session.config || {},
      history: session.history || [],
      message,
    });

    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: reply });
    session.questionNumber = Math.max(session.questionNumber + 1, 1);
    await session.save();

    res.json({ message: reply, questionNumber: session.questionNumber });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ error: "Failed to get interviewer response." });
  }
};

const endInterview = async (req, res) => {
  try {
    const { sessionId = "" } = req.body || {};
    const session = await InterviewSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    const reply = await getInterviewerReply({
      config: session.config || {},
      history: session.history || [],
      message: "Please end the interview now and provide the final overall feedback and recommendation in the required format.",
    });

    session.history.push({ role: "assistant", content: reply });
    session.questionNumber = Math.max(session.questionNumber + 1, 1);
    await session.save();

    res.json({ message: reply });
  } catch (error) {
    console.error("endInterview error:", error);
    res.status(500).json({ error: "Failed to end interview." });
  }
};

export { startInterview, sendMessage, endInterview };
