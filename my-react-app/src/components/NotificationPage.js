import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import getRelativeTime from "../utils/getRelativeTime.js";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Sample notifications data
    const sampleNotifications = [
      {
        id: 1,
        type: 'alert',
        title: 'Project Deadline Approaching',
        description: 'Your project "Website Redesign" is nearing its deadline. Please review the status.',
        timestamp: '2024-08-10T14:20:00Z',
        read: false
      },
      {
        id: 2,
        type: 'message',
        title: 'New Message from Freelancer',
        description: 'You have received a new message from John Doe regarding your project.',
        timestamp: '2024-08-09T10:00:00Z',
        read: false
      },
      {
        id: 3,
        type: 'alert',
        title: 'Contract Approved',
        description: 'The contract for your project "SEO Optimization" has been approved.',
        timestamp: '2024-08-08T09:15:00Z',
        read: true
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-">
      <header className="text-center mb-8 mt-2">
        <p className="text-lg text-gray-600">Stay updated with your recent alerts and messages.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <ul>
          {notifications.length === 0 ? (
            <p className="text-gray-600 text-center">No new notifications.</p>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <li
                  className={`flex items-center justify-between py-4 px-6 cursor-pointer 
                    ${notification.read ? 'bg-gray-50' : 'border-l-4 border-blue-500 shadow-lg'}`}
                  onClick={() => markAsRead(notification.id)}
                  style={notification.read ? {} : { boxShadow: '0 0 10px rgba(0, 123, 255, 0.7)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {notification.type === 'alert' ? (
                        <FaBell className={`text-2xl ${notification.read ? 'text-yellow-600' : 'text-blue-600 animate-bounce'}`} />
                      ) : (
                        <FaEnvelope className={`text-2xl ${notification.read ? 'text-blue-600' : 'text-blue-600 animate-pulse'}`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-800' : 'text-blue-800'}`}>{notification.title}</h3>
                      <p className="text-gray-600">{notification.description}</p>
                      <span className="text-gray-500 text-sm">{getRelativeTime(notification.timestamp)}</span>
                    </div>
                  </div>
                  {!notification.read && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                  )}
                </li>
                {index < notifications.length - 1 && (
                  <hr className="border-t border-gray-300" />
                )}
              </React.Fragment>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPage;
