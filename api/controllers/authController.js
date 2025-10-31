const User = require("../modals/userModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = createJWT(user._id);

  // === Set cookie ===

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  });

  // === Remove password from output ===

  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const protect = catchAsync(async (req, res, next) => {
  // === Getting token and check if it's there ===
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } // === Otherwise, check cookies
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // === Verify token ===
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // === Check if user still exists ===
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // === Check if user changed password after the token was issued ===
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // === Grant access to protected route ===
  req.user = currentUser;
  next();
});

const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // == expires in 10 seconds ==
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

module.exports = {
  signUp,
  signIn,
  protect,
  logout,
};
