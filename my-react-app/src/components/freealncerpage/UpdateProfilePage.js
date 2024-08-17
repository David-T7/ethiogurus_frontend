import React, { useState } from 'react';

// Mock function to simulate updating the profile
const updateProfile = (profileData) => {
  // Replace with actual API call to update the profile
  console.log('Updating profile:', profileData);
};

const UpdateProfilePage = () => {
  // Sample profile data
  const initialProfile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Experienced freelance developer with a passion for creating innovative solutions.',
    workingHours: 'Full time (40 or more hrs/week)',
    certifications: [
      { title: 'Certified JavaScript Developer', link: 'https://example.com/cert1' },
      { title: 'AWS Certified Solutions Architect', link: 'https://example.com/cert2' },
    ],
    portfolioLinks: [
      { title: 'Personal Portfolio', link: 'https://example.com/portfolio' },
      { title: 'GitHub Profile', link: 'https://github.com/janedoe' },
    ],
    address: '123 Main St, Apt 4B, New York, NY 10001',

  };

  const [profile, setProfile] = useState(initialProfile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: file,
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...profile.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setProfile((prevProfile) => ({
      ...prevProfile,
      certifications: newCertifications,
    }));
  };

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolioLinks = [...profile.portfolioLinks];
    newPortfolioLinks[index] = { ...newPortfolioLinks[index], [field]: value };
    setProfile((prevProfile) => ({
      ...prevProfile,
      portfolioLinks: newPortfolioLinks,
    }));
  };

  const addCertification = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      certifications: [...prevProfile.certifications, { title: '', link: '' }],
    }));
  };

  const addPortfolioLink = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      portfolioLinks: [...prevProfile.portfolioLinks, { title: '', link: '' }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(profile);
    // Show a confirmation message or redirect
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-normal text-brand-blue mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
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
            required
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
          <label htmlFor="workingHours" className="block text-lg font-normal text-brand-blue mb-2">
            Preferred Working Hours
          </label>
          <select
            id="workingHours"
            name="workingHours"
            value={profile.workingHours}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select your preferred working hours</option>
            <option value="Full time (40 or more hrs/week)">Full time (40 or more hrs/week)</option>
            <option value="Part time (Less than 40 hrs/week)">Part time (Less than 40 hrs/week)</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-normal text-brand-blue mb-4">Certifications</h2>
          {profile.certifications.map((certification, index) => (
            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
              <div className="mb-2">
                <label htmlFor={`certTitle_${index}`} className="block text-lg font-normal text-brand-blue mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id={`certTitle_${index}`}
                  value={certification.title}
                  onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`certLink_${index}`} className="block text-lg font-normal text-brand-blue mb-2">
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
          <h2 className="text-2xl font-normal text-brand-blue mb-4">Portfolio Links</h2>
          {profile.portfolioLinks.map((link, index) => (
            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
              <div className="mb-2">
                <label htmlFor={`portfolioTitle_${index}`} className="block text-lg font-normal text-brand-blue mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id={`portfolioTitle_${index}`}
                  value={link.title}
                  onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`portfolioLink_${index}`} className="block text-lg font-normal text-brand-blue mb-2">
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
          <label htmlFor="profilePicture" className="block text-lg font-normal text-brand-blue mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
