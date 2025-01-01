import React, { useState, useEffect, useRef } from "react";
import { redirect, useParams } from "react-router-dom";
import { FaPaperclip,FaDownload } from "react-icons/fa";

import profilePic from "../../images/default-profile-picture.png";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const ContactClient = () => {
  const { id: client_id } = useParams(); // Get freelancer ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSelectingProject, setIsSelectingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const messageEndRef = useRef(null);
  const [freelancerData, setFreelancerData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [chatID, setChatID] = useState(null);
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/client/${client_id}/`
        );
        setClientData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

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
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/clientFreelancerChat/", // Correct endpoint URL
          {
            params: {
              // Query parameters go in 'params'
              client_id: clientData.id,
              freelancer_id: freelancerData.id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChatID(response.data.chat.id); // Fixed 'response.data', not 'response.date'
        setMessages(response.data.messages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (clientData && freelancerData) {
      // Ensure both clientData and freelancerData are available
      fetchChat();
    }
  }, [freelancerData, clientData]); // Only re-run if freelancerData or clientData changes

  // Scroll to the bottom of chat when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Check if there's a message or file to send
    if (!newMessage.trim() && !file) return;

    // Prepare FormData for the message
    const formData = new FormData();
    formData.append("content", newMessage);
    if (file) {
      formData.append("file", file);
    }
    formData.append("sender", clientData.id); // Add sender ID

    try {
      // Check if a chat already exists
      const chatResponse = await fetchOrCreateChat();

      // If a chat is created, store its ID
      if (chatResponse.chat) {
        setChatID(chatResponse.id);
      }

      // Send the message
      const response = await sendMessage(chatResponse.chat.id, formData);
      console.log("send message resposne is ", response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);

      // Reset the message input and file
      setNewMessage("");
      setFile(null);
    } catch (error) {
      setError(error); // Handle the error appropriately
    }
  };

  // Function to mark messages as read
  const markMessagesAsRead = async (messages) => {
    const unreadMessages = messages?.filter(
      message => !message.read && message.sender===clientData.id 
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

        // Optionally update the local state to reflect that messages are read
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            unreadMessages.some(unreadMsg => unreadMsg.id === msg.id)
              ? { ...msg, read: true }
              : msg
          )
        );
      } catch (error) {
        console.error("Error marking messages as read: ", error);
      }
    }
  };

   // This effect will be triggered when new messages are received or updated
   useEffect(() => {
    // Call the function to mark freelancer messages as read
    markMessagesAsRead(messages);

    // Scroll to the bottom of the chat whenever new messages arrive
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dependency on 'messages' ensures the effect runs whenever messages change

  const fetchOrCreateChat = async () => {
    try {
      const chatResponse = await axios.get("http://127.0.0.1:8000/api/user/clientFreelancerChat/", {
        params: { client_id: clientData.id, freelancer_id: freelancerData.id },
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
  const sendMessage = async (chatID, formData) => {
    try {
      return await axios.post(
        `http://127.0.0.1:8000/api/user/chats/${chatID}/messages/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      throw new Error("Error sending message: " + error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = formatDate(message.timestamp);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8">Error fetching client details</div>
    );
  if (!clientData)
    return <div className="text-center py-8">No data available</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={clientData.profile_picture}
            alt={`${
              clientData.contact_person
                ? clientData.contact_person
                : clientData.company_name
            }'s profile`}
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-normal text-brand-dark-blue">
              {clientData.contact_person
                ? clientData.contact_person
                : clientData.company_name}
            </h1>
            <p className="text-brand-dark-blue">Client</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[60vh] overflow-y-auto mb-4">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="mb-4">
              <div className="text-center text-gray-500 text-sm mb-2">
                {date}
              </div>
              {groupedMessages[date].map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.sender === clientData.id
                      ? "items-start"
                      : "items-end"
                  } space-y-1`}
                >
                  <div
                    className={`flex-1 p-4 rounded-lg shadow-sm ${
                      message.sender === freelancerData.id
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
                          className="text-white"
                        >
                          <FaDownload className="h-5 w-5 mr-1" />
                          {message.file.split("/").pop()}
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatTime(message.timestamp)}
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
  );
};

export default ContactClient;
