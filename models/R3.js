const mongoose = require('mongoose');

const R3Schema = new mongoose.Schema({
  r3Number: {
    type: String,
    required: true,
    unique: true,
    maxlength: 6,
    minlength: 6,
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
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  failureCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'failureCode',
    required: true,
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
  engineeringRepairDate: {
    type: Date,
  },
  applicantValidationDate: {
    type: Date,
  },
  r3Completed: {
    type: Boolean,
    default: false,
  },
  remark: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = R3 = mongoose.model('r3', R3Schema);
