const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  film: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Film',
    index: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  article: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Article',
    index: true 
  },
  stars: { 
    type: Number, 
    min: 1, 
    max: 5,
    required: true 
  },
  comment: String
}, { timestamps: true });

ratingSchema.index({ film: 1, user: 1 }, { 
  unique: true,
  partialFilterExpression: { film: { $exists: true } }
});

ratingSchema.index({ article: 1, user: 1 }, { 
  unique: true,
  partialFilterExpression: { article: { $exists: true } }
});

module.exports = mongoose.model('Rating', ratingSchema);