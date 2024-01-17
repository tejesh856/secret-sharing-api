// Secret.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const secretSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Secret', secretSchema);
