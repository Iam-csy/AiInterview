import { getInterviewerReply } from "../services/claudeService.js";

const startInterview = async (req, res) => {
  try {
    const { role = "", experience = "", difficulty = "", type = "", resume = "" } = req.body || {};

    const reply = await getInterviewerReply({
      config: { role, experience, difficulty, type, resume },
      history: [],
      message: "Please begin the interview with introductions and a warm-up question.",
    });

    res.json({ sessionId: "demo-session", message: reply });
  } catch (error) {
    console.error("startInterview error:", error);
    res.status(500).json({ error: "Failed to start interview." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message = "" } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    const reply = await getInterviewerReply({
      config: {},
      history: [],
      message,
    });

    res.json({ message: reply, questionNumber: 1 });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ error: "Failed to get interviewer response." });
  }
};

const endInterview = async (req, res) => {
  try {
    const reply = await getInterviewerReply({
      config: {},
      history: [],
      message: "Please end the interview now and provide the final overall feedback and recommendation in the required format.",
    });

    res.json({ message: reply });
  } catch (error) {
    console.error("endInterview error:", error);
    res.status(500).json({ error: "Failed to end interview." });
  }
};

export { startInterview, sendMessage, endInterview };
