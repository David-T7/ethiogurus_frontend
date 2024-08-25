import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture
import ClientLayout from './ClientLayoutPage';
import Inbox from '../Inbox';
import axios from 'axios';
const ClientInbox = () => {
  const [freelancers, setFreelancers] = useState([]);
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
        const freelancersData = chats.map(chat => ({
          id: chat.id,
          name: chat.freelancer.name,
          profilePic: profilePic, // Replace with actual profile picture if available
          lastMessage: chat.messages[chat.messages.length - 1]?.content || 'No messages yet',
          timestamp: chat.messages[chat.messages.length - 1]?.timestamp || 'No timestamp'
        }));

        setFreelancers(freelancersData);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        setError('Failed to load chats. Please try again later.');
      }
    };

    fetchChats();
  }, []);

  const handleSelect = (id) => {
    navigate("/contact-freelancer/{id}")
  }


  return (
    <ClientLayout>
    {error && <div className="text-center py-8 text-red-600">{error}</div>}
    <Inbox users={freelancers} handleSelect={handleSelect}></Inbox>
    </ClientLayout>

  );
};

export default ClientInbox;
