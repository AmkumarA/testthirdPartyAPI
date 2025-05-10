const express = require('express');
const router = express.Router();
const youtubeController = require('../controller/youtubeSubscibe');

router.get('/checksubscibe', youtubeController.login);
router.get('/oauth2callback', youtubeController.oauthCallback);

module.exports = router;
