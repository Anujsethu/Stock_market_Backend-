const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const connectDB = require('./config/db');
const scheduleUpdates = require('./cron/updatePrices');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock_market_db';
connectDB(MONGO_URI);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/activities', require('./routes/activities'));

// seed simple stocks from public/Stock.json if DB empty
const fs = require('fs');
const Stock = require('./models/Stock');
async function seedStocks() {
  const count = await Stock.countDocuments();
  if (count === 0) {
    try {
      const dataPath = path.join(__dirname, '..', 'stock_market', 'public', 'Stock.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf8');
        const parsed = JSON.parse(raw);
        let arr = [];
        if (Array.isArray(parsed)) arr = parsed;
        else if (Array.isArray(parsed.stocks)) arr = parsed.stocks;
        else arr = parsed;
        const docs = arr.map(a => ({
          symbol: a.symbol || a.Symbol || a.name,
          name: a.name || a.symbol || a.Symbol,
          price: Number(a.price) || 10,
          change: Number((a.change || a.percent_change || 0).toString().replace('%','').replace('+','')) || 0,
          volume: a.volume || 0
        }));
        await Stock.insertMany(docs);
        console.log('Seeded stocks');
      }
    } catch (err) { console.error('Seed error', err); }
  }
}

seedStocks();

// start cron
scheduleUpdates();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
