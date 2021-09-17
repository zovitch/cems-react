const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const R3 = require('../../models/R3');

// @route   POST api/r3s
// @desc    Create or Update a Failure Code
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('machine', 'A machine required').not().isEmpty(),
      check('r3Date', 'An Application Date for the Failure is required')
        .not()
        .isEmpty(),
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
    if (r3Date) r3Fields.r3Date = r3Date;
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
      r3 = await R3.findOne({ r3Number: r3Number });

      if (r3) {
        console.log(' r3exist');
        return res.json(r3);
      }
      console.log('r3 new');
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
