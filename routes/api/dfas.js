const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Dfa = require('../../models/Dfa');

// @route   POST api/dfas
// @desc    Create or update an DFA
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
      dfaNumber,
      machine,
      validationENG,
      validationOWN,
      validationFIN,
      remark,
    } = req.body;

    const dfaFields = {};
    if (dfaNumber) dfaFields.dfaNumber = dfaNumber;
    if (remark) dfaFields.remark = remark;
    if (validationENG) dfaFields.validationENG = validationENG;
    if (validationOWN) dfaFields.validationOWN = validationOWN;
    if (validationFIN) dfaFields.validationFIN = validationFIN;

    try {
      if (dfaNumber) {
        // update and existing DFA
        let dfa = await Dfa.findOne({ dfaNumber: dfaNumber });

        if (dfa) {
          if (machine) {
            const foundMachine = await Machine.findById(machine);
            if (!foundMachine) {
              return res.status(400).json({ msg: 'Machine not found' });
            }
            dfaFields.machine = foundMachine;
            dfa = await Dfa.findOneAndUpdate(
              { dfaNumber: dfaNumber },
              { $set: dfaFields },
              { new: true }
            ).populate({
              path: 'machine',
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
            console.log('DFA updated');
            return res.json(dfa);
          }
        } else {
          return res.status(400).json({
            msg: 'DFA not found, do not provide DFA number to create a new one ',
          });
        }
      }
      //create a new DFA
      let dfa2 = await Dfa.findOne({ machine: machine });

      if (dfa2) {
        return res.status(400).json({
          msg: 'This Machine already has a DFA',
        });
      }

      let dfa = await Dfa.findOne()
        .sort('-dfaNumber') // to get the max
        .limit(1);
      dfaFields.dfaNumber = 1; //dfa.dfaNumber + 1;
      if (dfa) {
        dfaFields.dfaNumber = dfa.dfaNumber + 1;
      }

      const foundMachine = await Machine.findById(machine);
      if (!foundMachine) {
        return res.status(400).json({ msg: 'Machine not found' });
      }
      dfaFields.machine = foundMachine;

      dfa = new Dfa(dfaFields);

      await dfa.populate({
        path: 'machine',
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
      await dfa.save();
      return res.json(dfa);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'DFA not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/dfas
// @desc    Display all DFAs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const dfas = await Dfa.find()
      .sort({ dfaNumber: -1 })
      .populate({
        path: 'machine',
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
    if (!dfas) {
      return res.status(400).json({ msg: 'No DFAS found' });
    }
    res.json(dfas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/dfas/:dfa_id
// @desc    Delete an DFA
// @access  Private
router.delete('/:dfa_id', auth, async (req, res) => {
  try {
    const dfa = await Dfa.findById(req.params.dfa_id);
    if (!dfa) {
      return res.status(404).json({ msg: 'DFA not found' });
    }
    await dfa.remove();
    res.json({ msg: 'DFA deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'DFA not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
