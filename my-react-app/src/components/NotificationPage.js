import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import axios from 'axios'; // For making API requests
import getRelativeTime from "../utils/getRelativeTime.js";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const notificationsPerPage = 5; // Show 5 notifications initially

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications/'); // Replace with your API endpoint
        const sortedNotifications = response.data.sort((a, b) => {
          // Sort notifications by read status first, then by timestamp
          if (a.read === b.read) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          return a.read - b.read;
        });
        setNotifications(sortedNotifications);
        setDisplayedNotifications(sortedNotifications.slice(0, notificationsPerPage));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const showMoreNotifications = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * notificationsPerPage;
    const newNotifications = notifications.slice(0, startIndex + notificationsPerPage);
    setDisplayedNotifications(newNotifications);
    setCurrentPage(nextPage);
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/`, { read: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="text-center mb-8 mt-2">
        <p className="text-lg">Stay updated with your recent alerts and messages.</p>
      </header>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading notifications...</p>
      ) : (
        <>
          {displayedNotifications.length === 0 ? (
            <p className="text-gray-600 text-center">No new notifications.</p>
          ) : (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
              <ul>
                {displayedNotifications.map((notification, index) => (
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
                    {index < displayedNotifications.length - 1 && (
                      <hr className="border-t border-gray-300" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
              {displayedNotifications.length < notifications.length && (
                <div className="text-center py-4">
                  <button
                    onClick={showMoreNotifications}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPage;
