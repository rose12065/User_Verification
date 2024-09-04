const User =require('../models/user')
var nodemailer = require('nodemailer');
const crypto=require('crypto')
const axios = require('axios'); 
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

// function for otp generation
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}
    const otp = generateOtp();

//Logic for user registration
exports.register=async(req,res)=>{
    try {
        const { name, email, phoneNumber, aadhar, dob } = req.body;
        const newUser = new User({ name, email, phoneNumber, aadhar, dob });
         const user= await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
      }

}
//logic for feteching phone number from database
exports.verifyPhone=async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error('Error fetching phone number:', error);
    res.status(500).json({ message: 'Server error' });
  }
  }

// logic for senting otp to phone
  exports.sentOtp=async(req,res)=>{
    const { phoneNumber } = req.body;
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio account SID from the environment variables
    const authToken = process.env.TWILIO_AUTH_TOKEN; 
    const twilioClient = twilio(accountSid, authToken);
    // Use Twilio or any other service to send OTP
   // Store OTP in session
  
    try {
      console.log(`+91${phoneNumber}`);
      await twilioClient.messages.create({
        body: `Your verification code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to:`+91${phoneNumber}`,
      });
      res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Failed to send OTP.' });
    }
   
  }
// logic for verifying the otp 
  exports.verifyOtp=async(req,res)=>{
    const { otps } = req.body;
  if (otp === otp) {
    // OTP is correct
    res.status(200).json({ success: true });
  } else {
    // OTP is incorrect
    res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }
  }
//logic for senting mail otp
  exports.emailVerify = async (req, res) => {
    // Extract the email from the request body
    const { email } = req.body; // Use req.body instead of body.query
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail as the email service
      auth: {
        user: 'royrose459@gmail.com', // Sender's email address
        pass: 'guyv kyti vqfv qpib', // Sender's email password or app-specific password
      },
    });
// Define the mail options
const mailOptions = {
  from: 'royrose459@gmail.com', // Sender's email address
  to: email, // Recipient's email address
  subject: 'Email Verification', // Subject of the email
  html: `Your OTP code is ${otp}.`, // Email content with the OTP
};


try {
  // Attempt to send the email
  await transporter.sendMail(mailOptions);
  // If successful, send a response back to the client
  res.status(200).send('Verification email sent successfully');
} catch (error) {
  // If an error occurs, send an error response with the error message
  console.error('Error sending email:', error.message); // Debugging: Log the error message
  res.status(500).send('Error sending email: ' + error.message);
}
};

// Function to verify OTP
exports.verifyOtpEmail=async(req, res)=> {
  if (req.method === 'POST') {
    const userOtp = req.body.otp;

    // Debugging: Log received OTP
    console.log('Received OTP:', userOtp);

    if (!userOtp) {
      console.error('OTP is missing');
      return res.status(400).send('OTP is required.');
    }

    // Debugging: Log stored OTP
    console.log('Stored OTP:', otp);

    // Check if the OTP exists and matches
    if (otp && otp === userOtp) {
      // OTP is valid
      console.log('OTP verification successful');
      return res.status(200).send('OTP verified successfully!');
    } else {
      // OTP is invalid
      console.error('Invalid OTP');
      return res.status(400).send('Invalid OTP.');
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
  }
  // function to verify aadhar number
  exports.verifyAadhar=async(req,res)=>{
    const { aadhaar } = req.body;
    const APYHUB_TOKEN = 'APY015umz03zIiuMULgPEBZmwrx2dvVkdQCTe8BpuXS4rsh71R9vUc5iHaFiCnUFwXl9Bg';

  if (!aadhaar) {
    return res.status(400).json({ message: 'Aadhar number is required.' });
  }

  try {
    // Make a request to the ApyHub API for Aadhar verification
    const response = await axios.post(
      'https://api.apyhub.com/validate/aadhaar',
      { aadhaar },
      {
        headers: {
          'Content-Type': 'application/json',
          'apy-token': APYHUB_TOKEN
        }
      }
    );

    // Send back the response from ApyHub to the frontend
    res.status(200).json(response.data);  // You can adjust the response data based on what ApyHub sends
  } catch (error) {
    console.error('Error verifying Aadhar:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to verify Aadhar. Please try again later.' });
  }
  }

// function to verify pan number
  exports.verifyPan = async (req, res) => {
    const { panNumber } = req.body;
  
    const options = {
      method: 'POST',
      url: 'https://aadhaar-number-verification-api-using-pan-number.p.rapidapi.com/api/validation/pan_to_aadhaar',
      headers: {
        'x-rapidapi-key': 'a428a6a11fmsh4ee19a4d6cfb021p19e431jsnf6e9584fdfeb', // Replace with your RapidAPI key
        'x-rapidapi-host': 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        pan: panNumber,
        consent: 'y',
        consent_text: 'I hereby declare my consent agreement for fetching my information via AITAN Labs API'
      }
    };
  
    try {
      // Make the API request
      const response = await axios.request(options);
  
      // Check if the API response indicates a successful verification
      if (response.data.success) {
        return res.json({ success: true, message: 'PAN verified successfully!' });
      } else {
        return res.json({ success: false, message: response.data.message || 'PAN verification failed.' });
      }
    } catch (error) {
      console.error('Error verifying PAN:', error.response ? error.response.data : error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  // function to verify bank account
  exports.verifyBank=async(req,res)=>{
    const { bankAccountNumber } = req.body;

  const options = {
    method: 'GET',
    url: 'https://indian-bank-account-verification.p.rapidapi.com/v3/tasks',
    params: {
      request_id: bankAccountNumber // Replace this with actual request ID if needed
    },
    headers: {
      'x-rapidapi-key': 'a428a6a11fmsh4ee19a4d6cfb021p19e431jsnf6e9584fdfeb', // Replace with your RapidAPI key
      'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error verifying bank account:', error);
    res.status(500).json({ success: false, message: 'Bank account verification failed.' });
  }
  }
// function to verify gst
  exports.verifyGst = async (req, res) => {
    const { gstNumber } = req.body;
  
    // Adjust this URL, headers, and data according to your API documentation
    const options = {
      method: 'POST',
      url: 'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate',
      headers: {
        'x-rapidapi-key': 'a428a6a11fmsh4ee19a4d6cfb021p19e431jsnf6e9584fdfeb',
        'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1', // Update with actual task_id if needed
        group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e', // Update with actual group_id if needed
        data: {
          gstin: gstNumber
        }
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error verifying GST number:', error.response ? error.response.data : error.message);
      res.status(500).json({ success: false, message: 'GST verification failed.' });
    }
  }
  // function for address lookup using pincode
  exports.verifyPincode = async (req, res) => {
    const { pincode } = req.body;
  
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      // Check if response contains data and has the correct structure
      if (response.data && response.data[0].Status === 'Success') {
        const { PostOffice } = response.data[0];
        if (PostOffice && PostOffice.length > 0) {
          const { Name: name, District: city, State: state, Country: country } = PostOffice[0];
          console.log(name, city);
          return res.json({ success: true, name, city, state, country });
        } else {
          return res.json({ success: false, message: 'Pincode not found.' });
        }
      } else {
        return res.json({ success: false, message: 'Invalid pincode or API error.' });
      }
    } catch (error) {
      console.error('Error verifying pincode:', error.response ? error.response.data : error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };