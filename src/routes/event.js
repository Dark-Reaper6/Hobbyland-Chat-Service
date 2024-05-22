const express = require('express');
const { DispatchEvent, DispatchLogout } = require("../controllers/event")
const router = express.Router();

router.post('/dispatch', DispatchEvent);
router.post('/dispatch-logout', DispatchLogout);

module.exports = router;