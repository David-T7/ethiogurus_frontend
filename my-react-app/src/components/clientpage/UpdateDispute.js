import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from './ClientLayoutPage';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';

const UpdateDispute = () => {
  const { id: disputeId } = useParams(); // Get dispute ID from URL
  const navigate = useNavigate();
  const [dispute, setDispute] = useState(null);
  const [title, setTitle] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [refundType, setRefundType] = useState('full');
  const [refundAmount, setRefundAmount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchDispute = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDispute(response.data);
        setTitle(response.data.title);
        setDisputeDetails(response.data.description);
        setRefundType(response.data.return_type);
        setRefundAmount(response.data.return_amount || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dispute:', err);
        setError('Error fetching dispute details. Please try again.');
        setLoading(false);
      }
    };

    fetchDispute();
  }, [disputeId, token]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Please provide a title for the dispute.');
      return;
    }
    if (refundType === 'partial' && !refundAmount) {
      setError('Please specify the refund amount for a partial refund.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', disputeDetails);
    formData.append('return_type', refundType);
    if (refundType === "partial"){
      formData.append('return_amount', refundAmount);
    }
    // Append each file as 'supporting_documents'
    files.forEach((file) => {
      formData.append('supporting_documents', file);
    });

    try {
      // Send PATCH request to update dispute
      const response = await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Dispute updated successfully:', response.data);
      setSuccess(true);
      // Optionally, reset the form
      setTitle('');
      setDisputeDetails('');
      setFiles([]);
      setRefundType('full');
      setRefundAmount('');

      // Redirect to the dispute details page or any relevant page
      navigate(-1); // Go back to the previous page
    } catch (err) {
      console.error('Error updating dispute:', err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to update dispute. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          Update Dispute
        </h1>

        {/* Display Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Display Success Message */}
        {success && <div className="text-green-500 mb-4">Dispute updated successfully!</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dispute Title */}
          <div className="p-6">
            <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
              Dispute Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter dispute title..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Dispute Details */}
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
              required
            />
          </div>

          {/* Upload Evidence Documents */}
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

          {/* Refund Type */}
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
                  required={refundType === 'partial'}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Update Dispute'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default UpdateDispute;
