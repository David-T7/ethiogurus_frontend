import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const InterviewPage = () => {
  const { id } = useParams(); // Get interview ID from URL
  const [interview, setInterview] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem("access");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [passed, setPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        // Fetch interview data
        const interviewResponse = await axios.get(
          `http://127.0.0.1:8000/api/interviews/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const interviewData = interviewResponse.data;
        setInterview(interviewData);
        setPassed(interviewData.passed)
        setFeedback(interviewData.feedback)

        // Fetch freelancer data
        const freelancerResponse = await axios.get(
          `http://127.0.0.1:8000/api/user/freelancer/${interviewData.freelancer}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancer(freelancerResponse.data);

        // Fetch appointment data
        const appointmentResponse = await axios.get(
          `http://127.0.0.1:8000/api/appointments/${interviewData.appointment}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(appointmentResponse.data);

        setLoading(false); // Data fetched successfully
      } catch (err) {
        setError(
          err.response
            ? err.response.data.detail
            : "Failed to fetch interview details"
        );
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id, token]);

  // Handle form submission for feedback and status update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        feedback,
        passed,
        done: true,
      };

      // Update interview data
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/interviews/${id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const verificationPayload = {
        freelancer_id : freelancer.id,
        category : appointment.category,
        skills_passed : appointment.skills_passed
      };

      if(response.data.passed){
      await axios.post(
        `http://127.0.0.1:8000/api/user/verify-skills/`,
        verificationPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

    await axios.patch(
        `http://127.0.0.1:8000/api/appointments/${appointment.id}/done/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
      // Update local state with the new interview data
      setInterview(response.data);
      setPassed(response.data.passed)
      setFeedback(response.data.feedback)
      setIsModalOpen(false);
      setSubmitting(false);
    } catch (err) {
      setSubmissionError(
        err.response
          ? err.response.data.detail
          : "Failed to submit interview results"
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading interview details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!interview || !freelancer || !appointment) {
    return (
      <div className="text-center py-8 text-gray-500">
        Interview details are unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      {/* Interview Details */}
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">
        Interview Details
      </h1>

      {/* Category */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-normal text-brand-dark-blue">Category</h1>
      </div>

      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          {appointment.category}
        </h1>
      </div>

      {/* Freelancer */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-normal text-brand-dark-blue">Freelancer</h1>
      </div>

      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          {freelancer.full_name}
        </h1>
      </div>

      <div className="flex items-center mb-2">
        <h1 className="text-xl font-normal text-brand-dark-blue">Skills Passed</h1>
      </div>
      <div className="flex items-center mb-2">
      <h1 className="text-xl font-thin text-brand-dark-blue">
          {appointment.skills_passed}
      </h1>
      </div>

      {/* Appointment Date */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-normal text-brand-dark-blue">
          Appointment Date
        </h1>
      </div>

      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          {new Date(appointment.appointment_date).toLocaleString()}
        </h1>
      </div>

      {/* Feedback (if done) */}
      {interview.done && (
        <>
          <div className="flex items-center mb-2">
            <h1 className="text-xl font-normal text-brand-dark-blue">
              Feedback
            </h1>
          </div>

          <div className="flex items-center mb-2">
            <h1 className="text-xl font-thin text-brand-dark-blue">
              {interview.feedback || "No feedback provided."}
            </h1>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex items-center mb-2 mt-4">
        {!interview.done ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Submit Result
          </button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Update Result
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-normal text-brand-blue mb-4">
              {interview.done ? "Update Interview Result" : "Submit Interview Result"}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Feedback Field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="feedback">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="4"
                ></textarea>
              </div>

              {/* Interview Status */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="passed">
                  Interview Status
                </label>
                <select
                  id="passed"
                  value={passed ? "passed" : "not_passed"}
                  onChange={(e) => setPassed(e.target.value === "passed")}
                  required
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="passed">Passed</option>
                  <option value="not_passed">Not Passed</option>
                </select>
              </div>

              {/* Submission Error */}
              {submissionError && (
                <div className="text-red-500 mb-4">{submissionError}</div>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg ${
                    submitting
                      ? "bg-blue-300 text-blue-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {submitting
                    ? "Submitting..."
                    : interview.done
                    ? "Update Result"
                    : "Submit Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
