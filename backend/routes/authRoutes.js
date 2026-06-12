const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');
const { authRateLimiter } = require('../middlewares/authRateLimiter');

router.post('/login', authRateLimiter, login);
router.post('/signup', signup);

module.exports = router;