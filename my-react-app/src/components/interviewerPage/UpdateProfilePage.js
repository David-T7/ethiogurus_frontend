import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const fetchInterviewerProfile = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/user/interviewer/manage/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateInterviewerProfile = async ({ token, formData }) => {
  await axios.patch('http://127.0.0.1:8000/api/user/interviewer/manage/', formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const UpdateInterviewerProfile = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const queryClient = useQueryClient();

  // Fetch interviewer profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['interviewerProfile', token],
    queryFn: () => fetchInterviewerProfile(token),
  });

  // State for form updates
  const [updatedProfile, setUpdatedProfile] = useState({});
  const mutation = useMutation({
    mutationFn: ({ token, formData }) => updateInterviewerProfile({ token, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['interviewerProfile', token]); // Refetch profile
      alert('Profile updated successfully!');
    },
    onError: () => {
      alert('Failed to update profile.');
    },
  });

  // Handlers for form inputs
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
    const formData = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      formData.append(key, value);
    });

    mutation.mutate({ token, formData });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load profile data.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
        Update Profile
      </h2>
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
            defaultValue={profile?.email}
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
            type="number"
            id="phone_number"
            name="phone_number"
            defaultValue={profile?.phone_number}
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
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInterviewerProfile;
