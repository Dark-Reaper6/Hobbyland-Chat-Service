const express = require('express');
const { GetChatMessages, SendMessage } = require("../controllers/messages")
const router = express.Router();

router.get('/get-many', GetChatMessages);
router.post('/send', SendMessage);

module.exports = router;
