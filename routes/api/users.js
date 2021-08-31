const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Department = require('../../models/Department');

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
      'Please enter a password with 6 or more character'
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

      // Get User's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        d: 'pg',
        r: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
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
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/users
// @desc    Get the list of all users names
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name avatar');

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
      return res.status(404).json({ msg: 'User not found 2' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:user_id
// @desc    Get the details of one user
// @access  Private
router.get('/:user_id', auth, async (req, res) => {
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
router.get('/:user_id/departments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    const departments = await Department.find({ owners: user })
      .select('trigram name owners')
      .populate('owners', ['name', 'avatar']);
    return res.json(departments);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
