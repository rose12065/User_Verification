// routes/register.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController=require('../controllers/userController')

// Registration route
router.post('/register',userController.register);
router.post('/get-phone-number',userController.verifyPhone);
router.post('/send-otp',userController.sentOtp);


module.exports = router;
