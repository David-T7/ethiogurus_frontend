import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

// Fetch freelancer data
const fetchFreelancerData = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Return the entire freelancer data
};

const CheckVerification = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const encryptedToken = localStorage.getItem("access"); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  // UseQuery to fetch freelancer data
  const { data: freelancerData, isLoading, isError } = useQuery({
    queryKey: ["freelancerData", token],
    queryFn: fetchFreelancerData,
  });

  const handleUpdateProfile = () => {
    navigate("/update-profile"); // Redirect to profile update page
  };

  const handleVerify = () => {
    navigate("/verify-account"); // Redirect to account verification page
  };

  const handleNext = () => {
    navigate(`/camera-check/${id}/${type}`); // Redirect to the camera check page
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Failed to fetch freelancer data.</div>;

  const { profile_picture, verified } = freelancerData;

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          <div className="flex justify-center mt-2">
            <h2 className="text-2xl font-normal">
              {!profile_picture
                ? "Profile Picture Missing"
                : verified
                ? "Account Verified"
                : "Account Not Verified"}
            </h2>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <p className="mt-4">
            {!profile_picture
              ? "Please add a profile picture to proceed."
              : verified
              ? "Your account is verified. You can now proceed to camera check."
              : "Please verify your account to proceed with the test."}
          </p>
        </div>
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={
              !profile_picture
                ? handleUpdateProfile
                : verified
                ? handleNext
                : handleVerify
            }
            className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
          >
            {!profile_picture ? "Update Profile" : verified ? "Next" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckVerification;
