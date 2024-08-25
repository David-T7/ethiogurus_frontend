import React, { useState } from 'react';
import { FaEnvelope, FaBuilding, FaUser, FaPhone , FaLock , FaEye , FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinalizePage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    contactName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const data = new FormData();
    data.append('company_name', formData.companyName);
    data.append('email', formData.email);
    data.append('contact_person', formData.contactName);
    data.append('password', formData.password);
    data.append('phone_number', formData.phoneNumber);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/client/', data,);
      const { access, refresh } = response.data;
      // Save tokens to localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      navigate("/login")
      // navigate('/home'); // Redirect after successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-normal text-brand-blue mb-6">
          Complete Your Registration
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
              <FaEnvelope className="text-brand-blue mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
              <FaLock className="inline mr-2" />
              Password
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
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword"  className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
              <FaLock className="inline mr-2" />
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={"password"}
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="companyName" className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
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
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="contactName" className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
              <FaUser className="text-brand-blue mr-2" />
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Enter your contact name"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="phoneNumber" className="block text-lg font-normal text-brand-blue mb-2 flex items-center">
              <FaPhone className="text-brand-blue mr-2" />
              Phone Number (Optional)
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
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Sign Up
          </button>
        </form>
      </section>
    </div>
  );
};

export default FinalizePage;
