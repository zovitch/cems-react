const mongoose = require('mongoose');

const ManufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameCN: {
    type: String,
  },
});

module.exports = Manufacturer = mongoose.model(
  'Manufacturer',
  ManufacturerSchema
);
