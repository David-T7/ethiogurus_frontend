import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/user/freelancer/manage/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      profile_picture: file,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      profile_picture: file,
    }));
  };

  const initializeFieldIfEmpty = (fieldName) => {
    console.log("certification was ",profile.certifications)
    if (!updatedProfile[fieldName]) {
      setUpdatedProfile((prevProfile) => ({
        ...prevProfile,
        [fieldName]: [...(profile[fieldName] || [])],
      }));
    }
  };

  const handleCertificationChange = (index, field, value) => {
    initializeFieldIfEmpty('certifications');
    const newCertifications = [...updatedProfile.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setProfile((prevProfile) => ({
      ...prevProfile,
      certifications: newCertifications,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      certifications: newCertifications,
    }));
  };

  const handlePortfolioChange = (index, field, value) => {
    initializeFieldIfEmpty('portfolio');
    const newPortfolioLinks = [...updatedProfile.portfolio];
    newPortfolioLinks[index] = { ...newPortfolioLinks[index], [field]: value };
    setProfile((prevProfile) => ({
      ...prevProfile,
      portfolio: newPortfolioLinks,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      portfolio: newPortfolioLinks,
    }));
  };

  const addCertification = () => {
    initializeFieldIfEmpty('certifications');
    let newCertifications = []
    if (updatedProfile.certifications){
      newCertifications = [...updatedProfile.certifications, { title: '', link: '' }];
    }
    else{
      newCertifications = [{ title: '', link: '' }];
    }
    setProfile((prevProfile) => ({
      ...prevProfile,
      certifications: newCertifications,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      certifications: newCertifications,
    }));
  };

  const addPortfolioLink = () => {
    initializeFieldIfEmpty('portfolio');
    let newPortfolioLinks = []
    if (updatedProfile.portfolio){
      newPortfolioLinks = [...updatedProfile.portfolio, { title: '', link: '' }];
    }
    else{
      newPortfolioLinks = [{ title: '', link: '' }];
    }
    setProfile((prevProfile) => ({
      ...prevProfile,
      portfolio: newPortfolioLinks,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      portfolio: newPortfolioLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      for (const key in updatedProfile) {
        if (key === 'certifications' || key === 'portfolio') {
          formData.append(key, JSON.stringify(updatedProfile[key]));
        } else {
          formData.append(key, updatedProfile[key]);
        }
      }

      const token = localStorage.getItem('access');

      await axios.patch('http://127.0.0.1:8000/api/user/freelancer/manage/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch the updated profile data from the server
      const response = await axios.get('http://127.0.0.1:8000/api/user/freelancer/manage/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the profile state with the new data
      setProfile(response.data);
      setUpdatedProfile(response.data); // Optionally clear updatedProfile state

      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-lg font-normal text-brand-blue mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={profile.full_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
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
            required
          />
        </div>

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
        <div className="mb-4">
          <label htmlFor="bio" className="block text-lg font-normal text-brand-blue mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="preferred_working_hours" className="block text-lg font-normal text-brand-blue mb-2">
            Preferred Working Hours
          </label>
          <select
            id="preferred_working_hours"
            name="preferred_working_hours"
            value={profile.preferred_working_hours}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select your preferred working hours</option>
            <option value="full_time">Full time (40 or more hrs/week)</option>
            <option value="part_time">Part time (Less than 40 hrs/week)</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div className="mb-4">
        <label htmlFor="certification" className="block text-lg font-normal text-brand-blue mb-2">
        Certifications
        </label>
          {profile.certifications && profile.certifications.length > 0  && profile.certifications.map((certification, index) => (
            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
              <div className="mb-2">
                <label htmlFor={`certTitle_${index}`} className="block text-md font-normal text-brand-blue mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id={`certTitle_${index}`}
                  name="certification"
                  value={certification.title}
                  onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`certLink_${index}`} className="block text-md font-normal text-brand-blue mb-2">
                  Link
                </label>
                <input
                  type="url"
                  id={`certLink_${index}`}
                  value={certification.link}
                  onChange={(e) => handleCertificationChange(index, 'link', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Certification
          </button>
        </div>
        <div className="mb-4">
        <label htmlFor="portfolio" className="block text-lg font-normal text-brand-blue mb-2">
        Portfolio       
        </label>
          {profile.portfolio && profile.portfolio.length > 0 && profile.portfolio.map((link, index) => (
            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
              <div className="mb-2">
                <label htmlFor={`portfolioTitle_${index}`} className="block text-md font-normal text-brand-blue mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id={`portfolioTitle_${index}`}
                  name='portfolio'
                  value={link.title}
                  onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`portfolioLink_${index}`} className="block text-md font-normal text-brand-blue mb-2">
                  Link
                </label>
                <input
                  type="url"
                  id={`portfolioLink_${index}`}
                  value={link.link}
                  onChange={(e) => handlePortfolioChange(index, 'link', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioLink}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Portfolio Link
          </button>
        </div>
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
