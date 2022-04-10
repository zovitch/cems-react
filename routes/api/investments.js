const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Investment = require('../../models/Investment');

// @route   POST api/investments
// @desc    Create an investment
// @access  Private
router.post(
  '/',
  auth,
  check('year', 'A year is required with format YYYY').isLength({
    min: 4,
    max: 4,
  }),
  check('number', 'A Number between 1 and 99 is required').isLength({
    min: 1,
    max: 2,
  }),
  check('year', 'A year is required with format YYYY').isNumeric(),
  check('number', 'it should be a number between 1 and 99').isNumeric(),
  check('quantity', 'Quantity should be a number').isNumeric(),
  // check('estimatedUnitPrice', 'Estimated Price should be a number')
  //   .optional()
  //   .isNumeric(),
  check('name', 'A name for the investment is required').not().isEmpty(),
  // check('approved', 'Only Yes or No').isBoolean(),
  // check('completed', 'Only Yes or No').isBoolean(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      year,
      number,
      name,
      estimatedUnitPrice,
      quantity,
      approved,
      completed,
    } = req.body;

    const investmentFields = {};
    if (year) investmentFields.year = year;
    if (number) investmentFields.number = number;
    if (name) investmentFields.name = name;
    if (estimatedUnitPrice)
      investmentFields.estimatedUnitPrice = estimatedUnitPrice;
    if (quantity) investmentFields.quantity = quantity;
    if (approved) investmentFields.approved = approved;
    if (completed) investmentFields.completed = completed;

    try {
      // Check the unicity of the data in the form
      const otherInvestments = await Investment.find({
        year: year,
        number: number,
      });

      if (otherInvestments.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: `The Investment Number ${
                year + '-' + number
              } already exists`,
            },
          ],
        });
      }

      // Create a new Investment Number
      investment = new Investment(investmentFields);
      await investment.save();
      return res.json(investment);
    } catch (err) {
      console.error(err.message);

      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/investments/:investmentId
// @desc    Update am Investment
// @access  Private
router.put(
  '/:investmentId',
  auth,
  check('year', 'A year is required with format YYYY').isLength({
    min: 4,
    max: 4,
  }),
  check('number', 'A Number between 1 and 99 is required').isLength({
    min: 1,
    max: 2,
  }),
  check('year', 'A year is required with format YYYY').isNumeric(),
  check('number', 'A Number between 1 and 99 is required').isNumeric(),
  check('name', 'A name for the investment is required').not().isEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      year,
      number,
      name,
      estimatedUnitPrice,
      quantity,
      approved,
      completed,
    } = req.body;

    const investmentFields = {};
    if (year) investmentFields.year = year;
    if (number) investmentFields.number = number;
    if (name) investmentFields.name = name;
    if (estimatedUnitPrice)
      investmentFields.estimatedUnitPrice = estimatedUnitPrice;
    if (quantity) investmentFields.quantity = quantity;
    if (approved) investmentFields.approved = approved;
    if (completed) investmentFields.completed = completed;

    try {
      // Check the unicity of the data in the form
      const otherInvestments = await Investment.find({
        year: year,
        number: number,
      });

      let arrayOfInvestmentsId = otherInvestments.map((o) => o._id.toString());
      if (
        arrayOfInvestmentsId.length > 1 ||
        (arrayOfInvestmentsId.length === 1 &&
          arrayOfInvestmentsId.indexOf(req.params.investmentId) === -1)
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: `The Investment Number ${
                year + '-' + number
              } already exists`,
            },
          ],
        });
      }

      // Since we don't have any other entries, we can find and update
      const investment = await Investment.findByIdAndUpdate(
        { _id: req.params.investmentId },
        { $set: investmentFields },
        { new: true }
      );
      if (!investment) {
        return res.status(404).json({ msg: 'Investment not found' });
      }

      res.json(investment);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/investments
// @desc    GET the list of all investments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.find().sort({ year: -1, number: 1 });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/investments/:investmentId
// @desc    GET details on one investment
// @access  Public
router.get('/:investmentId', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investmentId);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    res.json(investment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/investments/:investmentId
// @desc    Delete a Investment
// @access  Private
router.delete('/:investmentId', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.investmentId);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    await investment.remove();
    res.json({ msg: 'Investment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
