const express = require('express');
const router = express.Router();
const { getAllUsers, blockUser , updateUserRole  } = require('../controllers/userController');
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

module.exports = router;
