const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  shortname: {
    type: String,
    required: true,
    unique: true,
    maxlength: 3,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nameCN: {
    type: String,
    index: { unique: true, sparse: true },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Location = mongoose.model('location', LocationSchema);
