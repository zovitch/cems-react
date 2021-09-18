const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');
const Machine = require('../../models/Machine');

// @route   POST api/r3s
// @desc    Create only a Repair Record
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('machine', 'A machine required').not().isEmpty(),
      check('applicant', 'An Applicant for the Failure is required')
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
      machine,
      r3Date,
      applicant,
      failureCode,
      failureExplanation,
      failureExplanationCN,
      machineStopped,
      repairEngineer,
      repairCode,
      repairExplanation,
      repairExplanationCN,
      engineeringRemark,
      analysisCode,
      analysisExplanation,
      analysisExplanationCN,
      maintenanceOilWaste,
      maintenancePlasticAndMetalWaste,
      maintenanceSpareParts,
      repairDate,
      remark,
    } = req.body;

    const r3Fields = {};
    if (remark) r3Fields.remark = remark;
    if (machine) r3Fields.machine = machine;
    if (!r3Date) {
      r3Fields.r3Date = new Date();
    } else {
      r3Fields.r3Date = r3Date;
    }
    if (applicant) r3Fields.applicant = applicant;
    if (failureCode) r3Fields.failureCode = failureCode;
    if (failureExplanation) r3Fields.failureExplanation = failureExplanation;
    if (failureExplanationCN)
      r3Fields.failureExplanationCN = failureExplanationCN;
    if (machineStopped) r3Fields.machineStopped = machineStopped;
    if (repairEngineer) r3Fields.repairEngineer = repairEngineer;
    if (repairCode) r3Fields.repairCode = repairCode;
    if (repairExplanation) r3Fields.repairExplanation = repairExplanation;
    if (repairExplanationCN) r3Fields.repairExplanationCN = repairExplanationCN;
    if (engineeringRemark) r3Fields.engineeringRemark = engineeringRemark;
    if (analysisCode) r3Fields.analysisCode = analysisCode;
    if (analysisExplanation) r3Fields.analysisExplanationanalysisExplanation;
    if (analysisExplanationCN)
      r3Fields.analysisExplanationCN = analysisExplanationCN;
    if (maintenanceOilWaste) r3Fields.maintenanceOilWaste = maintenanceOilWaste;
    if (maintenancePlasticAndMetalWaste)
      r3Fields.maintenancePlasticAndMetalWaste =
        maintenancePlasticAndMetalWaste;
    if (maintenanceSpareParts)
      r3Fields.maintenanceSpareParts = maintenanceSpareParts;
    if (repairDate) r3Fields.repairDate = repairDate;

    try {
      // Create a new R3
      let date = new Date();
      if (r3Date) {
        date = new Date(r3Date);
      }
      const year = date.getFullYear(); // 2021
      const year2digits = year.toString().substring(2);

      // Check the machine exists
      let foundMachine = await Machine.findById(machine).populate({
        path: 'department',
        populate: 'location',
      });
      if (!foundMachine) {
        return res
          .status(400)
          .json({ msg: 'Machine not found in the database' });
      }
      foundLocationLetter = foundMachine.department.location.locationLetter;

      let newR3Number = foundLocationLetter + year2digits + '001';
      const latestR3 = await R3.find({
        r3Number: {
          $regex: foundLocationLetter + year2digits,
          $options: 'i',
        },
      })
        .sort('-r3Number') // to get the max
        .limit(1);
      if (latestR3[0]) {
        newR3Number = parseInt(latestR3[0].r3Number.substring(3)) + 1;
        newR3Number =
          foundLocationLetter +
          year2digits +
          newR3Number.toString().padStart(3, '0');
      }
      r3Fields.r3Number = newR3Number;
      let r3 = new R3(r3Fields);
      await r3.populate({
        path: 'machine',
        select: '-afa',
        populate: {
          path: 'category department',
          populate: {
            path: 'owners location',
            strictPopulate: false,
            select: 'name avatar shortname nameCN',
          },
        },
      });

      await r3.save();
      return res.json(r3);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/r3s
// @desc    GET the list of all repairs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const r3s = await R3.find().populate({
      path: 'machine',
      select: '-afa',
      populate: {
        path: 'category department',
        populate: {
          path: 'owners location',
          strictPopulate: false,
          select: 'name avatar shortname nameCN',
        },
      },
    });

    res.json(r3s);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/r3s/:r3_id
