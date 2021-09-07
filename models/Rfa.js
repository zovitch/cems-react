const mongoose = require('mongoose');

const RfaSchema = new mongoose.Schema({
  rfaNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
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
    required: true,
    unique: true,
  },
  parentMachine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'machine',
  },
  investmentNumber: {
    type: String,
  },
  costCenter: {
    type: String,
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
  purchasedPrice: {
    type: String,
  },
  // machine images @todo
  img: {
    data: Buffer,
    contentType: String,
  },
  comment: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  validationENG: {
    opinion: {
      type: String,
    },
    signature: {
      type: String,
    },
    signatureDate: {
      type: Date,
      default: Date.now,
    },
  },
  validationPUR: {
    opinion: {
      type: String,
    },
    signature: {
      type: String,
    },
    signatureDate: {
      type: Date,
      default: Date.now,
    },
  },
  validationRequestor: {
    opinion: {
      type: String,
    },
    signature: {
      type: String,
    },
    signatureDate: {
      type: Date,
    },
  },
});

module.exports = Rfa = mongoose.model('rfa', RfaSchema);
