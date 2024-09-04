'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './verifyAadhar.module.css';
import { useRouter } from 'next/navigation'; 

const VerifyAadhar: React.FC = () => {
  const [aadhaar, setAadhaar] = useState<string>(''); // State for Aadhar input
  const [message, setMessage] = useState<string>(''); // State for the server message
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // State to manage the loading state
  const router = useRouter();
  // Function to handle Aadhar verification
  const handleVerifyAadhar = async () => {
    if (!aadhaar) {
      setMessage('Please enter your Aadhar number.');
      return;
    }

    setIsVerifying(true); // Set loading state to true
    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-aadhar', { aadhaar });
      setMessage(response.data.message || 'Aadhar verification successful!');
    }
    catch (error) {
      console.error('Error verifying Aadhar:', error);
      setMessage('Failed to verify Aadhar. Please try again.');
    } finally {
      setIsVerifying(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify Aadhar</h2>
      <p>{message}</p>

      {/* Input Field for Aadhar */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter Aadhar Number:</label>
        <input
          type="text"
          name="aadhaar"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          className={styles.input}
          placeholder="Enter your Aadhar number"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyAadhar}
        className={styles.button}
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify Aadhar'}
      </button>
      <button className={styles.button}><a href="/authentication/pan" className={styles.link}>Next</a></button>
    </div>
  );
};

export default VerifyAadhar;
