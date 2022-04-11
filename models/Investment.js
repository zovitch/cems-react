const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema(
  {
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
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // @todo assign a department
  },
  {
    toJSON: { virtuals: true },
  }
);

// Need to check in the routes if the code is unique
InvestmentSchema.virtual('investmentNumber').get(function () {
  return this.year + '-' + String(this.number).padStart(2, '0');
});

module.exports = Investment = mongoose.model('investment', InvestmentSchema);
