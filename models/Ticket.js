const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  seatNumber: String,
  paid: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['Stripe', 'PayPal'] }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
