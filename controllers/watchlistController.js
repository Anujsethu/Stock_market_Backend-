const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

exports.add = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.body.symbol });
    if (!stock) return res.status(404).json({ msg: 'Stock not found' });
    const exists = await Watchlist.findOne({ user: req.user._id, stock: stock._id });
    if (exists) return res.status(400).json({ msg: 'Already in watchlist' });
    const entry = new Watchlist({ user: req.user._id, stock: stock._id });
    await entry.save();
    res.json(entry);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ user: req.user._id, stock: req.params.stockId });
    res.json({ msg: 'Removed' });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.list = async (req, res) => {
  try {
    const list = await Watchlist.find({ user: req.user._id }).populate('stock');
    res.json(list.map(i => ({ symbol: i.stock.symbol, name: i.stock.name, price: i.stock.price })));
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};