// @desc    GET the detail of one repair
// @access  Public
router.get('/:r3_id', async (req, res) => {
  try {
    const r3 = await R3.findById(req.params.r3_id).populate({
      path: 'machine',
      select: '-afa',
      populate: {
        path: 'category department',
        populate: {
          path: 'owners location',
          strictPopulate: false,
          select: 'name avatar shortname nameCN',
        },
      },
    });
    if (!r3) {
      return res.status(400).json({ msg: 'Repair Record not found' });
    }
    res.json(r3);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/r3s/:r3_id
// @desc    Delete a Repair record
// @access  Private
router.delete('/:r3_id', auth, async (req, res) => {
  try {
    const r3 = await R3.findById(req.params.r3_id);
    if (!r3) {
      return res.status(404).json({ msg: 'Repair record not found' });
    }
    await r3.remove();
    res.json({ msg: 'Repair record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Repair record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/r3s/:r3_id
// @desc    Update a R3 Number and other infos
// @access  Private
router.patch('/:r3_id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    r3Number,
    machine,
    r3Date,
    applicant,
    failureCode,
    failureExplanation,
    failureExplanationCN,
    machineStopped,
    repairEngineer,
    repairCode,
    repairExplanation,
    repairExplanationCN,
    engineeringRemark,
    analysisCode,
    analysisExplanation,
    analysisExplanationCN,
    maintenanceOilWaste,
    maintenancePlasticAndMetalWaste,
    maintenanceSpareParts,
    repairDate,
    remark,
  } = req.body;

  const r3Fields = {};
  if (r3Number) r3Fields.r3Number = r3Number;
  if (remark) r3Fields.remark = remark;
  if (machine) r3Fields.machine = machine;
  if (!r3Date) {
    r3Fields.r3Date = new Date();
  } else {
    r3Fields.r3Date = r3Date;
  }
  if (applicant) r3Fields.applicant = applicant;
  if (failureCode) r3Fields.failureCode = failureCode;
  if (failureExplanation) r3Fields.failureExplanation = failureExplanation;
  if (failureExplanationCN)
    r3Fields.failureExplanationCN = failureExplanationCN;
  if (machineStopped) r3Fields.machineStopped = machineStopped;
  if (repairEngineer) r3Fields.repairEngineer = repairEngineer;
  if (repairCode) r3Fields.repairCode = repairCode;
  if (repairExplanation) r3Fields.repairExplanation = repairExplanation;
  if (repairExplanationCN) r3Fields.repairExplanationCN = repairExplanationCN;
  if (engineeringRemark) r3Fields.engineeringRemark = engineeringRemark;
  if (analysisCode) r3Fields.analysisCode = analysisCode;
  if (analysisExplanation) r3Fields.analysisExplanationanalysisExplanation;
  if (analysisExplanationCN)
    r3Fields.analysisExplanationCN = analysisExplanationCN;
  if (maintenanceOilWaste) r3Fields.maintenanceOilWaste = maintenanceOilWaste;
  if (maintenancePlasticAndMetalWaste)
    r3Fields.maintenancePlasticAndMetalWaste = maintenancePlasticAndMetalWaste;
  if (maintenanceSpareParts)
    r3Fields.maintenanceSpareParts = maintenanceSpareParts;
  if (repairDate) r3Fields.repairDate;

  try {
    // Check the machine exists
    let foundMachine = await Machine.findById(machine).populate({
      path: 'department',
      populate: 'location',
    });
    if (!foundMachine) {
      return res.status(400).json({ msg: 'Machine not found in the database' });
    }
    foundLocationLetter = foundMachine.department.location.locationLetter;
    const currentLocationLetter = r3Number.substring(0, 1);
    console.log('location letters of the machine is: ' + foundLocationLetter);
    console.log(
      'location letter of the R3 Number is: ' + currentLocationLetter
    );

    if (foundLocationLetter === currentLocationLetter) {
      return res.status(400).json({ msg: 'OK: Location Letter match' });
      //           // r3 = await R3.findOneAndUpdate(
      //           //   { r3Number: r3Number },
      //           //   { $set: r3Fields },
      //           //   { new: true }
      //           // ).populate({
      //           //   path: 'machine',
      //           //   select: '-afa',
      //           //   populate: {
      //           //     path: 'category department',
      //           //     populate: {
      //           //       path: 'owners location',
      //           //       strictPopulate: false,
      //           //       select: 'name avatar shortname nameCN',
      //           //     },
      //           //   },
      //           // });
    } else {
      //           // console.log(currentLocationLetter);
      //           // console.log(machine);
      //           // console.log(r3);
      //           // console.log(r3.machine.department.location.locationLetter);
      //           // In this case, the machine changed and location letter is not correct anymore
      return res.status(400).json({ msg: 'Error: Location Letter mismatch' });
    }

    const r3 = await R3.findByIdAndUpdate(
      req.params.r3_id,
      { $set: r3Fields },
      { new: true }
    ).populate({
      path: 'machine',
      select: '-afa',
      populate: {
        path: 'category department',
        populate: {
          path: 'owners location',
          strictPopulate: false,
          select: 'name avatar shortname nameCN',
        },
      },
    });

    if (!r3) {
      return res.status(404).json({ msg: 'Repair record not found' });
    }
    return res.json(r3);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Repair record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
