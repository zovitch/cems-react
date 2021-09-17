const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const { RepairCode } = require('../../models/Code');

// @route   POST api/repaircodes
// @desc    Create or Update a Repair Code
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('codeNumber', 'A Repair Code Number is required').not().isEmpty(),
      check('name', 'A Repair Code Name is required').not().isEmpty(),
      check('description', 'A description for the Repair Code is required')
        .not()
        .isEmpty(),
      check(
        'descriptionCN',
        'A description in Chinese for the Repair Code is required'
      )
        .not()
        .isEmpty(),
      check(
        'codeNumber',
        'Repair Code Number should be one or two digits'
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

    const repairCodeFields = {};
    if (codeNumber) repairCodeFields.codeNumber = codeNumber;
    if (name) repairCodeFields.name = name;
    if (description) repairCodeFields.description = description;
    if (descriptionCN) repairCodeFields.descriptionCN = descriptionCN;

    try {
      let repairCode = await RepairCode.findOne({ codeNumber: codeNumber });
      if (repairCode) {
        repairCode = await RepairCode.findOneAndUpdate(
          { codeNumber: codeNumber },
          { $set: repairCodeFields },
          { new: true }
        ).populate();
        return res.json(repairCode);
      }
      repairCode = new RepairCode(repairCodeFields);
      await repairCode.populate();
      await repairCode.save();
      return res.json(repairCode);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/repaircodes
// @desc    GET the list of all repair codes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const repairCodes = await RepairCode.find().populate();
    res.json(repairCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
