const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./api/config.env" });
const app = require("./app");

console.log("Environment PORT:", process.env.PORT);
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
