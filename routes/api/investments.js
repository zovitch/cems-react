const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Investment = require('../../models/Investment');

// @route   POST api/investments
// @desc    Create or Update an investment
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('year', 'A year is required with format YYYY').isLength({
        min: 4,
        max: 4,
      }),
      check('number', 'A Number between 1 and 99 is required').isLength({
        min: 1,
        max: 2,
      }),
      check('name', 'A name for the investment is required').not().isEmpty(),
    ],
  ],
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
      if (year) {
        if (number) {
          const investmentNumber = year + '-' + String(number).padStart(2, '0');
          investmentFields.investmentNumber = investmentNumber;

          let investment = await Investment.findOne({
            investmentNumber: investmentNumber,
          });

          if (investment) {
            console.log('Editing an Investment Line');
            investment = await Investment.findOneAndUpdate(
              { investmentNumber: investmentNumber },
              { $set: investmentFields },
              { new: true }
            );
            return res.json(investment);
          } else {
            console.log('Creating a new Investment Line');
            investment = new Investment(investmentFields);
            await investment.save();
            return res.json(investment);
          }
        }
      }
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
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find().select('-year -number');
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/investments/:year
// @desc    GET the list of all investments for a specific year
// @access  Private
router.get('/:year', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ year: req.params.year })
      .select('-year -number')
      .sort({ number: 1 });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
