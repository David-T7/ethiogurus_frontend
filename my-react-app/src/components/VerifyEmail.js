import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { id, token } = useParams();  // Extract id and token from the URL
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('Verifying email with token:', token);  // Log the token before the request
  
      if (!token) {
        setError('Missing token.');
        setLoading(false);
        return;
      }
  
      try {
        // Check if loading is true before sending the request
        if (!loading) return;
  
        console.log('Making API request to verify email');  // Log the request being made
  
        let apiUrl = '';
        if (window.location.href.startsWith('http://localhost:3000/user/')) {
          apiUrl = `http://127.0.0.1:8000/api/user/verify-email/`;  // User verification endpoint
        } else {
          apiUrl = `http://127.0.0.1:8000/api/verify-email/`;  // Default verification endpoint
        }
  
        const response = await axios.post(
          apiUrl,
          {
            token: token,  // Send token from URL params
            pk: id,        // Send the id (pk) from URL params
          }
        );
  
        console.log('Response received:', response);  // Log the API response
  
        setMessage(response.data.message);
      } catch (err) {
        console.error('Error during email verification:', err);  // Log the error
        setError(err.response?.data?.error || 'Failed to verify email.');
      } finally {
        setLoading(false);  // Ensure loading state is updated after the request finishes
      }
    };
  
    verifyEmail();
  }, []);  // Dependency array ensures the effect only runs when `id` or `token` changes

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {loading ? (
        <p>Verifying your email...</p>
      ) : error ? (
        <>
          <p style={{ color: 'red' }}>{error}</p>
        </>
      ) : (
        <>
          <p style={{ color: 'green' }}>{message}</p>         
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
