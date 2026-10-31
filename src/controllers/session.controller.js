const sessionModel = require("../models/session.model.js");
const { updatePlanStatus } = require("./therapyPlan.controller.js");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const getSessionsPlan = asyncHandler(async (req, res) => {

  const filter = { therapyPlan: req.params.planId };

  if (req.query.date) {
    const date = new Date(req.query.date);

    filter.sessionDate = {
      $gte: date,
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
    };
  }

  const sessions = await sessionModel.find(filter)
    .populate("therapy", "name category")
    .sort({ sessionDate: 1 });

  res.status(200).json({
    success: true,
    data: sessions
  });

});

const getSessions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.date) {
    const date = new Date(req.query.date);
    filter.sessionDate = { $gte: date, $lt: new Date(date.getTime() + 86400000) };
  }
  if (req.query.status) filter.status = req.query.status;

  const sessions = await sessionModel.find(filter)
    .populate("therapy", "name category")
    .populate({ path: "therapyPlan", populate: { path: "patient", select: "fullName phone" } })
    .sort({ sessionDate: 1 });

  res.status(200).json({ success: true, data: sessions });
});


const updateSessionStatus = asyncHandler(async (req, res) => {

  const { status, notes } = req.body;

  const allowedStatuses = ["completed", "missed", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid session status", 400);
  }

  const session = await sessionModel.findByIdAndUpdate(
    req.params.sessionId,
    { status, notes },
    { new: true }
  );

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  await updatePlanStatus(session.therapyPlan);

  res.status(200).json({
    success: true,
    data: session
  });

});

module.exports = {
  getSessionsPlan,
  getSessions,
  updateSessionStatus,
};
