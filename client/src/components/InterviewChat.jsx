import React, { useEffect, useRef, useState } from "react";
import Message from "./Message.jsx";
import Loader from "./Loader.jsx";
import AnswerInput from "./AnswerInput.jsx";
import { sendMessage, endInterview } from "../utils/api.js";

export default function InterviewChat({ sessionId, initialMessage, onEnd }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: initialMessage }]);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== "assistant") return;

    if (typeof window !== "undefined" && window.speechSynthesis && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(latestMessage.content);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, voiceEnabled]);

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
        <div className="chat-controls">
          <button
            className="voice-toggle-btn"
            type="button"
            onClick={() => setVoiceEnabled((value) => !value)}
          >
            {voiceEnabled ? "AI Voice On" : "AI Voice Off"}
          </button>
          <button className="end-btn" onClick={handleEndInterview} disabled={ending}>
            {ending ? "Ending..." : "End Interview"}
          </button>
        </div>
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
