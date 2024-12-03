import React, { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import profilePic from '../images/default-profile-picture.png';
import { decryptToken } from '../utils/decryptToken';
export const UserContext = createContext();

const fetchProfileData = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/user/freelancer/manage/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchUnreadMessages = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/user/messages/unread-count/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.count;
};

const fetchUnreadNotifications = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/user/notifications/unread-count/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.count;
};

export const UserProvider = ({ children }) => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the tokens

  const { data: profileData } = useQuery({
    queryKey: ['profileData', token],
    queryFn: fetchProfileData,
    enabled: !!token,
    staleTime: 300000, // Cache for 5 minutes
  });

  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ['unreadMessages', token],
    queryFn: fetchUnreadMessages,
    enabled: !!token,
    staleTime: 300000,
  });

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ['unreadNotifications', token],
    queryFn: fetchUnreadNotifications,
    enabled: !!token,
    staleTime: 300000,
  });

  const profilePicture = profileData?.profile_picture || profilePic;

  return (
    <UserContext.Provider
      value={{ profilePicture, unreadMessages, unreadNotifications }}
    >
      {children}
    </UserContext.Provider>
  );
};
