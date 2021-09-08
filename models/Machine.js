const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  machineNumber: {
    type: String,
    required: true,
    unique: true,
  },
  qualityNumber: {
    type: String,
    index: { unique: true, sparse: true },
  },
  designation: {
    type: String,
    required: true,
    unique: true,
  },
  designationCN: {
    type: String,
    index: { unique: true, sparse: true },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manufacturer',
  },
  model: {
    type: String,
  },
  serialNumber: {
    type: String,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',
    required: true,
  },
  manufacturingDate: {
    type: Date,
  },
  acquiredDate: {
    type: Date,
    default: Date.now,
  },
  investmentNumber: {
    type: String,
  },
  costCenter: {
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
  // @todo Parent Machine
  // parentMachine: {
  //   type: mongoose.Schema.Type.ObjectId,
  //   ref: 'machine',
  // },
  // machine images @todo
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
