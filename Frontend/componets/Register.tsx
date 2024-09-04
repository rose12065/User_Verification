'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css'; // Adjust the path as necessary

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  aadhar: string;
  dob: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    aadhar: '',
    dob: '',
  });

  const [errors, setErrors] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    aadhar: '',
    dob: '',
  });

  const [isClient, setIsClient] = useState(false);
  const [message, setMessage] = useState(''); // State for the message
  const [showPopup, setShowPopup] = useState(false); // State for showing the popup

  const router = useRouter(); // Declare router here but use it conditionally

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  // Validation functions 
  const validateName = (name: string) => /^[A-Za-z\s]+$/.test(name) && name.length >= 3;
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const validatePhoneNumber = (phoneNumber: string) => /^[1-9][0-9]{9}$/.test(phoneNumber);
  const validateAadhar = (aadhar: string) => /^[0-9]{12}$/.test(aadhar);
  const validateDOB = (dob: string) => new Date(dob) <= new Date();

  // Handle input changes 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle onKeyUp validation 
  const handleValidation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    switch (name) {
      case 'name':
        setErrors({ ...errors, name: validateName(value) ? '' : 'Invalid name (min 3 characters, letters only)' });
        break;
      case 'email':
        setErrors({ ...errors, email: validateEmail(value) ? '' : 'Invalid email address' });
        break;
      case 'phoneNumber':
        setErrors({
          ...errors,
          phoneNumber: validatePhoneNumber(value) ? '' : 'Invalid phone number (10 digits, starts with non-zero)',
        });
        break;
      case 'aadhar':
        setErrors({ ...errors, aadhar: validateAadhar(value) ? '' : 'Invalid Aadhaar number (12 digits)' });
        break;
      case 'dob':
        setErrors({ ...errors, dob: validateDOB(value) ? '' : 'Invalid date of birth (must be a past date)' });
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final validation before sending request
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePhoneNumber(formData.phoneNumber) ||
      !validateAadhar(formData.aadhar) ||
      !validateDOB(formData.dob)
    ) {
      alert('Please correct the errors before submitting.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', formData);

      // Set the message and show the popup
      setMessage(response.data.message);
      setShowPopup(true);

      // Perform navigation after a delay to allow the user to see the popup
      if (isClient) {
        setTimeout(() => {
          sessionStorage.setItem('email',formData.email); 
          router.push(`/verify/verifyPhone`);
        }, 3000); 
      }
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
      setShowPopup(true);
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form fields */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onKeyUp={handleValidation}
            className={styles.input}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyUp={handleValidation}
            className={styles.input}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onKeyUp={handleValidation}
            className={styles.input}
          />
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Aadhaar Number:</label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleInputChange}
            onKeyUp={handleValidation}
            className={styles.input}
          />
          {errors.aadhar && <span className={styles.error}>{errors.aadhar}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            onKeyUp={handleValidation}
            className={styles.input}
          />
          {errors.dob && <span className={styles.error}>{errors.dob}</span>}
        </div>
        <button type="submit" className={styles.button}>Register</button>
      </form>
      
      {/* Popup Modal */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <p>{message}</p>
            <button onClick={closePopup} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
