const express = require('express');
const router = express.Router();
const {
  createFilm, getFilms, getFilmById,
  updateFilm, deleteFilm, getFilmsByGenre
} = require('../controllers/filmController');
const { protect } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Film management
 */

/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Get all films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: List of all films
 */
router.get('/', getFilms);

/**
 * @swagger
 * /api/films:
 *   post:
 *     summary: Create a new film
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               year:
 *                 type: number
 *               director:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               poster:
 *                 type: string
 *     responses:
 *       201:
 *         description: Film created
 */
router.post('/', protect, isAdmin, createFilm);

/**
 * @swagger
 * /api/films/{id}:
 *   get:
 *     summary: Get a film by ID
 *     tags: [Films]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film details
 */
router.get('/:id', getFilmById);

/**
 * @swagger
 * /api/films/genre/{genre}:
 *   get:
 *     summary: Get films by genre
 *     tags: [Films]
 *     parameters:
 *       - name: genre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Films by genre
 */
router.get('/genre/:genre', getFilmsByGenre);

/**
 * @swagger
 * /api/films/{id}:
 *   put:
 *     summary: Update a film
 *     tags: [Films]
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
 *         description: Film updated
 */
router.put('/:id', protect, isAdmin, updateFilm);

/**
 * @swagger
 * /api/films/{id}:
 *   delete:
 *     summary: Delete a film
 *     tags: [Films]
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
 *         description: Film deleted
 */
router.delete('/:id', protect, isAdmin, deleteFilm);

module.exports = router;
