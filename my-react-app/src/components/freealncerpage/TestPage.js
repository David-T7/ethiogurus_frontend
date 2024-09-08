import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SkillTestContext } from "../SkillTestContext"; // Adjust the path if needed

const TestPage = () => {
  const { skillTests, loading, error } = useContext(SkillTestContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTestReady, setIsTestReady] = useState(false);
  const [freelancerId, setFreelancerId] = useState(null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Assuming testId is passed in the URL
  const token = localStorage.getItem("access");
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8001/api/tests/${id}/questions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("questions response data is", response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  useEffect(() => {
    const fetchFreelancerId = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFreelancerId(response.data.id);
      } catch (error) {
        console.error("Error fetching freelancer ID:", error);
      }
    };

    fetchFreelancerId();
  }, []);

  // Initialize question timer based on duration_in_seconds
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      setQuestionTimeRemaining(currentQuestion.duration_in_seconds);
      setIsTestReady(true);
    }
  }, [questions, currentQuestionIndex]);

  // Question timer effect
  useEffect(() => {
    if (questionTimeRemaining === null || !isTestReady) return;

    if (questionTimeRemaining <= 0) {
      // Auto-submit the answer and move to the next question
      handleSubmitCurrentQuestion();
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimeRemaining, isTestReady]);

  const handleSubmitCurrentQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id] || {
      id: "not given",
      text: "not given", // Default to empty string if no option is selected
    };
  
    setSelectedAnswers((prevAnswers) => {
      const updatedAnswers = {
        ...prevAnswers,
        [currentQuestion.id]: {
          id: selectedAnswer.id,
          text: selectedAnswer.text,
        },
      };
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Ensure the state update has completed before final submission
        handleSubmit(updatedAnswers);
      }
  
      return updatedAnswers;
    });
  };

  const handleAnswerSelection = (questionId, optionText, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: {
        id: optionId,
        text: optionText,
      },
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

  const handleSubmit = async (finalAnswers = selectedAnswers) => {
    try {
      const token = localStorage.getItem("access");

      // Create a submission first
      const submissionResponse = await axios.post(
        "http://127.0.0.1:8001/api/skilltestsubmissions/",
        {
          freelancer_id: freelancerId,
          test: id,
          start_time: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const submission = submissionResponse.data;

      const answersData = Object.entries(finalAnswers).map(
        ([questionId, optionData]) => ({
          submission: submission.id,
          question: questionId,
          selected_option: optionData.id,
          answer_text: optionData.text,
        })
      );
      console.log("final answers are ",answersData)

      // Send the answers to the new endpoint
      const answersResponse = await axios.post(
        "http://127.0.0.1:8001/api/bulk-answers/",
        {
          answers: answersData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (answersResponse.status !== 201) {
        throw new Error("Failed to submit answers");
      }

      const finalSubmission = await axios.patch(
        `http://127.0.0.1:8001/api/skilltestsubmissions/${submission.id}/`,
        {
          freelancer_id: freelancerId,
          test: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("final submission is ",finalSubmission.data)
      const passed =finalSubmission.data.submission.passed
      if (passed) {
        await updateFreelancerSkills(skillTests.theoretical.title);
      }

      // Navigate to the result page
      navigate("/test-result", {
        state: {
          questions,
          selectedAnswers,
          correctAnswers: questions.reduce((acc, question) => {
            const correctOption = question.options.find(
              (option) => option.is_correct
            );
            acc[question.id] = correctOption ? correctOption.option_text : null;
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const updateFreelancerSkills = async (skillType) => {
    console.log("skill type is",skillType)
    try {
      const freelancerResponse = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/manage/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const currentSkills = freelancerResponse.data.skills || {};

      // Update the skills JSON field
      const updatedSkills = {
        ...currentSkills,
        ["theoritical"]: Array.isArray(currentSkills["theoritical"])
          ? [...currentSkills["theoritical"], skillType]
          : [skillType],
      };

      await axios.patch(`http://127.0.0.1:8000/api/user/freelancer/manage/`, {
        skills: updatedSkills,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Freelancer skills updated successfully');
    } catch (error) {
      console.error('Failed to update freelancer skills', error);
    }
  };

  if (!isTestReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading your test, please wait...
          </p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <h2 className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-sm text-gray-200">
            Time remaining: {formatTime(questionTimeRemaining)}
          </p>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-700">
            {questions[currentQuestionIndex].text}
          </p>
          <ul className="mt-4">
            {questions[currentQuestionIndex].options.map((option) => (
              <li key={option.id} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name={`answer-${questions[currentQuestionIndex].id}`}
                    value={option.id}
                    required
                    checked={
                      selectedAnswers[questions[currentQuestionIndex].id]?.id ===
                      option.id
                    }
                    onChange={() =>
                      handleAnswerSelection(
                        questions[currentQuestionIndex].id,
                        option.option_text,
                        option.id
                      )
                    }
                  />
                  <span className="ml-2 text-gray-700">
                    {option.option_text}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-gray-100">
          <button
            onClick={handleSubmitCurrentQuestion}
            className="px-4 py-2 text-white bg-brand-blue rounded hover:bg-brand-dark-blue"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Submit Test"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
