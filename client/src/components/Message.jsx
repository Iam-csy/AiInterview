import React from "react";

export default function Message({ role, content }) {
  const isInterviewer = role === "assistant";
  return (
    <div className={`message ${isInterviewer ? "message-interviewer" : "message-candidate"}`}>
      <div className="message-label">{isInterviewer ? "Interviewer" : "You"}</div>
      <div className="message-content">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line || "\u00A0"}</p>
        ))}
      </div>
    </div>
  );
}
