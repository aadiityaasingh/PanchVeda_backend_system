const billModel = require("../models/bill.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const getBillByPlan = asyncHandler(async (req, res) => {

  const bill = await billModel
    .findOne({ therapyPlan: req.params.planId })
    .populate("patient", "fullName phone");

  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  res.status(200).json({
    success: true,
    data: bill
  });

});

const getBills = asyncHandler(async (req, res) => {
  const bills = await billModel.find()
    .populate("patient", "fullName phone")
    .populate("therapyPlan", "startDate endDate status")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: bills });
});


const addPayment = asyncHandler(async (req, res) => {

  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError("Payment amount must be greater than zero", 400);
  }

  const bill = await billModel.findById(req.params.billId);

  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  bill.paidAmount = Math.min(bill.paidAmount + amount, bill.totalAmount);

  if (bill.paidAmount >= bill.totalAmount) {
    bill.status = "paid";
  } else {
    bill.status = "partial";
  }

  await bill.save();

  res.status(200).json({
    success: true,
    data: bill
  });

});

module.exports = {
  getBillByPlan,
  getBills,
  addPayment,
};
