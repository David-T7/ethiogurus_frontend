import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaDollarSign, FaExclamationTriangle } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

// Utility to get and decrypt the token
const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem("access");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  return decryptToken(encryptedToken, secretKey);
};

// Fetch contract details
const fetchContractDetails = async (contractId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch milestones
const fetchMilestones = async (contractId, token) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/contracts/${contractId}/milestones/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch counter offers
// const fetchCounterOffers = async (contractId, token) => {
//   const response = await axios.get(
//     `http://127.0.0.1:8000/api/contracts/${contractId}/counter-offers/`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return response.data;
// };

// Fetch disputes
const fetchDisputes = async (contractId, token) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/contracts/${contractId}/disputes/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch client data
const fetchClientData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ContractDetailsPage = () => {
  const { id: contractId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = getDecryptedToken(); // Decrypt the token once

  // Fetch contract details
  const { data: contract, isLoading: loadingContract } = useQuery({
    queryKey: ["contractDetails", contractId],
    queryFn: () => fetchContractDetails(contractId, token),
    enabled: !!token,
  });

  // Fetch milestones
  const { data: milestones = [], isLoading: loadingMilestones } = useQuery({
    queryKey: ["milestones", contract?.contract_update || contractId],
    queryFn: () => fetchMilestones(contract?.contract_update || contractId, token),
    enabled: !!contract && !!token,
  });

  // // Fetch counter offers
  // const { data: counterOffers = [] } = useQuery({
  //   queryKey: ["counterOffers", contract?.contract_update || contractId],
  //   queryFn: () => fetchCounterOffers(contract?.contract_update || contractId, token),
  //   enabled: !!contract && !!token,
  // });

  // Fetch disputes
  const { data: disputes = [] } = useQuery({
    queryKey: ["disputes", contract?.id],
    queryFn: () => fetchDisputes(contract?.id, token),
    enabled: !!contract && !!token,
  });

  // Fetch client data
  const { data: client } = useQuery({
    queryKey: ["client"],
    queryFn: () => fetchClientData(token),
    enabled: !!token,
  });

  const updateContractMutation = useMutation({
    mutationFn: (status) => {
      axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        { status:status},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (contract.contract_update){
        axios.delete(
          `http://127.0.0.1:8000/api/contracts/${contract.contract_update}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contractDetails", contractId]);
      alert("Contract updated successfully!");
      navigate("/contracts");
    },
    onError: (error) => {
      console.error("Error updating contract:", error);
      alert("Failed to update contract.");
    },
  });

  const handleUpdate = () => navigate(`/contracts/${contractId}/edit`);

  const handleSendContract = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        { status: "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      queryClient.invalidateQueries(["contractDetails", contractId]);
      alert("Contract sent successfully!");
    } catch (error) {
      console.error("Error sending contract:", error);
      alert("Failed to send contract.");
    }
  };

  const handleUpdateContract= async (status)=>{
    try{
    axios.patch(
      `http://127.0.0.1:8000/api/contracts/${contractId}/`,
      { status:status},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    navigate("/contracts")
  }
  catch(error){
    console.error("Error sending contract:", error);
    alert("Failed to send contract.");
  }
  }

  const handleDisputes = () =>
    navigate(`/contract-disputes/${contract?.id}`, {
      state: {
        contract,
        clientId: client?.id,
        milestones,
      },
    });

  const handleDispute = (milestoneId) =>
    navigate(`/contract/${contractId}/createdispute`, { state: { milestoneId } });

  // const handleCheckCounterOffers = () =>
  //   navigate(`/contract-counter-offers/${contractId}`, {
  //     state: { counterOffers, contract },
  //   });

  const sortedMilestones = milestones.sort(
    (a, b) => new Date(a.due_date) - new Date(b.due_date)
  );

  if (loadingContract || loadingMilestones) return <div className="text-center">Loading...</div>;
  if (!contract) return <div>No contract found.</div>;

  const projectFee = contract.amount_agreed;

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Contract Details</h1>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
        <p className="text-gray-600">{projectFee} Birr</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Type</h2>
        <p className="text-gray-600">{contract.hourly ? "Hourly":"One Time Fee"}</p>
      </div>

      {contract.hourly && <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Duration</h2>
        <p className="text-gray-600">{contract.duration}</p>
      </div>}
      

      {contract.milestone_based && milestones.length > 0 ? (
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
      ):
      <>
      <p className="text-gray-600 mb-2">
        No milestones found for this contract.
      </p>
       {contract?.status === "pendingApproval" && <div className="mb-6">
        <p className="text-gray-600 mb-2">
        Freelancer is requesting approval of finished work
      </p>
        <button
            onClick={() =>{handleUpdateContract("completed")}}
            className="w-[50%] bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Approve
          </button>
      </div>
  } </>
    }

      {disputes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">Disputes</h3>
          <button
            onClick={handleDisputes}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Check Disputes
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-left space-x-4">
      {(contract.status === "pending" || contract.status === "active") && (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              <FaEdit className="inline mr-2" /> Edit Contract
            </button>
            {/* {counterOffers.length > 0 && (
              <button
                onClick={handleCheckCounterOffers}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Check Counter Offers
              </button>
            )} */}
          </>
        )}

        {contract.status === "draft" && (
          <button
            onClick={handleSendContract}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Send Contract
          </button>
        )}

        {contract.status === "accepted" && (
          <button
            onClick={() => updateContractMutation.mutate("active")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Activate Project
          </button>
        )}

        {/* {contract.status === "active" && !contract.milestone_based && (
          <button
            onClick={() => handleDispute(null)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            <FaExclamationTriangle className="inline mr-2" /> Create Dispute
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ContractDetailsPage;
