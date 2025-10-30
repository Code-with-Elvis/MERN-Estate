const express = require("express");
const userRouter = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

// ROUTES
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    data: {
      status: "success",
      message: "Welcome to the MERN Estate API",
    },
  });
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
