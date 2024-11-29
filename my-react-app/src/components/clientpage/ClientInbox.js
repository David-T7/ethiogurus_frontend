import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture
import ClientLayout from './ClientLayoutPage';
import Inbox from '../Inbox';
import axios from 'axios';

const fetchChats = async () => {
  const token = localStorage.getItem('access'); // Get the access token from localStorage
  const response = await axios.get('http://127.0.0.1:8000/api/user/chats/', {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the headers
    },
  });

  // Process the response data to get freelancers' information
  const chats = response.data;
  return chats.map(chat => ({
    id: chat.id,
    name: chat.freelancer.name,
    profilePic: profilePic, // Replace with actual profile picture if available
    lastMessage: chat.messages[chat.messages.length - 1]?.content || 'No messages yet',
    timestamp: chat.messages[chat.messages.length - 1]?.timestamp || 'No timestamp',
  }));
};

const ClientInbox = () => {
  const navigate = useNavigate();

  const {
    data: freelancers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['clientChats'],
    queryFn: fetchChats,
  });

  const handleSelect = (id) => {
    navigate(`/contact-freelancer/${id}`);
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="text-center py-8 text-gray-600">Loading chats...</div>
      </ClientLayout>
    );
  }

  if (isError) {
    return (
      <ClientLayout>
        <div className="text-center py-8 text-red-600">
          Failed to load chats. {error.message}
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Inbox users={freelancers} handleSelect={handleSelect} />
    </ClientLayout>
  );
};

export default ClientInbox;
