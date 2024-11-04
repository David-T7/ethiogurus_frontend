import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CounterOfferDetails = () => {
  const { id } = useParams(); // Extract the counter offer ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access"); // Get the access token from localStorage
  const [counterOffer, setCounterOffer] = useState([]);
  const [freelancer, setFreelancerData] = useState(null);
  //   const [contract , setContract] = useState(null)
  const [milestones, setMIlestones] = useState([]);
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
    const fetchFreelancerData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancerData(response.data);
      } catch (error) {
        console.log("error occured", error);
      }
    };
    fetchFreelancerData();
  }, []);

  // const handleAccept = async () => {
  //   // Handle counter offer acceptance (POST request using axios)
  //   try {
  //     await axios.patch(
  //       `http://127.0.0.1:8000/api/counter-offer/${id}/`,
  //       {
  //         status: "accpted",
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     navigate(""); // Navigate back to the contracts list after acceptance
  //   } catch (err) {
  //     setError(
  //       err.response
  //         ? err.response.data.detail
  //         : "Failed to accept the counter offer"
  //     );
  //   }
  // };

  const handleUpdateOfferStatus = async (offerStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        { status: offerStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCounterOffer(response.data)
    } catch (err) {
      console.error("Error updating counter offer status:", err);
      setError("Failed to update counter offer status.");
    }
  };



  const handleCounterOffer = () => {
    navigate(`/counter-offer/${id}`);
  };
  const handleUpdateOffer = (id) => {
    navigate(`/edit-counter-offer/${id}`);
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
          Counter Offer
        </h1>
      </div>
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-thin text-brand-dark-blue">
          {counterOffer.title}
        </h1>
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
          {counterOffer.sender !== freelancer?.id && (
            <>
              <button
                onClick={() => handleUpdateOfferStatus("accepted")}
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

          {counterOffer.sender === freelancer?.id &&
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
       {counterOffer.status === "canceled" && counterOffer.sender == freelancer?.id && (
             <button
             onClick={() => handleUpdateOfferStatus("pending")}
             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
           >
             Activate Offer
           </button>
        )}

    </div>
  );
};

// Helper function to get offer status styling
const getOfferStatusStyle = (status) => {
  switch (status) {
    case 'accepted':
      return 'text-green';
    case 'pending':
      return 'text-gray';
    case 'canceled':
      return 'text-red';
    default:
      return 'text-gray';
  }
};
export default CounterOfferDetails;
