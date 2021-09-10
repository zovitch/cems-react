const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  // this will hold the number as it is known on Excel "YYYY-XX"
  investmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  estimatedUnitPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
    default: 1,
  },
  approved: {
    type: Boolean,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Investment = mongoose.model('investment', InvestmentSchema);
