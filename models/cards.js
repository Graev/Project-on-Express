const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => /(?:(?:http:\/\/)|(?:https:\/\/))(?:[w]{3}\.)?(?:(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:(?:[a-zA-Z\-]+\.)?[a-zA-Z\-]+\.[a-zA-Z]+))(?::\d{2,5})?(?:[a-zA-Z\-\/0-9]#?)*.*/.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
