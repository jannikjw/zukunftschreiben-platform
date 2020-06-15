const express = require('express');
const DonationController = require('../controllers/DonationController');

const router = express.Router();

router.post('/:project_id', DonationController.createDonation);

module.exports = router;
