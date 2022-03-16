const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  trigram: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 5,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameCN: {
    type: String,
    index: { unique: true, sparse: true },
  },
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Department = mongoose.model('department', DepartmentSchema);
