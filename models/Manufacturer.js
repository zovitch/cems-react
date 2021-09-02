const mongoose = require('mongoose');

const ManufacturerSchema = new mongoose.Schema({
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

module.exports = Manufacturer = mongoose.model(
  'manufacturer',
  ManufacturerSchema
);
