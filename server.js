require("dotenv").config();

const express = require("express");
const path = require("path");

const chatRouter = require("./server/api/chat");

const app = express();

const PORT =
  process.env.PORT || 3000;

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.use(
  "/api/chat",
  chatRouter
);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    name: "NICEGOLD AI",
    version: "1.0.0",
    status: "online"
  });
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");
    console.log(
      "NICEGOLD AI"
    );
    console.log(
      "System online"
    );
    console.log("");
    console.log(
      `Local: http://127.0.0.1:${PORT}`
    );
    console.log("");
  }
);
