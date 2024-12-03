import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Fetch test results data
const fetchTestResults = async ({ queryKey }) => {
  const [_, { questions, selectedAnswers, correctAnswers }] = queryKey;
  if (!questions || !selectedAnswers || !correctAnswers) {
    throw new Error("Missing data for test results.");
  }
  return { questions, selectedAnswers, correctAnswers };
};

const TestResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from location state
  const { questions, selectedAnswers, correctAnswers } = location.state || {};
  const startingPath = location.pathname.split("/").slice(0, 2).join("/"); // e.g., '/assessment-camera-check'

  // UseQuery to fetch test result data
  const { data, isLoading, error } = useQuery({
    queryKey: ["testResults", { questions, selectedAnswers, correctAnswers }],
    queryFn: fetchTestResults,
  });

  // Handle missing data or loading state
  if (isLoading) {
    return <div>Loading test results...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const { questions: fetchedQuestions, selectedAnswers: fetchedAnswers, correctAnswers: fetchedCorrectAnswers } = data;

  // Calculate the score based on selected and correct answers
  const calculateScore = () => {
    let score = 0;
    fetchedQuestions.forEach((question) => {
      if (fetchedAnswers[question.id]?.text === fetchedCorrectAnswers[question.id]) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const totalQuestions = fetchedQuestions.length;
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  const handleReturnToSkillsPage = () => {
    if (startingPath === "/skill-test-result") {
      navigate("/my-skills");
    } else {
      navigate("/skills");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-brand-blue text-white">
          <h2 className="text-2xl font-bold">Test Results</h2>
          <p className="mt-2 text-lg">
            You scored {score} out of {totalQuestions}
          </p>
          <p className="mt-2 text-lg font-semibold">Percentage: {percentage}%</p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
          <ul className="space-y-4">
            {fetchedQuestions.map((question) => (
              <li key={question.id}>
                <div className="mb-2 text-lg font-medium">{question.text}</div>
                <div
                  className={`p-4 rounded-lg ${
                    fetchedAnswers[question.id]?.text === fetchedCorrectAnswers[question.id]
                      ? "bg-green-100 border-l-4 border-green-500"
                      : "bg-red-100 border-l-4 border-red-500"
                  }`}
                >
                  <p className="font-semibold">Your Answer: {fetchedAnswers[question.id]?.text}</p>
                  {fetchedAnswers[question.id]?.text !== fetchedCorrectAnswers[question.id] && (
                    <p className="font-semibold">Correct Answer: {fetchedCorrectAnswers[question.id]}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleReturnToSkillsPage}
              className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue transition-colors duration-300"
            >
              Return to skills page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
