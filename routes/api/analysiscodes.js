const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const { AnalysisCode } = require('../../models/Code');

// @route   POST api/Analysiscodes
// @desc    Create or Update an Analysis Code
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('codeNumber', 'An Analysis Code Number is required')
        .not()
        .isEmpty(),
      check('name', 'An Analysis Code Name is required').not().isEmpty(),
      check('description', 'A description for the Analysis Code is required')
        .not()
        .isEmpty(),
      check(
        'descriptionCN',
        'A description in Chinese for the Analysis Code is required'
      )
        .not()
        .isEmpty(),
      check(
        'codeNumber',
        'Analysis Code Number should be one or two digits'
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

    const analysisCodeFields = {};
    if (codeNumber) analysisCodeFields.codeNumber = codeNumber;
    if (name) analysisCodeFields.name = name;
    if (description) analysisCodeFields.description = description;
    if (descriptionCN) analysisCodeFields.descriptionCN = descriptionCN;

    try {
      let analysisCode = await AnalysisCode.findOne({ codeNumber: codeNumber });
      if (analysisCode) {
        analysisCode = await AnalysisCode.findOneAndUpdate(
          { codeNumber: codeNumber },
          { $set: analysisCodeFields },
          { new: true }
        ).populate();
        return res.json(analysisCode);
      }
      analysisCode = new AnalysisCode(analysisCodeFields);
      await analysisCode.populate();
      await analysisCode.save();
      return res.json(analysisCode);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/analysiscodes
// @desc    GET the list of all analysis codes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const analysisCodes = await AnalysisCode.find().populate();
    res.json(analysisCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
