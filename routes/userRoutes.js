const express = require('express');
const router = express.Router();
const { getAllUsers, blockUser , updateUserRole , createUser  } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin user management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', protect, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/block/{id}:
 *   put:
 *     summary: Block a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked successfully
 */
router.put('/block/:id', protect, isAdmin, blockUser);

/**
 * @swagger
 * /api/users/role/{id}:
 *   patch:
 *     summary: Update the role of a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role supplied
 *       404:
 *         description: User not found
 */
router.patch('/role/:id', protect, isAdmin, updateUserRole);

/**
 * @swagger
 * /api/users:
 *  post:
 *  summary: Create a new user (admin only)
 *  tags: [Users]
 *  security:
 *  - bearerAuth: []
 *  requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required: [name, email, password]
 * properties:
 *           name:
 *            type: string
 *           email:
 *            type: string
 *           password:
 *            type: string
 * responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       409:
 *         description: Email already in use
 * */
router.post('/', protect, isAdmin, createUser);

module.exports = router;
