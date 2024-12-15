import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaTimes, FaTrash , FaPlus } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { decryptToken } from "../../utils/decryptToken";

const fetchContract = async ({ queryKey }) => {
  const [, contractId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("contracts data is ",response.data)

  return response.data;
};

const fetchDisputes = async ({ queryKey }) => {
  const [, contractId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/disputes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestones = async ({ queryKey }) => {
  const [, contractId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/milestones/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


const EditContractPage = () => {
  const { id: contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [contract, setContract] = useState(null);
  const [updatedContract , setUpdtedContract] = useState([])
  const [milestones, setMilestones] = useState([]);
  const [updatedMilestones , setUpdtedMilestones] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractStatus, setContractStatus] = useState(null);
  const [addMilestone, setAddMiletsone] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [isMilestoneBased, setIsMilestoneBased] = useState(false);
  const [hourly, setHourly] = useState(false);
  const [oneTimeFee, setOneTimeFee] = useState(false);
  const [projectDuration, setprojectDuration] = useState("");
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    amount: "",
    due_date: "",
    is_completed: false,
    status: "pending",
  });
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

 // Fetch contract details
 const { data: fetchedcontract, isLoading: loadingContract } = useQuery({
  queryKey: ["contract", contractId, token],
  queryFn: fetchContract,
});

// Fetch disputes
const { data: fetcheddisputes, isLoading: loadingDisputes } = useQuery({
  queryKey: ["disputes", contractId, token],
  queryFn: fetchDisputes,
});

// Fetch milestones
const { data: fetchedmilestones, isLoading: loadingMilestones } = useQuery({
  queryKey: ["milestones", contractId, token],
  queryFn: fetchMilestones,
});

// Populate contract and milestones into local state
useEffect(() => {
  if (fetchedcontract) {
    setContract(fetchedcontract);
    setUpdtedContract(fetchedcontract)
    setHourly(fetchedcontract.hourly)
    setIsMilestoneBased(fetchedcontract.milestone_based)
    setOneTimeFee(!fetchedcontract.hourly)
    setprojectDuration(fetchedcontract.duration)
  }
}, [fetchedcontract]);

useEffect(() => {
  if (fetchedmilestones) {
    setMilestones(fetchedmilestones);
    setUpdtedMilestones(fetchedmilestones)
  }
}, [fetchedmilestones]);

useEffect(() => {
  if (fetcheddisputes) {
    setDisputes(fetcheddisputes);
  }
  setLoading(false)
}, [fetchDisputes]);

  const handleUpdateContract = async () => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        {
          amount_agreed: updatedContract.amount_agreed,
          terms: updatedContract.terms,
          milestone_based: isMilestoneBased ,
          duration:projectDuration,
          hourly:hourly
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Contract updated:", response.data);
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };

  const handleCreateNewUpdateContract = async () => {
    try {
      updatedContract.status = "pending"
      updatedContract.hourly = hourly
      updatedContract.milestone_based = isMilestoneBased
      const response = await axios.post(
        `http://127.0.0.1:8000/api/contracts/`,
        updatedContract
        ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Contract updated:", response.data);
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };


  const handleUpdate = async () => {
    checkForContractUpdate()
    checkForUpdates()
    navigate(`/contracts/${contractId}`);
  };

  const handleUpdateDispute = async (id) => {
    navigate(`/update-dispute/${id}`);
  };

  const handleCancelDispute = async (disputeId) => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      // Update the dispute status to resolved
      const response = axios.patch(
        `http://127.0.0.1:8000/api/disputes/${disputeId}/cancel/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(-1)
    } catch (error) {
      setError(error.message); // Set error message in state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const checkForUpdates = () => {
    updatedMilestones.forEach((updatedMilestone) => {
      const originalMilestone = milestones.find(
        (milestone) => milestone.id === updatedMilestone.id
      );

      if (originalMilestone) {
        const hasChanges = JSON.stringify(originalMilestone) !== JSON.stringify(updatedMilestone);

        if (hasChanges) {
          if (updatedMilestone.hasOwnProperty('milestone_update')) {
            handleCreateNewUpdateMilestone(updatedMilestone);
          } else {
            handleUpdateMilestone(updatedMilestone.id, updatedMilestone);
          }
        }
      }
    });
  };

  const checkForContractUpdate = async () => {
    if((contract.status === "active" || contract.status === "accepted") && !contract.contract_update){
        if(updatedContract.amount_agreed !== contract.amount_agreed || updatedContract.hourly !== contract.hourly || updatedContract.milestone_based !== contract.milestone_based || updatedContract.projectDuration !== contract.milestone_based  ){
          await handleCreateNewUpdateContract()
        }
      }
      else{
          await handleUpdateContract()
      }
  }

  const handleUpdateMilestone = async (milestoneId, updatedMilestone) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/milestones/${milestoneId}/`,
        updatedMilestone,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Milestone updated:", response.data);
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleCreateNewUpdateMilestone = async (updatedMilestone) => {
    console.log("updated milestone  before sending ",updatedMilestone)
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/milestones/`
        ,
        updatedMilestone,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Milestone updated for approval:", response.data);
    } catch (error) {
      console.error("Error updating milestone for approval:", error);
    }
  };


  const handleDeleteMilestone = async (index) => {
    const milestoneId = milestones[index].id;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/milestones/${milestoneId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedMilestones = milestones.filter((_, i) => i !== index);
      setMilestones(updatedMilestones);
      setUpdtedMilestones(updatedMilestones)
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const handleMilestoneChange = (index, field, value) => {
    // Create a new array with the updated milestone
    const updated = updatedMilestones.map((milestone, i) =>
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setUpdtedMilestones(updated); // Update updatedMilestones state with the modified array
  
    // Optionally, add milestone_update if amount or due_date has changed
    if (
      milestones[index].due_date !== updated[index].due_date ||
      milestones[index].amount !== updated[index].amount
    ) {
      updated[index].milestone_update = updated[index].id;
      setUpdtedMilestones(updated); // Update again if milestone_update was modified
    }
  };

  const handleContractChange = (field, value) => {
    // Create a new object with the updated contract
    const updated = {...updatedContract, [field]: value }
    setUpdtedContract(updated); // Update updatedMilestones state with the modified array
    updated.contract_update = updated.id;
  };

  const handleAddMilestone = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/milestones/`,
        {
          contract: contract?.contract_update ? contract.contract_update : contractId,
          title: newMilestone.title,
          amount: newMilestone.amount,
          due_date: newMilestone.due_date,
          is_completed: newMilestone.is_completed,
          status: newMilestone.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Milestone added:", response.data);
      setMilestones([...milestones, response.data]);
      setUpdtedMilestones([...updatedMilestones , response.data])
      await handleUpdateContract();
      setContract({ ...contract, milestone_based: true });
      setNewMilestone({
        title: "",
        description: "",
        amount: "",
        due_date: "",
        is_completed: false,
        status: "pending",
      });
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  const handleCreateDispute = async (milestoneId) => {
    navigate(`/contract/${contract.id}/createdispute`, {
      state: {
        milestoneId: milestoneId,
      },
    });
  };


  const handleContractStatusUPdate = async (statusValue) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        {
          status: statusValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Contract status updated to canceled.");
      setContractStatus(statusValue);
    } catch (error) {
      console.error("Error canceling project:", error);
    }
  };

  const handleDeleteContract = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Contract delteted");
      navigate("/contracts");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">
        Edit Contract
      </h1>
      {/* Create Dispute Button */}
      <div className="mt-6 flex justify-end space-x-4">
        {/* Cancel Project Button */}
        {["draft"].includes(updatedContract?.status) && (
          <button
            onClick={() => handleDeleteContract()}
            className="bg-gray-500 text-white hover:bg-gray-700 py-2 px-4 rounded"
          >
            Cancel Contract
          </button>
        )}
        {["inDispute"].includes(updatedContract?.status) &&
          !updatedContract?.milestone_based && (
            <button
              onClick={() => handleContractStatusUPdate("canceled")}
              className="bg-gray-500 text-white hover:bg-gray-700 py-2 px-4 rounded"
            >
              Cancel Dispute
            </button>
          )}

        {/* Cancel Project Button */}
        {["canceled"].includes(updatedContract?.status) && (
          <button
            onClick={() => handleContractStatusUPdate("pending")}
            className="bg-green-500 text-white hover:bg-green-700 py-2 px-4 rounded"
          >
            Activate Project
          </button>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">{oneTimeFee ? "Project Fee": hourly ? "Hourly Fee" : "Project Fee"}</h2>
        <input
          type="number"
          value={updatedContract?.amount_agreed}
          onChange={(e) =>
            handleContractChange("amount_agreed", e.target.value)
          }
          className="w-[50%] border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Type</h2>
            {!hourly && <div className="flex items-center">
              <input
                type="checkbox"
                checked={oneTimeFee}
                onChange={() => {setOneTimeFee(!oneTimeFee)  ; setHourly(false)}}
                id="onetime-fee-checkbox"
                className="mr-2"
              />
              <label htmlFor="onetime-fee-checkbo" className="text-gray-800">
                One time Fee
              </label>
            </div> }
            {!oneTimeFee && <div className="flex items-center">
              <input
                type="checkbox"
                checked={hourly}
                onChange={() => { setHourly(!hourly) ; setOneTimeFee(false) ; setIsMilestoneBased(false) }}
                id="hourly-checkbox"
                className="mr-2"
              />
              <label htmlFor="hourly-checkbox" className="text-gray-800">
                Hourly
              </label>
            </div>}
          </div>

          {hourly && (
  <div className="flex flex-col items-start mt-4">
    <label htmlFor="project-duration" className="text-gray-800 text-xl mb-2">
      Project Duration
    </label>
    <select
      id="project-duration"
      name="duration"
      value={projectDuration}
      required={hourly}
      className="border border-gray-300 w-[50%] p-2 rounded-lg focus:outline-none focus:border-blue-500"
      onChange={(e) => setprojectDuration(e.target.value)}
    >
      <option value="1week">1 Week</option>
      <option value="2weeks">2 Weeks</option>
      <option value="1month">1 Month</option>
      <option value="2months">2 Months</option>
      <option value="3months">3 Months</option>
      <option value="6months">6 Months</option>
      <option value="1year">1 Year</option>
      <option value="custom">Custom Duration</option>
    </select>
    {projectDuration === "custom" && (
      <input
        type="text"
        placeholder="Enter custom duration"
        onChange={(e) => setprojectDuration(e)}
        className="mt-2 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />
    )}
  </div>
)}


          {oneTimeFee && <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isMilestoneBased}
                onChange={() => setIsMilestoneBased(!isMilestoneBased)}
                id="milestone-checkbox"
                className="mr-2"
              />
              <label htmlFor="milestone-checkbox" className="text-gray-800">
                Milestone Based Contract
              </label>
            </div>
          </div> }

      {isMilestoneBased && !hourly && <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
        {updatedMilestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="flex flex-col mb-4 border border-gray-200 p-4 rounded-lg relative"
          >
            <div className="flex flex-col mb-2">
              <label className="text-gray-800">Title</label>
              <input
                type="text"
                placeholder="Enter milestone title"
                value={milestone.title}
                onChange={(e) =>
                  handleMilestoneChange(index, "title", e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label className="text-gray-800">Deadline</label>
              <input
                type="date"
                placeholder="Enter milestone deadline"
                value={milestone.due_date.split("T")[0]}
                onChange={(e) =>
                  handleMilestoneChange(index, "due_date", e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label className="text-gray-800">Amount ( Birr )</label>
              <input
                type="number"
                placeholder="Enter amount in Birr"
                value={milestone.amount}
                onChange={(e) =>
                  handleMilestoneChange(index, "amount", e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            {(milestone.status === "pending" &&<div className="absolute top-2 right-2">
              <button
                onClick={() => handleDeleteMilestone(index)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              {(milestone.status === "active" &&
                  <button
                    onClick={() => handleCreateDispute(milestone.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    Create Dispute
                  </button>
                )}

              {disputes.length > 0 && milestone.status === "inDispute" &&
                disputes.some(
                  (dispute) =>
                    dispute.milestone === milestone.id &&
                    dispute.status == "open"
                ) && (
                  <>
                    {disputes
                      .filter((dispute) => dispute.milestone === milestone.id && dispute.status === "open")
                      .map((dispute) => (
                        <button
                          key={dispute.id} // Ensure each button has a unique key
                          onClick={() => handleUpdateDispute(dispute.id)} // Pass the dispute ID
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                          Update Dispute
                        </button>
                      ))}
                  </>
                )}

              {disputes.length > 0 && milestone.status === "inDispute" &&
                disputes.some(
                  (dispute) =>
                    dispute.milestone === milestone.id &&
                    dispute.status === "open"
                ) && (
                  <>
                    {disputes
                      .filter((dispute) => dispute.milestone === milestone.id && dispute.status === "open")
                      .map((dispute) => (
                        <button
                          key={dispute.id} // Ensure each button has a unique key
                          onClick={() => handleCancelDispute(dispute.id)} // Pass the dispute ID
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                        >
                          Cancel Dispute
                        </button>
                      ))}
                  </>
                )}
            </div>
          </div>
        ))}
        <button
                  type="button"
                  onClick={() => setAddMiletsone(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-2" /> Add Milestone
                </button>
      </div>
      }

      {addMilestone && <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">
          New Milestone
        </h2>
        <label className="text-gray-800">Title</label>
        <input
          type="text"
          placeholder="Enter milestone title"
          value={newMilestone.title}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, title: e.target.value })
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 mb-2"
        />
                <label className="text-gray-800">Amount ( Birr )</label>

        <input
          type="number"
          placeholder="Enter amount in Birr"
          value={newMilestone.amount}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, amount: e.target.value })
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 mb-2"
        />
        <input
          type="date"
          value={newMilestone.due_date}
          onChange={(e) =>
            setNewMilestone({ ...newMilestone, due_date: e.target.value })
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
        />
        <button
          onClick={handleAddMilestone}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
        >
          Add Milestone
        </button>
        <button
          onClick={() => setAddMiletsone(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    }

      <div className="mt-6 flex justify-start space-x-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <FaSave className="inline mr-2" /> Save Changes
        </button>
        <button
          onClick={() => navigate(`/contracts/${contractId}`)}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          <FaTimes className="inline mr-2" /> Cancel
        </button>
        {updatedContract?.status === "active" && !updatedContract.milestone_based && (
          <button
            onClick={() =>handleCreateDispute(updatedContract.milestone)}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Create Dispute
          </button>
        )}
      </div>
    </div>
  );
};

export default EditContractPage;
