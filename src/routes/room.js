const express = require('express');
const { GetRoom, GetRooms, CreateRoom } = require("../controllers/room")
const router = express.Router();

router.get('/get-one', GetRoom);
router.get('/get-many', GetRooms);
router.post('/create', CreateRoom);

module.exports = router;