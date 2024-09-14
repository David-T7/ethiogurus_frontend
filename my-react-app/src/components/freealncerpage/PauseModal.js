import React from 'react';

const PauseModal = ({ showModal , message }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Test Paused</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <p className="text-sm text-gray-600">
          Please adjust your camera or reposition yourself. We will retry verification over the next 15 seconds.
        </p>
      </div>
    </div>
  );
};

export default PauseModal;
