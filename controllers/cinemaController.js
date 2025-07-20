const Cinema = require('../models/Cinema');

exports.createCinema = async (req, res) => {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json(cinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCinemas = async (req, res) => {
  const cinemas = await Cinema.find();
  res.json(cinemas);
};

exports.getCinemaById = async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);
  if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
  res.json(cinema);
};

exports.updateCinema = async (req, res) => {
  const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
  res.json(cinema);
};

exports.deleteCinema = async (req, res) => {
  const cinema = await Cinema.findByIdAndDelete(req.params.id);
  if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
  res.status(204).send();
};
