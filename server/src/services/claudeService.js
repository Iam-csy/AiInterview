import { ChatOllama } from "@langchain/ollama";
import { SYSTEM_PROMPT, buildContextBlock } from "../prompts/systemPrompt.js";

const MODEL = "llama3.2";
const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

let model = null;

try {
  model = new ChatOllama({
    model: MODEL,
    baseUrl,
  });
} catch (error) {
  console.error("Failed to initialize Ollama model:", error.message);
}

const buildFallbackReply = (config = {}, message = "") => {
  const role = config?.role || "candidate";
  const experience = config?.experience || "professional";
  const prompt = message && message.trim()
    ? `You said: ${message}`
    : "Please tell me about yourself and your background.";

  return [
    `Thanks for joining the interview. I’m ready to assess your ${role} background at the ${experience} level.`,
    "Start Ollama locally and ensure the selected model is available to enable real interview responses. For now, please share a short introduction and your relevant experience.",
    prompt,
  ].join(" ");
};

const buildPrompt = ({ config, history = [], message = "" }) => {
  const contextBlock = buildContextBlock(config);
  const historyText = history
    .map(({ role, content }) => `${role === "assistant" ? "Assistant" : "Candidate"}: ${content}`)
    .join("\n");

  return [
    `System: ${SYSTEM_PROMPT}`,
    `Context: ${contextBlock}`,
    "Assistant: Understood. I will conduct the interview accordingly.",
    historyText,
    `Candidate: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
};

const getInterviewerReply = async ({ config = {}, history = [], message = "" }) => {
  if (!model) {
    console.warn("Ollama model not available. Using fallback interview reply.");
    return buildFallbackReply(config, message);
  }

  try {
    const response = await model.invoke(buildPrompt({ config, history, message }));
    const content = response?.content;

    if (typeof content === "string") {
      return content.trim();
    }

    if (Array.isArray(content)) {
      return content.map((item) => item?.text || "").filter(Boolean).join("\n");
    }

    return "";
  } catch (error) {
    console.error("Ollama request failed, using fallback reply:", error.message);
    return buildFallbackReply(config, message);
  }
};

export { getInterviewerReply, MODEL };
