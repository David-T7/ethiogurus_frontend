import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const CodingTestResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTest } = location.state || { currentTest: null };
  const { id: submission_id } = useParams();
  const token = localStorage.getItem("access");

  // State to store fetched data
  const [totalResult, setTotalResult] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showMoreNeeded = (feedbackLength) => {
    const CHAR_LIMIT = 300;
    const REMAINING_CHAR_LIMIT = 200;
    return (
      feedbackLength > CHAR_LIMIT &&
      feedbackLength - CHAR_LIMIT >= REMAINING_CHAR_LIMIT
    );
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch total test submission result
        const totalResultResponse = await axios.get(
          `http://127.0.0.1:8002/api/coding-test-submissions/${submission_id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalResult(totalResultResponse.data);

        // Fetch individual question results
        const questionResultsResponse = await axios.get(
          `http://127.0.0.1:8002/api/skill-test-answers/${submission_id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedQuestionResults = questionResultsResponse.data;
        setQuestionResults(fetchedQuestionResults);

        // Fetch full question details based on question IDs
        const fetchQuestionDetails = async () => {
          const questionDetailsPromises = fetchedQuestionResults.map((result) =>
            axios.get(
              `http://127.0.0.1:8002/api/skill-test-question/${result.question}/`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          );

          const questionsData = await Promise.all(questionDetailsPromises);
          const questionsMap = {};
          questionsData.forEach((response, index) => {
            questionsMap[fetchedQuestionResults[index].question] =
              response.data;
          });
          setQuestions(questionsMap);
        };

        await fetchQuestionDetails();
      } catch (error) {
        console.error("Failed to fetch results", error);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentTest) {
      fetchResults();
    } else {
      setLoading(false);
      setError("Error occurred while loading results!");
    }
  }, [submission_id, currentTest, token]);

  const handleReturnToDashboard = () => {
    navigate("/skills");
  };

  const [expandedFeedback, setExpandedFeedback] = useState({});
  const CHAR_LIMIT = 300;

  const toggleFeedback = (questionId) => {
    setExpandedFeedback((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        {error}
      </div>
    );
  }

  const resultClass = totalResult?.passed
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className={`p-6 ${resultClass} text-center`}>
          <h1 className="text-3xl font-normal">
            Test Result for {currentTest.skill_type}
          </h1>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center ${resultClass} w-38 h-28 rounded-full shadow-md`}
            >
              <p className="text-2xl font-normal mt-4">
                {totalResult?.score?.toFixed(2)}/100
              </p>
            </div>

            <p className="mt-2 text-lg font-normal">
             {totalResult?.passed ? 
  "Congratulations on successfully passing the test." : 
  "Unfortunately, you did not pass the test this time. Please review the feedback and try again."}
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {questionResults.map((result, index) => (
            <div
              key={result.question}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <span className="text-xl font-semibold text-blue-600 mr-2">
                  Q{index + 1}:
                </span>
                <h3 className="text-lg font-normal text-blue-600">
                  {questions[result.question]?.description || "Loading..."}
                </h3>
              </div>

              <div className="mb-4">
                <p className="font-medium text-blue-600">Answer:</p>
                <pre className="bg-gray-100 p-3 border border-gray-300 rounded overflow-x-auto">
                  <code className="text-gray-800">{result.answer_text}</code>
                </pre>
              </div>
              <p className="text-gray-800 mb-4">
                <span className="font-medium text-blue-600">Score:</span>{" "}
                {result.score}/100
              </p>
              <div className="text-gray-700">
                <span className="font-medium text-blue-600">Feedback:</span>
                <p className="whitespace-pre-wrap">
                  {expandedFeedback[result.question]
                    ? result.evaluation_feedback
                    : showMoreNeeded(result.evaluation_feedback.length)
                    ? result.evaluation_feedback.substring(0, CHAR_LIMIT) +
                      "..."
                    : result.evaluation_feedback}
                </p>
                {showMoreNeeded(result.evaluation_feedback.length) && (
                  <button
                    onClick={() => toggleFeedback(result.question)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    {expandedFeedback[result.question]
                      ? "Show Less"
                      : "Show More"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReturnToDashboard}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Skills Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTestResultPage;
