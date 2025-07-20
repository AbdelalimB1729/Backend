const express = require('express');
const router = express.Router();
const {
  createCinema, getCinemas, getCinemaById,
  updateCinema, deleteCinema
} = require('../controllers/cinemaController');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Cinemas
 *   description: Manage cinema locations
 */

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Get all cinemas
 *     tags: [Cinemas]
 *     responses:
 *       200:
 *         description: List of cinemas
 */
router.get('/', getCinemas);

/**
 * @swagger
 * /api/cinemas:
 *   post:
 *     summary: Create a new cinema
 *     tags: [Cinemas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               numberOfSeats:
 *                 type: number
 *     responses:
 *       201:
 *         description: Cinema created
 */
router.post('/', protect, isAdmin, createCinema);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   get:
 *     summary: Get a cinema by ID
 *     tags: [Cinemas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cinema data
 */
router.get('/:id', getCinemaById);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   put:
 *     summary: Update a cinema
 *     tags: [Cinemas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cinema updated
 */
router.put('/:id', protect, isAdmin, updateCinema);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   delete:
 *     summary: Delete a cinema
 *     tags: [Cinemas]
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
 *         description: Cinema deleted
 */
router.delete('/:id', protect, isAdmin, deleteCinema);

module.exports = router;
