import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CounterOffer = () => {
  const { id } = useParams(); // Extract the counter offer ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access"); // Get the access token from localStorage
  const [counterOffer, setCounterOffer] = useState([]);
  const [client, setClientData] = useState(null);
  //   const [contract , setContract] = useState(null)
  const [milestones, setMIlestones] = useState([]);
  const [contractMilestones, setContractMIlestones] = useState([]);
  useEffect(() => {
    // Fetch contract details using axios
    const fetchCounterOffer = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/counter-offer/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        setCounterOffer(response.data); // Set the fetched contract data
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCounterOffer();
  }, [id]);

  //   useEffect(() => {
  //     const fetchContracts = async () => {
  //       try {
  //         const response = await axios.get(`http://127.0.0.1:8000/api/freelancer-contracts/${counterOffer.contract}/`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Include the token in the headers
  //           },
  //         });

  //         setContract(response.data); // Only set non-draft contracts
  //       } catch (error) {
  //         console.error('Failed to fetch contract:', error);
  //         setError(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchContracts();
  //   }, [counterOffer]);

  useEffect(() => {
    // Fetch contract details using axios
    const fetchOfferMilestones = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/counter-offer/${id}/milestones/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        setMIlestones(response.data); // Set the fetched contract data
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    if (counterOffer.milestone_based) {
      fetchOfferMilestones();
    }
  }, [counterOffer]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/client/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClientData(response.data);
      } catch (error) {
        console.log("error occured", error);
      }
    };
    fetchClientData();
  }, []);

  const syncContractMilestones = async (contract_id, contractMilestones) => {
    try {
      // Compare current milestones with contractMilestones

      // 1. Milestones to add (those in `milestones` but not in `contractMilestones`)
      const milestonesToAdd = milestones.filter(
        (milestone) =>
          !contractMilestones.some(
            (contractMilestone) => contractMilestone.id === milestone.id
          )
      );

      // 2. Milestones to remove (those in `contractMilestones` but not in `milestones`)
      const milestonesToRemove = contractMilestones.filter(
        (contractMilestone) =>
          !milestones.some((milestone) => milestone.id === contractMilestone.id)
      );

      // 3. Milestones to update (those in both but have changes)
      const milestonesToUpdate = milestones.filter((milestone) =>
        contractMilestones.some(
          (contractMilestone) =>
            contractMilestone.id === milestone.id &&
            (contractMilestone.title !== milestone.title ||
              contractMilestone.due_date !== milestone.due_date ||
              contractMilestone.amount !== milestone.amount)
        )
      );

      // Send API calls to sync the changes with the backend

      // 1. Add new milestones
      for (const milestone of milestonesToAdd) {
        const updatedMilestone = {
          ...milestone, // Copy existing milestone properties
          contract: contract_id, // Append contract_id
        };
        await axios.post(
          `http://127.0.0.1:8000/api/milestones/`,
          updatedMilestone,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      // 2. Update existing milestones
      for (const milestone of milestonesToUpdate) {
        await axios.patch(
          `http://127.0.0.1:8000/api/milestones/${milestone.id}/`,
          milestone,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // 3. Remove milestones
      for (const milestone of milestonesToRemove) {
        await axios.delete(
          `http://127.0.0.1:8000/api/milestones/${milestone.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error syncing milestones:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        {
          status: "accepted",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const milestonesResponse = await axios.get(
        `http://127.0.0.1:8000/api/contracts/${counterOffer.contract}/milestones/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      syncContractMilestones(counterOffer.contract, milestonesResponse.data);
      // Prepare the contract payload and filter out null or empty values
      const contractPayload = {
        title: counterOffer.title,
        start_date: counterOffer.start_date,
        end_date: counterOffer.end_date,
        amount_agreed: counterOffer.proposed_amount,
        status: "accepted",
        milestone_based: counterOffer.milestone_based,
      };

      // Filter contractPayload to only include non-null and non-empty values
      const filteredContractPayload = Object.fromEntries(
        Object.entries(contractPayload).filter(
          ([key, value]) =>
            value !== null && value !== "" && value !== undefined
        )
      );
      console.log("filtered contract payload:", filteredContractPayload);

      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${counterOffer.contract}/`,
        filteredContractPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/contract-counter-offer/${id}`);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err);
      setError(
        err.response && err.response.data.detail
          ? err.response.data.detail
          : "Failed to accept the counter offer"
      );
    }
  };

  const handleUpdateOfferStatus = async (status) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCounterOffer(response.data);
    } catch (err) {
      console.error("Error updating counter offer status:", err);
      setError("Failed to update counter offer status.");
    }
  };

  const handleCounterOffer = () => {
    navigate(`/create-counter-offer/${id}`);
  };
  const handleUpdateOffer = (id) => {
    navigate(`/edit-offer/${id}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading contract details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!counterOffer) {
    return <div className="text-center py-8">No contract found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-thin text-brand-dark-blue">
          {counterOffer.title}
        </h1>
        <span
          className={`ml-3 text-lg font-medium ${getContractStatusStyle(
            counterOffer.status
          )}`}
        >
          ({counterOffer.status})
        </span>
      </div>
      <p className="mb-2">
        Start Date: {new Date(counterOffer.start_date).toLocaleDateString()}
      </p>
      <p className="mb-2">
        End Date: {new Date(counterOffer.end_date).toLocaleDateString()}
      </p>
      <p className="mb-2">Proposed Amount: {counterOffer.proposed_amount}</p>
      <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">
        Milestones
      </h3>
      <div className="border-t border-gray-200">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`py-4 ${
                index < milestones.length - 1 ? "border-b border-gray-300" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-normal text-brand-dark-blue">
                  {milestone.title}
                </h4>
              </div>
              <p className="text-gray-600 mb-1">
                Due: {new Date(milestone.due_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Amount: {milestone.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-2">
            No milestones found for this Offer.
          </p>
        )}
      </div>
      {counterOffer.status === "pending" && (
        <div className="flex space-x-4">
          {counterOffer.sender !== client?.id && (
            <>
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={handleCounterOffer}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Counter Offer
              </button>
            </>
          )}

          {counterOffer.sender === client?.id &&
            counterOffer.status === "pending" && (
              <>
                <button
                  onClick={() => handleUpdateOffer(counterOffer.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Update Offer
                </button>

                <button
                  onClick={() => handleUpdateOfferStatus("canceled")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Cancel Offer
                </button>
              </>
            )}
        </div>
      )}
      {counterOffer.status === "canceled" &&
        counterOffer.sender == client?.id && (
          <button
            onClick={() => handleUpdateOfferStatus("pending")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Activate Offer
          </button>
        )}

      {counterOffer.status === "accepted" &&
        counterOffer.sender == client?.id && (
          <>
          <h4 className="text-md font-normal text-brand-dark-blue">
          Your counter offer has been accepted
        </h4>
          <button
            onClick={() => handleAccept()}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Approve Offer
          </button>
          </>
        )}
    </div>
  );
};

// Helper function to get counter offer status styling
const getContractStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "text-blue-600";
    case "accepted":
      return "text-green-600";
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};
export default CounterOffer;
