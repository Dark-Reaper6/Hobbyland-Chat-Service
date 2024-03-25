const express = require('express');
const { GetChatMessages, SendMessage } = require("../controllers/messages")
const router = express.Router();

router.get('/get-messages', GetChatMessages);
router.post('/send', SendMessage);

module.exports = router;
