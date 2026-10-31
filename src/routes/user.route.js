const express = require("express");

const { createUser, getUsers, toggleUserStatus } = require("../controllers/user.controller.js");
const { createUserValidation } = require("../validation/user.validation.js");
const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/auth.js");
const authorize = require("../middlewares/authorize.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createUserValidation,
  validate,
  createUser
);

router.get("/", protect, authorize("admin"), getUsers);
router.patch("/:userId/status", protect, authorize("admin"), toggleUserStatus);

module.exports = router;
