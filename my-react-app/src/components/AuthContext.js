import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const token = localStorage.getItem('access');

  // Function to authenticate the user with the current access token
  const authenticate = async () => {
    console.log("access is ", localStorage.getItem('access'));
    const token = localStorage.getItem('access');
  
    if (token) {
      try {
        console.log("token found");
        const response = await axios.post('http://127.0.0.1:8000/api/user/token/authenticate/', null, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.detail === "Access token is valid") {
          const userResponse = await axios.get('http://127.0.0.1:8000/api/user/role/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAuth({ role: userResponse.data.role });
  
          // Optionally log the user's role
          console.log("role is ", userResponse.data.role);
          // Do nothing else to stay on the same page
        } else {
          console.error('Authentication failed:', response.data.detail);
          await refreshToken();
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Optionally navigate to login page in case of authentication error
        navigate("/login");
      }
    } else {
      console.log("token not found");
      logout(); // Log out the user if the token is not found
    }
  };
  
  useEffect(() => {
    const loadAuth = async () => {
      console.log("loading....")
      await authenticate(); // Authenticate when the component loads
      setLoading(false);
    };
    loadAuth();
  }, []);

  const isAuthenticated = async () => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        console.log("token found");
        const response = await axios.post('http://127.0.0.1:8000/api/user/token/authenticate/', null, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.detail === "Access token is valid") {
          return true
        }
        else{
          return false
        }
  }
  catch (error) {
    console.error('Error during authentication:', error);
    console.error('Error details:', error.response?.data || error.message);
  }
}
  }

    const getRole = async () => {
      if (isAuthenticated()){
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user/role/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return userResponse.data.role
      }
      return null
    }

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/login/', { email, password });
      const { access, refresh } = response.data.token;
      const { role } = response.data;
      // Save tokens to localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      console.log("access is ",localStorage.getItem('access'))
      console.log("refresh is ",localStorage.getItem('refresh'))
      
      // Set user role in state
      setAuth({ role });
  
      return { role }; // Return role data
    } catch (error) {
      console.error('Login failed:', error.response?.data?.detail || error.message);
      throw new Error('Login failed');
    }
  };
  

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAuth(null);
    navigate("/login")
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
        localStorage.setItem('access', response.data.access);
        // Refresh user info
        const userResponse = await axios.get('/api/user/', {
          headers: { Authorization: `Bearer ${response.data.access}` },
        });
        setAuth((prev) => ({
          ...prev,
          role: userResponse.data.role,
        }));
      } catch (error) {
        console.error('Token refresh failed:', error.response?.data?.detail || error.message);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, loading,getRole, isAuthenticated, login, logout, refreshToken, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
