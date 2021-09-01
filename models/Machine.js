const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  equipmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  qualityNumber: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
  designationCN: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manufacturer',
  },
  model: {
    type: String,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',
  },
  manufacturingDate: {
    type: Date,
    default: Date.now,
  },
  acquiredDate: {
    type: Date,
    default: Date.now,
  },
  investmentNumber: {
    type: String,
  },
  retiredDate: {
    type: Date,
  },
  purchasedPrice: {
    type: String,
  },
  comment: {
    type: String,
  },
  // parentEquipment: {
  //   type: mongoose.Schema.Type.ObjectId,
  //   ref: 'machine',
  // },
  img: {
    data: Buffer,
    contentType: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Machine = mongoose.model('machine', MachineSchema);

//https://masteringjs.io/tutorials/mongoose/unique
//https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
