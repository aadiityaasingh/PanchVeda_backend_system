const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientHistory
} = require("../controllers/patient.controller.js");

const {
  createPatientValidation
} = require("../validation/patient.validation.js");

const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management APIs
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post(
  "/",
  protect,
  authorize("admin", "doctor"),
  createPatientValidation,
  validate,
  createPatient
);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/", protect, authorize("admin", "doctor", "therapist"), getPatients);

router.get("/:patientId", protect, authorize("admin", "doctor", "therapist"), getPatientById);
router.put("/:patientId", protect, authorize("admin", "doctor"), updatePatient);
router.delete("/:patientId", protect, authorize("admin"), deletePatient);

/**
 * @swagger
 * /api/patients/{patientId}/history:
 *   get:
 *     summary: Get patient treatment history
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient history fetched
 */
router.get(
  "/:patientId/history",
  protect,
  authorize("admin", "doctor", "therapist"),
  getPatientHistory
);

module.exports = router;
