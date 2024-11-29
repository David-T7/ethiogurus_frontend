import React from 'react';
import profilePic from '../../images/default-profile-picture.png';

const FreelancerInbox = ({ users, handleSelect }) => {
  return (
    <div className="p-4">
      {users?.length === 0 ?
       (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="flex items-center space-x-4 p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
            >
              <img
                src={user.profilePic || profilePic}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.lastMessage}</p>
                <span className="text-xs text-gray-400">{user.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      ) :
      (
        <div className="text-center text-gray-500 py-8">No messages yet</div>
      )
      }
    </div>
  );
};

export default FreelancerInbox;
