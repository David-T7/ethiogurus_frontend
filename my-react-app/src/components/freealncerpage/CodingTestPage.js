import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CodingTestPage = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();

  // State to store test data and answers
  const [testData, setTestData] = useState([]);
  const [currentTest , setCurrentTest] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const token = localStorage.getItem("access");
  const [freelancerId , setFreelancerId]= useState(null)
  const [submission_id , setSubmissionId] = useState(null)
  // Fetch test data and questions when component mounts
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch test data including questions
        
        const testResponse = await axios.get(`http://127.0.0.1:8002/api/practical-test/${testId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentTest(testResponse.data)
        
        const response = await axios.get(`http://127.0.0.1:8002/api/tests/${testId}/questions/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const freelnacerResponse = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
         
        });
        setFreelancerId(freelnacerResponse.data.id)
        setTestData(response.data);
        console.log("test data is ", response.data);
        setTimer(testResponse.data.duration_in_minutes * 60); // Convert minutes to seconds
      } catch (error) {
        console.error('Failed to fetch test data', error);
      }
    };

    fetchTestData();
  }, [testId]);

  // Timer functionality
  useEffect(() => {
    if (timer <= 0) return;

    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          handleFinalizeTest(); // Finalize test when timer expires
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleCodeChange = (e) => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestion.id]: e.target.value,
      }));
    }
  };

  const handleNextQuestion = async () => {
    // Submit the current answer before moving to the next question
    await submitCurrentAnswer();

    if (currentQuestionIndex === testData.length - 1) {
      handleFinalizeTest();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitCurrentAnswer = async () => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
        try {
            const response = await axios.post(`http://127.0.0.1:8002/api/skilltestsubmissions/${testId}/submit_answer/`, {
                question_id: currentQuestion.id,
                answer: answers[currentQuestion.id] || '',
                freelancer_id : freelancerId,
                submission_id: submission_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.submission_id){ 
              setSubmissionId(response.data.submission_id)
            } 
        } catch (error) {
            console.error('Failed to submit answer', error);
        }
    } 
};


  const handleFinalizeTest = async () => {
    try {
      await axios.post(`http://127.0.0.1:8002/api/skilltestsubmissions/finalize-submission/`, {
        submission_id:submission_id
      }, {
       
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Navigate to results page
      navigate(`/coding-test-result/${submission_id}`, { 
        state: { 
          currentTest, 
          submission_id,
        }
      });
    } catch (error) {
      console.error('Failed to finalize test', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (testData.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = testData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <h1 className="text-4xl font-extrabold mb-2">{currentTest?.skill_type} Coding Test</h1>
          <p className="mt-2 text-lg">Time Remaining: {formatTime(timer)}</p>
        </div>
        <div className="p-6">
          <div className="mb-2 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-brand-dark-blue">Question {currentQuestionIndex + 1}</h2>
            <p className="text-gray-800">{currentQuestion?.description}</p>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
              value={answers[currentQuestion?.id] || ''}
              onChange={handleCodeChange}
              placeholder="Write your code here..."
              required
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
              {currentQuestionIndex === testData.length - 1 ? 'Finalize Test' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTestPage;
