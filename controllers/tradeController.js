const Trade = require('../models/Trade');
const Stock = require('../models/Stock');
const Activity = require('../models/Activity');

exports.create = async (req, res) => {
  try {
    const { symbol, type, quantity, price } = req.body;
    if (!symbol || !type || !quantity) return res.status(400).json({ msg: 'symbol, type, quantity required' });
    if (!['buy','sell'].includes(type)) return res.status(400).json({ msg: 'type must be buy or sell' });
    const stock = await Stock.findOne({ symbol });
    if (!stock) return res.status(404).json({ msg: 'Stock not found' });
    const trade = new Trade({
      user: req.user._id,
      stock: stock._id,
      type,
      quantity: Number(quantity),
      price: Number(price) || stock.price
    });
    await trade.save();
    await Activity.create({ user: req.user._id, message: `Executed ${trade.type} ${trade.quantity} ${stock.symbol}`, meta: { tradeId: trade._id } });
    res.json(trade);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};

exports.list = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).populate('stock');
    res.json(trades.map(t => ({ symbol: t.stock.symbol, type: t.type, quantity: t.quantity, price: t.price, date: t.date })));
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
};
