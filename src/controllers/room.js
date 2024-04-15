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
        room = new Room({ members: [req.user.id, req.fields.user] });

        const message = (await Message.create({
            room_id: room._id,
            content: req.user.username + " create this room",
            author: req.user._id,
            members: room.members,
            type: 'tooltip',
        })).toObject();

        room.last_message = message._id;
        room = await room.save();
    }

    room = await Room.findById(room._id).populate('lastAuthor').populate('lastMessage').populate('members').lean();
    res.status(200).json({ status: 'ok', room });
})

module.exports = {
    CreateRoom
}