'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './pincode.module.css'; // Assuming you have some CSS for styling

const Pincode: React.FC = () => {
  const [pincode, setPincode] = useState<string>(''); // State to store the pincode
  const [name, setName] = useState<string>('');
  const [city, setCity] = useState<string>(''); // State to store the city
  const [state, setState] = useState<string>(''); // State to store the state
  const [country, setCountry] = useState<string>(''); // State to store the country
  const [message, setMessage] = useState<string>(''); // State to display success or error message
  const [isChecking, setIsChecking] = useState<boolean>(false); // State to manage the loading state

  // Function to handle pincode verification
  const handleVerifyPincode = async () => {
    if (!pincode) {
      setMessage('Please enter a pincode.');
      return;
    }

    setIsChecking(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-pincode', {
        pincode
      });

      if (response.data.success) {
        setName(response.data.name);
        
        setCity(response.data.city);
        setState(response.data.state);
        setCountry(response.data.country);
        setMessage('Pincode verified successfully!');
      } else {
        setMessage(response.data.message || 'Verification failed.');
      }
    } catch (error) {
      console.error('Error verifying pincode:', error);
      setMessage('Failed to verify pincode. Please try again.');
    } finally {
      setIsChecking(false); // Set loading state to false
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify Pincode</h2>
      <p>{message}</p>

      {/* Input Field for Pincode */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Enter Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className={styles.input}
          placeholder="Enter your pincode"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyPincode}
        className={styles.button}
        disabled={isChecking}
      >
        {isChecking ? 'Checking...' : 'Verify Pincode'}
      </button>

      {/* Display Results */}
      {city && state && country && (
        <div className={styles.results}>
          <h3>Verification Results</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>City:</strong> {city}</p>
          <p><strong>State:</strong> {state}</p>
          <p><strong>Country:</strong> {country}</p>
        </div>
      )}
    </div>
  );
};

export default Pincode;
