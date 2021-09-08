const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const newMachineNumber = require('../../functions/newMachineNumber');

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
      check('machines', 'An existing Machine is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      rfaNumber,
      machines,
      validationENG,
      validationPUR,
      validationRequestor,
    } = req.body;

    const rfaFields = {};
    if (rfaNumber) rfaFields.rfaNumber = rfaNumber;
    if (machines) rfaFields.machines = machines;
    if (validationENG) rfaFields.validationENG = validationENG;
    if (validationPUR) rfaFields.validationPUR = validationPUR;
    if (validationRequestor)
      rfaFields.validationRequestor = validationRequestor;

    try {
      let rfa = await Rfa.findOne({ rfaNumber: rfaNumber }).populate(
        'machines'
      );

      if (rfa) {
        // Update an existing RFA
        console.log('RFA updated');
        rfa = await Rfa.findOneAndUpdate(
          { rfaNumber: rfaNumber },
          { $set: rfaFields },
          { new: true }
        )
          .populate({
            path: 'machines',
            populate: {
              path: 'category',
              select: 'code trigram description descriptionCN',
            },
          })
          .populate({
            path: 'machines',
            populate: {
              path: 'department',
              select: 'trigram name nameCN',
              populate: {
                path: 'owners',
                select: 'name avatar',
              },
            },
          })
          .populate({
            path: 'machines',
            populate: {
              path: 'manufacturer',
              select: 'name nameCN',
            },
          })
          .populate({
            path: 'machines',
            populate: {
              path: 'location',
              select: 'shortname name nameCN floor',
            },
          });
        return res.json(rfa);
      }
      // Create a new RFA
      console.log('RFA created');
      rfa = new Rfa(rfaFields);
      await rfa.save();

      await rfa.populate({
        path: 'machines',
        // select: 'manufacturer category department location',
        populate: {
          path: 'category manufacturer department location',
          select:
            'code name nameCN trigram description descriptionCN trigram shortname owners floor',
          populate: {
            strictPopulate: false,
            path: 'owners',
            select: 'name avatar',
          },
        },
      });

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
        path: 'machines',
        populate: {
          path: 'category',
          select: 'code trigram description descriptionCN',
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'department',
          select: 'trigram name nameCN',
          populate: {
            path: 'owners',
            select: 'name avatar',
          },
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'manufacturer',
          select: 'name nameCN',
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'location',
          select: 'shortname name nameCN floor',
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
        path: 'machines',
        populate: {
          path: 'category',
          select: 'code trigram description descriptionCN',
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'department',
          select: 'trigram name nameCN',
          populate: {
            path: 'owners',
            select: 'name avatar',
          },
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'manufacturer',
          select: 'name nameCN',
        },
      })
      .populate({
        path: 'machines',
        populate: {
          path: 'location',
          select: 'shortname name nameCN floor',
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
