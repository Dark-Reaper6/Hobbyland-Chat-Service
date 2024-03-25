const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  content: String,
  type: String,
}, { timestamps: true });

module.exports = mongoose.model('Messages', MessageSchema);
