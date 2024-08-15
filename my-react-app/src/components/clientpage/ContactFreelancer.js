import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPaperclip } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';
import ProjectSelectionPage from './ProjectSelectionPage';
import profilePic from '../../images/default-profile-picture.png';

const ContactFreelancer = () => {
  const { id } = useParams(); // Get freelancer ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isHired, setIsHired] = useState(false); // State to track hiring status
  const [isSelectingProject, setIsSelectingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const messageEndRef = useRef(null);

  // Dummy data for freelancer details and projects (replace with real data from API)
  const freelancer = {
    name: 'Jane Doe',
    profilePic: profilePic, // Replace with actual profile picture URL
  };

  const projects = [
    { id: 1, name: 'Project Alpha', description: 'A description of Project Alpha' },
    { id: 2, name: 'Project Beta', description: 'A description of Project Beta' },
  ];

  // Scroll to the bottom of chat when new messages are added
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

  const handleHireFreelancer = () => {
    setIsSelectingProject(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsHired(true);
    setIsSelectingProject(false);
    // Replace with actual API call to hire the freelancer for the selected project
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = formatDate(message.sentAt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ClientLayout>
      {isSelectingProject ? (
        <ProjectSelectionPage projects={projects} onProjectSelect={handleProjectSelect} />
      ) : (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={freelancer.profilePic}
                alt={`${freelancer.name}'s profile`}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div>
                <h1 className="text-2xl font-bold">{freelancer.name}</h1>
                <p className="text-gray-500">Freelancer</p>
              </div>
            </div>
            <div>
              {isHired ? (
                <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Hiring for {selectedProject.name}....
                </span>
              ) : (
                <button
                  onClick={handleHireFreelancer}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition"
                >
                  Hire
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex flex-col h-[60vh] overflow-y-auto mb-4">
              {Object.keys(groupedMessages).length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                Object.keys(groupedMessages).map((date) => (
                  <div key={date} className="mb-4">
                    <div className="text-center text-gray-500 text-sm mb-2">{date}</div>
                    {groupedMessages[date].map((message, index) => (
                      <div key={index} className="flex flex-col items-start space-y-1">
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
                        <span className="text-gray-400 text-xs">{formatTime(message.sentAt)}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messageEndRef} />
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
      )}
    </ClientLayout>
  );
};

export default ContactFreelancer;
