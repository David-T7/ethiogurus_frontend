// src/components/EditCounterOffer.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const EditCounterOffer = () => {
  const { id } = useParams(); // Counter Offer ID from URL
  const navigate = useNavigate();
  const [counterOffer, setCounterOffer] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [newMilestones, setNewMilestones] = useState([]);
  const [removedMilestones, setRemovedMilestones] = useState([]);
  const [addMilestone, setAddMiletsone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false); // Flag to toggle edit mode
  const [rejectMilestoneOption, setRejectMilestoneOption] = useState(false);
  const [offer, setOffer] = useState({
    proposed_amount: "",
    milestone_based: false,
    title: "",
    startDate: "",
    endDate: "",
  });

  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  useEffect(() => {
    const fetchCounterOffer = async () => {
      try {
        // Fetch Counter Offer Details
        const response = await axios.get(
          `http://127.0.0.1:8000/api/counter-offer/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounterOffer(response.data);
        setOffer({
          proposed_amount: response.data.proposed_amount || "",
          milestone_based: response.data.milestone_based || false,
          title: response.data.title || "",
          startDate: response.data.start_date || "",
          endDate: response.data.end_date || "",
        });

        // If milestone-based, fetch milestones
        if (response.data.milestone_based) {
          const milestonesResponse = await axios.get(
            `http://127.0.0.1:8000/api/counter-offer/${id}/milestones/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMilestones(milestonesResponse.data);
        } else {
          setMilestones([]);
        }
      } catch (err) {
        console.error("Error fetching counter offer:", err);
        setError(
          err.response?.data?.detail || "Failed to load counter offer details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCounterOffer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer((prevOffer) => ({
      ...prevOffer,
      [name]: value,
    }));
  };

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...milestones[index],
      [name]: value,
    };
    setMilestones(updatedMilestones);
  };

  const handleAddMilestone = () => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestones: [
        ...prevOffer.milestones,
        { id: Date.now(), title: "", newAmount: "", newDueDate: "" },
      ],
    }));
  };

  const handleNewMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNewMilestones = [...newMilestones];
    updatedNewMilestones[index] = {
      ...updatedNewMilestones[index],
      [name]: value,
    };
    setNewMilestones(updatedNewMilestones);
  };

  const handleRemoveMilestone = (id, index) => {
    setRemovedMilestones((prevRemoved) => [...prevRemoved, id]);
    setMilestones((prevMilestones) =>
      prevMilestones.filter((_, i) => i !== index)
    );
  };

  const handleAddMilestoneToState = () => {
    setNewMilestones([
      ...newMilestones,
      { title: "", amount: "", due_date: "" },
    ]);
    setAddMiletsone(true);
  };

  const handleRemoveNewMilestone = (index) => {
    setNewMilestones((prevNewMilestones) =>
      prevNewMilestones.filter((_, i) => i !== index)
    );
  };
  const handleCheckboxChange = () => {
    setRejectMilestoneOption(!rejectMilestoneOption);
  };

  const handleUpdate = async () => {
    try {
      // If milestone-based, ensure all milestones are filled
      if (offer.milestone_based) {
        for (let i = 0; i < milestones.length; i++) {
          const milestone = milestones[i];
          if (!milestone.title || !milestone.amount || !milestone.due_date) {
            setError("Please fill out all fields for each milestone.");
            return;
          }
        }
      }

      // Prepare payload
      const payload = {
        proposed_amount: offer.proposed_amount,
        milestone_based: offer.milestone_based,
        title: offer.title,
        start_date: offer.startDate,
        end_date: offer.endDate,
      };

      // Update Counter Offer
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (milestones.length > 0) {
        for (const milestone of milestones) {
          const milestonePayload = {
            counter_offer: response.data.id, // Link to the newly created counter offer
            title: milestone.title,
            description: milestone.description || "", // Assuming you have a description field
            amount: milestone.amount,
            due_date: milestone.due_date,
          };
          console.log("milestone payload", milestonePayload);

          try {
            const milestoneResponse = await axios.patch(
              `http://127.0.0.1:8000/api/counter-offer-milestones/${milestone.id}/`,
              milestonePayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Milestone submitted:", milestoneResponse.data);
          } catch (err) {
            console.error("Failed to submit milestone:", milestone.title, err);
          }
        }
      }

      // Add new milestones
      await Promise.all(
        newMilestones.map((milestone) =>
          axios.post(
            `http://127.0.0.1:8000/api/counter-offer-milestones/`,
            {
              counter_offer: response.data.id,
              title: milestone.title,
              amount: milestone.amount,
              description: milestone.description || "",
              due_date: milestone.due_date,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      // Remove old milestones
      await Promise.all(
        removedMilestones.map((milestone_id) =>
          axios.delete(
            `http://127.0.0.1:8000/api/counter-offer-milestones/${milestone_id}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setEditing(false);
      setError(null);
      navigate(`/counter-offer/${counterOffer.id}`); // Navigate to the counter offer page page
    } catch (err) {
      console.error("Error updating counter offer:", err);
      setError(err.response?.data?.detail || "Failed to update counter offer.");
    }
  };

  const handleCancelUpdate = () => {
    navigate(`/counter-offer/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading counter offer details...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!counterOffer) {
    return <div className="text-center py-8">No counter offer found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">
        Edit Offer
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Title</h2>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter offer title"
          value={offer?.title}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">
          {" "}
          Proposed Amount (Birr)
        </h2>
        <input
          type="number"
          id="proposed_amount"
          name="proposed_amount"
          value={offer?.proposed_amount}
          onChange={handleInputChange}
          placeholder="Enter proposed amount"
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4"> Start Date</h2>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={offer?.startDate.split("T")[0]}
          onChange={handleInputChange}
          placeholder="Enter start date"
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4"> End Date</h2>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={offer?.endDate.split("T")[0]}
          onChange={handleInputChange}
          placeholder="Enter end date"
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      {/* Milestones Section */}
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
              {milestones.length > 0 ? (
                milestones.map((milestone, index) => {
                  return (
                    <div
                      key={milestone.id}
                      className="mb-4 border-t border-gray-300 pt-4 relative"
                    >
                      {/* Remove Milestone Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMilestone(milestone.id, index)
                        }
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
                        min="0"
                        step="0.01"
                      />
                      {/* Proposed Fee */}
                      <label
                        htmlFor={`milestoneAmount-${milestone.id}`}
                        className="block text-md font-normal text-brand-blue mb-1"
                      >
                        Amount ( Birr )
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
                      {/* Proposed Due Date */}
                      <label
                        htmlFor={`milestoneDueDate-${milestone.id}`}
                        className="block text-md font-normal text-brand-blue mb-1 mt-2"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id={`milestoneDueDate-${milestone.id}`}
                        name="due_date"
                        value={milestone.due_date.split("T")[0]}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  );
                })
              ) : (
                <h3 className="text-lg font-normal text-brand-blue mb-4">
                  No Milestones Found
                </h3>
              )}
              <button
                type="button"
                onClick={() => handleAddMilestoneToState()}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-2" /> Add Milestone
              </button>
            </div>
          )}
        </>
      )}

      {/* If there are no milestones, provide an option to add them */}
      {addMilestone && (
        <div className="mb-6">
          <h3 className="text-lg font-normal text-brand-blue mb-4">
            Add Milestones
          </h3>
          {newMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="mb-4 border-t border-gray-300 pt-4 relative"
            >
              {/* Remove Milestone Button */}
              <button
                type="button"
                onClick={() => handleRemoveNewMilestone(index)}
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
                Milestone Title
              </label>
              <input
                type="text"
                id={`milestoneTitle-${milestone.id}`}
                name="title"
                value={milestone.title}
                onChange={(e) => handleNewMilestoneChange(index, e)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter milestone title"
                required
              />
              {/* Proposed Fee */}
              <label
                htmlFor={`milestoneAmount-${milestone.id}`}
                className="block text-md font-normal text-brand-blue mt-4 mb-1"
              >
                Proposed Fee
              </label>
              <input
                type="number"
                id={`milestoneAmount-${milestone.id}`}
                name="amount"
                value={milestone.amount}
                onChange={(e) => handleNewMilestoneChange(index, e)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter proposed fee"
                min="0"
                step="0.01"
                required
              />
              {/* Proposed Due Date */}
              <label
                htmlFor={`milestoneDueDate-${milestone.id}`}
                className="block text-md font-normal text-brand-blue mt-4 mb-1"
              >
                Proposed Due Date
              </label>
              <input
                type="date"
                id={`milestoneDueDate-${milestone.id}`}
                name="due_date"
                value={milestone.due_date}
                onChange={(e) => handleNewMilestoneChange(index, e)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="submit"
          onClick={() => handleUpdate()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Offer
        </button>
        <button
          type="button"
          onClick={() => handleCancelUpdate()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Helper function to get offer status styling
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

export default EditCounterOffer;
