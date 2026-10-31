const therapyPlanModel = require("../models/therapyPlan.model.js");
const sessionModel = require("../models/session.model.js");
const billModel = require("../models/bill.model.js");
const { getPagination } = require("../utils/pagination.js");

const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const createTherapyPlan = asyncHandler(async (req, res) => {

  const plan = await therapyPlanModel.create(req.body);

  const sessions = [];

  for (const item of plan.therapies) {
    for (let day = 0; day < item.durationDays; day++) {

      const sessionDate = new Date(plan.startDate);
      sessionDate.setDate(sessionDate.getDate() + day);

      sessions.push({
        therapyPlan: plan._id,
        therapy: item.therapy,
        sessionDate
      });

    }
  }

  await sessionModel.insertMany(sessions);

  const totalAmount = plan.therapies.reduce((sum, item) => {
    return sum + item.durationDays * item.costPerDay;
  }, 0);

  await billModel.create({
    therapyPlan: plan._id,
    patient: plan.patient,
    totalAmount
  });

  res.status(201).json({
    success: true,
    data: plan
  });

});


const getTherapyPlans = asyncHandler(async (req, res) => {

  const { page, limit, skip } = getPagination(req);

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const plans = await therapyPlanModel.find(filter)
    .populate("patient", "fullName phone")
    .populate("therapies.therapy", "name category")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await therapyPlanModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    data: plans
  });

});

const getTherapyPlanById = asyncHandler(async (req, res) => {
  const plan = await therapyPlanModel.findById(req.params.planId)
    .populate("patient", "fullName phone")
    .populate("therapies.therapy", "name category");

  if (!plan) throw new AppError("Therapy plan not found", 404);
  res.status(200).json({ success: true, data: plan });
});


const updatePlanStatus = async (planId) => {

  const sessions = await sessionModel.find({ therapyPlan: planId });

  if (sessions.length === 0) return;

  const allCompleted = sessions.every((s) => s.status === "completed");
  const anyScheduled = sessions.some((s) => s.status === "scheduled");

  let newStatus = "planned";

  if (allCompleted) newStatus = "completed";
  else if (anyScheduled) newStatus = "ongoing";

  await therapyPlanModel.findByIdAndUpdate(planId, {
    status: newStatus
  });

};


module.exports = {
  createTherapyPlan,
  getTherapyPlans,
  getTherapyPlanById,
  updatePlanStatus
};
