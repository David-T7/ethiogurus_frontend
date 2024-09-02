import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

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

  const showMoreNeeded = (feedbackLenght) => {
    if (feedbackLenght > CHAR_LIMIT  && feedbackLenght - CHAR_LIMIT >= REMAINING_CHAR_LIMIT){
      return true
    }
  }
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch total test submission result
        const totalResultResponse = await axios.get(`http://127.0.0.1:8002/api/coding-test-submissions/${submission_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalResult(totalResultResponse.data);

        // Fetch individual question results
        const questionResultsResponse = await axios.get(`http://127.0.0.1:8002/api/skill-test-answers/${submission_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedQuestionResults = questionResultsResponse.data;
        setQuestionResults(fetchedQuestionResults);

        // Fetch full question details based on question IDs
        const fetchQuestionDetails = async () => {
          const questionDetailsPromises = fetchedQuestionResults.map(result =>
            axios.get(`http://127.0.0.1:8002/api/skill-test-question/${result.question}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          );

          const questionsData = await Promise.all(questionDetailsPromises);
          const questionsMap = {};
          questionsData.forEach((response, index) => {
            questionsMap[fetchedQuestionResults[index].question] = response.data;
          });
          setQuestions(questionsMap);
        };

        await fetchQuestionDetails();

      } catch (error) {
        console.error('Failed to fetch results', error);
        setError('Failed to fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentTest) {
      fetchResults();
    } else {
      setLoading(false);
      setError('Error occurred while loading results!');
    }
  }, [submission_id]);

  const handleReturnToDashboard = () => {
    navigate('/tests');
  };

  const [expandedFeedback, setExpandedFeedback] = useState({});
  const CHAR_LIMIT = 300; // Set your desired character limit here
  const REMAINING_CHAR_LIMIT = 200; // Set your desired character limit here

  const toggleFeedback = (questionId) => {
    setExpandedFeedback(prevState => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const resultClass = totalResult?.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className={`p-6 ${resultClass} text-center`}>
          <h1 className="text-4xl font-extrabold mb-4">Test Result for {currentTest.skill_type}</h1>
          <div className="relative mb-6 flex flex-col items-center">
            <div className={`flex items-center justify-center ${resultClass} w-36 h-36 rounded-full shadow-lg mx-auto`}>
              <p className="text-5xl font-bold">{totalResult?.score?.toFixed(2)}</p>
            </div>
            <h2 className="text-2xl font-semibold mt-2">Total Score</h2>
            <p className="mt-2 text-lg font-medium">
              {totalResult?.passed ? 'Test Passed' : 'Test Failed'}
            </p>
          </div>
        </div>
        <div className="p-6">
          {questionResults.map((result, index) => (
            <div
              key={result.question}
              className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl font-semibold text-brand-blue mr-4">Q{index + 1}:</span>
                <h3 className="text-xl font-semibold text-brand-blue">{questions[result.question]?.description || 'Loading...'}</h3>
              </div>

              <div className="mb-4">
                <p className="font-medium text-brand-blue">Answer:</p>
                <pre className="bg-gray-100 p-4 border border-gray-200 rounded-lg overflow-x-auto">
                  <code className="text-gray-800 whitespace-pre-wrap">{result.answer_text}</code>
                </pre>
              </div>
              <p className="text-gray-800 mb-4">
                <span className="font-medium text-brand-blue">Score:</span> {result.score}/100
              </p>
              <div className="text-gray-700">
                <span className="font-medium text-brand-blue">Feedback:</span>
                <p className="whitespace-pre-wrap">
                  {expandedFeedback[result.question]
                    ? result.evaluation_feedback
                    : showMoreNeeded(result.evaluation_feedback.length)
                      ? result.evaluation_feedback.substring(0, CHAR_LIMIT) + '...'
                      : result.evaluation_feedback
                  }
                </p>
                {showMoreNeeded(result.evaluation_feedback.length) &&  (
                  <button
                    onClick={() => toggleFeedback(result.question)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    {expandedFeedback[result.question] ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
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
