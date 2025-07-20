const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  year: Number,
  director: String,
  description: String,
  duration: Number,
  poster: String
});

module.exports = mongoose.model('Film', filmSchema);
