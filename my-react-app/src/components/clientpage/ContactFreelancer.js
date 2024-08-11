import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPaperclip, FaSmile } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage'; // Import the layout
import profilePic from '../../images/default-profile-picture.png'; // Replace with actual profile picture

const ContactFreelancer = () => {
  const { freelancerId } = useParams(); // Get freelancer ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const messageEndRef = useRef(null);

  // Dummy data for freelancer details (replace with real data from API)
  const freelancer = {
    name: 'Jane Doe',
    profilePic: profilePic, // Replace with actual profile picture URL
  };

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || file) {
      const message = {
        text: newMessage,
        file: file,
        sentAt: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={freelancer.profilePic} // Replace with dynamic profile picture
            alt={`${freelancer.name}'s profile`}
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-bold">{freelancer.name}</h1>
            <p className="text-gray-500">Freelancer</p>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex flex-col h-[60vh] overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.file ? 'flex-row' : 'flex-col'} items-start`}
                  >
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-sm">
                      {message.text && <p className="text-gray-800">{message.text}</p>}
                      {message.file && (
                        <a
                          href={URL.createObjectURL(message.file)}
                          download={message.file.name}
                          className="text-blue-500"
                        >
                          {message.file.name}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          <form className="flex items-center space-x-2 border-t border-gray-200 pt-4" onSubmit={handleSendMessage}>
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
                onChange={handleFileChange}
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
      </div>
    </ClientLayout>
  );
};

export default ContactFreelancer;
