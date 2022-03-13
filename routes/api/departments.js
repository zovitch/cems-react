const express = require('express');
// const config = require('config');
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
    [
      check('name', 'A name for the department is required').not().isEmpty(),
      check('location', 'A location is required').not().isEmpty(),
      check(
        'trigram',
        '3 letters to describe the department is required'
      ).isLength({ min: 3, max: 3 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, nameCN, owners, location } = req.body;
    const trigram = req.body.trigram.toUpperCase();

    const departmentFields = {};
    if (name) departmentFields.name = name;
    if (nameCN) departmentFields.nameCN = nameCN;
    if (owners) departmentFields.owners = owners;
    if (trigram) departmentFields.trigram = trigram;
    if (location) departmentFields.location = location;

    try {
      let department = await Department.findOne({ trigram: trigram });
      let departmentWithName = await Department.findOne({ name: name });
      let departmentWithNameCN = await Department.findOne({ name: nameCN });

      if (
        departmentWithName &&
        department &&
        departmentWithName.trigram !== department.trigram
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: 'A department with this name already exists, please chose a different name',
            },
          ],
        });
      }
      if (
        departmentWithNameCN &&
        department &&
        departmentWithNameCN.trigram !== department.trigram
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: 'A department with this Chinese name already exists, please chose a different Chinese name',
            },
          ],
        });
      }

      if (department) {
        department = await Department.findOneAndUpdate(
          { trigram: trigram },
          { $set: departmentFields },
          { new: true }
        )
          .populate('owners', ['name'])
          .populate('location');
        return res.json(department);
      }

      // no department found so we Create
      if (owners) {
        const foundUser = await User.findById(user);
        if (foundUser) {
          departmentFields.owners = [foundUser.id]; // We create the Array to receive the first owner
        }
      }
      department = new Department(departmentFields);

      await department.populate('owners', ['name']);
      await department.populate('location');
      await department.save();
      res.json(department);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
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
    const departments = await Department.find()
      .populate('owners', ['name'])
      .populate('location');
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
    })
      .populate('owners', ['name'])
      .populate('location');

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
// @access  Public
router.delete('/:trigram', async (req, res) => {
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

// NOT NEEDED BECAUSE THE LIST OF OWNERS IS OVERWRITTEN EVERY TIME WE EDIT THE DEPARTMENT
// @route   DELETE api/departments/:trigram/:user
// @desc    DELETE a user from the department's owners
// @access  Private

// router.delete('/:trigram/:user', auth, async (req, res) => {
//   try {
//     const department = await Department.findOne({
//       trigram: req.params.trigram,
//     }).populate('owners', ['name']);

//     if (department) {
//       const foundUser = await User.findById(req.params.user);
//       if (foundUser) {
//         if (
//           department.owners.filter(
//             (owner) => owner.id.toString() === foundUser.id
//           ).length > 0
//         ) {
//           department.owners.splice(foundUser, 1);
//           await department.save();
//           res.json(department);
//         } else {
//           return res
//             .status(404)
//             .json({ msg: 'User was not found in the list of owners' });
//         }
//       } else {
//         return res
//           .status(404)
//           .json({ msg: 'User was not found in the list of owners' });
//       }
//     } else {
//       return res.status(404).json({ msg: 'Department not found' });
//     }
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res
//         .status(404)
//         .json({ msg: 'User was not found in the list of owners' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
