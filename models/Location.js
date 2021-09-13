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
  floor: {
    type: Number,
    required: true,
    unique: true,
    maxlength: 1,
    minlength: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  locationLetter: {
    type: String,
    maxlength: 1,
    minlength: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Location = mongoose.model('location', LocationSchema);
