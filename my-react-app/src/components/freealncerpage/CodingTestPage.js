import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CodingTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Example state for test data; replace with API call in production
  const [testData, setTestData] = useState({
    title: 'Full Stack Web Application',
    questions: [
      { id: 1, statement: 'Implement a function to reverse a string.' },
      { id: 2, statement: 'Write a function to check if a number is prime.' },
    ],
    totalDuration: 3600, // 1 hour in seconds
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(testData.totalDuration);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleCodeChange = (e) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [testData.questions[currentQuestionIndex].id]: e.target.value,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === testData.questions.length - 1) {
      handleSubmitTest();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Assume this function sends all answers to the backend for evaluation
    // const result = await submitAllAnswers(testId, answers);

    // Dummy result data
    const results = testData.questions.map(question => ({
      question: question.statement,
      score: Math.floor(Math.random() * 100), // Random score for demo
      answer: answers[question.id],
      feedback: "Good job!" // Placeholder feedback
    }));

    // Calculate average score
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;

    navigate('/coding-test-result', { 
      state: { testId, results, totalScore: averageScore }
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = testData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <h1 className="text-4xl font-extrabold mb-2">{testData.title} Test</h1>
          <p className="mt-2 text-lg">Time Remaining: {formatTime(timer)}</p>
        </div>
        <div className="p-6">
          <div className="mb-2 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-brand-dark-blue">Question {currentQuestionIndex + 1}</h2>
            <p className="text-gray-800">{currentQuestion.statement}</p>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
              value={answers[currentQuestion.id] || ''}
              onChange={handleCodeChange}
              placeholder="Write your code here..."
            />
          </div>
          <div className="flex justify-between mb-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
            >
              {currentQuestionIndex === testData.questions.length - 1 ? 'Submit Test' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTestPage;
