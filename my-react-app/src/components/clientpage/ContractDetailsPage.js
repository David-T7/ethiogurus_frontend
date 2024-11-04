import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit , FaDollarSign } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';

const ContractDetailsPage = () => {
  const { id: contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]); // State to store milestones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterOffers, setCounterOffers] = useState([]);
  const [client , setClient] = useState(null)
  const [disputes, setDisputes] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {

        // Fetch the contract details
        const contractResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContract(contractResponse.data);
        
        // Fetch milestones for the contract
        const milestonesResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractResponse.data.contract_update ? contractResponse.data.contract_update : contractId}/milestones/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMilestones(milestonesResponse.data); // Store fetched milestones

      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);


  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contract.id}/disputes/`,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDisputes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contract disputes:", err);
        // setError("Error fetching contract disputes . Please try again.");
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [contract]);
  

  const handleUpdate = () => {
    navigate(`/contracts/${contractId}/edit`);
  };

  const handleDispute = (milestoneId) => {
    navigate(`/contract/${contractId}/createdispute`,{state: {milestoneId:milestoneId}});
  }

  const handleContractUpdate = () => {
    navigate(`/contracts/${contractId}/edit`);
  }

  const handleCounterOffer = () => {
    navigate(`/contract-counter-offer/${contractId}`);
  };
  const handleCheckCounterOffers = () => {
    console.log("contract is ",contract)
    console.log("counter offer is ",counterOffers)

    navigate(`/contract-counter-offers/${contractId}`,
      {
        state:{
          counterOffers:counterOffers,
          contract:contract
        }
      }
    );
  };

  useEffect(() => {
    const fetchCounterOffers = async () => {
      try {
        const token = localStorage.getItem("access"); // Get access token
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contract.contract_update ? contract.contract_update :contractId}/counter-offers/`,
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

  useEffect(() => {
    const fetchClient = async () => {
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
        setClient(response.data)
      }
      catch(error){
        console.log("failed to fetch freelancer data")
      }
    }
    fetchClient()

  } , [])


  const handleDisputes = () => {
    navigate(`/contract-disputes/${contract.id}` ,{
      state: {
        contract: contract,
        clientId: client.id,
        milestones : milestones
      },
    }
    );
  };


  const handleSendContract = async () => {
    try {
      const token = localStorage.getItem('access');
      // Update the contract status to pending
      await axios.patch(`http://127.0.0.1:8000/api/contracts/${contractId}/`, { status: 'pending' }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch the updated contract details
      const updatedContractResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContract(updatedContractResponse.data);

      alert('Contract sent and status updated to pending successfully!'); // Provide feedback to the user

    } catch (err) {
      alert('Failed to send contract or update status. Please try again.'); // Handle error appropriately
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!contract) return <div>No contract found.</div>;

  // Safely access projectFee
  const projectFee = contract.amount_agreed;

  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Contract Details</h1>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
        <p className="text-gray-600">{projectFee} Birr</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Terms</h2>
        <p className="text-gray-600">{contract.terms}</p>
      </div>

      {contract.milestone_based && milestones.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-[50%] border-t border-gray-300"></div>
            </div>
            <div className="relative">
              {sortedMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center mb-4 relative">
                  <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2">
                    {index + 1}
                  </div>
                  <div className="ml-8 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                    <h3 className="text-xl font-normal text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600">Due Date: {new Date(milestone.due_date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Amount: {milestone.amount} Birr</p>
                    <p className="text-gray-600">Status: {milestone.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

{disputes.length > 0 &&  <div className="mb-6">
        <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">Disputes</h3>
        <button
        onClick={handleDisputes}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Check Disputes
      </button>
       </div>
}

      <div className="mt-6 flex justify-left space-x-4">
      {contract.status === 'pending' &&  <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <FaEdit className="inline mr-2" /> Edit Contract
        </button>
       }

      {contract.status === 'accepted' &&  <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <FaDollarSign className="inline mr-2" /> Deposit Fund
        </button>
       }

        {contract.status === 'draft' && ( // Conditionally render the send button
          <button
            onClick={handleSendContract}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Send Contract
          </button>
        )}

{contract.status === 'pending' && counterOffers.length > 0 && (
            <button
              onClick={handleCheckCounterOffers}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Check Counter Offers
            </button>
          ) }

{contract.status === 'active' && (
            <button
              onClick={handleContractUpdate}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Update Contract
            </button>
          ) }

{contract.status === 'active' && !contract.milestone_based &&  
                    <button onClick={() => handleDispute(null)}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          <FaExclamationTriangle className="inline mr-2" /> Create Dispute
        </button>
       }
      </div>
    </div>
  );
};

export default ContractDetailsPage;
