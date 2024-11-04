import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaTimes, FaTrash , FaPlus } from "react-icons/fa";
import axios from "axios";

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
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    amount: "",
    due_date: "",
    is_completed: false,
    status: "pending",
  });
  const token = localStorage.getItem("access");

  // Fetch contract data when the component mounts
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contractId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContract(response.data);
        setUpdtedContract(response.data)
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Error fetching contract details. Please try again.");
        setLoading(false);
      }
    };

    fetchContract();
  }, [contractId, contractStatus]);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contractId}/disputes/`,

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
  }, [contractId]);

  // Fetch milestones associated with the contract
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contract?.contract_update ? contract.contract_update:contractId}/milestones/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMilestones(response.data);
        setUpdtedMilestones(response.data)
      } catch (err) {
        console.error("Error fetching milestones:", err);
      }
    };

    fetchMilestones();
  }, [contract, token]);

  const handleUpdateContract = async () => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        {
          amount_agreed: updatedContract.amount_agreed,
          terms: updatedContract.terms,
          milestone_based: updatedContract.milestone_based,
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
        if(updatedContract.amount_agreed !== contract.amount_agreed || updatedContract.terms !== contract.terms ){
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
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">
        Edit Contract
      </h1>
      {/* Create Dispute Button */}
      <div className="mt-6 flex justify-end space-x-4">
        {updatedContract?.status === "active" && !updatedContract.milestone_based && (
          <button
            onClick={handleCreateDispute}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Create Dispute
          </button>
        )}

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
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
        <input
          type="number"
          value={updatedContract?.amount_agreed}
          onChange={(e) =>
            handleContractChange("amount_agreed", e.target.value)
          }
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">
          Contract Terms
        </h2>
        <textarea
          value={updatedContract?.terms}
          onChange={(e) =>  
            handleContractChange("terms", e.target.value)
          }
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          rows="4"
        />
      </div>

      <div className="mb-6">
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

      <div className="mt-6 flex justify-end space-x-4">
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
      </div>
    </div>
  );
};

export default EditContractPage;
