const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Category = require('../../models/Category');

// @route   POST api/categories
// @desc    Create or Update a category
// @access  Private
router.post('/', [
  auth,
  [
    check('trigram', 'A 3-letter code is required').isLength({
      min: 3,
      max: 3,
    }),
    check('code', 'A 3-digit number is required').isLength({ min: 1, max: 3 }),
    check('code', 'A 3-digit number is required').isNumeric(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.json('Post Category');
  },
]);

// @route   GET api/categories
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

module.exports = router;
