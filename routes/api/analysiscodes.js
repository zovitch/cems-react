const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const { AnalysisCode } = require('../../models/Code');

// @route   POST api/analysiscodes
// @desc    Create or Update a Analysis Code
// @access  Private
router.post(
  '/',
  auth,
  check('codeNumber', 'A Analysis Code Number is required').not().isEmpty(),
  check('name', 'A Analysis Code Name is required').not().isEmpty(),
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
  check(
    'codeNumber',
    'The Analysis Code should be a one or two digits number'
  ).isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { codeNumber, description, descriptionCN } = req.body;
    const name = req.body.name.toUpperCase();

    const analysisCodeFields = {};
    if (codeNumber) analysisCodeFields.codeNumber = codeNumber;
    if (name) analysisCodeFields.name = name;
    if (description) analysisCodeFields.description = description;
    if (descriptionCN) analysisCodeFields.descriptionCN = descriptionCN;

    try {
      // Check the unicity of the data in the form
      const otherCodes = await AnalysisCode.find({
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
      analysiscode = new AnalysisCode(analysisCodeFields);
      await analysiscode.populate();
      await analysiscode.save();
      return res.json(analysiscode);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/analysiscodes/codeId
// @desc    Update a Analysis Code
// @access  Private
router.put(
  '/:codeId',
  auth,
  check('codeNumber', 'A Analysis Code Number is required').not().isEmpty(),
  check('name', 'A Analysis Code Name is required').not().isEmpty(),
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
  check(
    'codeNumber',
    'The Analysis Code should be a one or two digits number'
  ).isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { codeNumber, description, descriptionCN } = req.body;
    const name = req.body.name.toUpperCase();

    const analysisCodeFields = {};
    if (codeNumber) analysisCodeFields.codeNumber = codeNumber;
    if (name) analysisCodeFields.name = name;
    if (description) analysisCodeFields.description = description;
    if (descriptionCN) analysisCodeFields.descriptionCN = descriptionCN;

    try {
      // Check the unicity of the data in the form
      const otherCodes = await AnalysisCode.find({
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

      let code = await AnalysisCode.findByIdAndUpdate(
        { _id: req.params.codeId },
        { $set: analysisCodeFields },
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

// @route   GET api/analysiscodes/:codeId
// @desc    GET the details of a analysis
// @access  Public
router.get('/:codeId', async (req, res) => {
  try {
    const analysiscode = await AnalysisCode.findById(req.params.codeId);

    if (!analysiscode) {
      return res.status(400).json({ msg: 'Analysis Code not found' });
    }
    return res.json(analysiscode);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/codes/:codeId
// @desc    Delete a Code
// @access  Private
router.delete('/:codeId', auth, async (req, res) => {
  try {
    const code = await AnalysisCode.findById(req.params.codeId);
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
