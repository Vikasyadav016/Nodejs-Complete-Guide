const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const router = express.Router()

router.get('/all-user', getUserDetails)

module.exports = router;