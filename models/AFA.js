const mongoose = require('mongoose');

const AfaSchema = new mongoose.Schema({
  afaNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  designation: {
    type: String,
    required: true,
  },
  designationCN: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  parentMachine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'machine',
  },
  technicalRequirement: {
    type: String,
  },
  investmentNumber: {
    type: String,
  },
  applicantName: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true,
  },
  applicantSignature: {
    type: String,
  },
  applicantDate: {
    type: Date,
    default: Date.now,
    required: true,
  },

  reasonOfApplication: {
    type: String,
  },
  // When creating an AFA it might be a new supplier so we don't need to have it from our current list of manufacturers
  manufacturer: [
    {
      name: {
        type: String,
      },
      model: {
        type: String,
      },
      choice: {
        type: String,
        enum: ['open', 'restricted'],
      },
      priceEstimation: {
        type: String,
      },
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
  validationGM: {
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

module.exports = Afa = mongoose.model('afa', AfaSchema);
