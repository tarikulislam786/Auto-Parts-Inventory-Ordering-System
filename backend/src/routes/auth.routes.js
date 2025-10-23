const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout); // 👈 Protected route

module.exports = router;
