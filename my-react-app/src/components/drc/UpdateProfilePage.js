import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { decryptToken } from '../../utils/decryptToken';

// Utility to get and decrypt the token
const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem('access');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  return decryptToken(encryptedToken, secretKey);
};

// Function to fetch the profile data
const fetchProfile = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/user/dispute-manager/manage/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Function to update the profile data
const updateProfile = async ({ updatedProfile, token }) => {
  const formData = new FormData();
  for (const key in updatedProfile) {
    formData.append(key, updatedProfile[key]);
  }
  await axios.patch('http://127.0.0.1:8000/api/user/dispute-manager/manage/', formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const UpdateDrcProfile = () => {
  const [updatedProfile, setUpdatedProfile] = useState({});
  const token = getDecryptedToken(); // Decrypt the token once
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['drcProfile'],
    queryFn: () => fetchProfile(token), // Pass the token
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateProfile({ ...data, token }), // Pass both profile data and token
    onSuccess: () => {
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage("")
    },
    onError: (err) => {
      if (err.response && err.response.data) {
        // Display backend validation errors
        setErrorMessage(JSON.stringify(err.response.data));
      } else {
        setErrorMessage('Failed to resolve dispute. Please try again.');
      }
      setSuccessMessage("")
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedProfile((prev) => ({
      ...prev,
      profile_picture: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ updatedProfile }); // Pass the profile data
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">Update Profile</h2>
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
            defaultValue={profile.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-lg font-normal text-brand-blue mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="full_name"
            defaultValue={profile.full_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone_number" className="block text-lg font-normal text-brand-blue mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            defaultValue={profile.phone_number}
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
            defaultValue={profile.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Profile Picture */}
        <div className="mb-4">
          <label htmlFor="profile_picture" className="block text-lg font-normal text-brand-blue mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 w-full text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
           {mutation.isLoading ? "Updating..." : "Update Profile"}
        </button>
        </div>
        {errorMessage && (
    <div className="text-red-500 mt-4 text-center">
      {typeof errorMessage === "string" && errorMessage.length<=100 ? errorMessage : "An error occurred. Please try again."}
    </div>
  )}
        {successMessage && <div className="text-green-500 text-center mt-4">{successMessage}</div>}
      </form>
    </div>
  );
};

export default UpdateDrcProfile;
