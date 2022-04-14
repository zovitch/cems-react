const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');
const Machine = require('../../models/Machine');
const { FailureCode, RepairCode, AnalysisCode } = require('../../models/Code');

// @route   POST api/r3s
// @desc    Create a Repair Record
// @access  Private
router.post(
  '/',
  auth,
  check('machine', 'A machine required').not().isEmpty(),
  check('failureCode', 'A Failure Code is required').not().isEmpty(),
  check('applicant', 'An Applicant for the Failure is required')
    .not()
    .isEmpty(),

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
      applicantValidation,
      remark,
    } = req.body;

    const r3Fields = {};
    if (remark) r3Fields.remark = remark;
    if (applicantValidation) r3Fields.applicantValidation = applicantValidation;
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
        path: 'machine failureCode repairCode analysisCode repairEngineer',
        select: 'name nameCN codeNumber description descriptionCN',
        populate: {
          path: 'category department',
          strictPopulate: false,
          populate: {
            path: 'owners location',
            strictPopulate: false,
            select: 'name initials nameCN locationLetter',
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
      path: 'machine failureCode repairCode analysisCode repairEngineer',
      select:
        'machineNumber designation designationCN name nameCN codeNumber description descriptionCN',
      populate: {
        path: 'category department',
        strictPopulate: false,
        populate: {
          path: 'owners location',
          strictPopulate: false,
          select: 'name initials nameCN locationLetter',
        },
      },
    });

    res.json(r3s);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/r3s/short // debug short route
