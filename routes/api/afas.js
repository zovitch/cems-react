const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Afa = require('../../models/Afa');

// @route   POST api/afas
// @desc    Create or update an AFA
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      // check('afaNumber', 'AFA Number is required').not().isEmpty(),
      check('designation', 'A Designation for the machine is necessary')
        .not()
        .isEmpty(),
      check(
        'designationCN',
        'A Designation in Chinese for the machine is necessary'
      )
        .not()
        .isEmpty(),
      check('applicantName', 'An Applicant Name is necessary').not().isEmpty(),
      check('department', 'An Applicant Department is necessary')
        .not()
        .isEmpty(),
      // check('applicantDate', 'Application Date is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      afaNumber,
      designation,
      designationCN,
      investmentNumber,
      applicantName,
      department,
      applicantSignature,
      applicantDate,
      quantity,
      parentMachine,
      technicalRequirement,
      reasonOfApplication,
      remark,
      manufacturer,
      validationENG,
      validationGM,
      validationPUR,
    } = req.body;

    const afaFields = {};
    if (afaNumber) afaFields.afaNumber = afaNumber;
    if (designation) afaFields.designation = designation;
    if (designationCN) afaFields.designationCN = designationCN;
    if (investmentNumber) afaFields.investmentNumber = investmentNumber;
    if (applicantName) afaFields.applicantName = applicantName;
    if (department) afaFields.department = department;
    if (applicantSignature) afaFields.applicantSignature = applicantSignature;
    if (applicantDate) afaFields.applicantDate = applicantDate;
    if (quantity) afaFields.quantity = quantity;
    if (technicalRequirement)
      afaFields.technicalRequirement = technicalRequirement;
    if (reasonOfApplication)
      afaFields.reasonOfApplication = reasonOfApplication;
    if (remark) afaFields.remark = remark;
    if (manufacturer) afaFields.manufacturer = manufacturer;
    if (validationENG) afaFields.validationENG = validationENG;
    if (validationPUR) afaFields.validationPUR = validationPUR;
    if (validationGM) afaFields.validationGM = validationGM;
    if (parentMachine) afaFields.parentMachine = parentMachine;

    try {
      let afa = await Afa.findOne({ afaNumber: afaNumber });

      if (afa) {
        // Update an existing AFA
        afa = await Afa.findOneAndUpdate(
          { afaNumber: afaNumber },
          { $set: afaFields },
          { new: true }
        )
          .populate({
            path: 'department',
            select: 'trigram name nameCN owners',
            populate: { path: 'owners', select: 'name avatar' },
          })
          .populate({
            path: 'parentMachine',
            select: 'machineNumber designation designationCN ',
            populate: {
              path: 'location category manufacturer department',
              select: 'shortname trigram name nameCN description descriptionCN',
            },
          });
        return res.json(afa);
      }
      // no AFA found, we create a new one

      // Set the AFA Number
      // Find the max number of AFA
      afa = await Afa.find({})
        .select('afaNumber')
        .sort({ afaNumber: -1 })
        .limit(1);

      afaFields.afaNumber = 1; // by default is set at 1

      // Increment by 1 if AFA is found
      if (afa[0]) {
        afaFields.afaNumber = afa[0].afaNumber + 1;
      }
      console.log(afa[0]);
      afa = new Afa(afaFields);
      await afa.populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      });
      await afa.populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer ',
          select: 'shortname trigram name nameCN description descriptionCN',
        },
      });

      await afa.save();
      return res.json(afa);
    } catch (err) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ 'Duplicate Entry': err.keyValue });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/afas
// @desc    Display all AFAs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const afas = await Afa.find()
      .sort({ afaNumber: -1 })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer department',
          select: 'shortname trigram name nameCN description descriptionCN',
        },
      });

    if (!afas) {
      return res.status(400).json({ msg: 'No AFAs found' });
    }
    res.json(afas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/afas/:afaNumber
// @desc    Display details of a single AFA
// @access  Public
router.get('/:afaNumber', async (req, res) => {
  try {
    const afa = await Afa.findOne({ afaNumber: req.params.afaNumber })
      .populate({
        path: 'department',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
      })
      .populate({
        path: 'parentMachine',
        select: 'machineNumber designation designationCN ',
        populate: {
          path: 'location category manufacturer department',
          select: 'shortname trigram name nameCN description descriptionCN',
        },
      });

    if (!afa) {
      return res.status(400).json({ msg: 'AFA not found' });
    }
    res.json(afa);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/afas/:afa_id
// @desc    Delete a single AFA
// @access  Private
router.delete('/:afa_id', auth, async (req, res) => {
  try {
    const afa = await Afa.findById(req.params.afa_id);
    if (!afa) {
      return res.status(404).json({ msg: 'AFA not found' });
    }
    await afa.remove();
    res.json({ msg: 'AFA deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'AFA not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
