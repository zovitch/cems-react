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
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'machine',
      required: true,
      unique: true,
    },
  ],
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
  validationPUR: {
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Rfa = mongoose.model('rfa', RfaSchema);
