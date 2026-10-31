const express = require("express");
const { getBills, getBillByPlan, addPayment } = require("../controllers/bill.controller.js");

const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

router.get("/", protect, authorize("admin", "doctor"), getBills);

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Billing management APIs
 */

/**
 * @swagger
 * /api/bills/plan/{planId}:
 *   get:
 *     summary: Get bill by therapy plan
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: Therapy Plan ID
 *     responses:
 *       200:
 *         description: Bill fetched successfully
 *       404:
 *         description: Bill not found
 */
router.get(
  "/plan/:planId",
  protect,
  authorize("admin", "doctor"),
  getBillByPlan
);

/**
 * @swagger
 * /api/bills/{billId}/pay:
 *   patch:
 *     summary: Add payment to a bill
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: billId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Payment added successfully
 *       404:
 *         description: Bill not found
 */
router.patch(
  "/:billId/pay",
  protect,
  authorize("admin"),
  addPayment
);

module.exports = router;
