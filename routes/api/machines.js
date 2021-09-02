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
      department,
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
    if (department) machineFields.department = department;
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
        machine = await Machine.findOneAndUpdate(
          { equipmentNumber: equipmentNumber },
          { $set: machineFields },
          { new: true }
        )
          .populate({
            path: 'department',
            select: 'trigram name nameCN owners',
            populate: { path: 'owners', select: 'name avatar' },
          })
          .populate({
            path: 'category',
            select: 'code trigram description descriptionCN',
          })
          .populate({
            path: 'manufacturer',
            select: 'name nameCN',
          })
          .populate({
            path: 'location',
            select: 'shortname name nameCN',
          });

        return res.json(machine);
      }
      // Create machine
      machine = new Machine(machineFields);
      await machine
        .populate({
          path: 'department',
          select: 'trigram name nameCN owners',
          populate: { path: 'owners', select: 'name avatar' },
        })
        .populate({
          path: 'category',
          select: 'code trigram description descriptionCN',
        })
        .populate({
          path: 'manufacturer',
          select: 'name nameCN',
        })
        .populate({
          path: 'location',
          select: 'shortname name nameCN',
        });

      await machine.save();
      return res.json(machine);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
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
    const machines = await Machine.find()
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'category',
        select: 'code trigram description descriptionCN',
      })
      .populate({
        path: 'manufacturer',
        select: 'name nameCN',
      })
      .populate({
        path: 'location',
        select: 'shortname name nameCN',
      });
    res.json(machines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/machines/:number
// @desc    GET the detail of one machine
// @access  Public
router.get('/:number', async (req, res) => {
  try {
    const machineEQU = await Machine.findOne({
      equipmentNumber: req.params.number,
    })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'category',
        select: 'code trigram description descriptionCN',
      })
      .populate({
        path: 'manufacturer',
        select: 'name nameCN',
      })
      .populate({
        path: 'location',
        select: 'shortname name nameCN',
      });

    const machineQUA = await Machine.findOne({
      qualityNumber: req.params.number,
    })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'category',
        select: 'code trigram description descriptionCN',
      })
      .populate({
        path: 'manufacturer',
        select: 'name nameCN',
      })
      .populate({
        path: 'location',
        select: 'shortname name nameCN',
      });

    // the number in the params can be the EQU Number or the QUA Number
    if (machineEQU) {
      machine = machineEQU;
    } else {
      if (machineQUA) {
        machine = machineQUA;
      } else {
        return res.status(400).json({ msg: 'machine not found' });
      }
    }

    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/machines/:machine_id
// @desc    Delete a Machine
// @access  Private
router.delete('/:machine_id', auth, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.machine_id);
    if (!machine) {
      return res.status(404).json({ msg: 'Machine not found' });
    }
    await machine.remove();
    res.json({ msg: 'Machine removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Machine not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
