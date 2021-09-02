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
  investmentNumber: {
    type: String,
  },
  applicantName: {
    type: String,
    required: true,
  },
  applicantDepartment: {
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
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  parentEquipment: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'machine',
    },
  },
  technicalRequirement: {
    type: String,
  },
  reasonOfApplication: {
    type: String,
  },
  manufacturer: [
    {
      name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manufacturer',
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
  validator: [
    {
      name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
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
  ],
  remark: {
    type: String,
  },
});

module.exports = Afa = mongoose.model('afa', AfaSchema);
