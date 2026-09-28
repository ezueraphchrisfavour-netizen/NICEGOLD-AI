const express = require("express");
const router = express.Router();

const {
  getResponse
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
          (item.role === "user" ||
            item.role === "assistant") &&
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

    const answer =
      await getResponse(messages);

    return res.json({
      ok: true,
      answer
    });

  } catch (error) {
    console.error(
      "OPENROUTER ERROR:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error?.message ||
        "AI request failed."
    });
  }
});

module.exports = router;
