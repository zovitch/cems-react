const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Machine = require('../../models/Machine');
const Afa = require('../../models/Afa');
const Department = require('../../models/Department');

// @route   POST api/newMachineNumber
// @desc    Get the machineNumber without saving into the database through a post request
// @access  Private
router.post(
  '/newMachineNumber',
  auth,
  check('department', 'A Department is required').not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { department, acquiredDate } = req.body;
    let date = new Date(); //today's date
    if (acquiredDate) {
      date = new Date(acquiredDate);
    }
    const year = date.getFullYear(); // 2021
    const year2digits = year.toString().substring(2);

    const foundDepartment = await Department.findById(department).populate(
      'location'
    );

    if (!foundDepartment.location.floor) {
      return res
        .status(400)
        .json({ msg: 'Error: Department information are incorrect' });
    }
    let newMachineNumber =
      '8' + foundDepartment.location.floor + year2digits + '001';
    // This return an array of size 1 with the latest mmachine number
    const latestMachine = await Machine.find({
      machineNumber: {
        $regex: '8' + foundDepartment.location.floor + year2digits,
        $options: 'i',
      },
    })
      .sort('-machineNumber') // to get the max
      .limit(1);
    if (latestMachine[0]) {
      newMachineNumber = parseInt(latestMachine[0].machineNumber);
      newMachineNumber = newMachineNumber + 1;
    }

    return res.json(newMachineNumber);
  }
);

