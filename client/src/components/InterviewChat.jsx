import React, { useEffect, useRef, useState } from "react";
import Message from "./Message.jsx";
import Loader from "./Loader.jsx";
import AnswerInput from "./AnswerInput.jsx";
import { sendMessage, endInterview } from "../utils/api.js";

export default function InterviewChat({ sessionId, initialMessage, onEnd }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: initialMessage }]);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const appendMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  async function handleSend(text) {
    const trimmedText = text?.trim();
    if (!trimmedText) return;

    appendMessage("user", trimmedText);
    setLoading(true);

    try {
      const { message } = await sendMessage(sessionId, trimmedText);
      appendMessage("assistant", message);
    } catch (error) {
      appendMessage("assistant", "Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEndInterview() {
    setEnding(true);

    try {
      const { message } = await endInterview(sessionId);
      onEnd(message);
    } catch (error) {
      appendMessage("assistant", "Couldn't generate final feedback. Please try again.");
    } finally {
      setEnding(false);
    }
  }

  return (
    <div className="interview-chat">
      <div className="chat-header">
        <span>Live Interview</span>
        <button className="end-btn" onClick={handleEndInterview} disabled={ending}>
          {ending ? "Ending..." : "End Interview"}
        </button>
      </div>

      <div className="chat-window">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
        {loading && <Loader />}
        <div ref={bottomRef} />
      </div>

      <AnswerInput onSend={handleSend} disabled={loading || ending} />
    </div>
  );
}
