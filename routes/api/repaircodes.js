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
  auth,
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
  check(
    'codeNumber',
    'The Repair Code should be a one or two digits number'
  ).isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { codeNumber, description, descriptionCN } = req.body;
    const name = req.body.name.toUpperCase();

    const repairCodeFields = {};
    if (codeNumber) repairCodeFields.codeNumber = codeNumber;
    if (name) repairCodeFields.name = name;
    if (description) repairCodeFields.description = description;
    if (descriptionCN) repairCodeFields.descriptionCN = descriptionCN;

    try {
      // Check the unicity of the data in the form
      const otherCodes = await RepairCode.find({
        $or: [{ codeNumber: codeNumber }, { name: name }],
      });

      let duplicateField = null;
      let duplicateValue = null;

      if (otherCodes.length > 0) {
        if (otherCodes[0].codeNumber == codeNumber) {
          duplicateField = 'Code Number';
          duplicateValue = codeNumber;
        }
        if (otherCodes[0].name == name) {
          duplicateField = 'Name';
          duplicateValue = name;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

      // Create a new code
      repaircode = new RepairCode(repairCodeFields);
      await repaircode.populate();
      await repaircode.save();
      return res.json(repaircode);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/repaircodes/codeId
// @desc    Update a Repair Code
// @access  Private
router.put(
  '/:codeId',
  auth,
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
  check(
    'codeNumber',
    'The Repair Code should be a one or two digits number'
  ).isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { codeNumber, description, descriptionCN } = req.body;
    const name = req.body.name.toUpperCase();

    const repairCodeFields = {};
    if (codeNumber) repairCodeFields.codeNumber = codeNumber;
    if (name) repairCodeFields.name = name;
    if (description) repairCodeFields.description = description;
    if (descriptionCN) repairCodeFields.descriptionCN = descriptionCN;

    try {
      // Check the unicity of the data in the form
      const otherCodes = await RepairCode.find({
        $or: [{ codeNumber: codeNumber }, { name: name }],
      });

      let arrayOfCodesId = otherCodes.map((o) => o._id.toString());

      if (
        arrayOfCodesId.length > 1 ||
        (arrayOfCodesId.length === 1 &&
          arrayOfCodesId.indexOf(req.params.codeId) === -1)
      ) {
        let k = 0;
        if (arrayOfCodesId[k] === req.params.codeId) {
          k = 1;
        }

        let duplicateField = null;
        let duplicateValue = null;

        if (otherCodes[k].codeNumber == codeNumber) {
          duplicateField = 'Code Number';
          duplicateValue = codeNumber;
        }
        if (otherCodes[k].name == name) {
          duplicateField = 'Name';
          duplicateValue = name;
        }

        return res.status(400).json({
          errors: [
            {
              msg: `The ${duplicateField} ${duplicateValue} already exists`,
            },
          ],
        });
      }

      let code = await RepairCode.findByIdAndUpdate(
        { _id: req.params.codeId },
        { $set: repairCodeFields },
        { new: true }
      );
      return res.json(code);
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
    const repairCodes = await RepairCode.find().populate().sort({
      codeNumber: 'asc',
    });
    res.json(repairCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/repaircodes/:codeId
// @desc    GET the details of a repair
// @access  Public
router.get('/:codeId', async (req, res) => {
  try {
    const repaircode = await RepairCode.findById(req.params.codeId);

    if (!repaircode) {
      return res.status(400).json({ msg: 'Repair Code not found' });
    }
    return res.json(repaircode);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/codes/:codeId
// @desc    Delete a Code
// @access  Private
router.delete('/:codeId', auth, async (req, res) => {
  try {
    const code = await RepairCode.findById(req.params.codeId);
    if (!code) {
      return res.status(404).json({ msg: 'Code not found' });
    }
    await code.remove();
    res.json({ msg: 'Code removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Code not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
