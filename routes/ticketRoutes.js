const express = require('express');
const router = express.Router();
const {
  bookTicket, getUserTickets, getTicketById,
  updateTicket, deleteTicket
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Réservation de billets de cinéma
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets for the connected user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user tickets
 */
router.get('/', protect, getUserTickets);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Book a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [session, seatNumber]
 *             properties:
 *               session:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [Stripe, PayPal]
 *     responses:
 *       201:
 *         description: Ticket booked
 */
router.post('/', protect, bookTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
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
 *         description: Ticket details
 */
router.get('/:id', protect, getTicketById);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
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
 *         description: Ticket updated
 */
router.put('/:id', protect, updateTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Cancel a ticket
 *     tags: [Tickets]
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
 *         description: Ticket deleted
 */
router.delete('/:id', protect, deleteTicket);

module.exports = router;
