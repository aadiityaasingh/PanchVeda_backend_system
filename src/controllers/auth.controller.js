const bcrypt = require("bcrypt");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await userModel
    .findOne({ email, isActive: true })
    .select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });

});

const getSetupStatus = asyncHandler(async (req, res) => {
  const userCount = await userModel.countDocuments();
  res.status(200).json({ success: true, data: { needsSetup: userCount === 0 } });
});

const setupInitialAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName?.trim() || !email?.includes("@") || !password || password.length < 6) {
    throw new AppError("Enter a name, valid email, and a password with at least 6 characters", 400);
  }

  if (await userModel.exists({})) {
    throw new AppError("Initial setup has already been completed", 403);
  }

  const user = await userModel.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
    role: "admin"
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
  });
});

module.exports = {
  login,
  getSetupStatus,
  setupInitialAdmin
};
