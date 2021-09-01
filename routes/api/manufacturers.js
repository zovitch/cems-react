const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Manufacturer = require('../../models/Manufacturer');

// @route   POST api/Manufacturers
// @desc    Create a Manufacturer
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

    const manufacturerFields = {};
    if (name) manufacturerFields.name = name;
    if (nameCN) manufacturerFields.nameCN = nameCN;
    try {
      // Create manufacturer
      let manufacturer = new Manufacturer(manufacturerFields);
      await manufacturer.save();
      return res.json(manufacturer);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/manufacturers/:manufacturer_id
// @desc    Update a manufacturer
// @access  Private
router.put(
  '/:manufacturer_id',
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

    const manufacturerFields = {};
    if (name) manufacturerFields.name = name;
    if (nameCN) manufacturerFields.nameCN = nameCN;

    try {
      const manufacturer = await Manufacturer.findByIdAndUpdate(
        { _id: req.params.manufacturer_id },
        { $set: manufacturerFields },
        { new: true }
      );
      if (!manufacturer) {
        return res.status(404).json({ msg: 'Manufacturer not found' });
      }
      res.json(manufacturer);
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/manufacturers
// @desc    GET the list of all manufacturers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    if (!manufacturers) {
      return res.status(404).json({ msg: 'Manufacturers not found' });
    }
    res.json(manufacturers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manufacturers/:manufacturer_id
// @desc    GET the list of all manufacturers
// @access  Public
router.get('/:manufacturer_id', async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(
      req.params.manufacturer_id
    );

    if (!manufacturer) {
      return res.status(404).json({ msg: 'Manufacturer not found' });
    }
    res.json(manufacturer);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Manufacturer not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/manufacturers/:manufacturer_id
// @desc    Delete a Manufacturer
// @access  Private
router.delete('/:manufacturer_id', auth, async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(
      req.params.manufacturer_id
    );
    if (!manufacturer) {
      return res.status(404).json({ msg: 'Manufacturer not found' });
    }
    await manufacturer.remove();
    res.json({ msg: 'Manufacturer removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Manufacturer not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
