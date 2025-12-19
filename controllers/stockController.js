const Stock = require('../models/Stock');

exports.createStock = async (req, res) => {
  const { symbol, name, price } = req.body;
  if (!symbol) return res.status(400).json({ msg: 'symbol required' });
  try {
    let existing = await Stock.findOne({ symbol });
    if (existing) return res.status(400).json({ msg: 'Stock exists' });
    const s = new Stock({ symbol, name, price: Number(price) || 0 });
    await s.save();
    res.json(s);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    const out = stocks.map(s => ({ name: s.symbol, price: s.price, change: s.change, volume: s.volume }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ msg: 'Not found' });
    res.json(stock);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(stock);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.getGainers = async (req, res) => {
  try {
    const top = await Stock.find().sort({ change: -1 }).limit(10);
    res.json(top.map(s => ({ name: s.symbol, change: s.change })));
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.getLosers = async (req, res) => {
  try {
    const top = await Stock.find().sort({ change: 1 }).limit(10);
    res.json(top.map(s => ({ name: s.symbol, change: s.change })));
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.getTraded = async (req, res) => {
  try {
    const top = await Stock.find().sort({ volume: -1 }).limit(10);
    res.json(top.map(s => ({ name: s.symbol, volume: s.volume })));
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};
