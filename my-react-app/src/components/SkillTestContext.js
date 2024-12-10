import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { decryptToken } from '../utils/decryptToken';
const SkillTestContext = createContext();
const SkillTestProvider = ({ children }) => {
  const [skillTests, setSkillTests] = useState({
    theoretical: null,
    practical: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkillTests = async (id, type) => {
    setLoading(true);
    try {
      let url = '';
      console.log("id is ",id , " type is",type)
      if (type === 'theoretical') {
        url = `http://127.0.0.1:8001/api/skilltests/${id}/`;
      } else if (type === 'practical') {
        url = `http://127.0.0.1:8002/api/practical-test/${id}/`;
      } else {
        throw new Error('Invalid test type');
      }
      const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
      const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
      const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
      const response = await axios.get(url ,{headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      }},);
      if (type === 'theoretical') {
        setSkillTests((prev) => ({ ...prev, theoretical: response.data }));
      } else if (type === 'practical') {
        setSkillTests((prev) => ({ ...prev, practical: response.data }));
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skill tests:', err);
      setError('Failed to fetch skill tests');
      setLoading(false);
    }
  };
  return (
    <SkillTestContext.Provider value={{ skillTests, loading, error, fetchSkillTests }}>
      {children}
    </SkillTestContext.Provider>
     );
    };

export { SkillTestProvider, SkillTestContext };
