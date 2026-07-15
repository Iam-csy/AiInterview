import React, { useState } from "react";
import SetupForm from "./components/SetupForm.jsx";
import InterviewChat from "./components/InterviewChat.jsx";
import FeedbackReport from "./components/FeedbackReport.jsx";
import { startInterview } from "./utils/api.js";

const STAGE = {
  SETUP: "setup",
  INTERVIEW: "interview",
  FEEDBACK: "feedback",
};

export default function App() {
  const [stage, setStage] = useState(STAGE.SETUP);
  const [sessionId, setSessionId] = useState(null);
  const [initialMessage, setInitialMessage] = useState("");
  const [finalReport, setFinalReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(config) {
    setLoading(true);
    setError("");
    try {
      const response = await startInterview(config);
      const nextSessionId = response?.sessionId || `session-${Date.now()}`;
      const nextMessage = response?.message || "Let’s begin the interview.";

      setSessionId(nextSessionId);
      setInitialMessage(nextMessage);
      setStage(STAGE.INTERVIEW);
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Failed to start interview. Please check the server and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEnd(report) {
    setFinalReport(report);
    setStage(STAGE.FEEDBACK);
  }

  function handleRestart() {
    setSessionId(null);
    setInitialMessage("");
    setFinalReport("");
    setStage(STAGE.SETUP);
  }

  return (
    <div className="app-shell">
      {stage === STAGE.SETUP && (
        <>
          <SetupForm onStart={handleStart} loading={loading} />
          {error && <p className="error-text">{error}</p>}
        </>
      )}

      {stage === STAGE.INTERVIEW && (
        <InterviewChat
          sessionId={sessionId}
          initialMessage={initialMessage}
          onEnd={handleEnd}
        />
      )}

      {stage === STAGE.FEEDBACK && (
        <FeedbackReport report={finalReport} onRestart={handleRestart} />
      )}
    </div>
  );
}
