const express = require("express");
const userRouter = require("./routes/userRoute");
const listingRouter = require("./routes/listingRoute");
const reviewRouter = require("./routes/reviewRoute");
const favoriteRouter = require("./routes/favoriteRoute");
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");

const app = express();

// SET SECURE HTTP HEADERS
app.use(helmet());

// LIMIT REQUEST BODY SIZE
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// BODY PARSER AND CORS MIDDLEWARE

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// DATA SANITIZATION MIDDLEWARES
// app.use((req, res, next) => {
//   if (req.body && typeof req.body === "object") {
//     mongoSanitize()(req, res, next);
//   } else {
//     next();s
//   }
// });
// app.use(mongoSanitize());
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [],
  })
);

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/favorites", favoriteRouter);

// SERVE STATIC FILES IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
