const Room = require('../models/Room');
const Message = require('../models/message');
const getFile = require('../../utils/getFile');
const StandardApi = require("../middlewares/standard-api")

const GetChatMessages = async (req, res) => StandardApi(req, res, async () => {
  const { room_id } = req.body;
  if (!room_id) return res.status(400).json({ success: false, msg: "room id is required." });

  const LIMIT = 25;
  const msgQuery = { room_id, deleted: false }
  let totalMessages = await Message.countDocuments(msgQuery);
  const totalPages = Math.ceil(totalMessages / LIMIT);
  const page = parseInt(req.query.page) || 1;
  const skipMsgs = (page - 1) * LIMIT;
  let messages = await Message.find()
    .sort({ updatedAt: -1 })
    .skip(skipMsgs)
    .limit(LIMIT)
    .populate('pictures author')
    .lean()

  for (let message of messages) {
    for (let file of message.pictures) {
      if (typeof file.file !== 'string') return
      try {
        file.file = await getFile({
          shield: file.file,
          userId: req.user.id,
        })
      } catch (e) { console.log("Error getting the file: " + e) }
    }
  }

  res.status(200).json({ success: true, msg: '', messages, page, total_pages: totalPages });
})

const SendMessage = async (req, res) => {
  let room;

  if (!req.fields.room) {
    return res.status(400).json({ status: 'error', user: 'room id required', message: 'room id required' });
  }

  room = await Room.findById(req.fields.room);

  let message;

  message = new Message({
    content: req.fields.content,
    author: req.user.id,
    room: room._id,
    members: room.members,
    access: room.access,
    files: req.fields.files,
    pictures: req.fields.pictures,
    type: 'message',
  });
  await message.save();

  room.lastUpdate = Date.now();
  room.lastMessage = message;
  await room.save();

  message = await Message.findById(message._id).populate('author').populate('pictures').lean();

  for (let j = 0; j < message.pictures.length; j++) {
    const file = { ...message.pictures[j] }.file;
    if (file && typeof file === 'string') {
      try {
        message.pictures[j].file = await getFile({
          shield: file,
          userId: req.user.id,
        });
      } catch (e) { }
    }
  }

  const io = Socket.get();

  for (let member of message.members) {
    io.to(member.toString()).emit('message', { message, room });
  }

  res.status(200).json({ status: 'ok', message, room });
};

module.exports = {
  SendMessage,
  GetChatMessages
}