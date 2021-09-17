const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');
const Machine = require('../../models/Machine');

// @route   POST api/r3s
// @desc    Create or Update a Failure Code
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
    } = req.body;

    const r3Fields = {};
    if (r3Number) r3Fields.r3Number = r3Number;
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
    if (repairDate) r3Fields.repairDate;

    try {
      let r3 = await R3.findOne({ r3Number: r3Number }).populate({
        path: 'machine',
        select: '-afa',
        populate: {
          path: 'category department',
          populate: {
            path: 'owners location',
            strictPopulate: false,
            select: 'name avatar shortname nameCN locationLetter',
          },
        },
      });

      if (r3) {
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

        const currentLocationLetter = r3Number.substring(0, 1);
        if (foundLocationLetter === currentLocationLetter) {
          return res.status(400).json({ msg: 'OK: Location Letter match' });
          // r3 = await R3.findOneAndUpdate(
          //   { r3Number: r3Number },
          //   { $set: r3Fields },
          //   { new: true }
          // ).populate({
          //   path: 'machine',
          //   select: '-afa',
          //   populate: {
          //     path: 'category department',
          //     populate: {
          //       path: 'owners location',
          //       strictPopulate: false,
          //       select: 'name avatar shortname nameCN',
          //     },
          //   },
          // });
        } else {
          // console.log(currentLocationLetter);
          // console.log(machine);
          // console.log(r3);
          // console.log(r3.machine.department.location.locationLetter);
          // In this case, the machine changed and location letter is not correct anymore
          return res
            .status(400)
            .json({ msg: 'Error: Location Letter mismatch' });
        }

        // return res.json(r3);
      }
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
      r3 = new R3(r3Fields);
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

module.exports = router;
