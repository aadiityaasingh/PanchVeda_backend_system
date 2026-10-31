const express = require("express");

const {
  getSessionsPlan,
  getSessions,
  updateSessionStatus
} = require("../controllers/session.controller.js");

const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Therapy session management APIs
 */

/**
 * @swagger
 * /api/sessions/plan/{planId}:
 *   get:
 *     summary: Get sessions for a therapy plan
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapy Plan ID
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter sessions by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Sessions fetched successfully
 */
router.get("/", protect, authorize("admin", "doctor", "therapist"), getSessions);
router.get("/plan/:planId", protect, authorize("admin", "doctor", "therapist"), getSessionsPlan);

/**
 * @swagger
 * /api/sessions/{sessionId}/status:
 *   patch:
 *     summary: Update session status
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: completed
 *               notes:
 *                 type: string
 *                 example: Patient responded well
 *     responses:
 *       200:
 *         description: Session status updated
 *       404:
 *         description: Session not found
 */
router.patch(
  "/:sessionId/status",
  protect,
  authorize("admin", "doctor", "therapist"),
  updateSessionStatus
);

module.exports = router;
