const express = require('express');
const router = express.Router();
const profileController = require('../control/profile.controller');
router.route('/').post(profileController.createProfile);
module.exports = router;