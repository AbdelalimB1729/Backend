const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film' },
  cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema' },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // ex: '19:30'
  seats: [{
    seatNumber: String,
    isReserved: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Session', sessionSchema);
