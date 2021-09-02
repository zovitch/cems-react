const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Afa = require('../../models/Afa');
const AFA = require('../../models/Afa');

// @route   POST api/afas
// @desc    Create or Update an AFA
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('designation', 'A Designation for the machine is necessary')
        .not()
        .isEmpty(),
      check('designationCN', 'A Designation for the machine is necessary')
        .not()
        .isEmpty(),
      check('applicantName', 'An Applicant Name is necessary').not().isEmpty(),
      check('applicantDepartment', 'An Applicant Department is necessary')
        .not()
        .isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      designation,
      designationCN,
      investmentNumber,
      applicantName,
      applicantDepartment,
      applicantSignature,
      applicantDate,
      quantity,
      parentEquipment,
      technicalRequirement,
      reasonOfApplication,
      remark,
    } = req.body;

    const afaFields = {};
    if (designation) afaFields.designation = designation;
    if (designationCN) afaFields.designationCN = designationCN;
    if (investmentNumber) afaFields.investmentNumber = investmentNumber;
    if (applicantName) afaFields.applicantName = applicantName;
    if (applicantDepartment)
      afaFields.applicantDepartment = applicantDepartment;
    if (applicantSignature) afaFields.applicantSignature = applicantSignature;
    if (applicantDate) afaFields.applicantDate = applicantDate;
    if (quantity) afaFields.quantity = quantity;
    if (parentEquipment) afaFields.parentEquipment = parentEquipment;
    if (technicalRequirement)
      afaFields.technicalRequirement = technicalRequirement;
    if (reasonOfApplication)
      afaFields.reasonOfApplication = reasonOfApplication;
    if (remark) afaFields.remark = remark;

    try {
      // Set the AFA Number
      afaFields.afaNumber = 1; // by default is set at 1

      let afa = await Afa.find({})
        .select('afaNumber')
        .sort({ afaNumber: -1 })
        .limit(1);

      if (afa) {
        afaFields.afaNumber = afa[0].afaNumber + 1;
      }

      // Create a new AFA
      afa = new Afa(afaFields);
      await afa.populate({
        path: 'applicantDepartment',
        select: 'trigram name nameCN owners',
        populate: { path: 'owners', select: 'name avatar' },
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

module.exports = router;
