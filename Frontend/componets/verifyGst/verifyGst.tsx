'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './verifyGst.module.css'; // Assuming you have some CSS for styling

const VerifyGst: React.FC = () => {
  const [gstNumber, setGstNumber] = useState<string>(''); // State to store the GST number
  const [message, setMessage] = useState<string>(''); // State to display success or error message
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // State to manage the loading state

  // Function to handle GST verification
  const handleVerifyGst = async () => {
    if (!gstNumber) {
      setMessage('Please enter your GST number.');
      return;
    }

    setIsVerifying(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-gst', {
        gstNumber
      });
      setMessage(response.data.success ? 'GST verification successful!' : 'Verification failed');
      console.log(response.data); // Display the response data in the console for debugging
    } catch (error) {
      console.error('Error verifying GST:', error);
      setMessage('Failed to verify GST number. Please try again.');
    } finally {
      setIsVerifying(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify GST Number</h2>
      <p>{message}</p>

      {/* Input Field for GST Number */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter GST Number:</label>
        <input
          type="text"
          name="gstNumber"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          className={styles.input}
          placeholder="Enter your GST number"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyGst}
        className={styles.button}
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify GST Number'}
      </button>
      <button className={styles.button}><a href="/authentication/pincode" className={styles.link}>Next</a></button>
    </div>
  );
};

export default VerifyGst;
