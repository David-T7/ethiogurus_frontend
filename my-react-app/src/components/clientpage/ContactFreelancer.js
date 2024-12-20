import React, { useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import { FaPaperclip, FaUserPlus, FaDownload } from "react-icons/fa";
import ClientLayout from "./ClientLayoutPage";
import ProjectSelectionPage from "./ProjectSelectionPage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchFreelancerData = async (freelancerId) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancerId}/`);
  return response.data;
};

const fetchClientData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchChatData = async ({ queryKey }) => {
  const [, { clientId, freelancerId, token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/clientFreelancerChat/", {
    params: { client_id: clientId, freelancer_id: freelancerId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchProjects = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/projects/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const checkActiveContract = async ({ queryKey }) => {
  const [, { clientId, freelancerId, token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/check-active-contract/", {
    params: { client_id: clientId, freelancer_id: freelancerId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.active_contract;
};

const ContactFreelancer = () => {
  const { id: freelancerId } = useParams();
  const queryClient = useQueryClient();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const messageEndRef = useRef(null);
  const [error , setError]= useState("")
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSelectingProject, setIsSelectingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatID, setChatID] = useState(null);

  const { data: freelancerData, isLoading: loadingFreelancer } = useQuery({
    queryKey: ["freelancer", freelancerId],
    queryFn: () => fetchFreelancerData(freelancerId),
  });

  const { data: clientData, isLoading: loadingClient } = useQuery({
    queryKey: ["client", token],
    queryFn: () => fetchClientData(token),
  });

  const { data: chatData, isLoading: loadingChat } = useQuery({
    queryKey: ["chat", { clientId: clientData?.id, freelancerId, token }],
    queryFn: fetchChatData,
    enabled: !!clientData && !!freelancerData,
  });

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", token],
    queryFn: () => fetchProjects(token),
  });

  const { data: isHired } = useQuery({
    queryKey: ["activeContract", { clientId: clientData?.id, freelancerId, token }],
    queryFn: checkActiveContract,
    enabled: !!clientData && !!freelancerData,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatID, formData }) => {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/chats/${chatID}/messages/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["chat", { clientId: clientData?.id, freelancerId, token }], (old) => ({
        ...old,
        messages: [...old.messages, data],
      }));
    },
  });


  const fetchOrCreateChat = async () => {
    try {
      const chatResponse = await axios.get("http://127.0.0.1:8000/api/user/clientFreelancerChat/", {
        params: { client_id: clientData.id, freelancer_id: freelancerId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (chatResponse.data.chat) {
        return chatResponse.data; // Return the first chat
      } else {
        // Create a new chat if none exists
        const newChatResponse = await axios.post(
          "http://127.0.0.1:8000/api/user/chats/",
          {
            client: clientData.id,
            freelancer: freelancerData.id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return newChatResponse.data;
      }
    } catch (error) {
      throw new Error("Error fetching or creating chat: " + error.message);
    }
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    if (file) formData.append("file", file);

    try {
      const chatResponse = await fetchOrCreateChat();

      if (chatResponse.chat) {
        setChatID(chatResponse.chat.id);
      }

      sendMessageMutation.mutate({ chatID: chatResponse.chat.id, formData });

      setNewMessage("");
      setFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const groupedMessages = chatData?.messages?.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

   // Function to mark messages as read
   const markMessagesAsRead = async (messages) => {
    const unreadMessages = messages?.filter(
      message => !message.read && message.sender===freelancerData.id 
    );
    if (unreadMessages?.length > 0) {
      try {
        await axios.patch(
          "http://127.0.0.1:8000/api/user/messages/read/",
          {
            message_ids: unreadMessages.map(message => message.id),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error marking messages as read: ", error);
      }
    }
  };

   // This effect will be triggered when new messages are received or updated
   useEffect(() => {
    // Call the function to mark freelancer messages as read
    markMessagesAsRead(chatData?.messages);

    // Scroll to the bottom of the chat whenever new messages arrive
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]); // Dependency on 'messages' ensures the effect runs whenever messages change

  if (loadingFreelancer || loadingClient || loadingChat || loadingProjects)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <ClientLayout>
      {isSelectingProject ? (
        <ProjectSelectionPage
          projects={projects}
          onProjectSelect={(project) => {
            setSelectedProject(project);
            setIsSelectingProject(false);
          }}
          freelancerID={freelancerId}
        />
      ) : (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={freelancerData.profile_picture}
                alt={`${freelancerData.full_name}'s profile`}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div>
                <h1 className="text-2xl font-normal text-brand-dark-blue">
                  {freelancerData.full_name}
                </h1>
                <p className="text-brand-dark-blue">Freelancer</p>
              </div>
            </div>
            <div>
              {isHired ? (
                <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Hired
                </span>
              ) : (
                <button
                  onClick={() => setIsSelectingProject(true)}
                  className="flex items-center justify-center bg-brand-green text-white px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-green-600"
                >
                  <FaUserPlus className="mr-2" /> Hire
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col h-[60vh] overflow-y-auto mb-4">
            {Object.keys(groupedMessages || {}).length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              Object.keys(groupedMessages).map((date) => (
                <div key={date} className="mb-4">
                  <div className="text-center text-gray-500 text-sm mb-2">{date}</div>
                  {groupedMessages[date].map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        message.sender === freelancerData.id ? "items-start" : "items-end"
                      } space-y-1`}
                    >
                      <div
                        className={`flex-1 p-4 rounded-lg shadow-sm ${
                          message.sender === clientData.id
                            ? "bg-gray-100"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {message.content && <p>{message.content}</p>}
                        {message.file && (
                          <div className="flex items-center mt-1">
                            <a
                              href={`http://127.0.0.1:8000/${message.file}`}
                              download
                              className="text-blue-500"
                            >
                              <FaDownload className="h-5 w-5 mr-1" />
                              {message.file.split("/").pop()}
                            </a>
                          </div>
                        )}
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>

          <form
            className="flex items-center space-x-2 border-t border-gray-200 pt-4"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
              <FaPaperclip className="text-xl" />
              <input
                id="file-upload"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </ClientLayout>
  );
};

export default ContactFreelancer;
