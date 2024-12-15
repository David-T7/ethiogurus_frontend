import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const fetchClientData = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchCounterOffer = async ({ queryKey }) => {
  const [, counterOfferID, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/counter-offer/${counterOfferID}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestones = async ({ queryKey }) => {
  const [, counterOfferID, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/counter-offer/${counterOfferID}/milestones/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((milestone) => ({
    id: milestone.id,
    title: milestone.title || "",
    amount: milestone.amount || "",
    due_date: milestone.due_date ? milestone.due_date.split("T")[0] : "",
  }));
};

const CreateCounterOffer = () => {
  const { id: counterOfferID } = useParams();
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);

  const [offer, setOffer] = useState({
    title: "",
    proposed_amount: "",
    start_date: "",
    end_date: "",
    milestone_based: false,
    milestones: [],
  });
  const [rejectMilestoneOption, setRejectMilestoneOption] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ["client", token],
    queryFn: fetchClientData,
  });

  const { data: counterOffer, isLoading: counterOfferLoading } = useQuery({
    queryKey: ["counterOffer", counterOfferID, token],
    queryFn: fetchCounterOffer,
  });

  useEffect(() => {
    if (counterOffer) {
      setOffer((prevOffer) => ({
        ...prevOffer,
        title: counterOffer.title || "",
        proposed_amount: counterOffer.proposed_amount || "",
        start_date: counterOffer.start_date ? counterOffer.start_date.split("T")[0] : "",
        end_date: counterOffer.end_date ? counterOffer.end_date.split("T")[0] : "",
        milestone_based: counterOffer.milestone_based || false,
      }));
    }
  }, [counterOffer]);

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ["milestones", counterOfferID, token],
    queryFn: fetchMilestones,
    enabled: offer.milestone_based,
    onSuccess: (data) => {
      setOffer((prevOffer) => ({ ...prevOffer, milestones: data }));
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOffer((prevOffer) => ({
      ...prevOffer,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "milestone_based" && !checked ? { milestones: [] } : {}),
    }));
  };

  const handleAddMilestone = () => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestone_based:true,
      milestones: [
        ...prevOffer.milestones,
        { id: Date.now(), title: "", amount: "", due_date: "" },
      ],
    }));
  };

  const handleRemoveMilestone = (milestoneId) => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestones: prevOffer.milestones.filter((milestone) => milestone.id !== milestoneId),
    }));
    handleMilestoneBasedCheck()
  };
  
  const handleMilestoneBasedCheck = () => {
    if (milestones.length == 0){
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestone_based:false
    }));
  };
  }

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    setOffer((prevOffer) => {
      const updatedMilestones = [...prevOffer.milestones];
      updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
      return { ...prevOffer, milestones: updatedMilestones };
    });
  };

  const handleCheckboxChange = () => {
    setRejectMilestoneOption(!rejectMilestoneOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!offer.title) {
      setError("Title is required.");
      setIsSubmitting(false);
      return;
    }
    if (!offer.proposed_amount) {
      setError("Proposed Fee is required.");
      setIsSubmitting(false);
      return;
    }
    if (!offer.start_date) {
      setError("Start Date is required.");
      setIsSubmitting(false);
      return;
    }
    if (!offer.end_date) {
      setError("End Date is required.");
      setIsSubmitting(false);
      return;
    }

    if (offer.milestone_based && offer.milestones.length === 0 && !rejectMilestoneOption) {
      setError("Please add at least one milestone or reject the milestone-based option.");
      setIsSubmitting(false);
      return;
    }

    if (offer.milestone_based && !rejectMilestoneOption) {
      for (const milestone of offer.milestones) {
        if (!milestone.title || !milestone.amount || !milestone.due_date) {
          setError("Please fill out all fields for each milestone.");
          setIsSubmitting(false);
          return;
        }
      }
    }

    const counterOfferPayload = {
      title: offer.title,
      contract: counterOffer.contract,
      sender: client.id,
      proposed_amount: offer.proposed_amount,
      start_date: offer.start_date,
      end_date: offer.end_date,
      milestone_based: offer.milestone_based,
      reject_milestone_option: rejectMilestoneOption,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/counter-offer/",
        counterOfferPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (offer.milestone_based && !rejectMilestoneOption) {
        await Promise.all(
          offer.milestones.map((milestone) =>
            axios.post(
              "http://127.0.0.1:8000/api/counter-offer-milestones/",
              {
                counter_offer: response.data.id,
                title: milestone.title,
                amount: milestone.amount,
                due_date: milestone.due_date,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
          )
        );
      }

      setSuccessMessage("Counter offer submitted successfully!");
      setIsSubmitting(false);
      setError(null);
      navigate(-1);
    } catch (err) {
      setErrorMessage("Failed to submit counter offer. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (clientLoading || counterOfferLoading || milestonesLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Submit Counter Offer</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={offer.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter title for the offer"
          />
          {error && offer.title === "" && <span className="text-red-500">Title is required.</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="proposed_amount" className="block text-lg font-normal text-brand-blue mb-2">Proposed Fee (Birr)</label>
          <input
            type="number"
            id="proposed_amount"
            name="proposed_amount"
            value={offer.proposed_amount}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter proposed fee in Birr"
          />
          {error && offer.proposed_amount === "" && <span className="text-red-500">Proposed Fee is required.</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="start_date" className="block text-lg font-normal text-brand-blue mb-2">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={offer.start_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {error && offer.start_date === "" && <span className="text-red-500">Start Date is required.</span>}
        </div>
        <div className="mb-6">
          <label htmlFor="end_date" className="block text-lg font-normal text-brand-blue mb-2">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={offer.end_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {error && offer.end_date === "" && <span className="text-red-500">End Date is required.</span>}
        </div>
          <>
            {offer.milestone_based && <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rejectMilestones"
                checked={rejectMilestoneOption}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label
                htmlFor="rejectMilestones"
                className="text-lg font-normal text-brand-blue"
              >
                Reject Milestone-Based Option
              </label>
            </div>}
            {!rejectMilestoneOption && (
              <div className="mb-6">
                <h3 className="text-lg font-normal text-brand-blue mb-4">
                  Milestones
                </h3>
                {offer.milestones.length > 0 ? (
                  offer.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="mb-4 border-t border-gray-300 pt-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <label
                        htmlFor={`milestoneTitle-${milestone.id}`}
                        className="block text-md font-normal text-brand-blue mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id={`milestoneTitle-${milestone.id}`}
                        name="title"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter milestone title"
                        required
                      />
                      <label
                        htmlFor={`milestoneAmount-${milestone.id}`}
                        className="block text-md font-normal text-brand-blue mt-4 mb-1"
                      >
                        Amount (Birr)
                      </label>
                      <input
                        type="number"
                        id={`milestoneAmount-${milestone.id}`}
                        name="amount"
                        value={milestone.amount}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter milestone amount"
                        required
                      />
                      <label
                        htmlFor={`milestoneDueDate-${milestone.id}`}
                        className="block text-md font-normal text-brand-blue mt-4 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id={`milestoneDueDate-${milestone.id}`}
                        name="due_date"
                        value={milestone.due_date}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 mb-2">No milestones added yet.</p>
                )}
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
                >
                  <FaPlus className="mr-2" /> Add Milestone
                </button>
              </div>
            )}
          </>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      </form>
    </div>
  );
};

export default CreateCounterOffer;
