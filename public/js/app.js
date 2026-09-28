const sidebar =
  document.getElementById("sidebar");

const menuButton =
  document.getElementById("menuButton");

const newChat =
  document.getElementById("newChat");

const messageInput =
  document.getElementById("messageInput");

const sendButton =
  document.getElementById("sendButton");

const conversationBox =
  document.getElementById("conversation");

let conversation = [];

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

newChat.addEventListener("click", () => {
  conversation = [];
  conversationBox.innerHTML = "";

  messageInput.value = "";
  messageInput.style.height = "auto";

  messageInput.focus();
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";

  const height = Math.min(
    messageInput.scrollHeight,
    190
  );

  messageInput.style.height =
    height + "px";
});

messageInput.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }
);

sendButton.addEventListener(
  "click",
  sendMessage
);

function addMessage(
  role,
  content = ""
) {
  const message =
    document.createElement("div");

  message.className =
    role === "user"
      ? "message message-user"
      : "message message-assistant";

  const label =
    document.createElement("div");

  label.className =
    "message-label";

  label.textContent =
    role === "user"
      ? "YOU"
      : "NICEGOLD AI";

  const body =
    document.createElement("div");

  body.className =
    "message-content";

  body.textContent = content;

  message.appendChild(label);
  message.appendChild(body);

  conversationBox.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

  return body;
}

function addThinkingMessage() {
  const message =
    document.createElement("div");

  message.className =
    "message message-assistant";

  message.innerHTML = `
    <div class="message-label">
      NICEGOLD AI
    </div>

    <div class="message-content thinking">
      Thinking
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  conversationBox.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

  return message;
}

async function sendMessage() {
  const message =
    messageInput.value.trim();

  if (!message) {
    messageInput.focus();
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Sending";

  const previousHistory = [
    ...conversation
  ];

  conversation.push({
    role: "user",
    content: message
  });

  addMessage(
    "user",
    message
  );

  messageInput.value = "";
  messageInput.style.height = "auto";

  const thinking =
    addThinkingMessage();

  try {
    const response =
      await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message,
          history: previousHistory
        })
      });

    const data =
      await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(
        data.error ||
        "AI request failed."
      );
    }

    thinking.remove();

    addMessage(
      "assistant",
      data.answer
    );

    conversation.push({
      role: "assistant",
      content: data.answer
    });

  } catch (error) {
    console.error(
      "NICEGOLD AI ERROR:",
      error
    );

    thinking.remove();

    conversation.pop();

    addMessage(
      "assistant",
      "I couldn't complete that request.\n\n" +
      (error.message ||
        "Please try again.")
    );

  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    messageInput.focus();
  }
}
