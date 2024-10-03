import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture
import FreelancerProfileLayout from './FreelancerLayoutPage';
import Inbox from '../Inbox';
import FreelancerMessages from './freelancerMessages';
const FreelancerInbox = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch chats from the API
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('access'); // Get the access token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/user/chats/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        // Process the response data to get clients information
        const chats = response.data;
        const clientsData = chats.map(chat => ({
          id: chat.id,
          name: chat.client ? chat.client.name : chat.freelancer.name,
          profilePic: profilePic, // Replace with actual profile picture if available
          lastMessage: chat.messages[chat.messages.length - 1]?.content || 'No messages yet',
          timestamp: chat.messages[chat.messages.length - 1]?.timestamp || 'No timestamp'
        }));

        setClients(clientsData);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        setError('Failed to load chats. Please try again later.');
      }
    };

    fetchChats();
  }, []);

  const handleSelect = (id) => {
    navigate(`/messages/${id}`);
  };

  return (
    <FreelancerProfileLayout>
      {error && <div className="text-center py-8 text-red-600">{error}</div>}
      <FreelancerMessages users={clients} handleSelect={handleSelect} />
    </FreelancerProfileLayout>
  );
};

export default FreelancerInbox;
