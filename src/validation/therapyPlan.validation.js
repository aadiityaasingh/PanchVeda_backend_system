const { body } = require("express-validator");
const { diffInDays } = require("../utils/date.js");

const createTherapyPlanValidation = [
  body("patient").isMongoId().withMessage("Invalid patient ID"),

  body("startDate")
    .isISO8601()
    .withMessage("Invalid start date")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .isISO8601()
    .withMessage("Invalid end date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date cannot be before start date");
      }

      const planDays = diffInDays(req.body.startDate, value);

      if (Array.isArray(req.body.therapies) && req.body.therapies.length > 0) {
        const durations = req.body.therapies.map((t) => Number(t.durationDays) || 0);
        const maxTherapyDays = Math.max(...durations);

        if (maxTherapyDays > planDays) {
          throw new Error(
            `Therapy duration (${maxTherapyDays} days) exceeds plan duration (${planDays} days)`
          );
        }
      }

      return true;
    }),

  body("therapies")
    .isArray({ min: 1 })
    .withMessage("At least one therapy must be added to the plan"),

  body("therapies").custom((therapies) => {
    if (!Array.isArray(therapies)) return true;
    const ids = therapies.map((t) => t.therapy);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new Error("Duplicate therapies are not allowed in a plan");
    }

    return true;
  }),

  body("therapies.*.therapy").isMongoId().withMessage("Invalid therapy ID"),
  body("therapies.*.durationDays").isInt({ min: 1 }).withMessage("Duration must be at least 1 day"),
  body("therapies.*.costPerDay").isFloat({ min: 0 }).withMessage("Cost per day must be non-negative")
];

module.exports = {
  createTherapyPlanValidation
};
