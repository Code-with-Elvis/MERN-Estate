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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

try {
  User.create({ name: "John Havvey", email: "john@example.com" });
  console.log("User created successfully");
} catch (error) {
  console.error("Error creating user:", error);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
