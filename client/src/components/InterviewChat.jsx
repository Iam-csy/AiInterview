import React, { useEffect, useRef, useState } from "react";
import Message from "./Message.jsx";
import Loader from "./Loader.jsx";
import AnswerInput from "./AnswerInput.jsx";
import { sendMessage, endInterview } from "../utils/api.js";

export default function InterviewChat({ sessionId, initialMessage, onEnd }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: initialMessage },
  ]);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text) {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { message } = await sendMessage(sessionId, text);
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleEndInterview() {
    setEnding(true);
    try {
      const { message } = await endInterview(sessionId);
      onEnd(message);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Couldn't generate final feedback. Please try again." },
      ]);
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
