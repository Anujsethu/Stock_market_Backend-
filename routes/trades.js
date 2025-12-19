const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tradeCtrl = require('../controllers/tradeController');

router.post('/', auth, tradeCtrl.create);
router.get('/', auth, tradeCtrl.list);

module.exports = router;
