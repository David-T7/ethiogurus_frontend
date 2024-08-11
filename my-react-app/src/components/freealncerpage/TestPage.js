import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  // Sample questions array
  const questions = [
    {
      id: 1,
      question: "What is the output of 1 + '1' in JavaScript?",
      options: ["2", "'11'", "Error", "Undefined"],
    },
    {
      id: 2,
      question: "Which company developed React?",
      options: ["Google", "Facebook", "Twitter", "Microsoft"],
    },
    // Add more questions as needed
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(60 * 10); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining <= 0) {
      clearInterval(timer);
      handleSubmit();
    }

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelection = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestionIndex].id]: option,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Assuming correctAnswers is an object with question ids as keys and correct options as values
    const correctAnswers = {
      1: "'11'",
      2: "Facebook",
      // Add correct answers for all questions
    };
  
    // Navigate to the result page with test data
    navigate('/test-result', {
      state: { 
        questions,
        selectedAnswers,
        correctAnswers,
      },
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-brand-blue  text-white">
          <h2 className="text-2xl font-bold">JavaScript Fundamentals Test</h2>
          <p className="mt-2 text-lg">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className="mt-2 text-lg font-semibold">Time Remaining: {formatTime(timeRemaining)}</p>
        </div>

        <div className="p-6">
          <p className="text-xl font-medium mb-4">{questions[currentQuestionIndex].question}</p>
          <ul className="space-y-4">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleAnswerSelection(option)}
                  className={`block w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                    selectedAnswers[questions[currentQuestionIndex].id] === option
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-blue hover:bg-brand-dark-blue'
              }`}
            >
              Back
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue transition-colors duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-dark-green transition-colors duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
