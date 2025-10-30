const AppError = require("../utils/appError");

// --- Handlers for specific DB errors ---
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue
    ? Object.values(err.keyValue)[0]
    : "duplicate value";
  return new AppError(
    `"${value}" already exists. Please use another value!`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
};

// --- JWT-related errors ---
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// --- Senders for different environments ---

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Expected (trusted) error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown or programming error
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// --- Main global error handler ---

const globalErrorHandler = (err, req, res, next) => {
  // Ensure defaults
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Shallow clone to avoid mutating the original
  let error = { ...err, message: err.message };

  // Handle known errors
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Respond based on environment
  process.env.NODE_ENV === "development"
    ? sendErrorDev(error, res)
    : sendErrorProd(error, res);
};

module.exports = globalErrorHandler;
