const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  numberOfSeats: Number
});

module.exports = mongoose.model('Cinema', cinemaSchema);
