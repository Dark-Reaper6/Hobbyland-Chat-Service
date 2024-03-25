const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  title: String,
  picture: { type: Schema.ObjectId, ref: 'images' },
  isGroup: { type: Boolean, default: false },
  lastAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Messages' },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
