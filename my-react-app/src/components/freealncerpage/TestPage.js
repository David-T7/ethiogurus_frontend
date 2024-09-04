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

  useEffect(() => {
    if (skillTests.theoretical && skillTests.theoretical.duration_in_minutes) {
      const durationInMinutes = skillTests.theoretical.duration_in_minutes;
      setTimeRemaining(durationInMinutes * 60);
      setIsTestReady(true);
    }
  }, [skillTests]);

  useEffect(() => {
    if (timeRemaining === null || !isTestReady) return;

    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isTestReady]);

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

  const handleSubmit = async () => {
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

      const answersData = Object.entries(selectedAnswers).map(
        ([questionId, optionData]) => ({
          submission: submission.id,
          question: questionId,
          selected_option: optionData.id,
          answer_text: optionData.text,
        })
      );

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <h2 className="text-2xl font-bold">{skillTests.theoretical.title} Theoretical Test</h2>
          <p className="mt-2 text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="mt-2 text-lg font-semibold">
            Time Remaining: {formatTime(timeRemaining)}
          </p>
        </div>
        <div className="p-6">
          {questions.length > 0 && (
            <>
              <p className="text-xl font-medium mb-4">
                {questions[currentQuestionIndex].text}
              </p>
              <ul className="space-y-4">
                {questions[currentQuestionIndex].options.map(
                  (option, index) => {
                    const selectedOptionId =
                      selectedAnswers[questions[currentQuestionIndex].id]?.id ||
                      null;
                    return (
                      <li key={index}>
                        <button
                          onClick={() =>
                            handleAnswerSelection(
                              questions[currentQuestionIndex].id,
                              option.option_text,
                              option.id
                            )
                          }
                          className={`block w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                            selectedOptionId === option.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {option.option_text}
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>
            </>
          )}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
                currentQuestionIndex === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-blue hover:bg-brand-dark-blue"
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
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors duration-300"
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
