// ChangePasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { decryptToken } from '../utils/decryptToken';
const ChangePasswordPage = () => {
  const [profile, setProfile] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });

  const [errors, setErrors] = useState({}); // State to hold error messages
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [succesMessage , setSuccesMessage ] = useState("")
  const [errorMessage , setErrorMessage ] = useState("")
  const [loading, setLoading] = useState(false);
  
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let valid = true;
    if (!profile.newPassword.trim()) {
      setNewPasswordError("New passowrd is required.");
      valid = false;
    } else {
      setNewPasswordError("");
    }

    if (!profile.oldPassword.trim()) {
      setOldPasswordError("Old passowrd is required.");
      valid = false;
    } else {
      setOldPasswordError("");
    }

    if (!profile.confirmPassword.trim()) {
      setConfirmPasswordError("Confirm passowrd is required.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }
    
    if (profile.newPassword !== profile.confirmPassword) {
      setConfirmPasswordError("Passwords do not match!" );
      valid = false;
    }

    if (!valid) return;
    setLoading(true);


    try {
      const data = {
        'old_password': profile.oldPassword,
        'new_password': profile.newPassword
      };
      const response = await axios.post(`http://127.0.0.1:8000/api/user/change-password/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccesMessage('Password updated successfully!');
      setErrorMessage("")
      // Optionally, reset the form
      setProfile({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      if (err.response && err.response.data) {
        // Display backend validation errors
        setErrorMessage(JSON.stringify(err.response.data));
      } else {
        setErrorMessage('Failed to update password');
      }
      setSuccesMessage("")
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Old Password */}
        <div className="mb-4 relative">
          <label htmlFor="oldPassword" className="block text-lg font-normal text-brand-blue mb-2">
            Old Password
          </label>
          <input
            type={passwordVisibility.oldPasswordVisible ? "text" : "password"}
            id="oldPassword"
            name="oldPassword"
            value={profile.oldPassword}
            onChange={handleInputChange}
            className={`w-full border ${errors.old_password ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg focus:outline-none focus:border-blue-500`}
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('oldPasswordVisible')}
          >
            {passwordVisibility.oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          {oldPasswordError && <div className="text-red-500 mt-1">{oldPasswordError}</div>}
        </div>

        {/* New Password */}
        <div className="mb-4 relative">
          <label htmlFor="newPassword" className="block text-lg font-normal text-brand-blue mb-2">
            New Password
          </label>
          <input
            type={passwordVisibility.newPasswordVisible ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleInputChange}
            className={`w-full border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg focus:outline-none focus:border-blue-500`}
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('newPasswordVisible')}
          >
            {passwordVisibility.newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          {newPasswordError && <div className="text-red-500 mt-1">{newPasswordError}</div>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block text-lg font-normal text-brand-blue mb-2">
            Confirm New Password
          </label>
          <input
            type={passwordVisibility.confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleInputChange}
            className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg focus:outline-none focus:border-blue-500`}
          />
           <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('confirmPasswordVisible')}
          >
            {passwordVisibility.confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          {confirmPasswordError && <div className="text-red-500 mt-1">{confirmPasswordError}</div>}

        </div>


        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
              {loading ? 'Submitting...' : 'Submit'}
        </button>
        </div>
        {succesMessage && (
    <div className="text-green-500 text-center mt-4 text-md">
      {succesMessage}
    </div>
  )}
  {errorMessage && (
    <div className="text-red-500 text-center mt-4 text-md">
      {typeof errorMessage === "string" && errorMessage.length<=100 ? errorMessage : "An error occurred. Please try again."}
    </div>
  )}
      </form>
    </div>
  );
};

export default ChangePasswordPage;
