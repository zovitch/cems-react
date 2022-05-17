const express = require('express');
const router = express.Router();
const uploadControlled = require('../../middleware/upload');
const auth = require('../../middleware/auth');

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', auth, uploadControlled.upload_file);

module.exports = router;
