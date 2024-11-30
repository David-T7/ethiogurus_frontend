import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchContracts = async () => {
  const token = localStorage.getItem('access');
  const response = await axios.get('http://127.0.0.1:8000/api/contracts/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ContractsPage = () => {
  const { data: contracts = [], isLoading, isError, error } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'accepted':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'inDispute':
        return 'bg-red-500 text-black';
      case 'draft':
        return 'bg-gray-300 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'accepted':
      case 'completed':
        return <FaCheckCircle />;
      case 'pending':
        return <FaClock />;
      case 'inDispute':
        return <FaExclamationCircle />;
      case 'draft':
      default:
        return <FaTimesCircle />;
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">{error.message}</div>;
  if (contracts.length === 0) return <div className="text-center py-8">No contracts available.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 mt-8">
      <h1 className="text-4xl font-thin mb-8 text-brand-dark-blue">My Contracts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-normal text-brand-blue">{contract.title || 'No Title'}</h2>
                <span className={`ml-3 px-2 py-2 text-xs font-semibold rounded-full ${getStatusStyle(contract.status)}`}>
                  {contract.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">Fee: {contract.amount_agreed} Birr</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/contracts/${contract.id}`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  {getStatusIcon(contract.status)} View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractsPage;
