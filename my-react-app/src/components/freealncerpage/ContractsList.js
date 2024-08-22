import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// The ContractsList component
const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('access'); // Get the access token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/freelancer-contracts/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        setContracts(response.data);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading contracts...</div>;
  }

  if (error) {
    return <div className="text-center py-8">Failed to load contracts. Please try again later.</div>;
  }

  if (contracts.length === 0) {
    return <div className="text-center py-8">No contracts found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Contracts</h1>
      {contracts.map((contract) => (
        <div key={contract.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{contract.title}</h3>
            <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getContractStatusStyle(contract.status)}`}>
              {contract.status}
            </span>
          </div>
          <p className="text-gray-600">Client: {contract.client}</p>
          <p className="text-gray-600">Deadline: {contract.deadline}</p>
          <p className="text-gray-600">Project Fee: {contract.projectFee}</p>
          <Link to={`/mycontracts/${contract.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

// Helper function to get contract status styling
const getContractStatusStyle = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-500 text-white';
    case 'Pending':
      return 'bg-yellow-500 text-black';
    case 'Rejected':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ContractsList;
