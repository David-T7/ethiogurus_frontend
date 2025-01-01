import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';

const fetchContracts = async ({ queryKey }) => {
  const [, { token }] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/freelancer-contracts/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.filter(
    (contract) => contract.status && contract.status.trim().toLowerCase() !== 'draft'
  );
};

const ContractsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 3;

  const encryptedToken = localStorage.getItem('access');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);

  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['contracts', { token }],
    queryFn: fetchContracts,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading contracts...</div>;
  }

  if (isError) {
    return <div className="text-center py-8">Failed to load contracts. Please try again later.</div>;
  }

  if (contracts.length === 0) {
    return <div className="text-center py-8">No contracts found.</div>;
  }

  const totalContracts = contracts.length;
  const totalPages = Math.ceil(totalContracts / contractsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const displayedContracts = contracts.slice(
    (currentPage - 1) * contractsPerPage,
    currentPage * contractsPerPage
  );

  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-center text-brand-dark-blue mb-6">Contracts</h1>
      {displayedContracts.map((contract) => (
        <div key={contract.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-normal text-brand-dark-blue">{contract.title}</h3>
            <span
              className={`text-xs font-semibold rounded-full px-4 py-1 ${getContractStatusStyle(contract.status)}`}
            >
              {contract.status}
            </span>
          </div>
          <p className="text-gray-600">Deadline: {new Date(contract.end_date).toLocaleDateString()}</p>
          <p className="text-gray-600">Project Fee: {contract.amount_agreed} Birr</p>
          <Link to={`/mycontracts/${contract.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
            View Details
          </Link>
        </div>
      ))}
            {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>)}
    </div>
  );
};

const getContractStatusStyle = (status) => {
  switch (status) {
    case 'active':
      return 'bg-blue-500 text-white';
    case 'accepted':
      return 'bg-green-500 text-white';
    case 'completed':
      return 'bg-green-500 text-white';
    case 'pending':
      return 'bg-yellow-500 text-black';
    case 'inDispute':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ContractsList;
