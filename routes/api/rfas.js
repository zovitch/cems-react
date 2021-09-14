const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Rfa = require('../../models/Rfa');
const Machine = require('../../models/Machine');
const { populate } = require('../../models/Machine');

// @route   POST api/rfas
// @desc    Create or update an RFA
// @access  Private
router.post(
  '/',
  [auth, [check('machine', 'An existing Machine is required').not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      rfaNumber,
      machine,
      validationENG,
      validationPUR,
      validationRequestor,
    } = req.body;

    const rfaFields = {};
    if (rfaNumber) rfaFields.rfaNumber = rfaNumber;
    if (validationENG) rfaFields.validationENG = validationENG;
    if (validationPUR) rfaFields.validationPUR = validationPUR;
    if (validationRequestor)
      rfaFields.validationRequestor = validationRequestor;

    try {
      // Set the RFA Number
      // Find the max number of AFA
      let afa = await Afa.find({})
        .select('afaNumber')
        .sort({ afaNumber: -1 })
        .limit(1);

      // Find the max number of RFA
      let rfa = await Rfa.find({})
        .select('rfaNumber')
        .sort({ rfaNumber: -1 })
        .limit(1);

      let newRfaNumber = 1; // by default is set at 1;
      if (afa[0]) {
        newRfaNumber = afa[0].afaNumber + 1;
      }
      if (rfa[0]) {
        newRfaNumber = Math.max(newRfaNumber, rfa[0].rfaNumber + 1);
      }

      rfa = await Rfa.findOne({ rfaNumber: rfaNumber });

      if (rfa) {
        // Update an existing RFA
        if (machine) {
          const foundMachine = await Machine.findById(machine);
          if (foundMachine) {
            if (
              !rfa.machines.filter((m) => m.toString() === foundMachine.id)
                .length > 0
            ) {
              rfa.machines.unshift(foundMachine);
              await rfa.save();
            }
          } else {
            return res.status(400).json({ msg: 'Machine not found' });
          }

          rfa = await Rfa.findOneAndUpdate(
            { rfaNumber: rfaNumber },
            { $set: rfaFields },
            { new: true }
          ).populate({
            path: 'machines',
            populate: {
              path: 'department afa parentMachine manufacturer category',
              populate: {
                path: 'owners location department afa manufacturer category',
                select:
                  'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
                strictPopulate: false,
                populate: {
                  path: 'owners location department afa manufacturer category',
                  select:
                    'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
                  strictPopulate: false,
                },
              },
            },
          });
          return res.json(rfa);
        }
      }
      // Create a new RFA
      if (machine) {
        const foundMachine = await Machine.findById(machine).populate(
          'afa',
          'afaNumber'
        );
        if (foundMachine) {
          rfaFields.machines = [foundMachine.id]; // We create the Array to receive the first machine;
          // we the AFA Number associated with the machine
          if (foundMachine.afa) {
            rfaFields.rfaNumber = foundMachine.afa.afaNumber;
          } else {
            rfaFields.rfaNumber = newRfaNumber;
          }
        } else {
          return res.status(400).json({ msg: 'Machine not found' });
        }
      }
      rfa = new Rfa(rfaFields);
      await rfa.populate({
        path: 'machines',
        populate: {
          path: 'department afa parentMachine manufacturer category',
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
            populate: {
              path: 'owners location department afa manufacturer category',
              select:
                'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
              strictPopulate: false,
            },
          },
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
    const rfa = await Rfa.findOne({ rfaNumber: req.params.rfaNumber }).populate(
      {
        path: 'machines',
        populate: {
          path: 'department afa parentMachine manufacturer category',
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
            populate: {
              path: 'owners location department afa manufacturer category',
              select:
                'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
              strictPopulate: false,
            },
          },
        },
      }
    );

    if (!rfa) {
      return res.status(400).json({ msg: 'RFA not found' });
    }
    res.json(rfa);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'RFA not found' });
    }
    if (err.kind === 'Number') {
      return res.status(404).json({ msg: 'RFA not found' });
    }
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
          path: 'department afa parentMachine manufacturer category',
          populate: {
            path: 'owners location department afa manufacturer category',
            select:
              'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
            strictPopulate: false,
            populate: {
              path: 'owners location department afa manufacturer category',
              select:
                'name avatar nameCN shortname floor locationLetter code trigram description descriptionCN',
              strictPopulate: false,
            },
          },
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
