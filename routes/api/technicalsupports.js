const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const TechnicalSupport = require('../../models/TechnicalSupport');
// const User = require('../../models/User');

// @route   POST api/technicalsupport
// @desc    Create a Technical Support Request
// @access  Private
router.post(
  '/',
  auth,
  check('applicationDate', 'An application date is required').not().isEmpty(),
  check('applicant', 'An applicant is required') / not().isEmpty(),
  check('description', 'A description is required') / not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      applicationDate,
      applicant,
      expectedDate,
      description,
      requirement,
      reason,
      engineeringOpinion,
      engineer,
      opinionDate,
      orderTaker,
      projectedTime,
      progress,
      completionDate,
      applicantValidation,
    } = req.body;

    const technicalSupportFields = {};
    if (applicationDate) r3Fields.applicationDate = applicationDate;
    if (applicant) r3Fields.applicant = applicant;
    if (expectedDate) r3Fields.expectedDate = expectedDate;
    if (description) r3Fields.description = description;
    if (requirement) r3Fields.requirement = requirement;
    if (reason) r3Fields.reason = reason;
    if (engineeringOpinion) r3Fields.engineeringOpinion = engineeringOpinion;
    if (engineer) r3Fields.engineer = engineer;
    if (opinionDate) r3Fields.opinionDate = opinionDate;
    if (orderTaker) r3Fields.orderTaker = orderTaker;
    if (projectedTime) r3Fields.projectedTime = projectedTime;
    if (progress) r3Fields.progress = progress;
    if (completionDate) r3Fields.completionDate = completionDate;
    if (applicantValidation) r3Fields.applicantValidation = applicantValidation;

    try {
      // Check the unicity of the data in the form
      const otherCategories = await Category.find({
        $or: [{ code: code }, { trigram: trigram }],
      });
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  },
);

// @route   GET api/technicalsupport
// @desc    Get the list of Technical Support Request
// @access  Public
router.get('/', async (req, res) => {
  try {
    const technicalSupports = await TechnicalSupport.find()
      .sort({ date: 'desc' })
      .populate({
        path: 'applicant engineer orderTaker',
        select: 'name',
      });

    res.json(technicalSupports);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
