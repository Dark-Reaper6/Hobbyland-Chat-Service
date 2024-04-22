const express = require('express');
const { DispatchEvent } = require("../controllers/event")
const router = express.Router();

router.post('/dispatch', DispatchEvent);

module.exports = router;