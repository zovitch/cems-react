const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Department = require('../../models/Department');
const User = require('../../models/User');

// @route   POST api/departments
// @desc    Create or Update a department
// @access  Private
router.post(
  '/',
  [
    auth,
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

    try {
      let department = await Department.findOne({ trigram: trigram });

      if (department) {
        if (user) {
          const foundUser = await User.findById(user);
          if (foundUser) {
            if (
              !department.owners.filter(
                (owner) => owner.toString() === foundUser.id
              ).length > 0
            ) {
              department.owners.unshift(foundUser);
              await department.save();
            }
          }
        }

        department = await Department.findOneAndUpdate(
          { trigram: trigram },
          { $set: departmentFields },
          { new: true }
        ).populate('owners', ['name', 'avatar']);
        return res.json(department);
      }

      // no department found so we Create
      if (user) {
        const foundUser = await User.findById(user);
        if (foundUser) {
          departmentFields.owners = [foundUser.id]; // We create the Array to receive the first owner
        }
      }
      department = new Department(departmentFields);
      await department.populate('owners', ['name', 'avatar']);
      await department.save();
      res.json(department);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/departments
// @desc    Get all departments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().populate('owners', [
      'name',
      'avatar',
    ]);
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
    }).populate('owners', ['name', 'avatar']);

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

// @route   DELETE api/departments/:trigram/:user
// @desc    DELETE a user from the department's owners
// @access  Private

router.delete('/:trigram/:user', auth, async (req, res) => {
  try {
    const department = await Department.findOne({
      trigram: req.params.trigram,
    }).populate('owners', ['name', 'avatar']);

    if (department) {
      const foundUser = await User.findById(req.params.user);
      if (foundUser) {
        if (
          department.owners.filter(
            (owner) => owner.id.toString() === foundUser.id
          ).length > 0
        ) {
          department.owners.splice(foundUser, 1);
          await department.save();
          res.json(department);
        } else {
          return res
            .status(404)
            .json({ msg: 'User was not found in the list of owners' });
        }
      } else {
        return res
          .status(404)
          .json({ msg: 'User was not found in the list of owners' });
      }
    } else {
      return res.status(404).json({ msg: 'Department not found' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'User was not found in the list of owners' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
