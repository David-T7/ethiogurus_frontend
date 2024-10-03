import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useState , useEffect } from 'react';
const ChangePasswordPage = () => {
  
  const [profile, setProfile] = useState({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });

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
    console.log(profile.oldPassword , profile.confirmPassword )
    if (profile.newPassword !== profile.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    try {
      
    const data = {
            'old_password': profile.oldPassword,
            'new_password': profile.newPassword
    }

      const token = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      await axios.post(`http://127.0.0.1:8000/api/user/change-password/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    //   // Fetch the updated profile data from the server
    //   const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   // Update the profile state with the new data
    //   setProfile(response.data);
    //   setUpdatedProfile(response.data); // Optionally clear updatedProfile state

      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/*Old Password*/}
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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('oldPasswordVisible')}
          >
            {passwordVisibility.oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/*New Password*/}
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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('newPasswordVisible')}
          >
            {passwordVisibility.newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/*Confirm Password*/}
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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
