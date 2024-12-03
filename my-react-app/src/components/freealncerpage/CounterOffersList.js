import React, { useState, useEffect } from 'react';
import { Link, useParams , useLocation } from 'react-router-dom';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const CounterOffersList = () => {
  const { id:contractId } = useParams(); // Get contract ID from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancer , setFreelancerData] = useState(null)
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const location = useLocation()
  const {counterOffers} = location.state || null
  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancerData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [contractId]);

  // useEffect(() => {
  //   const fetchCounterOffers = async () => {
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contract.contract_update ? contract.contract_update : contract.id}/counter-offers/`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setCounterOffers(response.data); // Set counter offers related to the contract
  //     } catch (error) {
  //       console.error('Failed to fetch counter offers:', error);
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCounterOffers();
  // }, [contract]);


  if (loading) {
    return <div className="text-center py-8">Loading counter offers...</div>;
  }

  if (error) {
    return <div className="text-center py-8">Failed to load counter offers. Please try again later.</div>;
  }

  if (counterOffers.length === 0) {
    return <div className="text-center py-8">No counter offers found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Counter Offers</h1>
      {counterOffers.map((offer) => (
        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-normal text-brand-dark-blue">{offer.title}</h3>
            <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getOfferStatusStyle(offer.status)}`}>
              {offer.status}
            </span>
          </div>
          <p className="text-gray-600">Proposed Amount: {offer.proposed_amount} Birr</p>
          <p className="text-gray-600">Milestone Based: {offer.milestone_based ? 'Yes' : 'No'}</p>
          <Link to={`/counter-offer/${offer.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

// Helper function to get offer status styling
const getOfferStatusStyle = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-500 text-white';
    case 'pending':
      return 'bg-yellow-500 text-black';
    case 'canceled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default CounterOffersList;
