const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');
const Machine = require('../../models/Machine');
const Location = require('../../models/Location');

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
      foundMachineLocationLetter =
        foundMachine.department.location.locationLetter;

      let newR3Number = foundMachineLocationLetter + year2digits + '001';
      const latestR3 = await R3.find({
        r3Number: {
          $regex: foundMachineLocationLetter + year2digits,
          $options: 'i',
        },
      })
        .sort('-r3Number') // to get the max
        .limit(1);
      if (latestR3[0]) {
        newR3Number = parseInt(latestR3[0].r3Number.substring(3)) + 1;
        newR3Number =
          foundMachineLocationLetter +
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
router.patch(
  '/:r3_id',

  [
    auth,
    [
      check(
        'r3Number',
        'R3 Number (###) length should be maximum 3, ex: AYY###'
      )
        .isLength({
          min: 1,
          max: 3,
        }) // this is just a partial ### because A and YY are changed through machine of date
        .not()
        .isEmpty()
        .optional(), // allows not to raise the error if r3Number is not passed
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
      remark,
    } = req.body;

    const r3Fields = {};
    if (remark) r3Fields.remark = remark;
    if (applicant) r3Fields.applicant = applicant;
    if (failureExplanation) r3Fields.failureExplanation = failureExplanation;
    if (failureExplanationCN)
      r3Fields.failureExplanationCN = failureExplanationCN;
    if (machineStopped) r3Fields.machineStopped = machineStopped;
    if (repairEngineer) r3Fields.repairEngineer = repairEngineer;
    if (repairExplanation) r3Fields.repairExplanation = repairExplanation;
    if (repairExplanationCN) r3Fields.repairExplanationCN = repairExplanationCN;
    if (engineeringRemark) r3Fields.engineeringRemark = engineeringRemark;
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
    let needNewR3Number = false;

    try {
      // retrieve the R3 info
      let r3 = await R3.findById(req.params.r3_id).populate({
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
      if (!r3) {
        return res.status(400).json({ msg: 'Repair Record not found' });
      }
      // Create a new letter for the repair number, by default the existing one
      let oldR3Letter = r3.machine.department.location.locationLetter;
      let newR3Letter = oldR3Letter;
      // Create a new date for the repair, by default the existing one
      let oldR3Date = r3.r3Date;
      let newR3Date = oldR3Date;
      // Check the R3 Number changes
      let oldR3Number = r3.r3Number;
      let newR3Number = oldR3Number;

      // Check the machine exists
      let foundMachine = await Machine.findById(r3.machine).populate({
        path: 'department',
        populate: 'location',
      });

      if (machine) {
        // if machine is in the body, we need to use the machine id instead of the one in the existing R3
        foundMachine = await Machine.findById(machine).populate({
          path: 'department',
          populate: 'location',
        });
        if (!foundMachine) {
          return res
            .status(400)
            .json({ msg: 'Machine not found in the database' });
        }
        // and we need to update the R3 Letter for R3 Number
        newR3Letter = foundMachine.department.location.locationLetter;
        // we prepare the machine field for the update
        r3Fields.machine = machine;
      }

      // Check if the R3 Date is new
      if (r3Date) {
        // if there is a new R3 Date then it should be used for the new R3 Number and the new R3 Date entry
        newR3Date = new Date(r3Date);
        r3Fields.r3Date = r3Date;
      }

      // Chekc if we need to calculate a new R3 Number
      if (
        newR3Letter !== oldR3Letter ||
        newR3Date.getFullYear().toString().substring(2) !==
          oldR3Date.getFullYear().toString().substring(2)
      ) {
        needNewR3Number = true;
      }

      // Check if update the partial R3 Number

      if (needNewR3Number) {
        if (r3Number) {
          console.log(
            ' we try to assign the number: ' +
              newR3Letter +
              newR3Date.getFullYear().toString().substring(2) +
              r3Number.toString().padStart(3, '0')
          );
        } else {
          console.log(
            ' We need a new R3 Number with :' +
              newR3Letter +
              newR3Date.getFullYear().toString().substring(2)
          );
        }
      } else {
        if (r3Number & (r3Number != oldR3Number)) {
          console.log(
            ' we try to assign the number: ' +
              newR3Letter +
              newR3Date.getFullYear().toString().substring(2) +
              r3Number.toString().padStart(3, '0')
          );
        } else {
          console.log(' No changes needed to R3 Number ' + r3.r3Number);
        }
      }
      return res.json(r3);
      // const newR3Letter = 'A';
      // const newR3Year = r3Fields.r3Date.getFullYear().toString().substring(2);

      // let foundFailureCode = await FailureCode.findById(r3.failureCode);
      // let foundRepairCode = await FailureCode.findById(r3.repairCode);
      // let foundAnalysisCode = await FailureCode.findById(r3.analysisCode);
      // if (failureCode) {
      //   // if failureCode is in the body, we need to use it instead of the one in the existing R3
      //   foundFailureCode = await FailureCode.findById(failureCode);
      //   if (!foundFailureCode) {
      //     return res
      //       .status(400)
      //       .json({ msg: 'This Failure Code does not exist' });
      //   }
      //   r3Fields.failureCode = failureCode;
      // }

      // if (repairCode) {
      //   // if repairCode is in the body, we need to use it instead of the one in the existing R3
      //   foundRepairCode = await RepairCode.findById(repairCode);
      //   if (!foundRepairCode) {
      //     return res
      //       .status(400)
      //       .json({ msg: 'This Failure Code does not exist' });
      //   }
      //   r3Fields.repairCode = repairCode;
      // }

      // if (analysisCode) {
      //   // if analysisCode is in the body, we need to use it instead of the one in the existing R3
      //   foundAnalysisCode = await AnalysisCode.findById(analysisCode);
      //   if (!foundAnalysisCode) {
      //     return res
      //       .status(400)
      //       .json({ msg: 'This Failure Code does not exist' });
      //   }
      //   r3Fields.analysisCode = analysisCode;
      // }

      // if (r3Number) r3Fields.r3Number = r3Number;

      // foundMachineLocationLetter =
      //   foundMachine.department.location.locationLetter;

      // let foundR3LocationLetter = r3.r3Number.substring(0, 1);
      // if (r3Number) {
      //   // if r3Number is in the body, we need to use the r3Number instead of the one in the existing R3
      //   foundR3LocationLetter = r3Number.substring(0, 1);
      //   // we need to check the letter found matches an existing location
      //   existingLocationLetters = await Location.find({
      //     locationLetter: foundR3LocationLetter,
      //   });
      //   if (!existingLocationLetters) {
      //     return res.status(400).json({
      //       msg: 'The letter used in the R3 Number is not exising in any Locations',
      //     });
      //   }
      // }

      // if (foundMachineLocationLetter === foundR3LocationLetter) {
      //   r3 = await R3.findByIdAndUpdate(
      //     req.params.r3_id,
      //     { $set: r3Fields },
      //     { new: true }
      //   ).populate({
      //     path: 'machine',
      //     select: '-afa',
      //     populate: {
      //       path: 'category department',
      //       populate: {
      //         path: 'owners location',
      //         strictPopulate: false,
      //         select: 'name avatar shortname nameCN',
      //       },
      //     },
      //   });
      //   return res.json(r3);
      // } else {
      //   console.log(
      //     '!! Warning !!, Location of Machine and Letter of R3 Number do not match, new R3 Number will start with letter: ' +
      //       foundMachineLocationLetter
      //   );

      //   // Retrieve the year to build the R3 Number
      //   let date = new Date(); // by default it's today's date
      //   if (r3.r3Date) {
      //     // if the R3 beiing edited has a Date, we use it
      //     date = new Date(r3.r3Date);
      //   }
      //   if (r3Date) {
      //     // if the user provide the r3Date in the body, we use it
      //     date = new Date(r3Date);
      //   }
      //   const year = date.getFullYear(); // 2021
      //   const year2digits = year.toString().substring(2);

      //   // if (r3Number) {
      //   //   // if r3Number is provided, the year needs to match the r3Date
      //   //   if (year2digits != r3Number.substring(1, 3)) {
      //   //     console.log(year2digits);
      //   //     console.log(r3Number.substring(1, 3));
      //   //     return res.status(400).json({
      //   //       msg: 'The year in the R3 Number is not matching the R3 Date field',
      //   //     });
      //   //   }
      //   // }
      //   console.log(foundMachineLocationLetter + year2digits);

      //   return res.json(r3);
      // }
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
