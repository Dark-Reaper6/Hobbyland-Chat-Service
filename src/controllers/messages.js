const Room = require('../models/Room');
const Message = require('../models/message');
const { isValidObjectId } = require("mongoose");
const { io } = require("../socket");
const { SendMessageSchema } = require("../validation-schemas")
const StandardApi = require("../middlewares/standard-api");

const GetChatMessages = async (req, res) => StandardApi(req, res, async () => {
  const { room_id } = req.body;
  if (!isValidObjectId(room_id)) return res.status(400).json({ success: false, msg: "room id is required." });

  const LIMIT = +req.query.limit || 25;
  const msgQuery = { room_id, deleted: false }
  let totalMessages = await Message.countDocuments(msgQuery);
  const total_pages = Math.ceil(totalMessages / LIMIT);
  const page = +req.query.page || 1;
  const skipMsgs = (page - 1) * LIMIT;
  let messages = await Message.find(msgQuery)
    .sort({ updatedAt: -1 })
    .skip(skipMsgs)
    .limit(LIMIT)
    .populate('author')
    .lean()

  res.status(200).json({ success: true, msg: '', messages, page, total_pages });
})

const SendMessage = async (req, res) => StandardApi(req, res, async () => {
  const { room_id, message, files } = req.body;

  const newMessage = (await Message.create({
    author: req.user.id,
    room_id,
    content: message,
    files
  })).toObject();

  const room = await Room.findByIdAndUpdate(room_id, {
    last_message: newMessage._id,
    last_author: req.user._id
  }, { new: true, lean: true });

  room.members.forEach((member) => io.to(member.toString()).emit('message',
    { message: { ...newMessage, author: req.user }, room }
  ))

  res.status(201).json({ success: true, message, room });
}, { validationSchema: SendMessageSchema })

module.exports = {
  SendMessage,
  GetChatMessages
}