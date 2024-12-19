// ChangePasswordPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const ResetPassword = () => {
  const [profile, setProfile] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });
  const { id, token } = useParams();  // Extract id and token from the URL
  

  const [errors, setErrors] = useState({}); // State to hold error messages
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
        'new_password': profile.newPassword
      };
      const response = await axios.post(`http://127.0.0.1:8000/reset-password/${id}/${token}/`, data);

      setSuccesMessage('Password reseted successfully!');
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
        setErrorMessage('Failed to reset password');
      }
      setSuccesMessage("")
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            {!passwordVisibility.newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
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
            {!passwordVisibility.confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
          {confirmPasswordError && <div className="text-red-500 mt-1">{confirmPasswordError}</div>}

        </div>


        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-brand-blue w-full text-white px-6 py-3 rounded-lg hover:bg-brand-dark-blue transition-all duration-200"
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

export default ResetPassword;
