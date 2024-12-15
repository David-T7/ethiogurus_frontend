import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { decryptToken } from "../../utils/decryptToken";

// Utility to get and decrypt the token
const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem("access");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  return decryptToken(encryptedToken, secretKey);
};

// Fetch freelancer settings
const fetchSettings = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update freelancer settings
const updateSettings = async ({ settings, token }) => {
  const updateData = {
    account_status: settings.status,
    selected_payment_method: settings.paymentMethods.map((method) => ({
      name: method.name,
      details: method.details,
    })),
  };
  await axios.patch("http://127.0.0.1:8000/api/user/freelancer/manage/", updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const FreelancerSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    status: "",
    paymentMethods: [],
  });
  const [verificationStatus, setVerificationStatus] = useState(false);

  const token = getDecryptedToken(); // Decrypt the token once and reuse it
  const [successMessage , setSuccessMessage] = useState("")
  const [errorMessage , setErrorMessage] = useState("")
  // Fetch settings using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["freelancerSettings", token], // Include token in queryKey
    queryFn: () => fetchSettings(token), // Pass token explicitly
    enabled: !!token, // Only run query if token is available
    retry: false, // Avoid infinite retry loop if token is invalid
  });

  useEffect(() => {
    if (data) {
      setSettings({
        status: data.account_status || "",
        paymentMethods: data.selected_payment_method || [],
      });
      setVerificationStatus(data.verified);
    }
  }, [data]);

  // Mutation for saving settings
  const mutation = useMutation({
    mutationFn: (data) => updateSettings(data), // Pass both settings and token
    onSuccess: () => {
      setSuccessMessage("Settings saved successfully!");
      setErrorMessage("")
    },
    onError: () => {
      setErrorMessage("Failed to save settings. Please try again.");
      setSuccessMessage("")
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (index, field, value) => {
    const updatedPaymentMethods = settings.paymentMethods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    );
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: updatedPaymentMethods,
    }));
  };

  const handleAddPaymentMethod = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: [...prevSettings.paymentMethods, { name: "", details: "" }],
    }));
  };

  const handleRemovePaymentMethod = (index) => {
    const updatedPaymentMethods = settings.paymentMethods.filter((_, i) => i !== index);
    setSettings((prevSettings) => ({
      ...prevSettings,
      paymentMethods: updatedPaymentMethods,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ settings, token }); // Pass both settings and token
  };

  const handleVerifyAccount = () => {
    navigate("/verify-account", { state: { freelancerData: data } });
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center">Error: {error.message}</div>;

  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <form onSubmit={handleSubmit}>
        {/* Account Preferences */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Account Preferences</h3>
          <div className="mb-4">
            <label htmlFor="status" className="block text-lg font-normal text-brand-blue mb-2">
              Avaliablity Status
            </label>
            <select
              id="status"
              name="status"
              value={settings.status || "avaliable"}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="avaliable">Avaliable</option>
              <option value="not avaliable">Not Avaliable</option>
            </select>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-xl font-normal text-brand-blue mb-4">Payment Methods</h3>
          {settings.paymentMethods.map((method, index) => (
            <div key={index} className="mb-4">
              <label htmlFor="paymentmethod" className="block text-lg font-normal text-brand-blue mb-2">
                Payment Method
              </label>
              <input
                type="text"
                name="paymentmethod"
                value={method.name}
                onChange={(e) => handlePaymentMethodChange(index, "name", e.target.value)}
                className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter payment method name"
              />
              <label htmlFor="details" className="block text-lg font-normal text-brand-blue mb-2">
                Payment Method Details
              </label>
              <textarea
                name="details"
                value={method.details}
                onChange={(e) => handlePaymentMethodChange(index, "details", e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
                placeholder="Enter payment details"
              />
              <button
                type="button"
                onClick={() => handleRemovePaymentMethod(index)}
                className="mt-2 text-red-500 hover:text-red-700 text-md"
              >
                Remove Payment Method
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPaymentMethod}
            className="mt-2 text-blue-500 hover:text-blue-700 text-md"
          >
            Add Payment Method
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
        >
          Save Settings
        </button>
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
      </form>
    </div>
  );
};

export default FreelancerSettingsPage;
