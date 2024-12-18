import React, { useState } from "react";
import {
  FaEnvelope,
  FaBuilding,
  FaUser,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinalizePage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    contactName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For success or error messages
  const [errors, setErrors] = useState({}); // For field-specific errors
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.contactName) {
      newErrors.contactName = "Contact name is required.";
    }
    if (!formData.password || formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (formData.phoneNumber && !/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number (e.g., +251911234567).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setMessage(""); // Reset the message

    const data = new FormData();
    data.append("company_name", formData.companyName);
    data.append("email", formData.email);
    data.append("contact_person", formData.contactName);
    data.append("password", formData.password);
    data.append("phone_number", formData.phoneNumber);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/client/",
        data
      );
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setLoading(false);
      setMessage("Registration successful! Please.Please Verify your email using the link sent to your email.");
      // setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        // Check if the error is related to the email already existing
        if (error.response.data.email) {
          setErrors({ ...errors, email: "Email already exists." });
        } else {
          setMessage("Error submitting registration. Please try again.");
        }
      } else {
        setMessage("Error submitting registration. Please try again.");
      }
      console.error("Error submitting application:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors for the field being updated
  };

  return (
    <div className="container mx-w-md mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-thin text-brand-blue mb-6">
          Complete Your Registration
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaEnvelope className="text-brand-blue mr-2" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-md">{errors.email}</span>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaLock className="inline mr-2" />
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-md">{errors.password}</span>
            )}
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaLock className="inline mr-2" />
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              type={confirmPasswordVisible ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-md">{errors.confirmPassword}</span>
            )}
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="companyName"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaBuilding className="text-brand-blue mr-2" />
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="contactName"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaUser className="text-brand-blue mr-2" />
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Enter your contact name"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.contactName && (
              <span className="text-red-500 text-md">{errors.contactName}</span>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-normal text-brand-blue mb-2 flex items-center"
            >
              <FaPhone className="text-brand-blue mr-2" />
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+251 91 123 4567"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default FinalizePage;
