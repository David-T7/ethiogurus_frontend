import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Encrypt and store tokens
  const encryptToken = (token) => {
    return CryptoJS.AES.encrypt(token, secretKey).toString();
  };

  // Decrypt and retrieve tokens
  const decryptToken = (encryptedToken) => {
    if (!encryptedToken) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      if (!token) {
        throw new Error("Decrypted token is empty");
      }
      return token;
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };

  const getAccessToken = () => {
    const encryptedAccess = localStorage.getItem("access");
    return decryptToken(encryptedAccess);
  };

  const getRefreshToken = () => {
    const encryptedRefresh = localStorage.getItem("refresh");
    return decryptToken(encryptedRefresh);
  };

  // Authenticate the user with the current access token
  const authenticate = async () => {
    const token = getAccessToken();

    if (!token) {
      console.warn("No access token found. Logging out.");
      // logout();
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/token/authenticate/",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.detail === "Access token is valid") {
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user/role/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuth({ role: userResponse.data.role });
      } else {
        console.warn("Access token is invalid. Refreshing token...");
        await refreshToken();
      }
    } catch (error) {
      console.error("Error during authentication:", error.response?.data || error.message);
      // logout();
    }
  };

  useEffect(() => {
    const loadAuth = async () => {
      await authenticate();
      setLoading(false);
    };
    loadAuth();
  }, []);

  const isAuthenticated = async () => {
    const token = getAccessToken();
    if (!token) {
      console.warn("No access token found. User is not authenticated.");
      return false;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/token/authenticate/",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.detail === "Access token is valid";
    } catch (error) {
      console.error("Error during authentication:", error.response?.data || error.message);
      return false;
    }
  };

  const getRole = async () => {
    const token = getAccessToken();
    if (!token) {
      console.warn("No access token found. Cannot fetch role.");
      return null;
    }

    try {
      const userResponse = await axios.get("http://127.0.0.1:8000/api/user/role/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { role: userResponse.data.role, assessment: userResponse.data.assessment , assessment_started:userResponse.data.assessment_started , email_verified:userResponse.data.email_verified };
    } catch (error) {
      console.error("Error fetching role:", error.response?.data || error.message);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/login/", { email, password });
      const { access, refresh } = response.data.token;
      const { role, assessment , assessment_started , email_verified} = response.data;
      if(email_verified){
      // Encrypt and save tokens to localStorage
      localStorage.setItem("access", encryptToken(access));
      localStorage.setItem("refresh", encryptToken(refresh));
      }
      // Set user role in state
      setAuth({ role });

      return { role, assessment , assessment_started , email_verified};
    } catch (error) {
      console.error("Login failed:", error.response?.data?.detail || error.message);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    console.info("Logging out...");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuth(null);
    navigate("/login");
  };

  const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
      console.warn("No refresh token found. Logging out.");
      logout();
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
      localStorage.setItem("access", encryptToken(response.data.access));
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data?.detail || error.message);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        getRole,
        isAuthenticated,
        login,
        logout,
        refreshToken,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
