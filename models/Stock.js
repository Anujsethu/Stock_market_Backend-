const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String },
  price: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', StockSchema);
