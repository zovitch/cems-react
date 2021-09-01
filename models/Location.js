const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  shortname: {
    type: String,
    required: true,
    maxlength: 3,
  },
  name: {
    type: String,
    required: true,
  },
  nameCN: {
    type: String,
  },
});

module.exports = Location = mongoose.model('location', LocationSchema);
