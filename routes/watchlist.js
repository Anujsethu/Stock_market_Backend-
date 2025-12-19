const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const watchCtrl = require('../controllers/watchlistController');

router.post('/', auth, watchCtrl.add);
router.get('/', auth, watchCtrl.list);
router.delete('/:stockId', auth, watchCtrl.remove);

module.exports = router;
