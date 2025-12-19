const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const items = await Activity.find({ user: req.user._id }).sort({ date: -1 }).limit(50);
    res.json(items);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};
