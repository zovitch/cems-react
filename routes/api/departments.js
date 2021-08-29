const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Department = require('../../models/Department');
const User = require('../../models/User');

// @route   POST api/departments
// @desc    Create or Update a department
// @access  Private
router.post(
  '/',
  [
    check('name', 'A name for the department is required').not().isEmpty(),
    check(
      'trigram',
      '3 letters to describe the department is required'
    ).isLength({ min: 3, max: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, nameCN, user } = req.body;
    const trigram = req.body.trigram.toUpperCase();

    const departmentFields = {};
    if (name) departmentFields.name = name;
    if (nameCN) departmentFields.nameCN = nameCN;
    if (trigram) departmentFields.trigram = trigram;
    if (user) departmentFields.owners = user;

    try {
      let department = await Department.findOne({ trigram: trigram }).populate(
        'owners',
        ['name']
      );

      if (department) {
        // Found one so we Update
        console.log('Update department info');
        department = await Department.findOneAndUpdate(
          { trigram: trigram },
          { $set: departmentFields },
          { new: true }
        );

        department = new Department(departmentFields);
        console.log(departmentFields);
      } else {
        // no department found so we Create
      }

      // We add the user into the owners
      // if (user) {
      //   const foundUser = await User.findById(user);
      //   if (!foundUser) {
      //     // if a user is present but not found in our collections
      //     return res.status(404).json({ msg: 'User not found' });
      //   }
      //   console.log(123);

      //   department.owners.unshift(foundUser);
      // }

      await department.save();
      res.json(department);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/departments
// @desc    Get all departments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/departments/:trigram
// @desc    Show detail of one department
// @access  Public

router.get('/:trigram', async (req, res) => {
  try {
    const department = await Department.findOne({
      trigram: req.params.trigram,
    });

    if (!department) {
      // Not Found we return 404
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/departments/:user_id
// @desc    Show detail of oll department associated with a user
// @access  Public/
//@ todo

// @route   DELETE api/departments/:trigram
// @desc    Delete a department
// @access  Private
router.delete('/:trigram', auth, async (req, res) => {
  try {
    const department = await Department.findOne({
      trigram: req.params.trigram,
    });

    if (!department) {
      // Not Found we return 404
      return res.status(404).json({ msg: 'Department not found' });
    }

    await department.remove();
    res.json({ msg: 'Department removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
