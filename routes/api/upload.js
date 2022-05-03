const express = require('express');
const router = express.Router();
const uploadControlled = require('../../middleware/upload');
const auth = require('../../middleware/auth');

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', auth, uploadControlled.upload_file);

module.exports = router;

//https://morioh.com/p/ffd9b4fb610a
//https://stackoverflow.com/questions/67232312/uploading-file-that-already-exists-is-causing-page-to-refresh
