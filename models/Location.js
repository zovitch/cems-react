const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    initials: {
      type: String,
      required: true,
      // unique: true,
      maxlength: 5,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      // unique: true,
    },
    nameCN: {
      type: String,
      // index: { unique: true, sparse: true },
    },
    floor: {
      type: Number,
      required: true,
      // unique: true,
      // maxlength: 2,
      // minlength: 1,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    locationLetter: {
      type: String,
      maxlength: 1,
      minlength: 1,
      uppercase: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);
// Need to check in the routes if teh code is unique
LocationSchema.virtual('code').get(function () {
  return this.initials + this.floor + '-' + this.locationLetter;
});

module.exports = Location = mongoose.model('location', LocationSchema);
