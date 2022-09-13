const mongoose = require('mongoose');

const TechnicalSupportSchema = new mongoose.Schema({
  applicationDate: {
    type: Date,
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  expectedDate: {
    type: Date,
  },
  description: {
    type: String,
    required: true,
  },
  requirement: {
    type: String,
  },
  reason: {
    type: String,
  },
  engineeringOpinion: {
    type: String,
  },
  opinionDate: {
    type: Date,
  },
  orderTaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  projectedTime: {
    type: String,
  },
  progress: {
    type: String,
  },
  completionDate: {
    type: Date,
  },
  applicantValidation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TechnicalSupport = mongoose.model(
  'technicalsupport',
  TechnicalSupportSchema,
);
