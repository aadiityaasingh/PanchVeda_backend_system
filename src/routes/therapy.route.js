const express = require("express");

const {
  createTherapy,
  getTherapies,
  getTherapyById,
  updateTherapy,
  deleteTherapy
} = require("../controllers/therapy.controller.js");

const {
  createTherapyValidation
} = require("../validation/therapy.validation.js");

const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Therapies
 *   description: Therapy management APIs
 */

/**
 * @swagger
 * /api/therapies:
 *   post:
 *     summary: Create a new therapy
 *     tags: [Therapies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abhyanga
 *               category:
 *                 type: string
 *                 example: Massage
 *               description:
 *                 type: string
 *                 example: Full body oil massage therapy
 *     responses:
 *       201:
 *         description: Therapy created successfully
 *       400:
 *         description: Therapy already exists
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createTherapyValidation,
  validate,
  createTherapy
);

/**
 * @swagger
 * /api/therapies:
 *   get:
 *     summary: Get all therapies
 *     tags: [Therapies]
 *     responses:
 *       200:
 *         description: List of therapies
 */
router.get("/", getTherapies);
router.get("/:therapyId", getTherapyById);
router.put("/:therapyId", protect, authorize("admin"), updateTherapy);
router.delete("/:therapyId", protect, authorize("admin"), deleteTherapy);

module.exports = router;
