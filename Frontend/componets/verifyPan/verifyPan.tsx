'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import styles from './verifyPan.module.css';

const VerifyPan: React.FC = () => {
  const [panNumber, setPanNumber] = useState<string>(''); // State for PAN input
  const [message, setMessage] = useState<string>(''); // State for the server message
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // State to manage the loading state
  const router = useRouter(); // Initialize the useRouter hook

  // Function to handle PAN verification
  const handleVerifyPan = async () => {
    if (!panNumber) {
      setMessage('Please enter your PAN number.');
      return;
    }

    setIsVerifying(true); // Set loading state to true
    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-pan', { panNumber });
      setMessage(response.data.message || 'PAN verification successful!');

      if (response.data.success) {
        // Delay the navigation to the bank verification page after a successful PAN verification
        setTimeout(() => {
          router.push('/verify-bank'); // Replace with the correct path to the bank verification page
        }, 3000); // 3-second delay before navigating
      }
    } catch (error) {
      console.error('Error verifying PAN:', error);
      setMessage('Failed to verify PAN. Please try again.');
    } finally {
      setIsVerifying(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify PAN</h2>
      <p>{message}</p>

      {/* Input Field for PAN */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter PAN Number:</label>
        <input
          type="text"
          name="panNumber"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)}
          className={styles.input}
          placeholder="Enter your PAN number"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyPan}
        className={styles.button}
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify PAN'}
      </button>
      <button className={styles.button}><a href="/authentication/bank" className={styles.link}>Next</a></button>
    </div>
  );
};

export default VerifyPan;
