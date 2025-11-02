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

const updateMe = catchAsync(async (req, res, next) => {
  const { name, username, photo } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, username, photo },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Please provide both current and new passwords", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 400));
  }

  user.password = newPassword;
  await user.save();

  // === Remove password from output ===

  user.password = undefined;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deactivateMe = catchAsync(async (req, res, next) => {
  // === Find User ===
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  // === Toggle active status ===
  const isActive = user.active;

  await User.findByIdAndUpdate(req.user.id, { active: !isActive });
  res.status(200).json({
    status: "success",
    data: {
      active: !isActive,
    },
  });
});

module.exports = {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updatePassword,
  deactivateMe,
};
