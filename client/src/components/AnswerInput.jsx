import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function AnswerInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
    };
  }, []);

  function handleSubmit(e) {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  }

  function toggleRecording() {
    if (!SpeechRecognition || disabled) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      recognitionRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Speech recognition failed to start:", error);
      setIsRecording(false);
    }
  }

  return (
    <form className="answer-input" onSubmit={handleSubmit}>
      <textarea
        rows={2}
        placeholder="Type your answer or press the microphone button to dictate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <div className="input-actions">
        <button
          type="button"
          className={`mic-btn ${isRecording ? "recording" : ""}`}
          onClick={toggleRecording}
          disabled={disabled || !SpeechRecognition}
          aria-pressed={isRecording}
          title={SpeechRecognition ? "Start or stop voice input" : "Speech recognition not supported"}
        >
          {isRecording ? "Stop" : "🎙️"}
        </button>
        <button type="submit" disabled={disabled || !text.trim()}>
          Send
        </button>
      </div>
      <div className="voice-status">
        {isRecording && <span>Listening... speak now.</span>}
        {!SpeechRecognition && <span>Voice input is unavailable in this browser.</span>}
      </div>
    </form>
  );
}
