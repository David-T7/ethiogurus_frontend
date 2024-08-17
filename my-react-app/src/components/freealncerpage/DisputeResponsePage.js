import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';

const DisputeResponsePage = () => {
  // Initial states
  const [dispute, setDispute] = useState('');
  const [refundOffer, setRefundOffer] = useState(null);
  const [response, setResponse] = useState({
    decision: '',
    comments: '',
    documents: [],
    counterOfferAmount: ''
  });

  useEffect(() => {
    // Fetch dispute and refund offer data from API
    // This is just a mock implementation. Replace with actual API call.
    const fetchDisputeData = async () => {
      // Example data
      const disputeData = {
        details: 'The client did not complete the project as agreed.',
        refundOffer: {
          type: 'partial', // 'full' or 'partial'
          amount: '100' // Only applicable if 'partial'
        }
      };
      setDispute(disputeData.details);
      setRefundOffer(disputeData.refundOffer);
    };

    fetchDisputeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponse({
      ...response,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setResponse({
      ...response,
      documents: Array.from(e.target.files),
    });
  };

  const handleDecision = (decision) => {
    setResponse({ ...response, decision });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here (e.g., API call)
    console.log('Dispute response:', { ...response, refundOffer });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h2 className="text-3xl font-normal text-brand-blue mb-6 text-center">Respond to Dispute</h2>

      {/* Display Dispute Details */}
      <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
        <h3 className="text-lg font-semibold text-brand-blue mb-2">Dispute Details</h3>
        <p className="text-gray-800">{typeof dispute === 'string' ? dispute : 'No details available'}</p>
      </div>

      {/* Display Refund Offer Information */}
      {refundOffer && (
        <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-brand-blue mb-2">Refund Offer Details</h3>
          <p className="text-gray-800">
            {refundOffer.type === 'full' ? 'Full Refund Offer' : 'Partial Refund Offer'}
          </p>
          {refundOffer.type === 'partial' && (
            <p className="text-gray-800">Amount: ${refundOffer.amount}</p>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={() => handleDecision('accept')}
              className={`w-full py-2 rounded-lg border ${
                response.decision === 'accept' ? 'bg-green-500 text-white border-green-700' : 'border-gray-300'
              }`}
            >
              Accept Refund
            </button>
            <button
              type="button"
              onClick={() => handleDecision('counter')}
              className={`w-full py-2 rounded-lg border ${
                response.decision === 'counter' ? 'bg-yellow-500 text-white border-yellow-700' : 'border-gray-300'
              }`}
            >
              Counter Offer
            </button>
            <button
              type="button"
              onClick={() => handleDecision('reject')}
              className={`w-full py-2 rounded-lg border ${
                response.decision === 'reject' ? 'bg-red-500 text-white border-red-700' : 'border-gray-300'
              }`}
            >
              Reject Refund
            </button>
          </div>
        </div>
      )}

      {/* Counter Offer Form */}
      {response.decision === 'counter' && (
        <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-brand-blue mb-2">Counter Offer</h3>
          <label htmlFor="counterOfferAmount" className="block text-lg font-normal text-brand-blue mb-2">
            Proposed Amount
          </label>
          <input
            type="number"
            id="counterOfferAmount"
            name="counterOfferAmount"
            value={response.counterOfferAmount}
            onChange={handleInputChange}
            placeholder="Enter counter offer amount"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Comments */}
      <div className="mb-6">
        <label htmlFor="comments" className="block text-lg font-normal text-brand-blue mb-2">
          Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          value={response.comments}
          onChange={handleInputChange}
          rows="4"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Supporting Documents */}
      <div className="mb-6">
        <label htmlFor="documents" className="block text-lg font-normal text-brand-blue mb-2">
          Supporting Documents
        </label>
        <input
          type="file"
          id="documents"
          name="documents"
          multiple
          onChange={handleFileChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none"
        />
        <div className="mt-2 text-sm text-gray-600">
          <FaUpload className="inline-block mr-2" />
          {response.documents.length > 0
            ? `Files: ${response.documents.map(file => file.name).join(', ')}`
            : 'No files chosen'}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
};

export default DisputeResponsePage;
