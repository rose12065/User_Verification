'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './verifyPhone.module.css';

const VerifyPhone: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>(''); // State for OTP input
  const [otpError, setOtpError] = useState<string>(''); // State for OTP error message

  // Fetch phone number on component mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');

    if (storedEmail) {
      setEmail(storedEmail);

      axios.post('http://localhost:5000/api/user/get-phone-number', { email: storedEmail })
        .then(response => {
          setPhoneNumber(response.data.phoneNumber);
          setMessage(`Phone number fetched: ${response.data.phoneNumber}`);
          sendOtp(response.data.phoneNumber); // Automatically send OTP when phone number is fetched
        })
        .catch(error => {
          console.error('Error fetching phone number:', error);
          setMessage('Failed to fetch phone number. Please try again.');
        });
    } else {
      setMessage('Email not found in session.');
    }
  }, []);

  // Function to send OTP to the phone number
  const sendOtp = async (phoneNumber: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/send-otp', { phoneNumber });
      setMessage(response.data.message || 'OTP sent to your phone.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP.');
    }
  };

  // Function to verify the entered OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-otp', { phoneNumber, otp });
      if (response.data.success) {
        setMessage('Phone number verified successfully!');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Failed to verify OTP. Please try again.');
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify Phone Number</h2>
      <p>{message}</p>
      {phoneNumber && <p>Phone Number: {phoneNumber}</p>}

      {/* OTP Input Field */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter OTP:</label>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={styles.input}
          placeholder="Enter the OTP sent to your phone"
        />
        {otpError && <span className={styles.error}>{otpError}</span>}
      </div>

      {/* Submit Button for OTP */}
      <button onClick={handleVerifyOtp} className={styles.button}>Verify OTP</button>
      <button className={styles.button}><a href="/verify/verifyEmail"></a>Email verify</button>
    </div>
  );
};

export default VerifyPhone;
