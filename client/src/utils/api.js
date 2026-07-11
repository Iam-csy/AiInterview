import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/interview";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

export async function startInterview(config) {
  const { data } = await api.post("/start", config);
  return data; // { sessionId, message }
}

export async function sendMessage(sessionId, message) {
  const { data } = await api.post("/message", { sessionId, message });
  return data; // { message, questionNumber }
}

export async function endInterview(sessionId) {
  const { data } = await api.post("/end", { sessionId });
  return data; // { message }
}

export default api;
