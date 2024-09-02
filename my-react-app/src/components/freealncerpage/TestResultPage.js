import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state
  const { questions, selectedAnswers, correctAnswers } = location.state || {};

  // Check if required data exists
  if (!questions || !selectedAnswers || !correctAnswers) {
    return <div>Error: Missing data.</div>;
  }

  // Calculate the score based on selected and correct answers
  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id]?.text === correctAnswers[question.id]) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const totalQuestions = questions.length;
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-brand-blue text-white">
          <h2 className="text-2xl font-bold">Test Results</h2>
          <p className="mt-2 text-lg">You scored {score} out of {totalQuestions}</p>
          <p className="mt-2 text-lg font-semibold">Percentage: {percentage}%</p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question.id}>
                <div className="mb-2 text-lg font-medium">{question.text}</div>
                <div className={`p-4 rounded-lg ${
                  selectedAnswers[question.id]?.text === correctAnswers[question.id]
                    ? 'bg-green-100 border-l-4 border-green-500'
                    : 'bg-red-100 border-l-4 border-red-500'
                }`}>
                  <p className="font-semibold">Your Answer: {selectedAnswers[question.id]?.text}</p>
                  {selectedAnswers[question.id]?.id !== correctAnswers[question.id] && (
                    <p className="font-semibold">Correct Answer: {correctAnswers[question.id]}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/tests')}
              className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue transition-colors duration-300"
            >
              Go to Tests Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
