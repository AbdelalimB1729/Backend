const Film = require('../models/Film');

exports.createFilm = async (req, res) => {
  const film = await Film.create(req.body);
  res.status(201).json(film);
};

exports.getFilms = async (req, res) => {
  const films = await Film.find();
  res.json(films);
};
exports.getFilmById = async (req, res) => {
  const film = await Film.findById(req.params.id);
  if (!film) {
    return res.status(404).json({ message: 'Film not found' });
  }
  res.json(film);
};
exports.updateFilm = async (req, res) => {
    const film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!film) {
        return res.status(404).json({ message: 'Film not found' });
    }   
    res.json(film);
}
exports.deleteFilm = async (req, res) => {
    const film = await Film.findByIdAndDelete(req.params.id);
    if (!film) {
        return res.status(404).json({ message: 'Film not found' });
    }
    res.status(204).send();
}
exports.getFilmsByGenre = async (req, res) => {
    const films = await Film.find({ genre: req.params.genre });
    if (films.length === 0) {
        return res.status(404).json({ message: 'No films found for this genre' });
    }
    res.json(films);
}