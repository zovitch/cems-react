const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const { FailureCode } = require('../../models/Code');

// @route   POST api/failurecodes
// @desc    Create or Update a Failure Code
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('codeNumber', 'A Failure Code Number is required').not().isEmpty(),
      check('name', 'A Failure Code Name is required').not().isEmpty(),
      check('description', 'A description for the Failure Code is required')
        .not()
        .isEmpty(),
      check(
        'descriptionCN',
        'A description in Chinese for the Failure Code is required'
      )
        .not()
        .isEmpty(),
      check(
        'codeNumber',
        'Failure Code Number should be one or two digits'
      ).isLength({
        min: 1,
        max: 2,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { codeNumber, description, descriptionCN, name } = req.body;

    const failureCodeFields = {};
    if (codeNumber) failureCodeFields.codeNumber = codeNumber;
    if (name) failureCodeFields.name = name;
    if (description) failureCodeFields.description = description;
    if (descriptionCN) failureCodeFields.descriptionCN = descriptionCN;

    try {
      let failureCode = await FailureCode.findOne({ codeNumber: codeNumber });
      if (failureCode) {
        failureCode = await FailureCode.findOneAndUpdate(
          { codeNumber: codeNumber },
          { $set: failureCodeFields },
          { new: true }
        ).populate();
        return res.json(failureCode);
      }
      failureCode = new FailureCode(failureCodeFields);
      await failureCode.populate();
      await failureCode.save();
      return res.json(failureCode);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/failurecodes
// @desc    GET the list of all failure codes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const failureCodes = await FailureCode.find().populate();
    res.json(failureCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
