const express = require("express");

const {
  createTherapyPlan,
  getTherapyPlans,
  getTherapyPlanById
} = require("../controllers/therapyPlan.controller.js");

const {
  createTherapyPlanValidation
} = require("../validation/therapyPlan.validation.js");

const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Therapy Plans
 *   description: Therapy plan management APIs
 */

/**
 * @swagger
 * /api/therapy-plans:
 *   post:
 *     summary: Create a therapy plan
 *     tags: [Therapy Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7890abcd1
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-06
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-12
 *               therapies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     therapy:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7890abcd2
 *                     durationDays:
 *                       type: number
 *                       example: 5
 *                     costPerDay:
 *                       type: number
 *                       example: 500
 *     responses:
 *       201:
 *         description: Therapy plan created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin", "doctor"),
  createTherapyPlanValidation,
  validate,
  createTherapyPlan
);

/**
 * @swagger
 * /api/therapy-plans:
 *   get:
 *     summary: Get all therapy plans
 *     tags: [Therapy Plans]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter plans by status
 *     responses:
 *       200:
 *         description: List of therapy plans
 */
router.get("/", protect, authorize("admin", "doctor", "therapist"), getTherapyPlans);
router.get("/:planId", protect, authorize("admin", "doctor", "therapist"), getTherapyPlanById);

module.exports = router;
