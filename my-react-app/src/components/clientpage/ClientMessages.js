import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const fetchClientData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchChats = async (client_id, token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/clientChats/", {
    params: { client_id: client_id },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancerData = async (freelancer_id) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancer_id}/`);
  return response.data;
};

const ClientMessages = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();
  const queryFreelancer = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [freelancerData, setfreelancerData] = useState({});
  
  // Query to fetch freelancer data
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ["clientData", token],
    queryFn: () => fetchClientData(token),
    enabled: !!token,
  });

  // Query to fetch chats
  const { data: chats, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats", freelancerData?.id, token],
    queryFn: () => fetchChats(freelancerData.id, token),
    enabled: !!freelancerData,
  });

  // Fetch freelancer data for each chat
  useEffect(() => {
    const fetchFreelancers = async () => {
      const freelancerIds = [...new Set(chats.map((chat) => chat.chat.client))];
      const newFreelancerData = {};

      for (const freelancerId of freelancerIds) {
        if (!freelancerData[freelancerId]) {
          const freelancerData = await fetchFreelancerData(freelancerId);
          newFreelancerData[freelancerId] = freelancerData;
        }
      }

      setfreelancerData((prev) => ({ ...prev, ...newFreelancerData }));
    };

    if (chats?.length > 0) {
      fetchFreelancers();
    }
  }, [chats]);

  // Polling mechanism for refreshing chats
  useEffect(() => {
    const interval = setInterval(() => {
      if (freelancerData?.id) {
        queryFreelancer.invalidateQueries(["chats", freelancerData.id, token]);
      }
    }, 10000); // Fetch new data every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clientData, token, queryFreelancer]);

  const filteredChats = chats?.filter((chat) => {
    const freelancer = freelancerData[chat.chat.freelancer];
    const searchField = freelancer?.full_name;
    return searchField?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatClick = (freelancer_id) => {
    navigate(`/contact-freelancer/${freelancer_id}`);
  };

  if (clientLoading || chatsLoading) return <div className="text-center py-8">Loading...</div>;

  if (!chats || chats?.length === 0) {
    return <div className="text-center py-8">No Chats Found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Freelancer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {(searchTerm ? filteredChats : chats).map((chatItem) => {
          const freelancer_id = chatItem.chat.freelancer;
          const freelancerData = freelancerData[freelancer_id];

          return freelancerData ? (
            <div
              key={chatItem.chat.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
              onClick={() => handleChatClick(freelancer_id)}
            >
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src={freelancerData.profile_picture || "/path/to/default-profile-picture.png"}
                  alt={`${freelancerData.full_name}'s profile`}
                  className="w-12 h-12 rounded-full border-2 border-gray-300"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {freelancerData.full_name}
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
              Loading Freelancer info...
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientMessages;
