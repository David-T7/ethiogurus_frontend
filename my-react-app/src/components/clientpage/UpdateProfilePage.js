import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdateProfile = () => {
  // Initial mock data
  const [profile, setProfile] = useState({
    email: 'example@example.com',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    companyName: 'Sample Company',
    address: '123 Sample Street, Sample City, SC 12345',
    contactPerson: 'John Doe',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here (e.g., API call)
    console.log('Profile updated:', profile);
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8">
      <h2 className="text-3xl font-normal text-brand-blue mb-6 text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('oldPasswordVisible')}
          >
            {passwordVisibility.oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
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
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('newPasswordVisible')}
          >
            {passwordVisibility.newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Confirm New Password */}
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

        {/* Company Name */}
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-lg font-normal text-brand-blue mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={profile.companyName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-normal text-brand-blue mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Contact Person */}
        <div className="mb-4">
          <label htmlFor="contactPerson" className="block text-lg font-normal text-brand-blue mb-2">
            Contact Person
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={profile.contactPerson}
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
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
