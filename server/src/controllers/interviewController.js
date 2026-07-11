const { v4: uuidv4 } = require("uuid");
const { getInterviewerReply } = require("../services/claudeService");
const {
  createSession,
  getSession,
  appendTurn,
  deleteSession,
} = require("../services/sessionStore");

/**
 * POST /api/interview/start
 * body: { role, experience, difficulty, type, resume }
 */
async function startInterview(req, res) {
  try {
    const { role, experience, difficulty, type, resume } = req.body;
    const sessionId = uuidv4();
    createSession(sessionId, { role, experience, difficulty, type, resume });

    const reply = await getInterviewerReply({
      config: { role, experience, difficulty, type, resume },
      history: [],
      message: "Please begin the interview with introductions and a warm-up question.",
    });

    appendTurn(sessionId, "user", "Please begin the interview with introductions and a warm-up question.");
    appendTurn(sessionId, "assistant", reply);

    res.json({ sessionId, message: reply });
  } catch (err) {
    console.error("startInterview error:", err);
    res.status(500).json({ error: "Failed to start interview." });
  }
}

/**
 * POST /api/interview/message
 * body: { sessionId, message }
 */
async function sendMessage(req, res) {
  try {
    const { sessionId, message } = req.body;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found. Please start a new interview." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    const reply = await getInterviewerReply({
      config: session.config,
      history: session.history,
      message,
    });

    appendTurn(sessionId, "user", message);
    appendTurn(sessionId, "assistant", reply);

    res.json({ message: reply, questionNumber: session.questionNumber });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Failed to get interviewer response." });
  }
}

/**
 * POST /api/interview/end
 * body: { sessionId }
 */
async function endInterview(req, res) {
  try {
    const { sessionId } = req.body;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const reply = await getInterviewerReply({
      config: session.config,
      history: session.history,
      message:
        "Please end the interview now and provide the final overall feedback and recommendation in the required format.",
    });

    appendTurn(sessionId, "assistant", reply);
    deleteSession(sessionId);

    res.json({ message: reply });
  } catch (err) {
    console.error("endInterview error:", err);
    res.status(500).json({ error: "Failed to end interview." });
  }
}

module.exports = { startInterview, sendMessage, endInterview };
