import React from 'react';
import FreelancerProfileLayout from './FreelancerLayoutPage';

const FreelancerProfilePage = () => {
  return (
    <FreelancerProfileLayout>
      {/* Profile content goes here */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-blue mb-4">Profile</h2>
        <div className="flex flex-col items-center">
          <img
            src="/path/to/profile-pic.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold text-brand-blue">Freelancer Name</h3>
          <p className="text-gray-600 mb-4">freelancer@example.com</p>
          <div className="text-gray-700">
            <p className="text-lg font-medium mb-2">About Me</p>
            <p>No information provided.</p>
          </div>
        </div>
      </div>
    </FreelancerProfileLayout>
  );
};

export default FreelancerProfilePage;
