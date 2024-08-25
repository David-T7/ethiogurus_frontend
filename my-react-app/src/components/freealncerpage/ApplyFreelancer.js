import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaUser, FaEnvelope, FaPencilAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed

const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    position_applied_for: '',
    password: '',
    confirmPassword: '',
    resume_file: null,
  });
  const [positions, setPositions] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/services/'); // Replace with your API endpoint
        setPositions(response.data); // Assuming API returns an array of positions
        setLoading(false);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare form data for submission
    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('position_applied_for', formData.position_applied_for);
    data.append('password', formData.password);
    if (formData.resume_file) {
      data.append('resume_file', formData.resume_file);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/resumes/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // navigate('/home'); // Redirect after successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Introduction Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-normal text-brand-blue mb-4">
          Apply as a Freelancer
        </h2>
        <p className="text-lg text-brand-gray-dark">
          Join our network of top freelancers by filling out the application form below. 
          We are looking for talented professionals who are passionate about their work and ready to take on exciting projects.
        </p>
      </section>

      {/* Application Form */}
      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <h3 className="text-3xl font-normal text-brand-blue mb-6">Application Form</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="full_name" className="text-lg font-normal text-brand-blue">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Your Name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-normal text-brand-blue">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="position_applied_for" className="text-lg font-normal text-brand-blue">
              <FaPencilAlt className="inline mr-2" />
              Position Applying For
            </label>
            <select
              id="position_applied_for"
              name="position_applied_for"
              value={formData.position_applied_for}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.name}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-lg font-normal text-brand-blue">
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
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="confirmPassword" className="text-lg font-normal text-brand-blue ">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="resume_file" className="text-lg font-normal text-brand-blue">
              <FaFileAlt className="inline mr-2" />
              Resume
            </label>
            <input
              id="resume_file"
              name="resume_file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Submit Application
          </button>
        </form>
      </section>
    </div>
  );
};

export default ApplyAsFreelancer;
