const User = require("../modals/userModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = {
  getAllUsers,
  getMe,
  getUser,
};
