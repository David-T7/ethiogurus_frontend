import React, { useEffect, useState } from "react";
import { useParams, Link , useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchInterviewDetails = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const interviewResponse = await axios.get(
    `http://127.0.0.1:8000/api/interviews/${id}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const interview = interviewResponse.data;

  const freelancerResponse = await axios.get(
    `http://127.0.0.1:8000/api/user/freelancer/${interview.freelancer}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const appointmentResponse = await axios.get(
    `http://127.0.0.1:8000/api/appointments/${interview.appointment}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    interview,
    freelancer: freelancerResponse.data,
    appointment: appointmentResponse.data,
  };
};

const submitInterviewResult = async ({
  id,
  token,
  interviewPayload,
  assessmentPayload,
  appointmentId,
  freelancerId
}) => {
  // Update interview
  const interviewResponse = await axios.patch(
    `http://127.0.0.1:8000/api/interviews/${id}/`,
    interviewPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Update assessment status
  await axios.patch(
    `http://127.0.0.1:8000/api/full-assessment/${freelancerId}/update/`,
    assessmentPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Mark the appointment as done
  await axios.patch(
    `http://127.0.0.1:8000/api/appointments/${appointmentId}/done/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return interviewResponse.data;
};

const InterviewPage = () => {
  const { id } = useParams(); // Get interview ID from URL
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [passed, setPassed] = useState(false);
  const [onHoldDuration, setOnHoldDuration] = useState(""); // Duration state
  // Fetch interview details
  const { data, isLoading, error } = useQuery({
    queryKey: ["interviewDetails", { id, token }],
    queryFn: fetchInterviewDetails,
  });

  useEffect(() => {
    if (data && data.interview) {
      setPassed(data.interview.passed || false);
      setFeedback(data.interview.feedback || "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: submitInterviewResult,
    onSuccess: () => {
      queryClient.invalidateQueries(["interviewDetails", { id, token }]);
      setIsModalOpen(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const interviewPayload = {
      feedback,
      passed,
      done: true,
    };

    const fieldToUpdate = `${data.appointment.interview_type}_status`;

    const assessmentPayload = passed
      ? { [fieldToUpdate]: "passed" }
      : {
          [fieldToUpdate]: "on_hold",
          on_hold: true,
          on_hold_duration: onHoldDuration,
        };
    if(passed && fieldToUpdate === "soft_skills_assessment_status"){
      assessmentPayload.depth_skill_assessment_status = "pending";
    }
    else if (passed && fieldToUpdate === "live_assessment_status"){
      assessmentPayload.status = "passed"
      assessmentPayload.finished = true
    }
    mutation.mutate({
      id,
      token,
      interviewPayload,
      assessmentPayload,
      appointmentId: data.appointment.id,
      freelancerId:data.freelancer.id
    });
    navigate("/interviews")
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading interview details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error.response ? error.response.data.detail : "Failed to fetch data"}
      </div>
    );
  }

  const { interview, freelancer, appointment } = data;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      {/* Interview Details */}
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">
        Interview Details
      </h1>

      {/* Category */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          <span className="font-normal">Category:</span>{" "}
          <span className="text-black">{appointment.category || appointment.interview_type}</span>
        </h1>
      </div>

      {/* Freelancer */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          <span className="font-normal">Freelancer:</span> <span className="text-black">{freelancer.full_name}</span>
        </h1>
      </div>

      {appointment.interview_type !== "soft_skills_assessment" && appointment.skills_passed.lenght > 0 && (
        <div className="flex items-center mb-2">
          <h1 className="text-xl font-thin text-brand-dark-blue">
            <span className="font-normal">Skills Passed:</span>{" "}
            <span className="text-black">{appointment.skills_passed}</span>
          </h1>
        </div>
      )}

      {/* Appointment Date */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          <span className="font-normal">Selected Date:</span>{" "}
          <span className="text-black">{new Date(appointment.appointment_date).toLocaleString()}</span>
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
            <h1 className="text-xl font-thin text-black">
              {interview.feedback || "No feedback provided."}
            </h1>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex items-center mb-2 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {interview.done ? "Update Result" : "Submit Result"}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-thin text-brand-dark-blue mb-4">
              {interview.done ? "Update Interview Result" : "Submit Interview Result"}
            </h2>
            <form onSubmit={handleSubmit}>
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
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={passed}
                    onChange={() => setPassed(!passed)}
                    className="mr-2"
                  />
                  Passed
                </label>
              </div>
              {!passed && (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="onHoldDuration"
                  >
                    Duration on Hold (in days)
                  </label>
                  <input
                    type="number"
                    id="onHoldDuration"
                    value={onHoldDuration}
                    onChange={(e) => setOnHoldDuration(e.target.value)}
                    required
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-500 w-[50%] text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
