import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchVerificationStatus = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.verified;
};

const CheckVerification = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  // UseQuery for fetching verification status
  const { data: verificationStatus, isLoading, isError } = useQuery({
    queryKey: ["verificationStatus", token],
    queryFn: fetchVerificationStatus,
  });

  const handleVerify = () => {
    navigate("/verify-account");
  };

  const handleNext = () => {
    navigate(`/camera-check/${id}/${type}`);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Failed to fetch verification status.</div>;

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <div className="flex justify-center mt-2">
            <h2 className="text-2xl font-normal">
              {verificationStatus ? "Account Verified" : "Account Not Verified"}
            </h2>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p className="mt-4">
            {verificationStatus
              ? "Your account is verified. You can now proceed to camera check."
              : "Please verify your account to proceed with the test."}
          </p>
        </div>
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={verificationStatus ? handleNext : handleVerify}
            className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
          >
            {verificationStatus ? "Next" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckVerification;
