const express = require('express');
const { DispatchNotification, DispatchLogout } = require("../controllers/event")
const router = express.Router();

router.post('/dispatch-notification', DispatchNotification);
router.post('/dispatch-logout', DispatchLogout);

module.exports = router;