const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Chat box realtime");
});

module.exports = app;
