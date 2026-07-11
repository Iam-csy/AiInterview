import OpenAI from "openai";
import { SYSTEM_PROMPT, buildContextBlock } from "../prompts/systemPrompt.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const apiKey = process.env.OPENAI_API_KEY?.trim();
const client = apiKey ? new OpenAI({ apiKey }) : null;

const buildFallbackReply = (config = {}, message = "") => {
  const role = config?.role || "candidate";
  const experience = config?.experience || "professional";
  const prompt = message && message.trim()
    ? `You said: ${message}`
    : "Please tell me about yourself and your background.";

  return [
    `Thanks for joining the interview. I’m ready to assess your ${role} background at the ${experience} level.`,
    "Set OPENAI_API_KEY to enable real OpenAI responses. For now, please share a short introduction and your relevant experience.",
    prompt,
  ].join(" ");
};

const buildMessages = ({ config, history = [], message }) => {
  const contextBlock = buildContextBlock(config);

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: contextBlock },
    { role: "assistant", content: "Understood. I will conduct the interview accordingly." },
    ...history,
    { role: "user", content: message },
  ];
};

const getInterviewerReply = async ({ config = {}, history = [], message = "" }) => {
  if (!client) {
    console.warn("OpenAI credentials not configured. Using fallback interview reply.");
    return buildFallbackReply(config, message);
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: buildMessages({ config, history, message }),
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : "";
  } catch (error) {
    console.error("OpenAI request failed, using fallback reply:", error.message);
    return buildFallbackReply(config, message);
  }
};

export { getInterviewerReply, MODEL };
