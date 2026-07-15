import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/interview";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error || error?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export async function startInterview(config = {}) {
  const { resumeFile, ...restConfig } = config;

  if (resumeFile) {
    const formData = new FormData();

    Object.entries(restConfig).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    formData.append("resumeFile", resumeFile);

    const { data } = await api.post("/start", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  }

  const { data } = await api.post("/start", restConfig);
  return data;
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
