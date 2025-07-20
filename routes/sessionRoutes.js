const express = require('express');
const router = express.Router();
const {
  createSession, getSessions, getSessionById,
  updateSession, deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Séances de cinéma (planning et gestion)
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: List of all sessions
 */
router.get('/', getSessions);

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [film, cinema, date, time]
 *             properties:
 *               film:
 *                 type: string
 *                 example: 68374a8cf8c72d0561dff95b
 *               cinema:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatNumber:
 *                       type: string
 *                     isReserved:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Session created
 */
router.post('/', protect, isAdmin, createSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details
 */
router.get('/:id', getSessionById);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Session updated
 */
router.put('/:id', protect, isAdmin, updateSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Session deleted
 */
router.delete('/:id', protect, isAdmin, deleteSession);

module.exports = router;
