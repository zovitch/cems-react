const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Department = require('../../models/Department');
const User = require('../../models/User');

// @route   GET api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const departments = await Department.find({ trigram: 1 });
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
