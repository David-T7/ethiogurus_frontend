import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import profilePic from "../images/default-profile-picture.png";
import { useQuery } from '@tanstack/react-query';
import { decryptToken } from '../utils/decryptToken';
export const UserContext = createContext();


const fetchDisputeManagerProfile = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/user/dispute-manager/manage/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchUnreadNotifications = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/user/notifications/unread-count/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.count;
};

export const DisputeMangerUserProvider = ({ children }) => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const { data: profileData } = useQuery({
    queryKey: ['disputeManagerProfile', token],
    queryFn: fetchDisputeManagerProfile,
  });

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ['unreadNotifications', token],
    queryFn: fetchUnreadNotifications,
  });

  const profilePicture = profileData?.profile_picture || profilePic;

  return (
    <UserContext.Provider value={{ profilePicture , unreadNotifications }}>
      {children}
    </UserContext.Provider>
  );
};
