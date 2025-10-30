const User = require("../modals/userModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signUp = catchAsync(async (req, res) => {
  const { username, name, email, password } = req.body;
  const newUser = await User.create({ username, name, email, password });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

module.exports = {
  signUp,
};
