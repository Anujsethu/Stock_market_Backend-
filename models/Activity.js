const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  meta: { type: Object },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
