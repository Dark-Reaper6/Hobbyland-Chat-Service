const { isValidObjectId } = require("mongoose");
const Room = require("../models/room");
const Message = require("../models/message");
const StandardApi = require("../middlewares/standard-api");

const CreateRoom = async (req, res) => StandardApi(req, res, async () => {
    const { user_id } = req.body;
    if (!isValidObjectId(user_id)) return res.status(400).json({ success: false, msg: "The user_id Body Parameter is required with whom this user wants to create a chat room." });

    let room = await Room.findOne({
        members: { $all: [req.user._id, user_id] },
        isGroup: false
    }).populate('last_author last_message members').lean();

    if (!room) {
        room = (await Room.create({ members: [req.user.id, req.fields.user] })).toObject();

        const message = (await Message.create({
            room_id: room._id,
            content: req.user.username + " create this room",
            author: req.user._id,
            members: room.members,
            type: 'tooltip',
        })).toObject();

        room = await Room.findByIdAndUpdate(room._id,
            { last_message: message._id },
            { lean: true, new: true }
        ).populate('last_author last_message members')
    }
    res.status(200).json({ success: true, msg: "Room created successfully", room });
})

const GetRooms = async (req, res) => StandardApi(req, res, async () => {
    const rooms = await Room.find({ members: req.user._id }).populate('last_author last_message members').lean();
    res.status(200).json({ success: true, msg: '', rooms })
})

module.exports = {
    GetRooms,
    CreateRoom
}