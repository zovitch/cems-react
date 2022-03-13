const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  trigram: {
    type: String,
    required: true,
    unqiue: true,
    maxlength: 3,
    minlength: 3,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
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
