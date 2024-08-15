import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientLayout from './ClientLayoutPage';
import { FaUpload } from 'react-icons/fa';

const DisputePage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [disputeDetails, setDisputeDetails] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle dispute submission (e.g., API call)
    console.log('Dispute submitted:', disputeDetails, files);
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-extrabold text-brand-dark-blue mb-6 text-center">
          File a Dispute for Project #{projectId}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-brand-gray-dark mb-2">Dispute Details</h2>
            <textarea
              value={disputeDetails}
              onChange={(e) => setDisputeDetails(e.target.value)}
              placeholder="Describe your issue here..."
              className="w-full h-32 border border-brand-gray-dark p-4 rounded-lg focus:outline-none focus:border-brand-dark-blue"
            />
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-brand-gray-dark mb-2">Upload Evidence Documents</h2>
            <label className="flex flex-col items-center cursor-pointer">
              <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-brand-dark-blue bg-brand-gray-light rounded-lg mb-4">
                <FaUpload className="text-3xl text-brand-dark-blue" />
                <span className="text-brand-dark-blue ml-2">Drag & Drop your files here</span>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <ul className="list-disc pl-6 text-brand-gray-dark mt-4">
              {files.length > 0 ? (
                Array.from(files).map((file, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{file.name}</span>
                  </li>
                ))
              ) : (
                <li>No files selected</li>
              )}
            </ul>
          </div>

          <div className="text-center">
            <button
              type="submit"
               className="bg-brand-blue text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-dark-blue transition-transform transform hover:scale-105 shadow-md"
            >
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default DisputePage;
