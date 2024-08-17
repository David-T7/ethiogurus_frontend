import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientLayout from './ClientLayoutPage';
import { FaUpload } from 'react-icons/fa';

const DisputePage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [disputeDetails, setDisputeDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [refundType, setRefundType] = useState('full'); // 'full' or 'partial'
  const [refundAmount, setRefundAmount] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle dispute submission (e.g., API call)
    console.log('Dispute submitted:', {
      disputeDetails,
      files,
      refundType,
      refundAmount: refundType === 'partial' ? refundAmount : 'Full Refund'
    });
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          File a Dispute for Project #{projectId}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6">
            <label htmlFor="details" className="block text-lg font-normal text-brand-blue mb-2">
              Dispute Details  
            </label>
            <textarea
              id="details"
              value={disputeDetails}
              onChange={(e) => setDisputeDetails(e.target.value)}
              placeholder="Describe your issue here..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
            />
          </div>

          <div className="p-6">
            <h2 className="text-lg font-normal text-brand-blue mb-2">Upload Evidence Documents</h2>
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
                    <span className="font-normal">{file.name}</span>
                  </li>
                ))
              ) : (
                <li>No files selected</li>
              )}
            </ul>
          </div>

          <div className="p-6">
            <label htmlFor="refundType" className="block text-lg font-normal text-brand-blue mb-2">
              Refund Type
            </label>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="full"
                name="refundType"
                value="full"
                checked={refundType === 'full'}
                onChange={() => setRefundType('full')}
                className="mr-2"
              />
              <label htmlFor="full" className="mr-4">Full Refund</label>
              <input
                type="radio"
                id="partial"
                name="refundType"
                value="partial"
                checked={refundType === 'partial'}
                onChange={() => setRefundType('partial')}
                className="mr-2"
              />
              <label htmlFor="partial">Partial Refund</label>
            </div>

            {refundType === 'partial' && (
              <div>
                <label htmlFor="refundAmount" className="block text-lg font-normal text-brand-blue mb-2">
                  Amount for Partial Refund
                </label>
                <input
                  type="number"
                  id="refundAmount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
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
