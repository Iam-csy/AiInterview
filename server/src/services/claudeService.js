const OpenAI = require("openai");
const { SYSTEM_PROMPT, buildContextBlock } = require("../prompts/systemPrompt");

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

function buildFallbackReply(config = {}, message = "") {
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
}

/**
 * Sends the running conversation + interview config to OpenAI and
 * returns the interviewer's next message.
 *
 * @param {Object} params
 * @param {Object} params.config - { role, experience, difficulty, type, resume }
 * @param {Array}  params.history - [{ role: 'user'|'assistant', content: string }]
 * @param {string} params.message - latest candidate message
 */
async function getInterviewerReply({ config, history = [], message }) {
  if (!client) {
    console.warn("OpenAI credentials not configured. Using fallback interview reply.");
    return buildFallbackReply(config, message);
  }

  const contextBlock = buildContextBlock(config);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: contextBlock },
    { role: "assistant", content: "Understood. I will conduct the interview accordingly." },
    ...history,
    { role: "user", content: message },
  ];

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages,
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : "";
  } catch (err) {
    console.error("OpenAI request failed, using fallback reply:", err.message);
    return buildFallbackReply(config, message);
  }
}

module.exports = { getInterviewerReply, MODEL };
