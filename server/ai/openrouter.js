const OpenAI = require("openai");

const apiKey = process.env.OPENROUTER_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    })
  : null;

async function streamResponse(messages, onText) {
  if (!client) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured."
    );
  }

  const stream = await client.chat.completions.create({
    model: "openrouter/free",
    messages,
    stream: true
  });

  let fullText = "";

  for await (const chunk of stream) {
    const text =
      chunk.choices?.[0]?.delta?.content || "";

    if (!text) continue;

    fullText += text;

    if (onText) {
      onText(text);
    }
  }

  return fullText;
}

module.exports = {
  streamResponse
};
