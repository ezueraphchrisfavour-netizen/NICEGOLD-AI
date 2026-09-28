const express = require("express");
const router = express.Router();

const {
  streamResponse
} = require("../ai/openrouter");

router.post("/", async (req, res) => {
  try {
    const {
      message,
      history
    } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        ok: false,
        error: "A message is required."
      });
    }

    const messages = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (
          item &&
          typeof item.role === "string" &&
          typeof item.content === "string"
        ) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      }
    }

    messages.push({
      role: "user",
      content: message.trim()
    });

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.flushHeaders();

    let fullAnswer = "";

    await streamResponse(
      messages,
      text => {
        fullAnswer += text;

        res.write(
          `data: ${JSON.stringify({
            type: "text",
            text
          })}\n\n`
        );
      }
    );

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        answer: fullAnswer
      })}\n\n`
    );

    res.end();

  } catch (error) {
    console.error(
      "AI STREAM ERROR:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        ok: false,
        error:
          error.message ||
          "AI request failed."
      });
    }

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error:
          error.message ||
          "AI request failed."
      })}\n\n`
    );

    res.end();
  }
});

module.exports = router;
