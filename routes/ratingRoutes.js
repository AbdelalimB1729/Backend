const express = require('express');
const router = express.Router();
const {
  createRating, getRatings, getRatingById,
  updateRating, deleteRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Avis et notation de films
 */

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     summary: Get all ratings
 *     tags: [Ratings]
 *     responses:
 *       200:
 *         description: List of ratings
 */
router.get('/', getRatings);

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Submit a new rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [film, stars]
 *             properties:
 *               film:
 *                 type: string
 *               stars:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating submitted
 */
router.post('/', protect, createRating);

/**
 * @swagger
 * /api/ratings/{id}:
 *   get:
 *     summary: Get a rating by ID
 *     tags: [Ratings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating details
 */
router.get('/:id', getRatingById);

/**
 * @swagger
 * /api/ratings/{id}:
 *   put:
 *     summary: Update a rating
 *     tags: [Ratings]
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
 *         description: Rating updated
 */
router.put('/:id', protect, updateRating);

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     tags: [Ratings]
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
 *         description: Rating deleted
 */
router.delete('/:id', protect, deleteRating);

module.exports = router;
