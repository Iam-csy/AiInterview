import { getInterviewerReply } from "../services/claudeService.js";
import { createSession, getSession, updateSession } from "../services/sessionStore.js";

const extractResumeText = async (file) => {
  if (!file) {
    return "";
  }

  const name = file.originalname?.toLowerCase() || "";
  const mimeType = file.mimetype || "";

  if (mimeType.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    return file.buffer.toString("utf8");
  }

  if (mimeType === "application/pdf" || name.endsWith(".pdf")) {
    return "";
  }

  return "";
};

const startInterview = async (req, res) => {
  try {
    const { role = "", experience = "", difficulty = "", type = "", resume = "" } = req.body || {};
    const resumeText = req.file ? await extractResumeText(req.file) : typeof resume === "string" ? resume : "";
    const sessionId = `session-${Date.now()}`;

    const reply = await getInterviewerReply({
      config: { role, experience, difficulty, type, resume: resumeText },
      history: [],
      message: "Please begin the interview with introductions and a warm-up question.",
    });

    createSession(sessionId, { role, experience, difficulty, type, resume: resumeText }, [{ role: "assistant", content: reply }]);

    res.json({ sessionId, message: reply, resumeText });
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

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    const reply = await getInterviewerReply({
      config: session.config || {},
      history: session.history || [],
      message,
    });

    updateSession(sessionId, (current) => {
      current.history.push({ role: "user", content: message });
      current.history.push({ role: "assistant", content: reply });
      current.questionNumber = Math.max(current.questionNumber + 1, 1);
      return current;
    });

    res.json({ message: reply, questionNumber: session.questionNumber + 1 });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ error: "Failed to get interviewer response." });
  }
};

const endInterview = async (req, res) => {
  try {
    const { sessionId = "" } = req.body || {};
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    const reply = await getInterviewerReply({
      config: session.config || {},
      history: session.history || [],
      message: "Please end the interview now and provide the final overall feedback and recommendation in the required format.",
    });

    updateSession(sessionId, (current) => {
      current.history.push({ role: "assistant", content: reply });
      current.questionNumber = Math.max(current.questionNumber + 1, 1);
      return current;
    });

    res.json({ message: reply });
  } catch (error) {
    console.error("endInterview error:", error);
    res.status(500).json({ error: "Failed to end interview." });
  }
};

export { startInterview, sendMessage, endInterview };
