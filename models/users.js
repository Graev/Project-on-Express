const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(?:(?:http:\/\/)|(?:https:\/\/))(?:[w]{3}\.)?(?:(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:(?:[a-zA-Z\-]+\.)?[a-zA-Z\-]+\.[a-zA-Z]+))(?::\d{2,5})?(?:[a-zA-Z\-\/0-9]#?)*.*/.test(v),
    },
  },
});

module.exports = mongoose.model('user', userSchema);
// match: /(?:(?:http:\/\/)|(?:https:\/\/))(?:[w]{3}\.)?(?:(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:(?:[a-zA-Z\-]+\.)?[a-zA-Z\-]+\.[a-zA-Z]+))(?::\d{2,5})?(?:[a-zA-Z\-\/0-9]#?)*/'
