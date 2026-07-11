import React from "react";

export default function Loader() {
  return (
    <div className="message message-interviewer">
      <div className="message-label">Interviewer</div>
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
