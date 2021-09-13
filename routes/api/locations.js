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
      check('floor', 'A floor number is required').not().isEmpty(),
      check('shortname', 'A shortname is required for the Location')
        .not()
        .isEmpty(),
      check('name', 'A name is required for the Location').not().isEmpty(),
      check(
        'locationLetter',
        'Location Letter should be only one letter'
      ).isLength({
        max: 1,
        min: 1,
      }),
      check(
        'shortname',
        'The shortname can be only 3 letters maximum'
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

    const { shortname, name, nameCN, floor, locationLetter } = req.body;

    const locationFields = {};
    if (shortname) locationFields.shortname = shortname;
    if (name) locationFields.name = name;
    if (nameCN) locationFields.nameCN = nameCN;
    if (floor) locationFields.floor = floor;
    if (locationLetter) locationFields.locationLetter = locationLetter;

    try {
      location = await Location.findOne({ shortname: shortname });

      if (location) {
        // Update location
        location = await Location.findOneAndUpdate(
          { shortname: shortname },
          { $set: locationFields },
          { new: true }
        );
        return res.json(location);
      }

      // Create a new location
      location = new Location(locationFields);
      await location.save();
      return res.json(location);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
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

// @route   GET api/locations/:shortname
// @desc    GET the detail of one location from its shortname
// @access  Publice
router.get('/:shortname', async (req, res) => {
  try {
    const location = await Location.findOne({
      shortname: req.params.shortname,
    });

    if (!location) {
      return res.status(400).json({ msg: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/locations/:location_id
// @desc    Delete a Location
// @access  Private
router.delete('/:location_id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.location_id);
    if (!location) {
      return res.status(404).json({ msg: 'Location not found' });
    }
    await location.remove();
    res.json({ msg: 'Location removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Location not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
