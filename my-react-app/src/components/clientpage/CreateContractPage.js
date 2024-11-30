import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayoutPage";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchProject = async ({ queryKey }) => {
  const { projectId, token } = queryKey[1];
  const response = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const CreateContractPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const { freelancerID } = location.state || null;
  const token = localStorage.getItem("access");
  const queryClient = useQueryClient();
  const [isMilestoneBased, setIsMilestoneBased] = useState(false);
  const [hourly, setHourly] = useState(false);
  const [oneTimeFee, setOneTimeFee] = useState(false);
  const [projectFee, setProjectFee] = useState("");
  const [projectDuration, setprojectDuration] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", amount: "", deadline: "" }]);
  // const [contractTerms, setContractTerms] = useState("");

  const { data: project, isLoading: loadingProject, error } = useQuery({
    queryKey: ["project", { projectId, token }],
    queryFn: fetchProject,
  });

  const createContractMutation = useMutation({
    mutationFn: async (contractData) => {
      const response = await axios.post(`http://127.0.0.1:8000/api/contracts/`, contractData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (contract) => {
      queryClient.invalidateQueries(["project", { projectId, token }]);

      if (isMilestoneBased && milestones.length > 0) {
        milestones.forEach((milestone) => {
          axios.post(
            `http://127.0.0.1:8000/api/milestones/`,
            {
              contract: contract.id,
              title: milestone.title,
              amount: milestone.amount,
              due_date: milestone.deadline,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        });
      }

      alert("Contract and milestones created successfully");
      navigate(`/contracts/${contract.id}`);
    },
    onError: (error) => {
      console.error("Error creating contract:", error);
      alert("Error creating contract or milestones");
    },
  });

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
    setMilestones(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", deadline: "" }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contractData = {
      project: projectId,
      freelancer: freelancerID,
      title: project?.title,
      start_date: new Date().toISOString(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      amount_agreed: projectFee,
      payment_status: "not_started",
      milestone_based: isMilestoneBased,
      hourly:hourly
    };
    if(hourly){
      contractData.duration = projectDuration
    }

    createContractMutation.mutate(contractData);
  };

  if (loadingProject) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error loading project</div>;

  return (
    <ClientLayout>
      <div className="max-w-xl mx-auto p-8 mt-8">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          Create Contract for {project?.title}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-normal text-gray-800 mb-4">{hourly ? "Hourly Fee" : "Project Fee"}</h2>
            <input
              type="number"
              value={projectFee}
              onChange={(e) => setProjectFee(e.target.value)}
              placeholder="Enter project fee in Birr"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

         

           <div className="p-6 mb-3">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Type</h2>
            {!hourly && <div className="flex items-center">
              <input
                type="checkbox"
                checked={oneTimeFee}
                onChange={() => {setOneTimeFee(!oneTimeFee) ; setHourly(false)}}
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
                onChange={() => {setHourly(!hourly); setOneTimeFee(false) ; setIsMilestoneBased(false)}}
                id="hourly-checkbox"
                className="mr-2"
              />
              <label htmlFor="hourly-checkbox" className="text-gray-800">
                Hourly
              </label>
            </div>}

            {hourly && (
  <div className="flex flex-col items-start mt-4">
    <label htmlFor="project-duration" className="text-gray-800 text-xl mb-2">
      Project Duration
    </label>
    <select
      id="project-duration"
      name="duration"
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

          </div>


          {oneTimeFee && <div className="p-6 mb-3">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Type</h2>
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

          {isMilestoneBased && (
            <div className="p-6 mb-6">
              <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex flex-col mb-4 border border-gray-200 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`title-${index}`} className="text-gray-800">
                      Title
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, e)}
                    placeholder="Milestone title"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <div className="flex flex-col mt-4">
                    <label htmlFor={`deadline-${index}`} className="text-gray-800 mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      id={`deadline-${index}`}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <label htmlFor={`amount-${index}`} className="text-gray-800 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      placeholder="Amount in Birr"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-2 text-lg" /> Add Milestone
              </button>
            </div>
          )}

          {/* <div className="p-6 mb-3">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Terms</h2>
            <textarea
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              placeholder="Enter contract terms and conditions"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
            />
          </div> */}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 w-[50%] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default CreateContractPage;
