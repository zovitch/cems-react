const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Category = require('../../models/Category');

// @route   POST api/categories
// @desc    Create or Update a category
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('trigram', 'A 3-letter code is required').isLength({
        min: 3,
        max: 3,
      }),
      check('code', 'A 3-digit number is required').isLength({
        min: 1,
        max: 3,
      }),
      check('code', 'A 3-digit number is required').isNumeric(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trigram, code, description, descriptionCN } = req.body;

    const categoryFields = {};
    if (trigram) categoryFields.trigram = trigram;
    if (code) categoryFields.code = code;
    if (description) categoryFields.description = description;
    if (descriptionCN) categoryFields.descriptionCN = descriptionCN;

    try {
      let category = await Category.findOne({ trigram: trigram });

      if (category) {
        // Update category
        category = await Category.findOneAndUpdate(
          { trigram: trigram },
          { $set: categoryFields },
          { new: true }
        );
        return res.json(category);
      }
      // Create category
      category = new Category(categoryFields);
      await category.save();
      return res.json(category);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/categories/
// @desc    GET the list of all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/categories/:input
// @desc    GET the detail of one category from its trigram or its code
// @access  Public
router.get('/:input', async (req, res) => {
  try {
    // the input can be the category trigram or the category code
    const categoryTrigram = await Category.findOne({
      trigram: req.params.input,
    });

    if (categoryTrigram) {
      category = categoryTrigram;
      return res.json(category);
    } else {
      if (!isNaN(req.params.input)) {
        const categoryCode = await Category.findOne({ code: req.params.input });
        if (categoryCode) {
          category = categoryCode;
          return res.json(category);
        } else {
          return res.status(400).json({ msg: 'Category not found' });
        }
      } else {
        return res.status(400).json({ msg: 'Category not found' });
      }
    }
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:category_id
// @desc    Delete a Category
// @access  Private
router.delete('/:category_id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.category_id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    await category.remove();
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
