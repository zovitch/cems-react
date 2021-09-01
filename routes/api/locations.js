const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Location = require('../../models/Location');
// @route   POST api/Locations
// @desc    Create or Update a Location
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('shortcode', 'A shortcode is required for the Location')
        .not()
        .isEmpty(),
      check('name', 'A name is required for the Location').not().isEmpty(),
      check(
        'shortcode',
        'The shortcode can be only 3 letters maximum'
      ).isLength({
        max: 3,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, nameCN } = req.body;

    return res.json('Post Location');
  }
);

// @route   GET api/locations
// @desc    GET the list of all locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
