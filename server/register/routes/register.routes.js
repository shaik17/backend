const express = require('express');
const router = express.Router();
const controller = require('../controllers/register.controller')
router.route('/').post(controller.regUser)
module.exports = router;