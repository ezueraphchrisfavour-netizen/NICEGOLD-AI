const OpenAI = require("openai");

const apiKey = process.env.OPENROUTER_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1"
    })
  : null;

async function getResponse(messages) {
  if (!client) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured."
    );
  }

  const response =
    await client.chat.completions.create({
      model: "openrouter/free",
      messages,
      stream: false
    });

  const text =
    response.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  return text;
}

module.exports = {
  getResponse
};
