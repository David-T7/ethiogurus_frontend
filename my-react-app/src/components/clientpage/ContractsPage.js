import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaTimesCircle , FaExclamationCircle  } from 'react-icons/fa';

const mockContractsData = [
  { id: 1, title: 'Web Development Project', status: 'Active', projectFee: 1000 },
  { id: 2, title: 'Mobile App Development', status: 'Completed', projectFee: 2000 },
  { id: 3, title: 'Django Project', status: 'InDispute', projectFee: 1000 },

  // Add more mock contracts as needed
];

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    // Simulate fetching contracts
    setContracts(mockContractsData);
  }, []);

  if (contracts.length === 0) return <div className="text-center py-8">Loading...</div>;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Completed':
        return 'bg-blue-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-black';
      case 'InDispute':
        return 'bg-red-500 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <FaCheckCircle />;
      case 'Completed':
        return <FaCheckCircle />;
      case 'Pending':
        return <FaClock />;
      case 'InDispute':
          return <FaExclamationCircle />;
      default:
        return <FaTimesCircle />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-8">
      <h1 className="text-4xl font-thin mb-8 text-brand-dark-blue">My Contracts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map(contract => (
          <div key={contract.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{contract.title}</h2>
                <span className={`ml-3 px-2 py-2 text-xs font-semibold rounded-full ${getStatusStyle(contract.status)}`}>
                  {contract.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">Fee: ${contract.projectFee}</p>
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
