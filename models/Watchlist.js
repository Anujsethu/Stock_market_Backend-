const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
