const mongoose = require('mongoose');

const R3Schema = new mongoose.Schema({
  r3Number: {
    type: String,
    required: true,
    unique: true,
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'machine',
    required: true,
  },
  r3Date: {
    type: Date,
    required: true,
  },
  applicant: {
    type: String,
    required: true,
  },
  failureCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'failureCode',
  },
  failureExplanation: {
    type: String,
  },
  failureExplanationCN: {
    type: String,
  },
  machineStopped: {
    type: Boolean,
    default: false,
  },
  repairEngineer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  repairCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'repairCode',
  },
  repairExplanation: {
    type: String,
  },
  repairExplanationCN: {
    type: String,
  },
  engineeringRemark: {
    type: String,
  },
  analysisCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'analysisCode',
  },
  analysisExplanation: {
    type: String,
  },
  analysisExplanationCN: {
    type: String,
  },
  maintenanceOilWaste: {
    type: Boolean,
    default: false,
  },
  maintenancePlasticAndMetalWaste: {
    type: Boolean,
    default: false,
  },
  maintenanceSpareParts: {
    type: Boolean,
    default: false,
  },
  repairDate: {
    type: Date,
  },
  applicantValidation: {
    type: Boolean,
    default: false,
  },
});

module.exports = R3 = mongoose.model('r3', R3Schema);
