const express = require('express');
const router = express.Router();

const {
  createArticle,
  getArticles,
  updateArticle,
  getArticleById, 
  deleteArticle,
} = require('../controllers/blogController');

const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Operations related to film articles and critiques
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all articles
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/', getArticles);
router.get('/:id', getArticleById);

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new article with image URL
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: URL of the image
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Article created
 */
router.post('/', protect, createArticle);

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Article ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: URL of the image
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article updated
 */
router.put('/:id', protect, updateArticle);

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Article ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 */
router.delete('/:id', protect, deleteArticle);

module.exports = router;