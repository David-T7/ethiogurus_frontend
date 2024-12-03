import React, { useState , useEffect} from 'react';
import { useParams, useNavigate , useLocation } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const ContractDisputePage = () => {
  const { id:contractId } = useParams(); // Get contract ID from URL
  const navigate = useNavigate();
  const location = useLocation()
  const [contract , setContract]= useState(null)
  const [title, setTitle] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [refundType, setRefundType] = useState('full'); // 'full' or 'partial'
  const [refundAmount, setRefundAmount] = useState('');
  const [milestone , setMilestone] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const { milestoneId } = location.state || null;

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  useEffect(() => {
    
    const fetchContract = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContract(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contract:', err);
        setError('Error fetching contract details. Please try again.');
        setLoading(false);
      }
    };
    if (milestoneId == null){
    fetchContract();
    }
  }, [contractId, token ]);


  useEffect(() => {
    const fetchMilestone = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/milestones/${milestoneId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMilestone(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Milestone:', err);
        setError('Error fetching milestone details. Please try again.');
        setLoading(false);
      }
    };

    fetchMilestone();
  }, [milestoneId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setError('Please provide a title for the dispute.');
      return;
    }
    if (refundType === 'partial' && !refundAmount) {
      setError('Please specify the refund amount for a partial refund.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', disputeDetails);
    formData.append('return_type', refundType);
    if (refundType === "partial"){
    formData.append('return_amount', refundAmount);
    }
    formData.append('contract', contractId); // Associate dispute with the contract
    if (milestoneId){
      formData.append('milestone', milestoneId); // Associate dispute with the contract
    }
    // Append each file as 'supporting_documents'
    files.forEach((file) => {
      formData.append('supporting_documents', file);
    });

    try {
      // Send POST request to create dispute
      const response = await axios.post('http://127.0.0.1:8000/api/disputes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });



      console.log('Dispute submitted successfully:', response.data);
      handleContractStatusUPdate("inDispute")
      setSuccess(true);
      // Optionally, reset the form
      setTitle('');
      setDisputeDetails('');
      setFiles([]);
      setRefundType('full');
      setRefundAmount('');

      // Redirect to contract details page to reflect changes
      navigate(`/mycontracts/${contractId}`);
    } catch (err) {
      console.error('Error submitting dispute:', err);
      if (err.response && err.response.data) {
        // Display backend validation errors
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to submit dispute. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContractStatusUPdate = async (statusValue) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
        status: statusValue,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Contract status updated to canceled.');
    } catch (error) {
      console.error('Error canceling project:', error);
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          File a Dispute for {milestone? milestone?.title :contract?.title}
        </h1>
        {/* Display Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Display Success Message */}
        {success && <div className="text-green-500 mb-4">Dispute submitted successfully!</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dispute Title */}
          <div className="p-6">
            <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
              Dispute Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter dispute title..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Dispute Details */}
          <div className="p-6">
            <label htmlFor="details" className="block text-lg font-normal text-brand-blue mb-2">
              Dispute Details
            </label>
            <textarea
              id="details"
              value={disputeDetails}
              onChange={(e) => setDisputeDetails(e.target.value)}
              placeholder="Describe your issue here..."
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
              required
            />
          </div>

          {/* Upload Evidence Documents */}
          <div className="p-6">
            <h2 className="text-lg font-normal text-brand-blue mb-2">Upload Evidence Documents</h2>
            <label className="flex flex-col items-center cursor-pointer">
              <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-brand-dark-blue bg-brand-gray-light rounded-lg mb-4">
                <FaUpload className="text-3xl text-brand-dark-blue" />
                <span className="text-brand-dark-blue ml-2">Drag & Drop your files here</span>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <ul className="list-disc pl-6 text-brand-gray-dark mt-4">
              {files.length > 0 ? (
                Array.from(files).map((file, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-normal">{file.name}</span>
                  </li>
                ))
              ) : (
                <li>No files selected</li>
              )}
            </ul>
          </div>

          {/* Refund Type */}
          <div className="p-6">
            <label htmlFor="refundType" className="block text-lg font-normal text-brand-blue mb-2">
              Refund Type
            </label>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="full"
                name="refundType"
                value="full"
                checked={refundType === 'full'}
                onChange={() => setRefundType('full')}
                className="mr-2"
              />
              <label htmlFor="full" className="mr-4">Full Refund</label>
              <input
                type="radio"
                id="partial"
                name="refundType"
                value="partial"
                checked={refundType === 'partial'}
                onChange={() => setRefundType('partial')}
                className="mr-2"
              />
              <label htmlFor="partial">Partial Refund</label>
            </div>

            {refundType === 'partial' && (
              <div>
                <label htmlFor="refundAmount" className="block text-lg font-normal text-brand-blue mb-2">
                  Amount for Partial Refund
                </label>
                <input
                  type="number"
                  id="refundAmount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                  required={refundType === 'partial'}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default ContractDisputePage;