// @desc    GET the list of all repairs
// @access  Public
router.get('/short', async (req, res) => {
  try {
    const r3s = await R3.find().select('r3Number r3Date');

    res.json(r3s);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/r3s/:r3Id
// @desc    GET the detail of one repair
// @access  Public
router.get('/:r3Id', async (req, res) => {
  try {
    const r3 = await R3.findById(req.params.r3Id).populate({
      path: 'machine failureCode repairCode analysisCode repairEngineer',
      select:
        'machineNumber designation designationCN name nameCN codeNumber description descriptionCN',
      populate: {
        path: 'category department',
        strictPopulate: false,
        populate: {
          path: 'owners location',
          strictPopulate: false,
          select: 'name initials nameCN locationLetter',
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

// @route   DELETE api/r3s/:r3Id
// @desc    Delete a Repair record
// @access  Private
router.delete('/:r3Id', auth, async (req, res) => {
  try {
    const r3 = await R3.findById(req.params.r3Id);
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

// @route   PATCH api/r3s/:r3Id
// @desc    Update a R3 Number and other infos
// @access  Private
router.patch(
  '/:r3Id',
  auth,
  check(
    'r3NumberPartial',
    'R3 Number (###) length should be maximum 3, ex: AYY###'
  )
    .isLength({
      min: 1,
      max: 3,
    }) // this is just a partial ### because A and YY are changed through machine of date
    .not()
    .isEmpty()
    .optional(), // allows not to raise the error if r3Number is not passed

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      r3NumberPartial,
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
      applicantValidation,
      remark,
    } = req.body;

    const r3Fields = {};
    if (remark) r3Fields.remark = remark;
    if (applicantValidation) r3Fields.applicantValidation = applicantValidation;
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
      let r3 = await R3.findById(req.params.r3Id).populate({
        path: 'machine failureCode repairCode analysisCode repairEngineer',
        select: 'name nameCN codeNumber description descriptionCN',
        populate: {
          path: 'category department',
          strictPopulate: false,
          populate: {
            path: 'owners location',
            strictPopulate: false,
            select: 'name initials nameCN locationLetter',
          },
        },
      });
      if (!r3) {
        return res.status(400).json({ msg: 'Repair Record not found' });
      }
      // Create a new letter for the repair number, by default the existing one
      let oldlocationLetter = r3.machine.department.location.locationLetter;
      let newlocationLetter = oldlocationLetter;
      // Create a new date for the repair, by default the existing one
      let oldR3Date = r3.r3Date;
      let newR3Date = oldR3Date;
      // Check the R3 Number changes
      let newR3Number = r3.r3Number;
      let oldR3NumberPartial = parseInt(newR3Number.substring(3));
      // Retrieve the codess
      let foundFailureCode = await FailureCode.findById(r3.failureCode);
      let foundRepairCode = await FailureCode.findById(r3.repairCode);
      let foundAnalysisCode = await FailureCode.findById(r3.analysisCode);

      // Retrieve the machine
      let foundMachine = await Machine.findById(r3.machine).populate({
        path: 'department',
        populate: 'location',
      });
      //Check if the machine in the body
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
        newlocationLetter = foundMachine.department.location.locationLetter;
        // we prepare the machine field for the update
        r3Fields.machine = machine;
      }

      // Check if the R3 Date is new
      if (r3Date) {
        // if there is a new R3 Date then it should be used for the new R3 Number and the new R3 Date entry
        newR3Date = new Date(r3Date);
        r3Fields.r3Date = newR3Date;
      }
      // Check if we need to calculate a new R3 Number
      if (
        newlocationLetter !== oldlocationLetter ||
        newR3Date.getFullYear().toString().substring(2) !==
          oldR3Date.getFullYear().toString().substring(2)
      ) {
        needNewR3Number = true;
      }

      // Check if update the partial R3 Number
      if (!newlocationLetter) {
        console.log('error to catch');
        res.status(500).send('Server Error');
      }
      const regex =
        newlocationLetter + newR3Date.getFullYear().toString().substring(2);
      if (needNewR3Number) {
        if (r3NumberPartial) {
          newR3Number =
            newlocationLetter +
            newR3Date.getFullYear().toString().substring(2) +
            r3NumberPartial.toString().padStart(3, '0');
          console.log(
            '[CODE: 1-0] We try to assign the number: ' + newR3Number
          );

          r3 = await R3.findOne({ r3Number: newR3Number });
          if (r3) {
            console.log(
              '[CODE: 1-1] This R3 Number already exist, we need to create a new one'
            );
            r3 = await R3.find({
              r3Number: {
                $regex: regex,
                $options: 'i',
              },
            })
              .sort('-r3Number') // to get the max
              .limit(1);
            if (r3[0]) {
              newR3Number = parseInt(r3[0].r3Number.substring(3)) + 1;
              newR3Number = regex + newR3Number.toString().padStart(3, '0');
            }
            r3Fields.r3Number = newR3Number;
          } else {
            console.log(
              '[CODE: 1-2] This R3 number is unused and can be attributed'
            );
            r3Fields.r3Number = newR3Number;
          }
        } else {
          console.log('[CODE: 2-0] We need a new R3 Number with ' + regex);

          r3 = await R3.find({
            r3Number: {
              $regex: regex,
              $options: 'i',
            },
          })
            .sort('-r3Number') // to get the max
            .limit(1);
          newR3Number = regex + '001';
          if (r3[0]) {
            newR3Number = parseInt(r3[0].r3Number.substring(3)) + 1;
            newR3Number = regex + newR3Number.toString().padStart(3, '0');
          }
          r3Fields.r3Number = newR3Number;
        }
      } else {
        if (r3NumberPartial) {
          // if Location and Date don't change, and there is a partial provided, we prepare the new r3Number
          newR3Number =
            newR3Number.substring(0, 3) + r3NumberPartial.padStart(3, '0');

          if (r3NumberPartial != oldR3NumberPartial) {
            console.log(
              '[CODE: 3-0] We try to assign the number: ' + newR3Number
            );
            r3 = await R3.findOne({ r3Number: newR3Number });
            if (r3) {
              console.log(
                '[CODE: 3-1] This R3 Number already exist, we need to create a new one'
              );
              r3 = await R3.find({
                r3Number: {
                  $regex: regex,
                  $options: 'i',
                },
              })
                .sort('-r3Number') // to get the max
                .limit(1);
              if (r3[0]) {
                newR3Number = parseInt(r3[0].r3Number.substring(3)) + 1;
                newR3Number = regex + newR3Number.toString().padStart(3, '0');
              }
              r3Fields.r3Number = newR3Number;
            } else {
              console.log(
                '[CODE: 3-2] This R3 number is unused and can be attributed'
              );
              r3Fields.r3Number = newR3Number;
            }
          } else {
            console.log(
              '[CODE: 4-0] No changes needed to R3 Number ' + r3.r3Number
            );
          }
        } else
          console.log(
            '[CODE: 4-1] No changes needed to R3 Number ' + r3.r3Number
          );
      }
      if (failureCode) {
        // if failureCode is in the body, we need to use it instead of the one in the existing R3
        foundFailureCode = await FailureCode.findById(failureCode);
        if (!foundFailureCode) {
          return res
            .status(400)
            .json({ msg: 'This Failure Code does not exist' });
        }
        r3Fields.failureCode = failureCode;
      }

      if (repairCode) {
        // if repairCode is in the body, we need to use it instead of the one in the existing R3
        foundRepairCode = await RepairCode.findById(repairCode);
        if (!foundRepairCode) {
          return res
            .status(400)
            .json({ msg: 'This Repair Code does not exist' });
        }
        r3Fields.repairCode = repairCode;
      }

      if (analysisCode) {
        // if analysisCode is in the body, we need to use it instead of the one in the existing R3
        foundAnalysisCode = await AnalysisCode.findById(analysisCode);
        if (!foundAnalysisCode) {
          return res
            .status(400)
            .json({ msg: 'This Analysis Code does not exist' });
        }
        r3Fields.analysisCode = analysisCode;
      }

      console.log(r3.r3Date);
      console.log('date' + r3.r3Date);

      r3 = await R3.findByIdAndUpdate(
        req.params.r3Id,
        { $set: r3Fields },
        { new: true }
      );

      await r3.populate({
        path: 'machine failureCode repairCode analysisCode repairEngineer',
        select: 'name nameCN codeNumber description descriptionCN',
        populate: {
          path: 'category department',
          strictPopulate: false,
          populate: {
            path: 'owners location',
            strictPopulate: false,
            select: 'name initials nameCN locationLetter',
          },
        },
      });
      console.log('R3 Number: ' + r3.r3Number);
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
