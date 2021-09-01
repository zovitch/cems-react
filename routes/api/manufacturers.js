const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Manufacturer = require('../../models/Manufacturer');

// @route   POST api/Manufacturers
// @desc    Create or Update a Manufacturer
// @access  Private
router.post(
  '/',
  [
    auth,
    [check('name', 'A name is required for the Manufacturer').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, nameCN } = req.body;
    return res.json('Post Manufacturer ');
  }
);

// @route   GET api/manufacturers
// @desc    GET the list of all manufacturers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    res.json(manufacturers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
