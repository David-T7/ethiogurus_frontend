import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CodingTestResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId, results, totalScore } = location.state || { results: [], totalScore: 0 };

  const handleReturnToDashboard = () => {
    navigate('/tests');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 bg-brand-blue text-white text-center">
          <h1 className="text-4xl font-extrabold mb-4">Test Result {testId}</h1>
          <div className="relative mb-6 flex flex-col items-center">
            <div className="flex items-center justify-center bg-brand-light-blue w-36 h-36 rounded-full shadow-lg mx-auto">
              <p className="text-5xl font-bold text-white">{totalScore.toFixed(2)}</p>
            </div>
            <h2 className="text-2xl font-semibold mt-2">Total Score</h2>
          </div>
        </div>
        <div className="p-6">
          {results.map((result) => (
         <div
         key={result.question}
         className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105"
       >
         <h3 className="text-xl font-semibold text-brand-blue mb-3 border-b border-gray-200 pb-2">
           Question: {result.question}
         </h3>
         <p className="text-gray-800 mb-4">
           <span className="font-medium text-brand-blue">Score:</span> {result.score}/100
         </p>
         <div className="mb-4">
           <p className="font-medium text-brand-blue">Answer:</p>
           <pre className="bg-gray-100 p-4 border border-gray-200 rounded-lg overflow-x-auto">
             <code className="text-gray-800 whitespace-pre-wrap">{result.answer}</code>
           </pre>
         </div>
         <p className="text-gray-700">
           <span className="font-medium text-brand-blue">Feedback:</span> {result.feedback}
         </p>
       </div>
          ))}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleReturnToDashboard}
              className="px-6 py-3 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue transition-colors duration-300"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTestResultPage;
