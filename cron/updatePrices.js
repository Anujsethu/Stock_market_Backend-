const cron = require('node-cron');
const Stock = require('../models/Stock');
const Activity = require('../models/Activity');

module.exports = function scheduleUpdates() {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const stocks = await Stock.find();
      for (const s of stocks) {
        const change = (Math.random() - 0.5) * (s.price || 10) * 0.02;
        const newPrice = Math.max(0.01, +(s.price + change).toFixed(2));
        const pct = ((newPrice - s.price) / (s.price || 1)) * 100;
        s.change = +(pct.toFixed(2));
        s.price = newPrice;
        s.lastUpdated = new Date();
        await s.save();
        if (Math.abs(pct) > 5) {
          await Activity.create({ message: `Significant move ${s.symbol} ${pct.toFixed(2)}%`, meta: { symbol: s.symbol } });
        }
      }
    } catch (err) {
      console.error('Cron update error', err);
    }
  });
};
