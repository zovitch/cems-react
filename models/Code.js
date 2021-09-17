const mongoose = require('mongoose');

const CodeSchema = mongoose.Schema({
  codeNumber: {
    type: Number,
    required: true,
    unique: true,
    maxlength: 2,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionCN: {
    type: String,
    required: true,
  },
});

// module.exports = { FailureCode, RepairCode, AnalysisCode } = mongoose.model(
//   'code',
//   CodeSchema
// );

const FailureCode = mongoose.model('failureCode', CodeSchema);
const RepairCode = mongoose.model('repairCode', CodeSchema);
const AnalysisCode = mongoose.model('analysisCode', CodeSchema);

module.exports = {
  FailureCode,
  RepairCode,
  AnalysisCode,
};
