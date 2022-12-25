const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogin);

router.post('/register', authController.postSignup);

router.get('/logout', authController.getLogout);


module.exports = router;