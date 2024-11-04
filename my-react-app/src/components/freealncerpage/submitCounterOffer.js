// src/components/SubmitCounterOffer.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

const SubmitCounterOffer = () => {
  const { id: contractId } = useParams(); // Contract ID from URL
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [offer, setOffer] = useState({
    title: "",
    proposed_amount: "",
    start_date: "",
    end_date: "",
    milestone_based: false,
    milestones: [], // All milestones are managed here
  });
  const [rejectMilestoneOption, setRejectMilestoneOption] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancer(response.data);
      } catch (err) {
        console.error("Error fetching freelancer data:", err);
        setError("Failed to load freelancer details.");
      }
    };
    fetchFreelancer();
  }, [token]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/freelancer-contracts/${contractId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setContract(response.data);

        setOffer((prevOffer) => ({
          ...prevOffer,
          title: response.data.title || "",
          proposed_amount: response.data.amount_agreed || "",
          start_date: response.data.start_date
            ? response.data.start_date.split("T")[0]
            : "",
          end_date: response.data.end_date
            ? response.data.end_date.split("T")[0]
            : "",
          milestone_based: response.data.milestone_based || false,
        }));
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Failed to load contract details.");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [contractId]);


  useEffect(() => {
    const fetchMileStone = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contract.contract_update ? contract.contract_update :contractId}/milestones/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOffer((prevOffer) => ({
          ...prevOffer, milestones: response.data
          ? response.data.map((milestone) => ({
              id: milestone.id, // Existing milestone ID
              title: milestone.title || "",
              amount: milestone.amount || "",
              due_date: milestone.due_date
                ? milestone.due_date.split("T")[0]
                : "",
            }))
          : [],}))
      } catch (error) {
        console.log("error fetching milestones", error);
      }
    };
    fetchMileStone();
  }, [contract]);




  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOffer((prevOffer) => ({
      ...prevOffer,
      [name]: type === "checkbox" ? checked : value,
      // If milestone_based is unchecked, clear milestones
      ...(name === "milestone_based" && !checked ? { milestones: [] } : {}),
    }));
  };

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    setOffer((prevOffer) => {
      const updatedMilestones = [...prevOffer.milestones];
      updatedMilestones[index] = {
        ...updatedMilestones[index],
        [name]: value,
      };
      return { ...prevOffer, milestones: updatedMilestones };
    });
  };

  const handleAddMilestone = () => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestones: [
        ...prevOffer.milestones,
        { id: Date.now(), title: "", amount: "", due_date: "" },
      ],
    }));
  };

  const handleRemoveMilestone = (milestoneId) => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestones: prevOffer.milestones.filter(
        (milestone) => milestone.id !== milestoneId
      ),
    }));
  };

  const handleCheckboxChange = () => {
    setRejectMilestoneOption(!rejectMilestoneOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!offer.title || !offer.proposed_amount || !offer.start_date || !offer.end_date) {
      setError("Please fill out all required fields.");
      return;
    }

    if (offer.milestone_based && offer.milestones.length === 0 && !rejectMilestoneOption) {
      setError("Please add at least one milestone or reject the milestone-based option.");
      return;
    }

    // If milestone_based and not rejecting, ensure all milestones have required fields
    if (offer.milestone_based && !rejectMilestoneOption) {
      for (let i = 0; i < offer.milestones.length; i++) {
        const milestone = offer.milestones[i];
        if (!milestone.title || !milestone.amount || !milestone.due_date) {
          setError("Please fill out all fields for each milestone.");
          return;
        }
      }
    }

    // Prepare the payload for the counter offer
    const counterOfferPayload = {
      title: offer.title,
      contract:contract.contract_update ? contract.contract_update :contractId,
      sender: freelancer.id,
      proposed_amount: offer.proposed_amount,
      start_date: offer.start_date,
      end_date: offer.end_date,
      milestone_based: offer.milestone_based,
      reject_milestone_option: rejectMilestoneOption,
    };

    try {
      // Submit the counter offer
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

      console.log("Counter offer submitted:", response.data);


      await axios.patch(
        `http://127.0.0.1:8000/api/freelancer-contracts-update/${response.data.contract}/`,
        {
          freelancer_accepted_terms:"true"
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );



      // If milestone-based and not rejecting, submit milestones
      if (offer.milestone_based && !rejectMilestoneOption) {
        await Promise.all(
          offer.milestones.map((milestone) =>
            axios.post(
              "http://127.0.0.1:8000/api/counter-offer-milestones/",
              {
                counter_offer: response.data.id, // Link to the newly created counter offer
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

      // Navigate to the contract details page or another appropriate route
      navigate(-1);
    } catch (err) {
      console.error("Error submitting counter offer:", err);
      setError("Failed to submit counter offer. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading contract details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!contract) {
    return <div className="text-center py-8">No contract data available.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">
        Submit Counter Offer
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Offer Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-normal text-brand-blue mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={offer.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter title for the offer"
            required
          />
        </div>

        {/* Proposed Fee */}
        <div className="mb-4">
          <label
            htmlFor="proposed_amount"
            className="block text-lg font-normal text-brand-blue mb-2"
          >
            Proposed Fee (Birr)
          </label>
          <input
            type="number"
            id="proposed_amount"
            name="proposed_amount"
            value={offer.proposed_amount}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter proposed fee in Birr"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label
            htmlFor="start_date"
            className="block text-lg font-normal text-brand-blue mb-2"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={offer.start_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-6">
          <label
            htmlFor="end_date"
            className="block text-lg font-normal text-brand-blue mb-2"
          >
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={offer.end_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Reject Milestone-Based Option */}
        {offer.milestone_based && (
          <>
            <div className="mb-6 flex items-center">
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
            </div>
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
                      {/* Remove Milestone Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        title="Remove Milestone"
                      >
                        <FaTrash />
                      </button>

                      {/* Milestone Title */}
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

                      {/* Milestone Amount */}
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
                        min="0"
                        step="0.01"
                      />

                      {/* Milestone Due Date */}
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
                  <p className="text-gray-600 mb-2">
                    No milestones added yet.
                  </p>
                )}

                {/* Add Milestone Button */}
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
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Counter Offer
        </button>
      </form>
    </div>
  );
};

// Helper function to get offer status styling (if needed elsewhere)
const getOfferStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-black";
    case "rejected":
      return "bg-red-500 text-white";
    case "canceled":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

export default SubmitCounterOffer;
