const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    data: {
      status: "success",
      message: "Welcome to the MERN Estate API",
    },
  });
});

module.exports = app;
