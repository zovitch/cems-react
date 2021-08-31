const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  trigram: {
    type: String,
    required: true,
    maxlength: 3,
    minlength: 3,
  },
  code: {
    type: Number,
    required: true,
    maxlength: 3,
    minlength: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  description: {
    type: String,
  },
  descriptionCN: {
    type: String,
  },
});

module.exports = Category = mongoose.model('category', CategorySchema);
