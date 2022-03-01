const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Machine = require('../../models/Machine');
const Afa = require('../../models/Afa');
// @route   POST api/machines
// @desc    Create or Update a machine from AFA
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('afa', 'A prior AFA is required').not().isEmpty(),
      check('category', 'A Category is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      machineNumber,
      qualityNumber,
      designation,
      designationCN,
      category,
      department,
      manufacturer,
      model,
      manufacturingDate,
      acquiredDate,
      investmentNumber,
      retiredDate,
      purchasedPrice,
      comment,
      costCenter,
      afa,
      parentMachine,
    } = req.body;

    let foundAfa = await Afa.findById(afa).populate({
      path: 'department',
    });

    const machineFields = {};
    if (machineNumber) machineFields.machineNumber = machineNumber;
    if (qualityNumber) machineFields.qualityNumber = qualityNumber;
    if (category) machineFields.category = category;
    if (manufacturer) machineFields.manufacturer = manufacturer;
    if (model) machineFields.model = model;
    if (manufacturingDate) machineFields.manufacturingDate = manufacturingDate;
    if (acquiredDate) machineFields.acquiredDate = acquiredDate;
    if (investmentNumber) machineFields.investmentNumber = investmentNumber;
    if (retiredDate) machineFields.retiredDate = retiredDate;
    if (purchasedPrice) machineFields.purchasedPrice = purchasedPrice;
    if (comment) machineFields.comment = comment;
    if (costCenter) machineFields.costCenter = costCenter;

    if (foundAfa) machineFields.afa = foundAfa;
    if (foundAfa.designation) machineFields.designation = foundAfa.designation;
    if (foundAfa.designationCN)
      machineFields.designationCN = foundAfa.designationCN;
    if (foundAfa.parentMachine)
      machineFields.parentMachine = foundAfa.parentMachine;
    if (foundAfa.department) machineFields.department = foundAfa.department;

    // if the body contains this info, we overwrite the AFA infos
    if (designation) machineFields.designation = designation;
    if (designationCN) machineFields.designationCN = designationCN;
    if (parentMachine) machineFields.parentMachine = parentMachine;
    if (department) machineFields.department = department;

    try {
      let machine = await Machine.findOne({ machineNumber: machineNumber });

      if (machine) {
        // Update machine
        machine = await Machine.findOneAndUpdate(
          { machineNumber: machineNumber },
          { $set: machineFields },
          { new: true }
        ).populate({
          path: 'department afa parentMachine manufacturer category',
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name nameCN shortname floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
            populate: {
              path: 'owners location department afa manufacturer category',
              select:
                'name nameCN shortname floor locationLetter code trigram description descriptionCN',
              strictPopulate: false,
            },
          },
        });

        return res.json(machine);
      }
      // Create machine
      let date = new Date(); //today's date
      if (acquiredDate) {
        date = new Date(acquiredDate);
      }
      const year = date.getFullYear(); // 2021
      const year2digits = year.toString().substring(2);

      const foundLocation = await Location.findById(
        machineFields.department.location
      );
      if (!foundLocation.floor) {
        return res
          .status(400)
          .json({ msg: 'Error: Floor information is missing' });
      }
      let newMachineNumber = '8' + foundLocation.floor + year2digits + '001';
      // This return an array of size 1 with the latest mmachine number
      const latestMachine = await Machine.find({
        machineNumber: {
          $regex: '8' + foundLocation.floor + year2digits,
          $options: 'i',
        },
      })
        .sort('-machineNumber') // to get the max
        .limit(1);
      if (latestMachine[0]) {
        newMachineNumber = parseInt(latestMachine[0].machineNumber);
        newMachineNumber = newMachineNumber + 1;
      }
      machineFields.machineNumber = newMachineNumber;
      machine = new Machine(machineFields);
      await machine.populate({
        path: 'department afa parentMachine manufacturer category',
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name nameCN shortname floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
          },
        },
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
    const machines = await Machine.find().populate({
      path: 'department afa parentMachine manufacturer category',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN shortname floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
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
    const machine_id = await Machine.findById(req.params.number).populate({
      path: 'department afa parentMachine manufacturer category',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN shortname floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
    });
    const machineEQU = await Machine.findOne({
      machineNumber: req.params.number,
    }).populate({
      path: 'department afa parentMachine manufacturer category',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN shortname floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
    });

    const machineQUA = await Machine.findOne({
      qualityNumber: req.params.number,
    }).populate({
      path: 'department afa parentMachine manufacturer category',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN shortname floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
    });
    // the number in the params can be the EQU Number or the QUA Number
    if (machineEQU) {
      machine = machineEQU;
    } else {
      if (machineQUA) {
        machine = machineQUA;
      } else {
        if (machine_id) {
          machine = machine_id;
        } else return res.status(400).json({ msg: 'machine not found' });
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

// @route   PATCH api/machines/:machine_id
// @desc    Update a Machine Number and other infos
// @access  Private
router.patch('/:machine_id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    machineNumber,
    qualityNumber,
    designation,
    designationCN,
    category,
    department,
    manufacturer,
    model,
    manufacturingDate,
    acquiredDate,
    investmentNumber,
    retiredDate,
    purchasedPrice,
    comment,
    costCenter,
    afa,
    parentMachine,
  } = req.body;
  const machineFields = {};
  if (machineNumber) machineFields.machineNumber = machineNumber;
  if (qualityNumber) machineFields.qualityNumber = qualityNumber;
  if (category) machineFields.category = category;
  if (manufacturer) machineFields.manufacturer = manufacturer;
  if (model) machineFields.model = model;
  if (manufacturingDate) machineFields.manufacturingDate = manufacturingDate;
  if (acquiredDate) machineFields.acquiredDate = acquiredDate;
  if (investmentNumber) machineFields.investmentNumber = investmentNumber;
  if (retiredDate) machineFields.retiredDate = retiredDate;
  if (purchasedPrice) machineFields.purchasedPrice = purchasedPrice;
  if (comment) machineFields.comment = comment;
  if (costCenter) machineFields.costCenter = costCenter;
  if (designation) machineFields.designation = designation;
  if (designationCN) machineFields.designationCN = designationCN;
  if (parentMachine) machineFields.parentMachine = parentMachine;
  if (department) machineFields.department = department;
  if (afa) machineFields.afa = afa;

  console.log('Updating a machine ');
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.machine_id,
      { $set: machineFields },
      { new: true }
    ).populate({
      path: 'department afa parentMachine manufacturer category',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN shortname floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN shortname floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
    });

    if (!machine) {
      return res.status(404).json({ msg: 'Machine not found' });
    }
    return res.json(machine);

    // machine.save(function (err, result) {
    //   if (err) {
    //     if (err.code === 11000) {
    //       return res.status(400).json({ 'Duplicate Entry': err.keyValue });
    //     }
    //     console.log(err);
    //   } else {
    //     res.json(machine);
    //   }
    // });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Machine not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
