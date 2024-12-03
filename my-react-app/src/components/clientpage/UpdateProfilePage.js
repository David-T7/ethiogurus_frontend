import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchProfile = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateProfile = async ({ updatedProfile, token }) => {
  const formData = new FormData();
  for (const key in updatedProfile) {
    formData.append(key, updatedProfile[key]);
  }
  await axios.patch("http://127.0.0.1:8000/api/user/client/manage/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UpdateProfile = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const queryClient = useQueryClient(); // Initialize the query client

  const [updatedProfile, setUpdatedProfile] = useState({});

  // Fetch profile data using useQuery
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", token],
    queryFn: fetchProfile,
  });

  // Update profile mutation
  const mutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      alert("Profile updated successfully!");
      // Invalidate and refetch the profile query
      queryClient.invalidateQueries(["profile"]);
    },
    onError: () => {
      alert("Failed to update profile.");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      profile_picture: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ updatedProfile, token });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message || "Failed to load profile data."}</div>;

  return (
    <div className="max-w-lg mx-auto p-6 mt-8">
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
            defaultValue={profile?.email}
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
            name="contact_person"
            defaultValue={profile?.contact_person}
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
            name="company_name"
            defaultValue={profile?.company_name}
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
            defaultValue={profile?.address}
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
            className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
