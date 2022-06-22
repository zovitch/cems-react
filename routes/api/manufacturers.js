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
  auth,
  check('name', 'A name is required for the Manufacturer').not().isEmpty(),
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
      // Check the unicity of the data in the form
      const otherManufacturers = await Manufacturer.find({
        $or: [{ name: name }, { nameCN: nameCN }],
      });

      let duplicateField = null;
      let duplicateValue = null;

      if (otherManufacturers.length > 0) {
        if (otherManufacturers[0].nameCN == nameCN) {
          duplicateField = 'Name';
          duplicateValue = nameCN;
        }
        if (otherManufacturers[0].name == name) {
          duplicateField = 'Name';
          duplicateValue = name;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

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

// @route   PUT api/manufacturers/:manufacturerId
// @desc    Update a manufacturer
// @access  Private
router.put(
  '/:manufacturerId',
  auth,
  check('name', 'A name is required for the Manufacturer').not().isEmpty(),

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
      //Check the unicity of the data in the form
      const otherManufacturers = await Manufacturer.find({
        $or: [{ name: name }, { nameCN: nameCN }],
      });

      let arrayOfManufacturersId = otherManufacturers.map((o) =>
        o._id.toString()
      );
      if (
        arrayOfManufacturersId.length > 1 ||
        (arrayOfManufacturersId.length === 1 &&
          arrayOfManufacturersId.indexOf(req.params.manufacturerId) === -1)
      ) {
        let k = 0;
        if (arrayOfManufacturersId[k] === req.params.manufacturerId) {
          k = 1;
        }

        let duplicateField = null;
        let duplicateValue = null;

        if (otherManufacturers[k].nameCN == nameCN) {
          duplicateField = 'Name';
          duplicateValue = nameCN;
        }
        if (otherManufacturers[k].name == name) {
          duplicateField = 'Name';
          duplicateValue = name;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

      const manufacturer = await Manufacturer.findByIdAndUpdate(
        { _id: req.params.manufacturerId },
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
    const manufacturers = await Manufacturer.find().sort({ nameCN: 'asc' });
    if (!manufacturers) {
      return res.status(404).json({ msg: 'Manufacturers not found' });
    }
    res.json(manufacturers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/manufacturers/:manufacturerId
// @desc    GET details of a manufacturer
// @access  Public
router.get('/:manufacturerId', async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.manufacturerId);

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

// @route   DELETE api/manufacturers/:manufacturerId
// @desc    Delete a Manufacturer
// @access  Private
router.delete('/:manufacturerId', auth, async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.manufacturerId);
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
