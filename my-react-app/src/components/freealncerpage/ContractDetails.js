import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ContractDetails = () => {
  const { id } = useParams(); // Extract the contract ID from the URL
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access"); // Get the access token from localStorage
  const [counterOffers, setCounterOffers] = useState([]);
  const [milestones , setMIlestones]= useState([])
  useEffect(() => {
    // Fetch contract details using axios
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/freelancer-contracts/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          }
        );

        setContract(response.data); // Set the fetched contract data
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchContract();
  }, [id]);


  useEffect(() => {
    // Fetch contract details using axios
    const fetchContractMilestones = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contract/${id}/milestones/`,
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
    if(contract?.milestone_based){
    fetchContractMilestones();
    }
  }, [contract]);

  useEffect(() => {
    const fetchCounterOffers = async () => {
      try {
        const token = localStorage.getItem("access"); // Get access token
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${id}/counter-offers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounterOffers(response.data); // Set counter offers related to the contract
      } catch (error) {
        console.error("Failed to fetch counter offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounterOffers();
  }, [contract]);

  const handleAccept = async () => {
    // Handle contract acceptance (POST request using axios)
    try {
      await axios.post(`/api/freelancer-contracts/${id}/accept/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      navigate("/freelancer-contracts"); // Navigate back to the contracts list after acceptance
    } catch (err) {
      setError(
        err.response
          ? err.response.data.detail
          : "Failed to accept the contract"
      );
    }
  };

  const handleCounterOffer = () => {
    navigate(`/submit-counter-offer/${id}`);
  };
  const handleCheckCounterOffers = () => {
    navigate(`/counter-offers/${id}`,
      {
        state:{
          counterOffers:counterOffers
        }
      }
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading contract details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!contract) {
    return <div className="text-center py-8">No contract found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-thin text-brand-dark-blue">
          {contract.title}
        </h1>
        <span
          className={`ml-3 text-lg font-medium ${getContractStatusStyle(
            contract.status
          )}`}
        >
          ({contract.status})
        </span>
      </div>
      <p className="mb-2">
        Deadline: {new Date(contract.end_date).toLocaleDateString()}
      </p>
      <p className="mb-2">Project Fee: {contract.amount_agreed}</p>
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-4">
        Contract Terms
      </h1>
      <p className="text-gray-700 mb-4">{contract.terms}</p>
      <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">
        Milestones
      </h3>
      <div className="border-t border-gray-200 pt-4">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`py-4 ${
                index < milestones.length - 1
                  ? "border-b border-gray-300"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  {milestone.title}
                </h4>
              </div>
              <p className="text-gray-600 mb-1">Due: {milestone.due_date}</p>
              <p className="text-gray-600">Amount: {milestone.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-2">
            No milestones found for this contract.
          </p>
        )}
      </div>
      {contract.status === "pending" && (
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Accept
          </button>
          {counterOffers.length > 0 ? (
            <button
              onClick={handleCheckCounterOffers}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Counter Offers
            </button>
          ) : (
            <button
              onClick={handleCounterOffer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Make Counter Offer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get contract status styling
const getContractStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "text-green-600";
    case "Active":
      return "text-blue-600";
    case "In Dispute":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};
export default ContractDetails;
