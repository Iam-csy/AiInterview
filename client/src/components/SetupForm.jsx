import React, { useState } from "react";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "Node.js Developer",
  "Software Engineer",
  "AI Engineer",
  "ML Engineer",
];

const EXPERIENCES = ["Fresher", "0-1 Years", "2-5 Years", "5+ Years"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TYPES = [
  "HR Interview",
  "MERN Stack",
  "Java",
  "Spring Boot",
  "Node.js",
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "SQL",
  "MongoDB",
  "System Design",
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "AI",
  "DevOps",
  "Cloud",
  "Cyber Security",
];

export default function SetupForm({ onStart, loading }) {
  const [role, setRole] = useState(ROLES[0]);
  const [experience, setExperience] = useState(EXPERIENCES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [type, setType] = useState(TYPES[0]);
  const [resume, setResume] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onStart({ role, experience, difficulty, type, resume });
  }

  return (
    <form className="setup-form" onSubmit={handleSubmit}>
      <div className="landing-hero">
        <div>
          <h1>InterviewGPT</h1>
          <p className="subtitle">Configure your mock interview with dynamic AI prompts, voice support, and instant feedback.</p>
          <div className="feature-chips">
            <span>AI interviewer</span>
            <span>Voice-ready answers</span>
            <span>Config preview</span>
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-label">Live preview</div>
          <div className="preview-item">
            <strong>Role:</strong> {role}
          </div>
          <div className="preview-item">
            <strong>Experience:</strong> {experience}
          </div>
          <div className="preview-item">
            <strong>Difficulty:</strong> {difficulty}
          </div>
          <div className="preview-item">
            <strong>Type:</strong> {type}
          </div>
        </div>
      </div>

      <div className="setup-grid">
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label>
          Experience
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            {EXPERIENCES.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        <label>
          Difficulty
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label>
          Interview Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Resume (paste text, optional)
        <textarea
          rows={5}
          placeholder="Paste your resume text here so the interviewer can ask about your projects..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
      </label>

      <div className="form-footer">
        <div className="hint-box">
          <strong>Tip:</strong> Use the preview card to review your interview setup before you start.
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </div>
    </form>
  );
}
