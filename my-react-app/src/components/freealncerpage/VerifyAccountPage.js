import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptToken } from '../../utils/decryptToken';
const VerifyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const freelancerData = location.state?.freelancerData;
  
  const [verificationType, setVerificationType] = useState('');
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const handleVerificationTypeChange = (e) => {
    setVerificationType(e.target.value);
  };

  const handleFrontFileChange = (e) => {
    setFrontIdImage(e.target.files[0]);
  };

  const handleBackFileChange = (e) => {
    setBackIdImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationType || !frontIdImage || (verificationType === 'government_id' && !backIdImage)) {
      setSubmissionError('Please select a verification type and upload the required images.');
      return;
    }

    const formData = new FormData();
    formData.append('verification_type', verificationType);
    formData.append('freelancer_id', freelancerData.id);
    formData.append('full_name', freelancerData.full_name);

    if (verificationType === 'government_id') {
      formData.append('front_id_image', frontIdImage);
      formData.append('back_id_image', backIdImage);
    } else {
      formData.append('passport_image', frontIdImage);
    }

    try {
      setIsSubmitting(true);
      setSubmissionError('');
      setSubmissionSuccess('');
      
      const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
      const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
      const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
      await axios.post(`http://127.0.0.1:8005/api/${verificationType === "government_id" ? 'verify-id' : 'verify-passport'}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSubmissionSuccess('Id submitted successfully!');
      setTimeout(() => {
        navigate('/verificatoin-steps' , { state: { freelancerData } }); // Redirect to liveliness test after a short delay
      }, 2000);
    } catch (error) {
      console.error('Error submitting verification:', error);
      setSubmissionError('Error submitting the id. Please try again.');
    } finally {
      setIsSubmitting(false); // Stop loading state
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <h2 className="text-2xl font-normal mb-4 text-brand-blue">Verify Your Account</h2>

      {/* Step Indicator */}
      <div className="mb-6">
        <p className="text-lg text-gray-700 font-normal">Step 1 of 5: Document Verification</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
        </div>
      </div>

      {/* Document Instructions */}
      <div className="bg-blue-100 text-blue-800 p-4 mb-6 rounded-lg">
        <h3 className="text-lg font-semibold">Document Requirements:</h3>
        <ul className="list-disc list-inside mt-2">
          <li>The document should be clear and fully visible.</li>
          <li>Ensure all text is legible, without any glare or blur.</li>
          <li>Avoid shadows or any obstructions on the document.</li>
          <li>Accepted formats: JPEG, PNG.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Select Verification Type */}
        <div className="mb-6">
          <label htmlFor="verificationType" className="block text-lg font-normal text-brand-blue mb-2">
            Choose Verification Method
          </label>
          <select
            id="verificationType"
            value={verificationType}
            onChange={handleVerificationTypeChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a method</option>
            <option value="government_id">Government ID</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        {/* Upload Document Images */}
        {verificationType === 'government_id' && (
          <>
            <div className="mb-6">
              <label htmlFor="frontIdImage" className="block text-lg font-normal text-brand-blue mb-2">
                Upload Front of Government ID
              </label>
              <input
                type="file"
                id="frontIdImage"
                accept="image/*"
                onChange={handleFrontFileChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="backIdImage" className="block text-lg font-normal text-brand-blue mb-2">
                Upload Back of Government ID
              </label>
              <input
                type="file"
                id="backIdImage"
                accept="image/*"
                onChange={handleBackFileChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Upload Passport Image */}
        {verificationType === 'passport' && (
          <div className="mb-6">
            <label htmlFor="document" className="block text-lg font-normal text-brand-blue mb-2">
              Upload Passport Image
            </label>
            <input
              type="file"
              id="document"
              accept="image/*"
              onChange={handleFrontFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Submission Status */}
        {submissionError && <p className="mt-4 text-red-500">{submissionError}</p>}
        {submissionSuccess && <p className="mt-4 text-green-500">{submissionSuccess}</p>}

      </form>
    </div>
  );
};

export default VerifyAccountPage;
