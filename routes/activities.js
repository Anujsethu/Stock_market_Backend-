const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const activityCtrl = require('../controllers/activityController');

router.get('/', auth, activityCtrl.list);

module.exports = router;
