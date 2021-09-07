const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Rfa = require('../../models/Rfa');

// @route   POST api/rfas
// @desc    Create or update an RFA
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check(
        'rfaNumber',
        'RFA Number is required, if possible should match an existing RFA'
      )
        .not()
        .isEmpty(),
      check('machineNumber', 'Machine Number is required').not().isEmpty(),
      check('designation', 'A Designation for the machine is necessary')
        .not()
        .isEmpty(),
      check(
        'designationCN',
        'A Designation in Chinese for the machine is necessary'
      )
        .not()
        .isEmpty(),
      check('category', 'A Category is necessary').not().isEmpty(),
      check('department', 'Assigning a department is necessary')
        .not()
        .isEmpty(),
      check('location', 'Assigning a location is necessary').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      rfaNumber,
      machineNumber,
      qualityNumber,
      designation,
      designationCN,
      investmentNumber,
      costCenter,
      category,
      department,
      manufacturer,
      model,
      serialNumber,
      location,
      manufacturingDate,
      acquiredDate,
      purchasedPrice,
      comment,
      date,
      validationENG,
      validationPUR,
      validationRequestor,
      parentMachine,
    } = req.body;

    const rfaFields = {};
    if (rfaNumber) rfaFields.rfaNumber = rfaNumber;
    if (machineNumber) rfaFields.machineNumber = machineNumber;
    if (qualityNumber) rfaFields.qualityNumber = qualityNumber;
    if (designation) rfaFields.designation = designation;
    if (designationCN) rfaFields.designationCN = designationCN;
    if (investmentNumber) rfaFields.investmentNumber = investmentNumber;
    if (costCenter) rfaFields.costCenter = costCenter;
    if (category) rfaFields.category = category;
    if (department) rfaFields.department = department;
    if (manufacturer) rfaFields.manufacturer = manufacturer;
    if (model) rfaFields.model = model;
    if (serialNumber) rfaFields.serialNumber = serialNumber;
    if (location) rfaFields.location = location;
    if (manufacturingDate) rfaFields.manufacturingDate = manufacturingDate;
    if (acquiredDate) rfaFields.acquiredDate = acquiredDate;
    if (purchasedPrice) rfaFields.purchasedPrice = purchasedPrice;
    if (comment) rfaFields.comment = comment;
    if (date) rfaFields.date = date;
    if (validationENG) rfaFields.validationENG = validationENG;
    if (validationPUR) rfaFields.validationPUR = validationPUR;
    if (validationRequestor)
      rfaFields.validationRequestor = validationRequestor;
    if (parentMachine) rfaFields.parentMachine = parentMachine;

    try {
      let rfa = await Rfa.findOne({ rfaNumber: rfaNumber });

      if (rfa) {
        // Update an existing RFA
        rfa = await Rfa.findOneAndUpdate(
          { rfaNumber: rfaNumber },
          { $set: rfaFields },
          { new: true }
        )
          .populate({
            path: 'location category manufacturer',
            select: 'shortname trigram name nameCN description descriptionCN',
          })
          .populate({
            path: 'department',
            select: 'trigram name nameCN owners',
            populate: { path: 'owners', select: 'name avatar' },
          })
          .populate({
            path: 'parentMachine',
            select: 'machineNumber designation designationCN ',
            populate: {
              path: 'location category manufacturer department',
              select:
                'shortname trigram name nameCN description descriptionCN ',
            },
          });
        return res.json(rfa);
      }
      // Create a new RFA
      rfa = new Rfa(rfaFields);
      await rfa.populate({
        path: 'location category manufacturer',
        select: 'shortname trigram name nameCN description descriptionCN',
      });
      await rfa.populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      });
      await rfa.populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer department',
          select: 'shortname trigram name nameCN description descriptionCN ',
        },
      });

      await rfa.save();
      return res.json(rfa);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/rfas/:rfaNumber
// @desc    Display details of a single RFA
// @access  Public
router.get('/:rfaNumber', async (req, res) => {
  try {
    const rfa = await Rfa.findOne({ rfaNumber: req.params.rfaNumber })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer department',
          select: 'shortname trigram name nameCN description descriptionCN',
        },
      });

    if (!rfa) {
      return res.status(400).json({ msg: 'RFA not found' });
    }
    res.json(rfa);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rfas
// @desc    Display all RFAs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const rfas = await Rfa.find()
      .sort({ rfaNumber: -1 })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer department',
          select: 'shortname trigram name nameCN description descriptionCN',
        },
      });

    if (!rfas) {
      return res.status(400).json({ msg: 'No RFAs found' });
    }
    res.json(rfas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/rfas/:rfa_id
// @desc    Delete an RFA
// @access  Private
router.delete('/:rfa_id', auth, async (req, res) => {
  try {
    const rfa = await Rfa.findById(req.params.rfa_id);
    if (!rfa) {
      return res.status(404).json({ msg: 'RFA not found' });
    }
    await rfa.remove();
    res.json({ msg: 'RFA deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'RFA not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
