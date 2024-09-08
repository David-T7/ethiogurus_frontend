import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const FollowUpModal = ({
  isOpen,
  onClose,
  followUpQuestions,
  onAnswerChange,
  onSubmit,
  onNext,
  timer,
  currentFollowUpIndex,
  handleFinalizeTest,
  finalQuestion,
  setFollowUpFinished,
}) => {
  

  
  const handleSubmit = () => {
    console.log("submitting now ")
    onSubmit(); // Submit follow-up answers
    
    // Check if the current question is the last one
    if (currentFollowUpIndex === followUpQuestions.length - 1) {
      setFollowUpFinished(true);
      onClose(); // Close modal if it is the last question
      if (finalQuestion) {
        handleFinalizeTest(); // Finalize the test if it's the last question
      }
    }
  };

  const currentQuestion = followUpQuestions[currentFollowUpIndex];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Follow-Up Question"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      shouldCloseOnOverlayClick={false} // Prevent closing when clicking outside
      shouldCloseOnEsc={false} // Prevent closing when pressing ESC
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Follow-Up Question</h2>
        <p className="text-lg mb-4">{currentQuestion?.question_text}</p>

        {currentQuestion?.options?.length > 0 && (
          <div className="mb-4">
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`option-${option.id}`}
                  name={currentQuestion.id}
                  value={option.id}
                  onChange={onAnswerChange}
                  className="mr-2"
                />
                <label htmlFor={`option-${option.id}`} className="text-base">
                  {option.option_text}
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg text-gray-600">Time Left: {timer}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentFollowUpIndex === followUpQuestions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FollowUpModal;
