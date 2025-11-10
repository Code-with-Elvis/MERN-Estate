const express = require("express");
const userRouter = require("./routes/userRoute");
const listingRouter = require("./routes/listingRoute");
const reviewRouter = require("./routes/reviewRoute");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);

// SERVE STATIC FILES IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
}

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
