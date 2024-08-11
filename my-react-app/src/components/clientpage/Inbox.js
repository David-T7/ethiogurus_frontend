import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture
import ClientLayout from './ClientLayoutPage'; // Import the layout

const Inbox = () => {
  // Dummy data for freelancers (replace with real data from API)
  const freelancers = [
    { id: 1, name: 'Jane Doe', profilePic: profilePic },
    { id: 2, name: 'John Smith', profilePic: profilePic },
    { id: 3, name: 'Alice Johnson', profilePic: profilePic },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredFreelancers = freelancers.filter(freelancer =>
    freelancer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ClientLayout>
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search freelancers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="space-y-4">
        {filteredFreelancers.length === 0 ? (
          <p className="text-gray-500">No freelancers found.</p>
        ) : (
          filteredFreelancers.map(freelancer => (
            <Link
              to={`/contact-freelancer/${freelancer.id}`}
              key={freelancer.id}
              className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
            >
              <img
                src={freelancer.profilePic}
                alt={`${freelancer.name}'s profile`}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div>
                <h2 className="text-lg font-semibold">{freelancer.name}</h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
    </ClientLayout>
  );
};

export default Inbox;
