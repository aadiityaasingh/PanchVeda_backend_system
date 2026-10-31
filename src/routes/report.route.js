const express = require("express");

const {
  getRevenueReport,
  getTopTherapies,
  getPatientStats
} = require("../controllers/reports.controller.js");

const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting and analytics APIs
 */

/**
 * @swagger
 * /api/reports/revenue:
 *   get:
 *     summary: Get revenue report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue report fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/revenue",
  protect,
  authorize("admin"),
  getRevenueReport
);

/**
 * @swagger
 * /api/reports/top-therapies:
 *   get:
 *     summary: Get top therapies usage report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top therapies fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/top-therapies",
  protect,
  authorize("admin", "doctor"),
  getTopTherapies
);

/**
 * @swagger
 * /api/reports/patient-count:
 *   get:
 *     summary: Get total patient statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient statistics fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/patient-count",
  protect,
  authorize("admin", "doctor"),
  getPatientStats
);

module.exports = router;
