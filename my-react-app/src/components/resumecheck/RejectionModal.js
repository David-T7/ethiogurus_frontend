import React, { useState } from 'react'; 
import axios from 'axios';

const RejectionModal = ({ isOpen, onClose, positions, services, token, resume }) => {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [holdDuration, setHoldDuration] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleReject = async () => {
    if (!positions[currentPositionIndex]?.id || !rejectionReason || !holdDuration) {
      setErrorMessage('Position, reason, and hold duration are required.');
      return;
    }

    // Convert hold duration to a future datetime
    const holdUntilDate = new Date();
    holdUntilDate.setDate(holdUntilDate.getDate() + parseInt(holdDuration, 10));

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/application-on-hold/',
        {
          resume: resume.id,
          email: resume.email,
          position: positions[currentPositionIndex].id,
          hold_until: holdUntilDate.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose();
    } catch (error) {
      console.error('Error sending application on hold:', error);
      setErrorMessage(error.response?.data?.detail || 'Failed to process request. Try again.');
    }
  };

  const handleNextPosition = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
    }
  };

  const handlePreviousPosition = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(currentPositionIndex - 1);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 relative">
          <h2 className="text-xl font-normal text-center text-gray-800 mb-4">Reject Application</h2>
          <p className="text-lg font-normal mb-2">
            Position: {services[currentPositionIndex]?.name || `Position ID: ${positions[currentPositionIndex]?.id}`}
          </p>
          <div className="mb-4">
            <label className="block text-gray-700">Hold Duration</label>
            <input
              type="text"
              value={holdDuration}
              onChange={(e) => setHoldDuration(e.target.value)}
              placeholder="Enter days"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rejection Reason</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between">
            {/* Only show navigation buttons if there is more than one position */}
            {positions.length > 1 && (
              <>
                <button
                  onClick={handlePreviousPosition}
                  disabled={currentPositionIndex === 0}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Back
                </button>
                <button
                  onClick={handleNextPosition}
                  disabled={currentPositionIndex === positions.length - 1}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Next
                </button>
              </>
            )}
            <button onClick={handleReject} className="bg-red-600 text-white py-2 px-4 rounded-lg">
              Reject
            </button>
            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-lg">
              Cancel
            </button>
          </div>
          {errorMessage && <div className="text-red-500 mt-4 text-center text-md">{errorMessage}</div>}
        </div>
      </div>
    )
  );
};

export default RejectionModal;
