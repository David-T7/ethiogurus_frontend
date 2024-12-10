import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const fetchFreelancerData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchChats = async (freelancerId, token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancerChats/", {
    params: { freelancer_id: freelancerId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchClientData = async (clientId) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/user/client/${clientId}/`);
  return response.data;
};

const FreelancerMessages = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [clientsData, setClientsData] = useState({});
  
  // Query to fetch freelancer data
  const { data: freelancerData, isLoading: freelancerLoading } = useQuery({
    queryKey: ["freelancerData", token],
    queryFn: () => fetchFreelancerData(token),
    enabled: !!token,
  });

  // Query to fetch chats
  const { data: chats, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats", freelancerData?.id, token],
    queryFn: () => fetchChats(freelancerData.id, token),
    enabled: !!freelancerData,
  });

  // Fetch client data for each chat
  useEffect(() => {
    const fetchClients = async () => {
      const clientIds = [...new Set(chats.map((chat) => chat.chat.client))];
      const newClientsData = {};

      for (const clientId of clientIds) {
        if (!clientsData[clientId]) {
          const clientData = await fetchClientData(clientId);
          newClientsData[clientId] = clientData;
        }
      }

      setClientsData((prev) => ({ ...prev, ...newClientsData }));
    };

    if (chats?.length > 0) {
      fetchClients();
    }
  }, [chats]);

  // Polling mechanism for refreshing chats
  useEffect(() => {
    const interval = setInterval(() => {
      if (freelancerData?.id) {
        queryClient.invalidateQueries(["chats", freelancerData.id, token]);
      }
    }, 10000); // Fetch new data every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [freelancerData, token, queryClient]);

  const filteredChats = chats?.filter((chat) => {
    const client = clientsData[chat.chat.client];
    const searchField = client?.contact_person || client?.company_name;
    return searchField?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatClick = (client_id) => {
    navigate(`/contact-client/${client_id}`);
  };

  if (freelancerLoading || chatsLoading) return <div className="text-center py-8">Loading...</div>;

  if (chats?.length === 0) {
    return <div className="text-center py-8">No Chats Found.</div>;
  }

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
        {(searchTerm ? filteredChats : chats).map((chatItem) => {
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
                  src={clientData.profile_picture || "/path/to/default-profile-picture.png"}
                  alt={`${clientData.contact_person || clientData.company_name}'s profile`}
                  className="w-12 h-12 rounded-full border-2 border-gray-300"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {clientData.contact_person || clientData.company_name}
                  </h2>
                  <p className="text-gray-600 text-sm truncate">
                    {chatItem.messages.length > 0
                      ? chatItem.messages[chatItem.messages.length - 1].content
                      : "No messages yet."}
                  </p>
                </div>
                <span className="text-gray-400 text-xs">
                  {chatItem.messages.length > 0
                    ? formatTime(chatItem.messages[chatItem.messages.length - 1].timestamp)
                    : ""}
                </span>
              </div>
            </div>
          ) : (
            <div key={chatItem.chat.id} className="text-center">
              Loading Client info...
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FreelancerMessages;
