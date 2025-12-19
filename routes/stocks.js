const express = require('express');
const router = express.Router();
const stockCtrl = require('../controllers/stockController');
const auth = require('../middleware/auth');

// Protected routes - require authentication
router.get('/', auth, stockCtrl.getStocks);
router.post('/', auth, stockCtrl.createStock);
router.get('/gainers', auth, stockCtrl.getGainers);
router.get('/losers', auth, stockCtrl.getLosers);
router.get('/traded', auth, stockCtrl.getTraded);
router.get('/:id', auth, stockCtrl.getStock);
router.put('/:id', auth, stockCtrl.updateStock);
router.delete('/:id', auth, stockCtrl.deleteStock);

module.exports = router;
