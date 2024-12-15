import React, { useState, useEffect } from 'react';
import { useNavigate, useParams , useLocation } from 'react-router-dom';
import { FaUpload, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const CounterDisputeResponsePage = () => {
  const {id:disputeResponseId} = useParams()
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();
  const [successMessage , setSuccessMessage] = useState("")
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
    description: '',
    title: '',
    documents: [],
    supporting_documents: [],
    counterOfferAmount: '',
    counterReturnType: '',
    forwardToResolutionCenter:false,
  });

  const [uploadedDocumentIds, setUploadedDocumentIds] = useState([]); // New state for document IDs
  const location = useLocation()
  const {clientId} = location.state || null
  const [prevDisputeResponse , setPrevDisputeResponse ] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDisputeData = async () => {
      try {
        const disputeResponse = await axios.get(`http://127.0.0.1:8000/api/dispute-response/${disputeResponseId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrevDisputeResponse(disputeResponse.data)
        // fetchSupportingDocuments(disputeResponse.data.supporting_documents);
      } catch (error) {
        console.error('Error fetching dispute data:', error);
      }
    };
    fetchDisputeData();
  }, [disputeResponseId, token]);

  const fetchSupportingDocuments = async (documentIds) => {
    try {
      const documentPromises = documentIds.map(id =>
        axios.get(`http://127.0.0.1:8000/api/supporting-document/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const documentsData = await Promise.all(documentPromises);
      setResponse(prevResponse => ({
        ...prevResponse,
        supporting_documents: documentsData.map(doc => doc.data)
      }));
    } catch (error) {
      console.error('Error fetching supporting documents:', error);
    }
  };

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


    console.log("repsonse is ",response.title)
    const payload = {
      title: response?.title || prevDisputeResponse.title ,
      description: response?.description || prevDisputeResponse.description ,
      dispute: prevDisputeResponse.dispute,
      return_type: response?.counterReturnType || prevDisputeResponse.return_type,
      return_amount: response?.counterOfferAmount || prevDisputeResponse.return_amount,
      response: response?.decision === 'accept' ? 'accepted' : response.decision === 'reject'  ? 'rejected' : 'counter_offer',
    };

    // Handle document uploads and save IDs
    const uploadedIds = [];
    for (const file of response.documents) {
      const documentFormData = new FormData();
      documentFormData.append('file', file);
      documentFormData.append('dispute', disputeDetails.dispute);
      documentFormData.append('uploaded_by', clientId);

      const documentResponse = await axios.post(`http://127.0.0.1:8000/api/supporting-document/`, documentFormData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      uploadedIds.push(documentResponse.data.id); // Assuming the response contains the new document ID
      
    }

    setUploadedDocumentIds(uploadedIds); // Store the uploaded document IDs
    console.log("payload before sending ",payload)
    const disputeResponse = await axios.post(`http://127.0.0.1:8000/api/dispute-response/`, {
        ...payload,
        supporting_documents: uploadedIds ,
        // Send the new document IDs
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      if (disputeDetails.status === 201){
      fetchSupportingDocuments(disputeResponse.data.supporting_documents);
      }

    
    try {

        await axios.patch(`http://127.0.0.1:8000/api/dispute-response/${prevDisputeResponse.id}/`, {
            got_response: true
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        
      if (response.decision === 'accept') {
        await axios.patch(`http://127.0.0.1:8000/api/disputes/${prevDisputeResponse.dispute}/`, {
          status: 'resolved',
          got_response: true
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

      } 
      else if (response.decision === 'reject' && response.forwardToResolutionCenter ){
       await axios.patch(`http://127.0.0.1:8000/api/disputes/${response.dispute}/`, {
          status: 'drc_forwarded',
          got_response: true
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Dispute has been rejected.");
      }
      
      else {
        await axios.patch(`http://127.0.0.1:8000/api/disputes/${prevDisputeResponse.dispute}/`, {
          got_response: true
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSuccessMessage("Response submitted successfully.");
    } catch (err) {
      console.error('Error submitting dispute response:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        // Display backend validation errors
        setErrorMessage(JSON.stringify(err.response.data));
      } else {
        setErrorMessage('Failed to submit dispute response. Please try again.');
      }
    }
  };

  const handleDeleteDocument = async (index , docId) => {
    
    try{

      const delResponse = await axios.delete(`http://127.0.0.1:8000/api/supporting-document/${docId}/`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("del response is",delResponse.status)

      if (delResponse.status === 204) {
      setResponse(prevResponse => ({
        ...prevResponse,
        supporting_documents: prevResponse.supporting_documents.filter((_, i) => i !== index),
      }));
    }
    }
    catch(error){
      console.error('Error deleting supporting document:', error.response?.data || error.message);
      alert("There was an error deleting your doucument.");
    }

  }
    
   

  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Counter Dispute Response</h1>
      {/* Refund Offer Information */}
      <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
        <h3 className="font-medium text-gray-700 mb-2">Refund Offer Details</h3>
        <p className="text-gray-800">
          {prevDisputeResponse?.return_type === 'full' ? 'Full Refund Offer' : 'Partial Refund Offer'}
          <p className="text-gray-800">Amount: {prevDisputeResponse?.return_amount} Birr</p>
        </p>
        <div className="flex space-x-4 mt-4">
          <button type="button" onClick={() => handleDecision('accept')} className={`w-full py-2 rounded-lg border ${response.decision === 'accept' ? 'bg-green-500 text-white' : 'border-gray-300'}`}>
            Accept Refund
          </button>
          <button type="button" onClick={() => handleDecision('counter')} className={`w-full py-2 rounded-lg border ${response.decision === 'counter' ? 'bg-yellow-500 text-white' : 'border-gray-300'}`}>
            Counter Offer
          </button>
          <button type="button" onClick={() => handleDecision('reject')} className={`w-full py-2 rounded-lg border ${response.decision === 'reject' ? 'bg-red-500 text-white' : 'border-gray-300'}`}>
            Reject Refund
          </button>
        </div>
        {decisionErrorMessage && <div className="text-red-500 mt-1">{decisionErrorMessage}</div>}
      </div>

      {/* Counter Offer Form */}
      {response.decision === 'counter' && (
        <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
          <label htmlFor="counterReturnType" className="block text-lg font-normal text-brand-blue mb-2">Return Type</label>
          <select id="counterReturnType" name="counterReturnType" value={response.counterReturnType} onChange={handleInputChange} className="w-full border p-2 rounded-lg">
            <option value="">Select Return Type</option>
            <option value="partial">Partial</option>
            <option value="full">Full</option>
          </select>
          {response.counterReturnType === "partial" && <>
          <label htmlFor="counterOfferAmount" className="block text-lg font-normal text-brand-blue mt-4 mb-2">Proposed Amount</label>
          <input type="number" id="counterOfferAmount" name="counterOfferAmount" value={response.counterOfferAmount} onChange={handleInputChange} placeholder="Enter counter offer amount in Birr" className="w-full border p-2 rounded-lg" />
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

      {/* Title and Comments */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">Title</label>
        <input id="title" name="title" value={response.title} onChange={handleInputChange} placeholder="Enter a title for your response" required className="w-full border p-2 rounded-lg" />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-lg font-normal text-brand-blue mb-2">Description</label>
        <textarea id="description" name="description" value={response.description} onChange={handleInputChange} rows="4" required className="w-full border p-2 rounded-lg" placeholder="Enter your comments..."></textarea>
      </div>

      {/* Supporting Documents List */}
<div className="mb-6">
<label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">Supporting Documents</label>

  {response.supporting_documents.length > 0 ? (
    <ul>
      {response.supporting_documents.map((doc, index) => (
        <li key={doc.id} className="flex justify-between items-center border-b py-2">
          <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Document {index + 1}
          </a>
          <button 
            onClick={() => handleDeleteDocument(index , doc.id)} 
            className="text-red-500 hover:text-red-700"
            aria-label="Delete document"
          >
            <FaTrash />
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">No supporting documents available.</p>
  )}
</div>

      {/* Supporting Documents Upload */}
      <div className="mb-6">
        <label htmlFor="documents" className="block text-lg font-normal text-brand-blue mb-2">Upload Supporting Documents</label>
        <input type="file" id="documents" multiple onChange={handleFileChange} className="border p-2 rounded-lg" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">

      <button onClick={handleSubmit} className="w-[50%] bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg">Submit Response</button>
    </div>
    <div className="flex justify-center">
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
    </div>
  );
};

export default CounterDisputeResponsePage;
