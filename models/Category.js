const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true,
    maxlength: 3,
    minlength: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  trigram: {
    type: String,
    required: true,
    unique: true,
    maxlength: 3,
    minlength: 3,
  },
  description: {
    type: String,
  },
  descriptionCN: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Category = mongoose.model('category', CategorySchema);
