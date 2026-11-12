const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const DEMO_EMAILS = [
  "admin@panchveda.com",
  "dr.ananya@panchveda.com",
  "dr.rajesh@panchveda.com",
  "vikram@panchveda.com",
  "sneha@panchveda.com"
];

const createUser = asyncHandler(async (req, res) => {

  const { fullName, email, password, role } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {

    if (error.code === 11000) {
      throw new AppError("User already exists", 400);
    }

    throw error;
  }

});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().select("fullName email role isActive createdAt").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: users });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (DEMO_EMAILS.includes(user.email.toLowerCase())) {
    throw new AppError("Core demo staff accounts cannot be deactivated in demo mode", 403);
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }
  });
});

module.exports = {
  createUser,
  getUsers,
  toggleUserStatus
};
