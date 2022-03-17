const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Location = require('../../models/Location');

// @route   POST api/Locations
// @desc    Create a Location
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('floor', 'A floor number is required').not().isEmpty(),
      check('initials', 'Initials are required for the Location')
        .not()
        .isEmpty(),
      check('name', 'A name is required for the Location').not().isEmpty(),
      check('locationLetter', 'Location Letter should be one letter').isLength({
        max: 1,
        min: 1,
      }),
      check('initials', 'Initials can be only 5 letters maximum').isLength({
        max: 5,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { initials, name, nameCN, floor, locationLetter, code } = req.body;

    const locationFields = {};
    if (initials) locationFields.initials = initials;
    if (name) locationFields.name = name;
    if (nameCN) locationFields.nameCN = nameCN;
    if (floor) locationFields.floor = floor;
    if (locationLetter) locationFields.locationLetter = locationLetter;
    if (code) locationFields.code = code;

    try {
      // Check the unicity of the data in the form
      const otherLocations = await Location.find({
        initials: initials,
        floor: floor,
        locationLetter: locationLetter,
      });

      if (otherLocations.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: `The combination ${
                initials + floor + '-' + locationLetter
              } (initials + floor + Location Letter) already exists`,
            },
          ],
        });
      }

      // Create a new location
      location = new Location(locationFields);
      await location.save();
      return res.json(location);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/locations/:locationId
// @desc    Update a Location
// @access  Private
router.put(
  '/:locationId',
  auth,
  check('initials', 'Initials are required for the Location').not().isEmpty(),
  check('initials', 'Initials can be only 5 letters maximum').isLength({
    max: 5,
  }),
  check('floor', 'A floor number is required').not().isEmpty(),

  check('name', 'A name is required for the Location').not().isEmpty(),
  check('locationLetter', 'Location Letter should be one letter').isLength({
    max: 1,
    min: 1,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { initials, name, nameCN, floor, locationLetter, code } = req.body;

    const locationFields = {};
    if (initials) locationFields.initials = initials;
    if (name) locationFields.name = name;
    if (nameCN) locationFields.nameCN = nameCN;
    if (floor) locationFields.floor = floor;
    if (locationLetter) locationFields.locationLetter = locationLetter;
    if (code) locationFields.code = code;

    try {
      //Check the unicity of the data in the form
      const otherLocations = await Location.find({
        initials: initials,
        floor: floor,
        locationLetter: locationLetter,
      });

      let arrayOfLocationsId = otherLocations.map((o) => o._id.toString());

      if (
        arrayOfLocationsId.length > 1 ||
        (arrayOfLocationsId.length === 1 &&
          arrayOfLocationsId.indexOf(req.params.locationId) === -1)
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: `The combination ${
                initials + floor + '-' + locationLetter
              } (initials + floor + Location Letter) already exists`,
            },
          ],
        });
      }

      // Since we don't have any other entries, we can find and update
      const location = await Location.findByIdAndUpdate(
        { _id: req.params.locationId },
        { $set: locationFields },
        { new: true }
      );
      if (!location) {
        return res.status(404).json({ msg: 'Location not found' });
      }

      res.json(location);
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

// @route   GET api/locations/:locationId
// @desc    GET the detail of one location from its id
// @access  Public
router.get('/:locationId', async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId);

    if (!location) {
      return res.status(400).json({ msg: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/locations/:locationId
// @desc    Delete a Location
// @access  Private
router.delete('/:locationId', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId);
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
