const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Machine = require('../../models/Machine');
// @route   POST api/machines
// @desc    Create or Update a machine
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check(
        'equipmentNumber',
        'An Equipment Number is required for the machine'
      )
        .not()
        .isEmpty(),
      check(
        'designation',
        'An Equipment Designation is required for this machine'
      )
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      equipmentNumber,
      qualityNumber,
      designation,
      designationCN,
      category,
      manufacturer,
      model,
      location,
      manufacturingDate,
      acquiredDate,
      investmentNumber,
      retiredDate,
      purchasedPrice,
      comment,
    } = req.body;

    const machineFields = {};
    if (equipmentNumber) machineFields.equipmentNumber = equipmentNumber;
    if (qualityNumber) machineFields.qualityNumber = qualityNumber;
    if (designation) machineFields.designation = designation;
    if (designationCN) machineFields.designationCN = designationCN;
    if (category) machineFields.category = category;
    if (manufacturer) machineFields.manufacturer = manufacturer;
    if (model) machineFields.model = model;
    if (location) machineFields.location = location;
    if (manufacturingDate) machineFields.manufacturingDate = manufacturingDate;
    if (acquiredDate) machineFields.acquiredDate = acquiredDate;
    if (investmentNumber) machineFields.investmentNumber = investmentNumber;
    if (retiredDate) machineFields.retiredDate = retiredDate;
    if (purchasedPrice) machineFields.purchasedPrice = purchasedPrice;
    if (comment) machineFields.comment = comment;
    try {
      let machine = await Machine.findOne({ equipmentNumber: equipmentNumber });
      if (machine) {
        // Update machine
        return res.json(machine);
      }
      // Create machine
      console.log('New Machine');
      return res.json(machine);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/machines
// @desc    GET the list of all machines
// @access  Public
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
