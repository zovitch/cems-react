const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema(
  {
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
    manufacturingDate: {
      type: Date,
    },
    acquiredDate: {
      type: Date,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'investment',
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
    parentMachine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'machine',
    },
    imgPath: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    afa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'afa',
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
MachineSchema.virtual(
  'children',
  {
    ref: 'machine',
    localField: 'id',
    foreignField: 'parentMachine',
    // justOne: false,
  },
  {
    toJSON: { virtuals: true },
  }
);

module.exports = Machine = mongoose.model('machine', MachineSchema);

//https://masteringjs.io/tutorials/mongoose/unique
//https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
