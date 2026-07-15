const sessions = new Map();

const createSession = (sessionId, config = {}, history = []) => {
  const session = {
    sessionId,
    config,
    history,
    questionNumber: 1,
  };

  sessions.set(sessionId, session);
  return session;
};

const getSession = (sessionId) => sessions.get(sessionId) || null;

const updateSession = (sessionId, updater) => {
  const existing = sessions.get(sessionId);
  if (!existing) {
    return null;
  }

  const nextSession = updater(existing);
  sessions.set(sessionId, nextSession);
  return nextSession;
};

const deleteSession = (sessionId) => {
  const existing = sessions.get(sessionId);
  sessions.delete(sessionId);
  return existing;
};

export { createSession, getSession, updateSession, deleteSession };
