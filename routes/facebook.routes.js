const express = require('express');
const router = express.Router();
const facebookController = require('../controller/facebookController');

router.get('/login', facebookController.facebookLogin);
router.get('/callback', facebookController.facebookCallback);

module.exports = router;
