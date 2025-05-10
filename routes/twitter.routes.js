const express = require('express');
const router = express.Router();
const { twitterLogin, twitterCallback } = require('../controller/twitterController');

router.get('/login', twitterLogin);
router.get('/callback', twitterCallback);

module.exports = router;
