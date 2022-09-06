const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Department = require('../../models/Department');
const Manufacturer = require('../../models/Manufacturer');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'A valid email is required').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more character',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;
    const email = req.body.email.toLowerCase();

    try {
      // See if User exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '365d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route   GET api/users
// @desc    Get the list of all users names
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name email isEngineer').sort({
      name: 1,
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/me
// @desc    Get Current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/me
// @desc    Update a user information
// @access  Private
router.put(
  '/me',
  [auth, [check('name', 'A name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const nameField = {};
    if (name) nameField.name = name;

    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: nameField },
        { new: true },
      );
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route   GET api/users/:user_id
// @desc    Get the details of one user
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:user_id/department
// @desc    Show all the department owned by one person
// @access  Public
router.get('/:user_id/departments', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    const departments = await Department.find({ owners: user })
      .select('trigram name owners location')
      .populate('owners', ['name'])
      .populate('location');
    return res.json(departments);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/
// @desc    Delete the user account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // todo remove things belonging to the user??
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
