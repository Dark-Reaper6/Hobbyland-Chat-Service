const Room = require("../models/room");
const Message = require('../models/message');
const { isValidObjectId } = require("mongoose");
const { Io } = require("../socket");
const { SendMessageSchema } = require("../validation-schemas");
const StandardApi = require("../middlewares/standard-api");
const { sendUserNotification } = require("../../lib/send-notification");
const UploadFiles = require("../../lib/upload-files");

const GetChatMessages = async (req, res) => StandardApi(req, res, async () => {
  const { room_id } = req.query;
  if (!isValidObjectId(room_id)) return res.status(400).json({ success: false, msg: "A valid room id is required." });

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
  const { room_id, message } = req.body;
  const { files } = req;
  if (files && !files.chat_shares?.length) return res.status(400).json({ success: false, msg: "Invalid files key or format." });

  const newMessage = (await Message.create({
    author: req.user._id,
    room_id,
    content: message,
  })).toObject();

  const room = await Room.findByIdAndUpdate(room_id, {
    last_message: newMessage._id,
    last_author: req.user._id
  }, { new: true, lean: true }).populate("members");

  room.members.forEach((member) => Io().to(member._id.toString()).emit('message',
    { message: { ...newMessage, author: req.user }, room }
  ))
  res.status(201).json({ success: true, message, room });

  for (let memeber of room.members) {
    await sendUserNotification(memeber._id.toString(), {
      category: "primary",
      heading: `New message from ${req.user?.firstname || ("@" + req.user.username)}`,
      mini_msg: newMessage.content.slice(0, 50) + newMessage.content.length > 50 ? "..." : '',
      message: `${req.user?.firstname || ("@" + req.user.username)} says: ${newMessage.content.slice(500)}`,
      href: "/message"
    }, { notify: true });
  }

  // const filePairs = files.chat_shares.map((file, index) => ({ file, key: `/chat/${newMessage._id}-${index}` }))
  // const fileUrls = await UploadFiles(filePairs);
  // await Message.findByIdAndUpdate(newMessage._id, { files: fileUrls });

}, { validationSchema: SendMessageSchema })

module.exports = {
  SendMessage,
  GetChatMessages
}