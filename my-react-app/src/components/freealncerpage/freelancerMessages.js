import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FreelancerMessages = () => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancerData, setFreelancerData] = useState(null);
  const [clientsData, setClientsData] = useState({}); // Store freelancer data in an object
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancerData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [token]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancerChats/",
          {
            params: {
              freelancer_id: freelancerData?.id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChats(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : 'Error fetching chats');
      } finally {
        setLoading(false);
      }
    };

    if (freelancerData && token) {
      fetchChats();
    }
  }, [freelancerData, token]);

  useEffect(() => {
    const fetchClientData = async (clientId) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/client/${clientId}/`
        );
        setClientsData((prevData) => ({
          ...prevData,
          [clientId]: response.data, // Save freelancer data by their ID
        }));
      } catch (err) {
        setError(err);
      }
    };

    // Fetch freelancer data for each chat
    chats.forEach(chatItem => {
      if (!clientsData[chatItem.chat.client]) {
        fetchClientData(chatItem.chat.client);
      }
    });
  }, [chats]);

  const filteredChats = chats.filter(chat => {
    const client = clientsData[chat.chat.client]; // Access the client data
    const searchField = client?.contact_person // Check if contact_person exists
      ? client.contact_person // Use contact_person if it exists
      : client?.company_name; // Otherwise, use company_name
  
    return searchField?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatClick = (client_id) => {
    navigate(`/contact-client/${client_id}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error.detail || 'Error fetching chats'}</div>;
  if (chats.length === 0) return <div className="text-center py-8">No Chats Found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {(searchTerm ? filteredChats : chats).length === 0 ? (
          <p>No Clients match your search.</p>
        ) : (
          (searchTerm ? filteredChats : chats).map(chatItem => {
            const client_id = chatItem.chat.client;
            const clientData = clientsData[client_id];

            return clientData ? (
              <div
                key={chatItem.chat.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                onClick={() => handleChatClick(client_id)}
              >
                <div className="flex items-center space-x-4 mb-2">
                  <img
                    src={clientData.profile_picture || '/path/to/default-profile-picture.png'}
                    alt={`${clientData.contact_person ? clientData.contact_person : clientData.company_name }'s profile`}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{clientData.contact_person ? clientData.contact_person : clientData.company_name}</h2>
                    <p className="text-gray-600 text-sm truncate">
                      {chatItem.messages.length > 0 ? chatItem.messages[chatItem.messages.length - 1].content : 'No messages yet.'}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {chatItem.messages.length > 0 ? formatTime(chatItem.messages[chatItem.messages.length - 1].timestamp) : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div key={chatItem.chat.id} className="text-center">Loading Client info...</div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FreelancerMessages;
