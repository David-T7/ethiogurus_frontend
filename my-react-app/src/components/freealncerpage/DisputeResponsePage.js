import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams  } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const DisputeResponsePage = () => {
  const { id: disputeId } = useParams();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [successMessage , setSuccessMessage] = useState("")
  const [errorMessage , setErrorMessage] = useState("")
  const [decisionErrorMessage , setdecisionErrorMessage] = useState("")
  const [partialRefundMessage , setPartialRefundMessage] = useState("")
  
  const [disputeDetails, setDisputeDetails] = useState({
    title: '',
    description: '',
    return_type: '',
    return_amount: '',
    dispute: '',
    got_response: false,
  });

  const [response, setResponse] = useState({
    decision: '',
    comments: '',
    title:'',
    documents: [],
    counterOfferAmount: '',
    counterReturnType: '',
    forwardToResolutionCenter:false,
  });
  
  const navigate = useNavigate()


  useEffect(() => {
    const fetchDisputeData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputeDetails(response.data);
      } catch (error) {
        console.error('Error fetching dispute data:', error);
      }
    };
    fetchDisputeData();
  }, [disputeId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponse({ ...response, [name]: value });
  };

  const handleFileChange = (e) => {
    setResponse({ ...response, documents: Array.from(e.target.files) });
  };

  const handleDecision = (decision) => {
    setResponse({ ...response, decision });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!response.decision) {
      setdecisionErrorMessage("You should select one of the above decsisions!");
      valid = false;
    } else {
      setdecisionErrorMessage("");
    }

    if(response.counterReturnType === "partial"){
      if (!response.counterOfferAmount){
        setPartialRefundMessage("Please specify the refund amount for a partial refund.")
        valid = false
      }
      else {
        setPartialRefundMessage("")
      }
    }

    if (!valid) return;



    const formData = new FormData();
    formData.append("title", response.title|| disputeDetails.title);
    formData.append("description", response.comments);
    formData.append("return_type", response.counterReturnType || disputeDetails.return_type);
    formData.append("return_amount", response.counterOfferAmount || disputeDetails.return_amount);
    formData.append("dispute", disputeId);
    formData.append("response",response.decision === "accept" ?"accepted":response.decision === "reject" ?"rejected":"counter_offer" );

    response.documents.forEach((file) => formData.append("supporting_documents", file));

    try {
      if (response.decision === 'accept') {
        await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          status: 'resolved',
          got_response : true
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.post('http://127.0.0.1:8000/api/dispute-response/', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
      } 
      else if (response.decision === 'reject' && response.forwardToResolutionCenter ){
        await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
           status: 'drc_forwarded',
           got_response: true
         }, {
           headers: { Authorization: `Bearer ${token}` },
         });
         await axios.post(`http://127.0.0.1:8000/api/drc-disputes/`, {
          dispute: disputeDetails.id,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.post('http://127.0.0.1:8000/api/dispute-response/', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
       }
      else {
        await axios.post('http://127.0.0.1:8000/api/dispute-response/', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          got_response : true
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccessMessage("Response submitted successfully.");

    } catch (err) {
      console.error('Error submitting dispute response:', err);
      if (err.response && err.response.data) {
        // Display backend validation errors
        setErrorMessage(JSON.stringify(err.response.data));
      } else {
        setErrorMessage('Failed to submit dispute response. Please try again.');
      }
    }
  };


  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Respond to Dispute</h1>
      
      {/* Display Dispute Details */}
      <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
      <h3 className="font-medium text-gray-700 mb-2">{disputeDetails.title}</h3>
        <p className="text-gray-800">{disputeDetails.description}</p>
      </div>

      {/* Refund Offer Information */}
      <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
      <h3 className="font-medium text-gray-700 mb-2">Refund Offer Details</h3>
        <p className="text-gray-800">
          {disputeDetails.return_type === 'full' ? 'Full Refund Offer' : 'Partial Refund Offer'}
        </p>
        {disputeDetails.return_type === 'partial' && (
          <p className="text-gray-800">Amount: {disputeDetails.return_amount} Birr</p>
        )}
        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => handleDecision('accept')}
            className={`w-full py-2 rounded-lg border ${
              response.decision === 'accept' ? 'bg-green-500 text-white border-green-700' : 'border-gray-300'
            }`}
          >
            Accept Refund
          </button>
          <button
            type="button"
            onClick={() => handleDecision('counter')}
            className={`w-full py-2 rounded-lg border ${
              response.decision === 'counter' ? 'bg-yellow-500 text-white border-yellow-700' : 'border-gray-300'
            }`}
          >
            Counter Offer
          </button>
          <button
            type="button"
            onClick={() => handleDecision('reject')}
            className={`w-full py-2 rounded-lg border ${
              response.decision === 'reject' ? 'bg-red-500 text-white border-red-700' : 'border-gray-300'
            }`}
          >
            Reject Refund
          </button>
        </div>
        {decisionErrorMessage && <div className="text-red-500 mt-1">{decisionErrorMessage}</div>}

      </div>

      {/* Counter Offer Form */}
      {response.decision === 'counter' && (
        <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
          <label htmlFor="counterReturnType" className="block text-lg font-normal text-brand-blue mb-2">
            Return Type
          </label>
          <select
            id="counterReturnType"
            name="counterReturnType"
            value={response.counterReturnType}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">
              Select Return Type
            </option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
          </select>

         {response.counterReturnType === 'partial' && <> <label htmlFor="counterOfferAmount" className="block text-lg font-normal text-brand-blue mt-4 mb-2">
            Proposed Amount
          </label>
          <input
            type="number"
            id="counterOfferAmount"
            name="counterOfferAmount"
            value={response.counterOfferAmount}
            onChange={handleInputChange}
            placeholder="Enter counter offer amount in Birr"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {partialRefundMessage && <div className="text-red-500 mt-1">{partialRefundMessage}</div>}
          </>}
        </div>
      )}


      {/* Rejection Form */}
{response.decision === 'reject' && (
  <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
    <label htmlFor="forwardToResolutionCenter" className="block text-lg font-normal text-brand-blue mb-2">
      Forward to Dispute Resolution Center
    </label>
    <input
      type="checkbox"
      id="forwardToResolutionCenter"
      name="forwardToResolutionCenter"
      checked={response.forwardToResolutionCenter || false}
      onChange={(e) => setResponse(prevResponse => ({
        ...prevResponse,
        forwardToResolutionCenter: e.target.checked,
      }))}
      className="mr-2"
    />
    <label htmlFor="forwardToResolutionCenter" className="text-gray-700">Check to forward the dispute to the resolution center</label>
  </div>
)}

      {/* title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={response.title}
          onChange={handleInputChange}
          placeholder='enter a title for your response'
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      


      {/* Comments */}
      <div className="mb-6">
        <label htmlFor="comments" className="block text-lg font-normal text-brand-blue mb-2">
          Comment
        </label>
        <textarea
          id="comments"
          name="comments"
          value={response.comments}
          onChange={handleInputChange}
          placeholder='any comment about the dispute or your response'
          rows="4"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Supporting Documents */}
      <div className="mb-6">
        <label htmlFor="documents" className="block text-lg font-normal text-brand-blue mb-2">
          Supporting Documents
        </label>
        <input
          type="file"
          id="documents"
          name="documents"
          multiple
          onChange={handleFileChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none"
        />
        <div className="mt-2 text-sm text-gray-600">
          <FaUpload className="inline-block mr-2" />
          {response.documents.length > 0
            ? `Files: ${response.documents.map(file => file.name).join(', ')}`
            : 'No files chosen'}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 w-[50%] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Submit Response
        </button>
      </div>
      {successMessage && (
    <div className="text-green-500 text-center mt-4 text-sm">
      {successMessage}
    </div>
  )}
  {errorMessage && (
    <div className="text-red-500 text-center mt-4 text-sm">
      {typeof errorMessage === "string" && errorMessage.length<=100 ? errorMessage : "An error occurred. Please try again."}
    </div>
  )}
    </div>
  );
};

export default DisputeResponsePage;
