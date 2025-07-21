const Article = require('../models/Article');

exports.createArticle = async (req, res) => {
  const article = await Article.create({
    ...req.body,
    author: req.user.id,
  });

  res.status(201).json(article);
};

exports.getArticles = async (req, res) => {
  const articles = await Article
    .find()
    .sort({ createdAt: -1 })
    .populate('author', 'name');
  res.json(articles);
};

exports.getArticleById = async (req, res) => {
  const article = await Article
    .findById(req.params.id)
    .populate('author', 'name');
  if (!article) {
    return res.status(404).json({ message: 'Article introuvable' });
  }
  res.json(article);
};

exports.updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(article);
};

exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};