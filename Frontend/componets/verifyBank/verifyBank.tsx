'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './verifyBank.module.css'; // Assuming you have some CSS for styling

const VerifyBank = () => {
  const [bankAccountNumber, setBankAccountNumber] = useState(''); // State to store the bank account number
  const [message, setMessage] = useState(''); // State to display success or error message
  const [isVerifying, setIsVerifying] = useState(false); // State to manage the loading state

  // Function to handle bank account verification
  const handleVerifyBank = async () => {
    if (!bankAccountNumber) {
      setMessage('Please enter your bank account number.');
      return;
    }

    setIsVerifying(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-bank', {
        bankAccountNumber
      });
      setMessage(response.data.success ? 'Bank account verification successful!' : 'Verification failed');
      console.log(response.data); // Display the response data in the console for debugging
    } catch (error) {
      console.error('Error verifying bank account:', error);
      setMessage('Failed to verify bank account. Please try again.');
    } finally {
      setIsVerifying(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify Bank Account</h2>
      <p>{message}</p>

      {/* Input Field for Bank Account Number */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter Bank Account Number:</label>
        <input
          type="text"
          name="bankAccountNumber"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value)}
          className={styles.input}
          placeholder="Enter your bank account number"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyBank}
        className={styles.button}
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify Bank Account'}
      </button>
      <button className={styles.button}><a href="/authentication/gst" className={styles.link}>Next</a></button>
    </div>
  );
};

export default VerifyBank;
