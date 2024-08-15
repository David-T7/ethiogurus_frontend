import React, { useState } from 'react';

const Inbox = ({ users, handleSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return isToday
      ? `Today at ${timeString}`
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          filteredUsers.map(user => (
            <button
              onClick={() => handleSelect(user.id)}
              key={user.id}
              className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition w-full text-left"
            >
              <img
                src={user.profilePic}
                alt={`${user.name}'s profile`}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm truncate">{user.lastMessage}</p>
              </div>
              <span className="text-gray-400 text-xs">
                {formatTimestamp(user.timestamp)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
