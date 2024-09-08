import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FollowUpModal from './FollowUpModal';

const CodingTestPage = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState([]);
  const [currentTest, setCurrentTest] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [followUpTimer, setFollowUpTimer] = useState(0); // Timer for follow-up questions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [followUpSubmissionId, setFollowUpSubmissionId] = useState(null);  
  const token = localStorage.getItem('access');
  const [freelancerId, setFreelancerId] = useState(null);
  const [currentAnswer , setCurrentAnswer] = useState(null);
  const [finalQuestion , setFinalQuestion] = useState(false)
  const [followUpFinished, setFollowUpFinished] = useState(false);
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const testResponse = await axios.get(
          `http://127.0.0.1:8002/api/practical-test/${testId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentTest(testResponse.data);

        const response = await axios.get(
          `http://127.0.0.1:8002/api/tests/${testId}/questions/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const freelancerResponse = await axios.get(
          'http://127.0.0.1:8000/api/user/freelancer/manage/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFreelancerId(freelancerResponse.data.id);
        setTestData(response.data);
        setTimer(testResponse.data.duration_in_minutes * 60); // Convert minutes to seconds
      } catch (error) {
        console.error('Failed to fetch test data', error);
      }
    };

    fetchTestData();
  }, [testId]);

  useEffect(() => {
    if (timer <= 0) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
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

  useEffect(() => {
    if (followUpTimer === null) return;
    if (followUpTimer <= 0){
      console.log("automatic submission trigered",timer)
      handleSubmitFollowUp(); // Automatically submit follow-up answers when timer expires
    }
    const intervalId = setInterval(() => {
      console.log("timer",followUpTimer)
      setFollowUpTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        }
        else{
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [followUpTimer]);

  const handleCodeChange = (e) => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: e.target.value,
      }));
    }
  };

  const handleFollowUpChange = (e) => {
    console.log("name is ")

    const { name, value } = e.target;
    console.log("name is ",name)
    console.log("value is ",value)
    setFollowUpAnswers({
      [name]: value});
  };

  const fetchFollowUpQuestions = async (answerId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8002/api/follow-up-questions/${answerId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedFollowUpQuestions = response.data;

      setFollowUpQuestions(fetchedFollowUpQuestions);

      if (fetchedFollowUpQuestions.length > 0) {
        setCurrentFollowUpIndex(0);
        console.log("current follow up qeustion",fetchedFollowUpQuestions[0])
        setFollowUpTimer(fetchedFollowUpQuestions[0].duration_in_seconds); // Set initial timer for the first follow-up question
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to fetch follow-up questions', error);
    }
  };

  const handleNextQuestion = async () => {
    console.log("handling next question")
    const responseData = await submitCurrentAnswer();
    setFollowUpFinished(false)
    if (currentQuestionIndex === testData.length - 1) {
      await fetchFollowUpQuestions(responseData.id);
      setFinalQuestion(true)
    } else {
      await fetchFollowUpQuestions(responseData.id);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  const handleNextFollowUp = () => {
    if (currentFollowUpIndex < followUpQuestions.length - 1) {
      setCurrentFollowUpIndex(currentFollowUpIndex + 1);
      setFollowUpTimer(followUpQuestions[currentFollowUpIndex + 1].duration_in_seconds); // Set timer for the next question
    }
  };

  const submitCurrentAnswer = async () => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8002/api/skilltestsubmissions/${testId}/submit_answer/`,
          {
            question_id: currentQuestion.id,
            answer: answers[currentQuestion.id] || '',
            freelancer_id: freelancerId,
            submission_id: submissionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("submit answer response is ",response.data)
        if (response.data) {
          if (response.data.id) { 
          setCurrentAnswer(response.data.id)
          }
          if (response.data.submission_id) {
            setSubmissionId(response.data.submission_id); // Update state with the submission ID
          }
        }
        return response.data
      } catch (error) {
        console.error('Failed to submit answer', error);
      }
    }
  };


const submitFollowUpAnswers = async () => {
  if (!followUpFinished) {
    try {
      console.log("In submit follow-up method");
      console.log("Follow-up answers are ", followUpAnswers);     

      // Default values
      let questionId = followUpQuestions[currentFollowUpIndex].id;
      let answer = "not answered";

      // Update the questionId and answer if followUpAnswers contains data
      if (Object.keys(followUpAnswers).length > 0) {
        questionId = Object.keys(followUpAnswers)[0]; // Assuming there's only one follow-up question
        answer = followUpAnswers[questionId];
        console.log("Answer is ", answer);
      }

      // Prepare payload
      const payload = {
        follow_up_submission: followUpSubmissionId,
        question: questionId,
        selected_option: answer, // Send null if answer is "not answered", adjust as needed
        test_answer: currentAnswer,
        freelancer_id: freelancerId,
        test_submission: submissionId,
      };
      

      // Send the follow-up answer to the backend
      const response = await axios.post(
        "http://127.0.0.1:8002/api/follow-up-question-answer/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.follow_up_submission_id) {
        setFollowUpSubmissionId(response.data.follow_up_submission_id);
      }
      console.log("follow up sent as new ");

      // Clear follow-up answers after submission
      setFollowUpAnswers({});

      // Handle navigation after submission
        if (currentFollowUpIndex === followUpQuestions.length - 1) {
          setIsModalOpen(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleNextFollowUp();
        }
    } catch (error) {
      console.error("Failed to submit follow-up answers", error.response ? error.response.data : error.message);
    }
  }
};
  
  
  const handleSubmitFollowUp = async () => {
    console.log("submitting follow up..")
    await submitFollowUpAnswers();
  };

  const handleFinalizeTest = async () => {
    try {
      await submitFollowUpAnswers(); // Submit follow-up answers before finalizing

      await axios.post(
        `http://127.0.0.1:8002/api/skilltestsubmissions/finalize-followUp-submission/${followUpSubmissionId}/`,
        {}, // Empty object for the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const finalizeResponse = await axios.post(
        'http://127.0.0.1:8002/api/skilltestsubmissions/finalize-submission/',
        {
          submission_id: submissionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    

      const { submission } = finalizeResponse.data;

      if (submission.passed) {
        await updateFreelancerSkills(currentTest.skill_type);
      }

      navigate(`/coding-test-result/${submissionId}`, {
        state: {
          currentTest,
          submission_id: submissionId,
        },
      });
    } catch (error) {
      console.error('Failed to finalize test', error);
    }
  };

  const updateFreelancerSkills = async (skillType) => {
    try {
      const freelancerResponse = await axios.get(
        'http://127.0.0.1:8000/api/user/freelancer/manage/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const freelancerId = freelancerResponse.data.id;

      await axios.post(
        'http://127.0.0.1:8000/api/user/freelancer/update/skills/',
        {
          freelancer_id: freelancerId,
          skill_type: skillType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to update freelancer skills', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {testData.length > 0 && currentQuestionIndex < testData.length && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
            <h1 className="text-4xl font-extrabold mb-2">{currentTest?.skill_type} Coding Test</h1>
            <p className="mt-2 text-lg">Time Remaining: {formatTime(timer)}</p>
          </div>
          <div className="p-6">
            <div className="mb-2 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-brand-dark-blue">Question {currentQuestionIndex + 1}</h2>
              <p className="text-lg mb-4">{testData[currentQuestionIndex].description}</p>
              <textarea
                className="w-full h-64 border border-gray-300 p-2 rounded-md"
                value={answers[testData[currentQuestionIndex].id] || ''}
                onChange={handleCodeChange}
                placeholder="Write your code here..."
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex === testData.length - 1 ? 'Finish Test' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }}
        followUpQuestions={followUpQuestions}
        currentFollowUpIndex={currentFollowUpIndex}
        onAnswerChange={handleFollowUpChange}
        onNext={handleNextFollowUp}
        onSubmit={handleSubmitFollowUp}
        timer={formatTime(followUpTimer)}
        handleFinalizeTest={handleFinalizeTest}
        finalQuestion={finalQuestion}
        setFollowUpFinished ={setFollowUpFinished}
      />
    </div>
  );
};

export default CodingTestPage;
