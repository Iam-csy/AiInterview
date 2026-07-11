/**
 * Minimal in-memory session store keyed by sessionId.
 * Swap this for Redis/Mongo in production if you need persistence
 * across server restarts or multiple instances.
 */
const sessions = new Map();

function createSession(sessionId, config) {
  sessions.set(sessionId, {
    config,
    history: [],
    questionNumber: 0,
    createdAt: Date.now(),
  });
  return sessions.get(sessionId);
}

function getSession(sessionId) {
  return sessions.get(sessionId);
}

function appendTurn(sessionId, role, content) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  session.history.push({ role, content });
  if (role === "assistant") session.questionNumber += 1;
  return session;
}

function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = { createSession, getSession, appendTurn, deleteSession };
