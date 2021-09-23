const express = require('express');
const router = express.Router();
const userController = require('../control/user.control');
router.route('/').post(userController.userCreate);
module.exports = router;