// @route   POST api/machines
// @desc    Create a machine from AFA
// @access  Private
router.post(
  '/',
  auth,
  check('designation', 'A Machine Designation is required').not().isEmpty(),
  check('category', 'A Category is required').not().isEmpty(),
  check('department', 'A Department is required').not().isEmpty(),
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
      serialNumber,
      manufacturingDate,
      acquiredDate,
      investment,
      retiredDate,
      purchasedPrice,
      comment,
      costCenter,
      imgPath,
      afa,
      parentMachine,
    } = req.body;

    // let foundAfa = await Afa.findById(afa).populate({
    //   path: 'department',
    // });

    const machineFields = {};
    if (machineNumber) machineFields.machineNumber = machineNumber;
    if (qualityNumber) machineFields.qualityNumber = qualityNumber;
    if (category) machineFields.category = category;
    if (manufacturer) machineFields.manufacturer = manufacturer;
    if (model) machineFields.model = model;
    if (serialNumber) machineFields.serialNumber = serialNumber;
    if (manufacturingDate) machineFields.manufacturingDate = manufacturingDate;
    if (acquiredDate) machineFields.acquiredDate = acquiredDate;
    if (investment) machineFields.investment = investment;
    if (retiredDate) machineFields.retiredDate = retiredDate;
    if (purchasedPrice) machineFields.purchasedPrice = purchasedPrice;
    if (comment) machineFields.comment = comment;
    if (costCenter) machineFields.costCenter = costCenter;
    if (imgPath) machineFields.imgPath = imgPath;

    // if (foundAfa) machineFields.afa = foundAfa;
    // if (foundAfa.designation) machineFields.designation = foundAfa.designation;
    // if (foundAfa.designationCN)
    //   machineFields.designationCN = foundAfa.designationCN;
    // if (foundAfa.parentMachine)
    //   machineFields.parentMachine = foundAfa.parentMachine;
    // if (foundAfa.department) machineFields.department = foundAfa.department;

    // if the body contains this info, we overwrite the AFA infos
    if (designation) machineFields.designation = designation;
    if (designationCN) machineFields.designationCN = designationCN;
    if (parentMachine) machineFields.parentMachine = parentMachine;
    if (department) machineFields.department = department;
    try {
      // Check the unicity of the data in the form
      const otherMachines = await Machine.find({
        $or: [
          { machineNumber: machineNumber },
          { qualityNumber: qualityNumber },
          { designation: designation },
          { designationCN: designationCN },
        ],
      });

      let duplicateField = null;
      let duplicateValue = null;

      if (otherMachines.length > 0) {
        if (otherMachines[0].machineNumber == machineNumber) {
          duplicateField = 'EQU No.';
          duplicateValue = machineNumber;
        }
        if (otherMachines[0].qualityNumber == qualityNumber) {
          duplicateField = 'QUA No.';
          duplicateValue = qualityNumber;
        }
        if (otherMachines[0].designation == designation) {
          duplicateField = 'Designation';
          duplicateValue = designation;
        }
        if (otherMachines[0].designationCN == designationCN) {
          duplicateField = '设备名称';
          duplicateValue = designationCN;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

      //@nico @todo
      // do we need to check if the objects are valid?

      // Create a new Machine
      let date = new Date(); //today's date
      if (acquiredDate) {
        date = new Date(acquiredDate);
      }
      const year = date.getFullYear(); // 2021
      const year2digits = year.toString().substring(2);

      const foundDepartment = await Department.findById(
        machineFields.department
      ).populate('location');

      if (!foundDepartment.location.floor) {
        return res
          .status(400)
          .json({ msg: 'Error: Department information are incorrect' });
      }

      let newMachineNumber =
        '8' + foundDepartment.location.floor + year2digits + '001';
      // This return an array of size 1 with the latest machine number
      const latestMachine = await Machine.find({
        machineNumber: {
          $regex: '8' + foundDepartment.location.floor + year2digits,
          $options: 'i',
        },
      })
        .sort('-machineNumber') // to get the max
        .limit(1);
      if (latestMachine[0]) {
        newMachineNumber = parseInt(latestMachine[0].machineNumber);
        newMachineNumber = newMachineNumber + 1;
      }

      // we use the newMachineNumber only if none is provided
      if (!machineNumber) {
        machineFields.machineNumber = newMachineNumber;
      }

      let machine = new Machine(machineFields);
      await machine.populate({
        path: 'department afa parentMachine manufacturer category investment',
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN initials floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name nameCN initials floor locationLetter code trigram description descriptionCN',
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
    const machines = await Machine.find()
      .sort({
        machineNumber: 'asc',
      })
      .populate({
        path: 'department afa parentMachine manufacturer category investment',
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN initials floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name nameCN initials floor locationLetter code trigram description descriptionCN',
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

// @route   GET api/machines/:machineId
// @desc    GET the detail of one machine
// @access  Public
router.get('/:machineId', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.machineId).populate({
      path: 'department afa parentMachine manufacturer category investment',
      populate: {
        path: 'owners location department afa manufacturer category',
        select:
          'name nameCN initials floor locationLetter code trigram description descriptionCN',
        strictPopulate: false,
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN initials floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
        },
      },
    });
    if (!machine) {
      return res.status(400).json({ msg: 'machine not found' });
    }

    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/machines/:machineId
// @desc    Delete a Machine
// @access  Private
router.delete('/:machineId', auth, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.machineId);
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

// @route   PATCH api/machines/:machineId
// @desc    Update a Machine Number and other infos
// @access  Private
router.patch(
  '/:machineId',
  auth,
  check('designation', 'A Machine Designation is required').not().isEmpty(),
  check('category', 'A Category is required').not().isEmpty(),
  check('department', 'A Department is required').not().isEmpty(),
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
      serialNumber,
      manufacturingDate,
      acquiredDate,
      investment,
      retiredDate,
      purchasedPrice,
      comment,
      costCenter,
      imgPath,
      afa,
      parentMachine,
    } = req.body;

    const machineFields = {};
    if (machineNumber) machineFields.machineNumber = machineNumber;
    if (qualityNumber) machineFields.qualityNumber = qualityNumber;
    if (category) machineFields.category = category;
    if (manufacturer) machineFields.manufacturer = manufacturer;
    if (model) machineFields.model = model;
    if (serialNumber) machineFields.serialNumber = serialNumber;
    if (manufacturingDate) machineFields.manufacturingDate = manufacturingDate;
    if (acquiredDate) machineFields.acquiredDate = acquiredDate;
    if (investment) machineFields.investment = investment;
    if (retiredDate) machineFields.retiredDate = retiredDate;
    if (purchasedPrice) machineFields.purchasedPrice = purchasedPrice;
    if (comment) machineFields.comment = comment;
    if (costCenter) machineFields.costCenter = costCenter;
    machineFields.imgPath = null; // to force update to null in case we remove the picture
    if (imgPath) machineFields.imgPath = imgPath;

    if (designation) machineFields.designation = designation;
    if (designationCN) machineFields.designationCN = designationCN;
    if (parentMachine) machineFields.parentMachine = parentMachine;
    if (department) machineFields.department = department;
    // if (afa) machineFields.afa = afa;

    try {
      // Check the unicity of the data in the form
      const otherMachines = await Machine.find({
        $or: [
          { machineNumber: machineNumber },
          { qualityNumber: qualityNumber },
          { designation: designation },
          { designationCN: designationCN },
        ],
      });
      let arrayOfMachinesId = otherMachines.map((o) => o._id.toString());
      if (
        arrayOfMachinesId.length > 1 ||
        (arrayOfMachinesId.length === 1 &&
          arrayOfMachinesId.indexOf(req.params.machineId) === -1)
      ) {
        let k = 0;
        if (arrayOfMachinesId[k] === req.params.machineId) k = 1;
        let duplicateField = null;
        let duplicateValue = null;

        if (otherMachines[k].machineNumber === machineNumber) {
          duplicateField = 'EQU No.';
          duplicateValue = machineNumber;
        }
        if (otherMachines[k].qualityNumber === qualityNumber) {
          duplicateField = 'QUA No.';
          duplicateValue = qualityNumber;
        }
        if (otherMachines[k].designationCN === designationCN) {
          duplicateField = '设备名称';
          duplicateValue = designationCN;
        }
        if (otherMachines[k].designation === designation) {
          duplicateField = 'Designation';
          duplicateValue = designation;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

      //@nico @todo
      // do we need to check if the objects are valid?

      const machine = await Machine.findByIdAndUpdate(
        { _id: req.params.machineId },
        { $set: machineFields },
        { new: true }
      ).populate({
        path: 'department afa parentMachine manufacturer category investment',
        populate: {
          path: 'owners location department afa manufacturer category',
          select:
            'name nameCN initials floor locationLetter code trigram description descriptionCN',
          strictPopulate: false,
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name nameCN initials floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
          },
        },
      });

      if (!machine) {
        return res.status(404).json({ msg: 'Machine not found' });
      }
      return res.json(machine);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Machine not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
