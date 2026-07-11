import React from "react";

export default function FeedbackReport({ report, onRestart }) {
  return (
    <div className="feedback-report">
      <h2>Interview Complete</h2>
      <div className="report-body">
        {report.split("\n").map((line, i) => (
          <p key={i}>{line || "\u00A0"}</p>
        ))}
      </div>
      <button onClick={onRestart}>Start New Interview</button>
    </div>
  );
}
