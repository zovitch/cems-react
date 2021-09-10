const mongoose = require('mongoose');

const DfaSchema = new mongoose.Schema({
  dfaNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'machine',
    required: true,
    unique: true,
  },
  validationOWN: {
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
  validationENG: {
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
  validationFIN: {
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
  remark: {
    type: String,
  },
});

module.exports = Dfa = mongoose.model('dfa', DfaSchema);
