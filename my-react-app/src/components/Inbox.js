import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../utils/decryptToken';
const fetchClientData = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchChats = async (clientId, token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/user/clientChats/', {
    params: { client_id: clientId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancerData = async (freelancerId) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancerId}/`);
  return response.data;
};

const Inbox = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [freelancersData, setFreelancersData] = useState({});

  // Fetch client data using useQuery
  const { data: clientData, isLoading: clientLoading, error: clientError } = useQuery({
    queryKey: ['clientData', token],
    queryFn: () => fetchClientData(token),
    enabled: !!token,
  });

  // Fetch chats using useQuery
  const { data: chats, isLoading: chatsLoading, error: chatsError } = useQuery({
    queryKey: ['chats', clientData?.id, token],
    queryFn: () => fetchChats(clientData.id, token),
    enabled: !!clientData,
  });

  // Fetch freelancer data for each chat
  useEffect(() => {
    const fetchFreelancers = async () => {
      const freelancerIds = chats?.map((chat) => chat.chat.freelancer) || [];
      const uniqueFreelancerIds = [...new Set(freelancerIds)];

      for (const freelancerId of uniqueFreelancerIds) {
        if (!freelancersData[freelancerId]) {
          const freelancerData = await fetchFreelancerData(freelancerId);
          setFreelancersData((prev) => ({ ...prev, [freelancerId]: freelancerData }));
        }
      }
    };

    if (chats?.length > 0) {
      fetchFreelancers();
    }
  }, [chats, freelancersData]);

  // Polling to refresh chats every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (clientData?.id) {
        queryClient.invalidateQueries(['chats', clientData.id, token]);
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup interval
  }, [clientData, token, queryClient]);

  const filteredChats = chats?.filter((chat) =>
    freelancersData[chat.chat.freelancer]?.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatClick = (freelancerId) => {
    navigate(`/contact-freelancer/${freelancerId}`);
  };

  if (clientLoading || chatsLoading) return <div className="text-center py-8">Loading...</div>;
  if (clientError || chatsError)
    return (
      <div className="text-center py-8 text-red-500">
        {clientError?.message || chatsError?.message || 'Error fetching data'}
      </div>
    );
  if (chats?.length === 0) return <div className="text-center py-8">No Chats Found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search freelancer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {(searchTerm ? filteredChats : chats)?.length === 0 ? (
          <p>No freelancers match your search.</p>
        ) : (
          (searchTerm ? filteredChats : chats)?.map((chatItem) => {
            const freelancerId = chatItem.chat.freelancer;
            const freelancerData = freelancersData[freelancerId];

            return freelancerData ? (
              <div
                key={chatItem.chat.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                onClick={() => handleChatClick(freelancerId)}
              >
                <div className="flex items-center space-x-4 mb-2">
                  <img
                    src={freelancerData.profile_picture || '/path/to/default-profile-picture.png'}
                    alt={`${freelancerData.full_name}'s profile`}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{freelancerData.full_name}</h2>
                    <p className="text-gray-600 text-sm truncate">
                      {chatItem.messages.length > 0
                        ? chatItem.messages[chatItem.messages.length - 1].content
                        : 'No messages yet.'}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {chatItem.messages.length > 0
                      ? formatTime(chatItem.messages[chatItem.messages.length - 1].timestamp)
                      : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div key={chatItem.chat.id} className="text-center">
                Loading freelancer info...
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Inbox;
