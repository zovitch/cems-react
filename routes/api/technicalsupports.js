const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const TechnicalSupport = require('../../models/TechnicalSupport');

// @route   POST api/technicalsupport
// @desc    Create a Technical Support Request
// @access  Private
router.post(
  '/',
  auth,
  check('applicationDate', 'An application date is required').not().isEmpty(),
  check('description', 'A description is required').not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      applicationDate,
      expectedDate,
      description,
      requirement,
      reason,
      engineeringOpinion,
      opinionDate,
      orderTaker,
      projectedTime,
      progress,
      completionDate,
      applicantValidation,
    } = req.body;

    const technicalSupportFields = {};
    if (applicationDate)
      technicalSupportFields.applicationDate = applicationDate;
    if (expectedDate) technicalSupportFields.expectedDate = expectedDate;
    if (description) technicalSupportFields.description = description;
    if (requirement) technicalSupportFields.requirement = requirement;
    if (reason) technicalSupportFields.reason = reason;
    if (engineeringOpinion)
      technicalSupportFields.engineeringOpinion = engineeringOpinion;
    if (opinionDate) technicalSupportFields.opinionDate = opinionDate;
    if (orderTaker) technicalSupportFields.orderTaker = orderTaker;
    if (projectedTime) technicalSupportFields.projectedTime = projectedTime;
    if (progress) technicalSupportFields.progress = progress;
    if (completionDate) technicalSupportFields.completionDate = completionDate;
    if (applicantValidation)
      technicalSupportFields.applicantValidation = applicantValidation;

    technicalSupportFields.applicant = req.user.id;

    try {
      // Create a new Record
      technicalsupport = new TechnicalSupport(technicalSupportFields);
      await technicalsupport.save();
      return res.json(technicalsupport);
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
        path: 'applicant orderTaker',
        select: 'name',
      });

    res.json(technicalSupports);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/technicalsupport/:technicalsupportId
// @desc    Get the details of a Technical Support Request
// @access  Public
router.get('/:technicalsupportId', async (req, res) => {
  try {
    const technicalsupport = await TechnicalSupport.findById(
      req.params.technicalsupportId,
    ).populate({
      path: 'applicant orderTaker',
      select: 'name',
    });
    if (!technicalsupport) {
      return res
        .status(400)
        .json({ msg: 'Technical Support Record not found' });
    }

    res.json(technicalsupport);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/technicalsupport/:technicalsupportId
// @desc    Delete a Technical Support Request
// @access  Private
router.delete('/:technicalsupportId', async (req, res) => {
  try {
    const technicalsupport = await TechnicalSupport.findById(
      req.params.technicalsupportId,
    );
    if (!technicalsupport) {
      return res
        .status(400)
        .json({ msg: 'Technical Support Record not found' });
    }
    await technicalsupport.remove();
    res.json({ msg: 'Technical Support record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Technical Support record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/technicalsupport/:technicalsupportId
// @desc    Update a Technical Support Request
// @access  Private
router.patch(
  '/:technicalsupportId',
  auth,
  check('applicationDate', 'An application date is required').not().isEmpty(),
  check('description', 'A description is required').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      applicationDate,
      expectedDate,
      description,
      requirement,
      reason,
      engineeringOpinion,
      opinionDate,
      orderTaker,
      projectedTime,
      progress,
      completionDate,
      applicantValidation,
    } = req.body;

    const technicalSupportFields = {};

    if (applicationDate)
      technicalSupportFields.applicationDate = applicationDate;
    if (expectedDate) technicalSupportFields.expectedDate = expectedDate;
    if (description) technicalSupportFields.description = description;
    if (requirement) technicalSupportFields.requirement = requirement;
    if (reason) technicalSupportFields.reason = reason;
    if (engineeringOpinion)
      technicalSupportFields.engineeringOpinion = engineeringOpinion;
    if (opinionDate) technicalSupportFields.opinionDate = opinionDate;
    if (orderTaker) technicalSupportFields.orderTaker = orderTaker;
    if (projectedTime) technicalSupportFields.projectedTime = projectedTime;
    if (progress) technicalSupportFields.progress = progress;
    if (completionDate) technicalSupportFields.completionDate = completionDate;
    if (applicantValidation)
      technicalSupportFields.applicantValidation = applicantValidation;

    console.log(req.params.technicalsupportId);
    try {
      let technicalsupport = await TechnicalSupport.findByIdAndUpdate(
        { _id: req.params.technicalsupportId },
        { $set: technicalSupportFields },
        { new: true },
      ).populate({
        path: 'applicant orderTaker',
        select: 'name',
      });

      if (!technicalsupport) {
        return res
          .status(400)
          .json({ msg: 'Technical Support Record not found' });
      }

      res.json(technicalsupport);
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
