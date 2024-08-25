import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import profilePic from "../images/default-profile-picture.png";
export const clientUserContext = createContext();

export const ClientUserProvider = ({ children }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const messageCountResponse = await axios.get('http://127.0.0.1:8000/api/user/messages/unread-count/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const notificationCountResponse = await axios.get('http://127.0.0.1:8000/api/user/notifications/unread-count/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { profile_picture } = response.data;
        setProfilePicture(profile_picture || profilePic);
        setUnreadMessages(messageCountResponse.data.count || 0);
        setUnreadNotifications(notificationCountResponse.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <clientUserContext.Provider value={{ profilePicture, unreadMessages, unreadNotifications }}>
      {children}
    </clientUserContext.Provider>
  );
};
export default ClientUserProvider