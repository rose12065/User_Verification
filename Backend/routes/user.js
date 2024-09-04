// routes/register.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController=require('../controllers/userController');

// Registration route
router.post('/register',userController.register);
router.post('/get-phone-number',userController.verifyPhone);
router.post('/send-otp',userController.sentOtp);
router.post('/verify-otp',userController.verifyOtp);
router.post('/emailVerify',userController.emailVerify);
router.post('/verifyOtp',userController.verifyOtpEmail);
router.post('/verify-aadhar',userController.verifyAadhar);
router.post('/verify-pan',userController.verifyPan);
router.post('/verify-bank',userController.verifyBank);
router.post('/verify-gst',userController.verifyGst);
router.post('/verify-pincode',userController.verifyPincode);

module.exports = router;
