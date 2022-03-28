const express = require('express');
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
  auth,
  check('name', 'A name for the department is required').not().isEmpty(),
  check('location', 'A location is required').not().isEmpty(),
  check(
    'trigram',
    'A 3-letter Trigram to describe the department is required'
  ).isLength({ min: 2, max: 5 }),
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
      // Check the unicity of the data in the form
      const otherDepartments = await Department.find({
        trigram: trigram,
        location: location,
      }).populate('location');

      if (otherDepartments.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: `The department ${
                trigram + ' on ' + otherDepartments[0].location.floor
              }/F already exists, 
              please choose a different Trigram or Location`,
            },
          ],
        });
      }

      department = new Department(departmentFields);
      await department.populate('owners', ['name']);
      await department.populate('location');
      await department.save();
      res.json(department);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/departments/:departmentId
// @desc    Update a department
// @access  Private
router.put(
  '/:departmentId',
  auth,
  check('name', 'A name for the department is required').not().isEmpty(),
  check('location', 'A location is required').not().isEmpty(),
  check(
    'trigram',
    'A 3-letter Trigram to describe the department is required'
  ).isLength({ min: 2, max: 5 }),
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
      // Check the unicity of the data in the form
      const otherDepartments = await Department.find({
        trigram: trigram,
        location: location,
      }).populate('location');

      let arrayOfDepartmentsId = otherDepartments.map((o) => o._id.toString());

      if (
        arrayOfDepartmentsId.length > 1 ||
        (arrayOfDepartmentsId.length === 1 &&
          arrayOfDepartmentsId.indexOf(req.params.departmentId) === -1)
      ) {
        return res.status(400).json({
          errors: [
            {
              msg: `The department ${
                trigram + ' on ' + otherDepartments[0].location.floor
              }/F already exists, 
              please choose a different Trigram or Location`,
            },
          ],
        });
      }

      // Since we don't have any other entries, we can find and update
      const department = await Department.findByIdAndUpdate(
        { _id: req.params.departmentId },
        { $set: departmentFields },
        { new: true }
      );
      if (!department) {
        return res.status(404).json({ msg: 'Department not found' });
      }

      res.json(department);
    } catch (err) {
      console.error(err.message);
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

// @route   GET api/departments/:departmentId
// @desc    Show detail of one department
// @access  Public
router.get('/:departmentId', async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId)
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

// @route   DELETE api/departments/:departmentId
// @desc    Delete a department
// @access  Private
router.delete('/:departmentId', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId);

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
