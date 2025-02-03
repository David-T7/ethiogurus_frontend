import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { decryptToken } from "../../utils/decryptToken";

// Reusable function to get and decrypt the token
const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem("access"); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  return decryptToken(encryptedToken, secretKey); // Decrypt the token
};

// Function to fetch the profile data
const fetchProfile = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


const faceMatchCheck = async (freelancerId, userImage, token) => {
  const formData = new FormData();
  formData.append("freelancer_id", freelancerId);
  formData.append("user_image", userImage);

  const response = await axios.post("http://127.0.0.1:8005/api/verify/face-match/", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// Function to update the profile data
const updateProfile = async ({ updatedProfile, token }) => {
  const formData = new FormData();
  for (const key in updatedProfile) {
    if (key === "certifications" || key === "portfolio") {
      formData.append(key, JSON.stringify(updatedProfile[key]));
    } else {
      formData.append(key, updatedProfile[key]);
    }
  }
  await axios.patch("http://127.0.0.1:8000/api/user/freelancer/manage/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to update the user image separately
const updateUserImage = async ({ userImage, freelancerId, token }) => {
  const formData = new FormData();
  formData.append("freelancer_id", freelancerId);
  formData.append("user_image", userImage);

  await axios.patch("http://127.0.0.1:8005/api/verify/update-user-image/", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Function to update the user image separately
const updateTestProfilePicture = async ({ userImage, freelancerId, token }) => {
  const formData = new FormData();
  formData.append("freelancer_id", freelancerId);
  formData.append("profile_picture", userImage);

  await axios.patch("http://127.0.0.1:8003/api/update-test-profile-picture/", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(null);
  const token = getDecryptedToken(); // Decrypt the token once and reuse it
  const [userImage, setUserImage] = useState(null);
  const [successMessage , setSuccessMessage] = useState("")
  const [errorMessage , setErrorMessage] = useState("")
  const [profilePicutreError , setProfilePictureError] = useState("")
  // Use React Query to fetch the profile data
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile", token], // Include token in the queryKey to refetch if it changes
    queryFn: () => fetchProfile(token),
    enabled: !!token, // Only run if token is available
    retry: false, // Avoid infinite retry loop if token is invalid
  });

  // Use React Query to handle profile updates
  const mutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("")
    },
    onError: (err) => {
      if (err.response && err.response.data) {
        // Display backend validation errors
        setErrorMessage(JSON.stringify(err.response.data));
      } else {
        setErrorMessage('Failed to resolve dispute. Please try again.');
      }
      setSuccessMessage("")
    },
  });


  // Mutation for updating user image
  const userImageMutation = useMutation({
    mutationFn: (data) => updateUserImage(data),
    onError: (err) => {
      setErrorMessage("Failed to update profile picture");
      setSuccessMessage("");
    },
  });

   // Mutation for updating user image
   const testProfilePictureMutation = useMutation({
    mutationFn: (data) => updateTestProfilePicture(data),
    onError: (err) => {
      setErrorMessage("Failed to update test profile picture");
      setSuccessMessage("");
    },
  });

  useEffect(() => {
    if (profile) {
      setVerificationStatus(profile.verified);
    }
  }, [profile]);

  // Handlers for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUpdatedProfile((prev) => ({ ...prev, profile_picture: file }));
    setUserImage(file);
    if (verificationStatus) {
      try {
        const response = await faceMatchCheck(profile.id, file, token);
        if (response.status !== "success") {
          setProfilePictureError("");
          return;
        }
      } catch (err) {
        setProfilePictureError("Face does not match with the previous profile picture.");
        return;
      }
    }
  };

  const initializeFieldIfEmpty = (fieldName) => {
    setUpdatedProfile((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || profile?.[fieldName] || [])],
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    initializeFieldIfEmpty("certifications");
    setUpdatedProfile((prev) => {
      const certifications = [...(prev.certifications || [])];
      certifications[index] = { ...certifications[index], [field]: value };
      return { ...prev, certifications };
    });
  };

  const handlePortfolioChange = (index, field, value) => {
    initializeFieldIfEmpty("portfolio");
    setUpdatedProfile((prev) => {
      const portfolio = [...(prev.portfolio || [])];
      portfolio[index] = { ...portfolio[index], [field]: value };
      return { ...prev, portfolio };
    });
  };

  const addCertification = () => {
    initializeFieldIfEmpty("certifications");
    setUpdatedProfile((prev) => {
      const certifications = [...(prev.certifications || []), { title: "", link: "" }];
      return { ...prev, certifications };
    });
  };

  const addPortfolioLink = () => {
    initializeFieldIfEmpty("portfolio");
    setUpdatedProfile((prev) => {
      const portfolio = [...(prev.portfolio || []), { title: "", link: "" }];
      return { ...prev, portfolio };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(profilePicutreError === "" && userImage){
    userImageMutation.mutate({
      userImage,
      freelancerId: profile?.id,
      token,
    });
    testProfilePictureMutation.mutate({
      userImage,
      freelancerId: profile?.id,
      token,
    });
  }
    mutation.mutate({ updatedProfile, token }); // Pass both the updated profile and token
  };


  const handleVerifyAccount = () => {
    navigate("/verify-account", { state: { freelancerData: profile } });
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center">Error: {error.message}</div>;

  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-lg font-normal text-brand-blue mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={profile.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-normal text-brand-blue mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={profile.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label htmlFor="bio" className="block text-lg font-normal text-brand-blue mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        {/* Working Hours */}
        <div className="mb-4">
          <label htmlFor="preferred_working_hours" className="block text-lg font-normal text-brand-blue mb-2">
            Preferred Working Hours
          </label>
          <select
            id="preferred_working_hours"
            name="preferred_working_hours"
            defaultValue={profile.preferred_working_hours}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select your preferred working hours</option>
            <option value="full_time">Full time (40 or more hrs/week)</option>
            <option value="part_time">Part time (Less than 40 hrs/week)</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div className="mb-4">
          <label htmlFor="profile_picture" className="block text-lg font-normal text-brand-blue mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
        </div>
        {profilePicutreError && <div className="text-red-500 mt-2">{profilePicutreError}</div>}

        {/* Certifications */}
        <div className="mb-4">
          <label htmlFor="certifications" className="block text-lg font-normal text-brand-blue mb-2">
            Certifications
          </label>
          {(updatedProfile.certifications || profile.certifications || []).map((item, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Title"
                value={item.title || ""}
                onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="url"
                placeholder="Link"
                value={item.link || ""}
                onChange={(e) => handleCertificationChange(index, "link", e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
            </div>
          ))}
          <button type="button" onClick={addCertification} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Certification
          </button>
        </div>

        {/* Portfolio */}
        <div className="mb-4">
          <label htmlFor="portfolio" className="block text-lg font-normal text-brand-blue mb-2">
            Portfolio
          </label>
          {(updatedProfile.portfolio || profile.portfolio || []).map((item, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Title"
                value={item.title || ""}
                onChange={(e) => handlePortfolioChange(index, "title", e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="url"
                placeholder="Link"
                value={item.link || ""}
                onChange={(e) => handlePortfolioChange(index, "link", e.target.value)}
                className="w-full border p-2 rounded mt-2"
              />
            </div>
          ))}
          <button type="button" onClick={addPortfolioLink} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Portfolio Link
          </button>
        </div>

        {/* Verify Account */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Verification Status</h3>
          {!verificationStatus ? (
            <button
              type="button"
              onClick={handleVerifyAccount}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            >
              Verify Account
            </button>
          ) : (
            <p className="mt-2 text-green-500 flex items-center">
              <FaCheckCircle className="mr-2" /> Verified
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          disabled={mutation.isLoading}

        >
      {mutation.isLoading ? "Updating..." : "Update Profile"}
        </button>
        {errorMessage && (
    <div className="text-red-500 mt-4 text-center">
      {typeof errorMessage === "string" && errorMessage.length<=100 ? errorMessage : "An error occurred. Please try again."}
    </div>
  )}
        {successMessage && <div className="text-green-500 text-center mt-4">{successMessage}</div>}
      </form>
    </div>
  );
};

export default UpdateProfilePage;
