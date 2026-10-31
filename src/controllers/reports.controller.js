const billModel = require("../models/bill.model.js");
const therapyPlanModel = require("../models/therapyPlan.model.js");
const patientModel = require("../models/patient.model.js");

const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");


const getRevenueReport = asyncHandler(async (req, res) => {

  const revenue = await billModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$paidAmount" }
      }
    }
  ]);

  const result = revenue[0] || {
    totalRevenue: 0,
    totalPaid: 0
  };

  const totalUnpaid = result.totalRevenue - result.totalPaid;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: result.totalRevenue,
      totalPaid: result.totalPaid,
      totalUnpaid
    }
  });

});


const getTopTherapies = asyncHandler(async (req, res) => {

  const therapies = await therapyPlanModel.aggregate([
    { $unwind: "$therapies" },

    {
      $group: {
        _id: "$therapies.therapy",
        count: { $sum: 1 }
      }
    },

    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "therapies",
        localField: "_id",
        foreignField: "_id",
        as: "therapy"
      }
    },
    { $unwind: { path: "$therapy", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        count: 1,
        name: { $ifNull: ["$therapy.name", "Unknown Therapy"] },
        category: { $ifNull: ["$therapy.category", "other"] }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: therapies
  });

});


const getPatientStats = asyncHandler(async (req, res) => {

  const totalPatients = await patientModel.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalPatients
    }
  });

});


module.exports = {
  getRevenueReport,
  getTopTherapies,
  getPatientStats
};
