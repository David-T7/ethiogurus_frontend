import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const fetchProfile = async () => {
  const token = localStorage.getItem('access');
  const response = await axios.get('http://127.0.0.1:8000/api/user/dispute-manager/manage/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateProfile = async (updatedProfile) => {
  const formData = new FormData();
  for (const key in updatedProfile) {
    formData.append(key, updatedProfile[key]);
  }
  const token = localStorage.getItem('access');
  await axios.patch('http://127.0.0.1:8000/api/user/dispute-manager/manage/', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const UpdateDrcProfile = () => {
  const [updatedProfile, setUpdatedProfile] = useState({});

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['drcProfile'],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      alert('Profile updated successfully!');
    },
    onError: () => {
      alert('Failed to update profile.');
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
    mutation.mutate(updatedProfile);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

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
            className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDrcProfile;
