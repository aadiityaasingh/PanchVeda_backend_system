const therapyModel = require("../models/therapy.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const CORE_CLASSICAL_THERAPIES = [
  "Vamana Therapy",
  "Virechana Therapy",
  "Basti Therapy",
  "Nasya Therapy",
  "Raktamokshana Therapy"
];

const createTherapy = asyncHandler(async (req, res) => {

  try {
    const therapy = await therapyModel.create(req.body);

    res.status(201).json({
      success: true,
      data: therapy
    });

  } catch (error) {

    if (error.code === 11000) {
      throw new AppError("Therapy already exists", 400);
    }

    throw error;
  }

});

const getTherapies = asyncHandler(async (req, res) => {

  const therapies = await therapyModel
    .find({ isActive: true })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: therapies
  });

});

const getTherapyById = asyncHandler(async (req, res) => {
  const therapy = await therapyModel.findById(req.params.therapyId);
  if (!therapy) {
    throw new AppError("Therapy not found", 404);
  }

  res.status(200).json({
    success: true,
    data: therapy
  });
});

const updateTherapy = asyncHandler(async (req, res) => {
  const existing = await therapyModel.findById(req.params.therapyId);
  if (!existing) {
    throw new AppError("Therapy not found", 404);
  }

  // Guard: In demo mode, classical therapies cannot have their core name or category altered
  if (CORE_CLASSICAL_THERAPIES.includes(existing.name)) {
    if (req.body.name && req.body.name !== existing.name) {
      throw new AppError("Classical Panchakarma therapy names cannot be renamed in demo mode", 403);
    }
    if (req.body.category && req.body.category !== existing.category) {
      throw new AppError("Classical Panchakarma therapy categories cannot be modified in demo mode", 403);
    }
  }

  const therapy = await therapyModel.findByIdAndUpdate(
    req.params.therapyId,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: therapy
  });
});

const deleteTherapy = asyncHandler(async (req, res) => {
  const existing = await therapyModel.findById(req.params.therapyId);
  if (!existing) {
    throw new AppError("Therapy not found", 404);
  }

  if (CORE_CLASSICAL_THERAPIES.includes(existing.name)) {
    throw new AppError("The 5 Classical Panchakarma therapies cannot be deactivated or deleted in demo mode", 403);
  }

  existing.isActive = false;
  await existing.save();

  res.status(200).json({
    success: true,
    message: "Therapy deactivated successfully"
  });
});

module.exports = {
  createTherapy,
  getTherapies,
  getTherapyById,
  updateTherapy,
  deleteTherapy
};
