'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyPhone: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');

    if (storedEmail) {
      setEmail(storedEmail);

      axios.post('http://localhost:5000/api/user/get-phone-number', { email: storedEmail })
        .then(response => {
          setPhoneNumber(response.data.phoneNumber);
          setMessage(`Phone number fetched: ${response.data.phoneNumber}`);
        })
        .catch(error => {
          console.error('Error fetching phone number:', error);
          setMessage('Failed to fetch phone number. Please try again.');
        });
    } else {
      setMessage('Email not found in session.');
    }
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    try {
        const response = await axios.post('http://localhost:5000/api/user/send-otp', { phoneNumber });
        setMessage(response.data.message);
    } catch (error) {
        console.error('Error sending OTP:', error);
        setMessage('Failed to send OTP');
    }
};

  return (
    <div className="container">
      {email}
      <h2 className="heading">Verify Phone Number</h2>
      <p>{message}</p>
      {phoneNumber && <p>Phone Number: {phoneNumber}</p>}
    </div>
  );
};

export default VerifyPhone;
