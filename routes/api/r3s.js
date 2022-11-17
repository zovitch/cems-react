const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');
const Machine = require('../../models/Machine');
const { FailureCode, RepairCode, AnalysisCode } = require('../../models/Code');

// @route   POST api/newR3Number
// @desc    Get the R3Number without saving into the database through a post request
// @access  Private
router.post(
  '/newR3Number',
  auth,
  check('machine', 'An EQU Machine is required').not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { machine, r3Date } = req.body;
    let date = new Date(); //today's date
    if (r3Date) {
      date = new Date(r3Date);
    }
    const year = date.getFullYear(); // 2021
    const year2digits = year.toString().substring(2);

    let foundMachine = await Machine.findById(machine).populate({
      path: 'department',
      populate: 'location',
    });
    if (!foundMachine) {
      return res.status(400).json({ msg: 'Machine not found in the database' });
    }

    const foundMachineLocationLetter =
      foundMachine.department &&
      foundMachine.department.location &&
      foundMachine.department.location.locationLetter;
    if (!foundMachineLocationLetter) {
      return res
        .status(400)
        .json({ msg: 'Location not found in the database for this Machine' });
    }
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
    return res.json(newR3Number);
  },
);

// @route   POST api/r3s
// @desc    Create a Repair Record
// @access  Private
router.post(
  '/',
  auth,
  // check('r3Number', 'An R3 No. is required').not().isEmpty(),
  check('machine', 'An EQU No. is required').not().isEmpty(),
  check('failureCode', 'A Failure Code is required').not().isEmpty(),
  // check('applicant', 'An Applicant for the Failure is required')
  //   .not()
  //   .isEmpty(),

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
      engineeringRepairDate,
      applicantValidationDate,
      r3Completed,
      remark,
    } = req.body;

    const r3Fields = {};
    if (r3Number) r3Fields.r3Number = r3Number;
    if (remark) r3Fields.remark = remark;
    if (r3Completed) r3Fields.r3Completed = r3Completed;
    if (applicantValidationDate)
      r3Fields.applicantValidationDate = applicantValidationDate;
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
    if (analysisExplanation) r3Fields.analysisExplanation = analysisExplanation;
    if (analysisExplanationCN)
      r3Fields.analysisExplanationCN = analysisExplanationCN;
    if (maintenanceOilWaste) r3Fields.maintenanceOilWaste = maintenanceOilWaste;
    if (maintenancePlasticAndMetalWaste)
      r3Fields.maintenancePlasticAndMetalWaste =
        maintenancePlasticAndMetalWaste;
    if (maintenanceSpareParts)
      r3Fields.maintenanceSpareParts = maintenanceSpareParts;
    if (engineeringRepairDate)
      r3Fields.engineeringRepairDate = engineeringRepairDate;

    try {
      // Check the unicity of the data in the form
      const otherR3s = await R3.find({ r3Number: r3Number });
      let duplicateField = null;
      let duplicateValue = null;

      if (otherR3s.length > 0) {
        if (otherR3s[0].r3Number == r3Number) {
          duplicateField = 'R3 No.';
          duplicateValue = r3Number;
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
      // do we need to check the r3number mask?
      const foundMachine = await Machine.findById(machine).populate({
        path: 'department',
        populate: 'location',
      });
      if (!foundMachine) {
        return res
          .status(400)
          .json({ msg: 'Machine not found in the database' });
      }
      const foundMachineLocationLetter =
        foundMachine.department.location.locationLetter;

      if (!foundMachineLocationLetter) {
        return res
          .status(400)
          .json({ msg: 'Error: Department information are incorrect' });
      }
      const foundFailureCode = await FailureCode.findById(failureCode);
      if (!foundFailureCode) {
        return res
          .status(400)
          .json({ msg: 'This Failure Code does not exist' });
      }
      if (repairCode) {
        const foundRepairCode = await RepairCode.findById(repairCode);
        if (!foundRepairCode) {
          return res
            .status(400)
            .json({ msg: 'This Repair Code does not exist' });
        }
      }
      if (analysisCode) {
        const foundAnalysisCode = await AnalysisCode.findById(analysisCode);
        if (!foundAnalysisCode) {
          return res
            .status(400)
            .json({ msg: 'This Analysis Code does not exist' });
        }
      }
      if (repairEngineer) {
        const foundRepairEngineer = await User.findById(repairEngineer);
        if (!foundRepairEngineer) {
          return res
            .status(400)
            .json({ msg: 'This Repair Engineer does not exist' });
        }
      }

      // Create a new R3
      let date = new Date();
      if (r3Date) {
        date = new Date(r3Date);
      }
      const year = date.getFullYear(); // 2021
      const year2digits = year.toString().substring(2);

      // in case r3Number is empty
      let newR3Number = foundMachineLocationLetter + year2digits + '001';
      // This return an array of size 1 with the latest R3 number
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
      if (!r3Number) {
        r3Fields.r3Number = newR3Number;
      }

      let r3 = new R3(r3Fields);
      r3.requester = req.user.id; // save the auth user info into the R3

      const user = await User.findById(req.user.id).select('-password');

      user ? (r3.applicant = user.name) : (r3.applicant = 'Unknown');

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
  },
);

// @route   GET api/r3s
// @desc    GET the list of all repairs
// @access  Private
router.get('/', async (req, res) => {
  try {
    let year;
    let month;
    let day;

    let query = req.query;

    if ('from' in req.query) {
      year = req.query.from.split('-')[0];
      month = req.query.from.split('-')[1] - 1;
      day = req.query.from.split('-')[2];
      query = {
        r3Date: {
          $gte: new Date(year, month, day),
        },
      };
    }

    const r3s = await R3.find(query)
      .sort({ date: 'desc' })
      .populate({
        path: 'machine failureCode repairCode analysisCode repairEngineer requester',
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
      })
      .sort({ r3Date: -1 });

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
      path: 'machine failureCode repairCode analysisCode repairEngineer requester',
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

    const machineId = r3.machine._id;

    const relatedR3s = await R3.find({ machine: machineId })
      .populate({
        path: 'repairEngineer',
        select: 'name',
      })
      .sort({ date: 'desc' });

    res.json({ r3, relatedR3s });
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
  // check('r3Number', 'An R3 No. is required').not().isEmpty(),
  check('machine', 'An EQU No. is required').not().isEmpty(),
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
      engineeringRepairDate,
      applicantValidationDate,
      r3Completed,
      remark,
    } = req.body;

    const r3Fields = {};
    if (r3Number) r3Fields.r3Number = r3Number;
    if (remark) r3Fields.remark = remark;
    if (r3Completed) r3Fields.r3Completed = r3Completed;
    if (applicantValidationDate)
      r3Fields.applicantValidationDate = applicantValidationDate;
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
    if (analysisExplanation) r3Fields.analysisExplanation = analysisExplanation;
    if (analysisExplanationCN)
      r3Fields.analysisExplanationCN = analysisExplanationCN;
    if (maintenanceOilWaste) r3Fields.maintenanceOilWaste = maintenanceOilWaste;
    if (maintenancePlasticAndMetalWaste)
      r3Fields.maintenancePlasticAndMetalWaste =
        maintenancePlasticAndMetalWaste;
    if (maintenanceSpareParts)
      r3Fields.maintenanceSpareParts = maintenanceSpareParts;
    if (engineeringRepairDate)
      r3Fields.engineeringRepairDate = engineeringRepairDate;
    try {
      // Check the unicity of the data in the form
      const otherR3s = await R3.find({ r3Number: r3Number });

      let arrayOfR3Id = otherR3s.map((o) => o._id.toString());
      if (
        arrayOfR3Id.length > 1 ||
        (arrayOfR3Id.length === 1 &&
          arrayOfR3Id.indexOf(req.params.r3Id) === -1)
      ) {
        let k = 0;
        if (arrayOfR3Id[k] === req.params.r3Id) k = 1;
        let duplicateField = null;
        let duplicateValue = null;

        if (otherR3s[k].r3Number === r3Number) {
          duplicateField = 'R3 No.';
          duplicateValue = r3Number;
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
      // do we need to check the r3number mask?
      const foundMachine = await Machine.findById(machine).populate({
        path: 'department',
        populate: 'location',
      });
      if (!foundMachine) {
        return res
          .status(400)
          .json({ msg: 'Machine not found in the database' });
      }
      const foundMachineLocationLetter =
        foundMachine.department.location.locationLetter;

      if (!foundMachineLocationLetter) {
        return res
          .status(400)
          .json({ msg: 'Error: Department information are incorrect' });
      }
      const foundFailureCode = await FailureCode.findById(failureCode);
      if (!foundFailureCode) {
        return res
          .status(400)
          .json({ msg: 'This Failure Code does not exist' });
      }
      if (repairCode) {
        const foundRepairCode = await RepairCode.findById(repairCode);
        if (!foundRepairCode) {
          return res
            .status(400)
            .json({ msg: 'This Repair Code does not exist' });
        }
      }
      if (analysisCode) {
        const foundAnalysisCode = await AnalysisCode.findById(analysisCode);
        if (!foundAnalysisCode) {
          return res
            .status(400)
            .json({ msg: 'This Analysis Code does not exist' });
        }
      }
      if (repairEngineer) {
        const foundRepairEngineer = await User.findById(repairEngineer);
        if (!foundRepairEngineer) {
          return res
            .status(400)
            .json({ msg: 'This Repair Engineer does not exist' });
        }
      }

      // in case r3Number is empty
      let date = new Date();
      if (r3Date) {
        date = new Date(r3Date);
      }
      const year = date.getFullYear(); // 2021
      const year2digits = year.toString().substring(2);

      let newR3Number = foundMachineLocationLetter + year2digits + '001';
      // This return an array of size 1 with the latest R3 number
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
      if (!r3Number) {
        r3Fields.r3Number = newR3Number;
      }

      let r3 = await R3.findByIdAndUpdate(
        { _id: req.params.r3Id },
        { $set: r3Fields },
        { new: true },
      ).populate({
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

      return res.json(r3);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
