const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey
    })
  : null;

async function streamResponse(messages, onText) {
  if (!client) {
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  const stream = await client.responses.create({
    model: "gpt-5.6-luna",
    input: messages,
    stream: true
  });

  let fullText = "";

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      const text = event.delta || "";

      fullText += text;

      if (onText) {
        onText(text);
      }
    }
  }

  return fullText;
}

module.exports = {
  streamResponse
};
