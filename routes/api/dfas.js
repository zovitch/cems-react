const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Dfa = require('../../models/Dfa');

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
    if (validationENG) rfaFields.validationENG = validationENG;
    if (validationOWN) rfaFields.validationOWN = validationOWN;
    if (validationFIN) rfaFields.validationFIN = validationFIN;

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
            // check if machine already offline
            dfaFields.machine = foundMachine;
            dfa = await Dfa.findOneAndUpdate(
              { dfaNumber: dfaNumber },
              { $set: dfaFields },
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

      let dfa = await Dfa.findOne()
        .sort('-dfaNumber') // to get the max
        .limit(1);
      let newDfaNumber = 1;

      console.log(dfa);

      //   if (dfa[0]) {
      dfaFields.dfaNumber = 1; //dfa.dfaNumber + 1;
      //   }
      console.log(dfa);
      if (machine) {
        const foundMachine = await Machine.findById(machine);
        if (!foundMachine) {
          return res.status(400).json({ msg: 'Machine not found' });
        }
        // Check if machine not already offline
        dfaFields.machine = foundMachine;

        dfa = new Dfa(dfaFields);
        await dfa.populate({
          path: 'machine',
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
        await dfa.save();
        console.log('DFA created');
        return res.json(dfa);
      }
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

module.exports = router;
