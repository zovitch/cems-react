const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  // Department can have 0, 1 or multiple "user"
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  name: {
    type: String,
    required: true,
  },
  nameCN: {
    type: String,
  },
  trigram: {
    type: String,
    required: true,
    maxlength: 3,
    minlength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Department = mongoose.model('department', DepartmentSchema);
