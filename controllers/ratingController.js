const Rating = require('../models/Rating');

exports.createRating = async (req, res) => {
  try {
    const { article, film, stars, comment } = req.body;
    const userId = req.user.id;

    // Validation renforcée
    if ((!article && !film) || (article && film)) {
      return res.status(400).json({ 
        message: "Spécifiez soit un article, soit un film" 
      });
    }

    // Déterminer le type de ressource
    const resourceType = article ? 'article' : 'film';
    const resourceId = article || film;

    // Vérifier l'existence d'une notation
    const existingRating = await Rating.findOne({
      user: userId,
      [resourceType]: resourceId
    });

    if (existingRating) {
      return res.status(400).json({ 
        message: `Vous avez déjà noté ce ${resourceType}`
      });
    }

    // Créer la notation
    const newRating = await Rating.create({
      [resourceType]: resourceId,
      stars,
      comment,
      user: userId
    });

    // Renvoyer la réponse avec les données peuplées
    const populatedRating = await Rating.findById(newRating._id)
      .populate('user', 'name');

    res.status(201).json(populatedRating);
  } catch (error) {
    console.error("Erreur de notation:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Conflit de notation détecté - Veuillez réessayer"
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Erreur serveur' 
    });
  }
};

exports.getRatings = async (req, res, next) => {
  try {
    const { film, article } = req.query;
    const filter = {};
    
    if (film) filter.film = film;
    if (article) filter.article = article;

    const ratings = await Rating.find(filter)
      .populate('user', 'name')     
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    next(err);
  }
};
exports.getRatingById = async (req, res) => {
  const rating = await Rating.findById(req.params.id).populate('film user');
  if (!rating) {
    return res.status(404).json({ message: 'Rating not found' });
  }
  res.json(rating);
};
exports.updateRating = async (req, res) => {
  const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('film user');
  if (!rating) {
    return res.status(404).json({ message: 'Rating not found' });
  } 
    res.json(rating);
};  
exports.deleteRating = async (req, res) => {
  const rating = await Rating.findByIdAndDelete(req.params.id);
  if (!rating) {
    return res.status(404).json({ message: 'Rating not found' });
  }
  res.status(204).send();
};