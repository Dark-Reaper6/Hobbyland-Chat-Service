const express = require('express');
const { GetRooms, CreateRoom } = require("../controllers/room")
const router = express.Router();

router.get('/get-many', GetRooms);
router.post('/create', CreateRoom);

module.exports = router;