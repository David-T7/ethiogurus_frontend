import React, { useState } from 'react';
import { FaFileAlt, FaUser, FaEnvelope, FaPhone, FaPencilAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const positions = [
  'React Developer',
  'Django Developer',
  'Node.js Developer',
  'Python Developer',
  'UI/UX Designer',
  'Project Manager',
  'DevOps Engineer',
  'AWS Specialist'
];

const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    password: '',
    confirmPassword: '',
    resume: null,
  });
  const navigate = useNavigate();


  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle form submission logic here
    navigate('/home'); // Change this to the actual path for the next step
  };

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Introduction Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-brand-blue mb-4">
          Apply as a Freelancer
        </h2>
        <p className="text-lg text-brand-gray-dark">
          Join our network of top freelancers by filling out the application form below. 
          We are looking for talented professionals who are passionate about their work and ready to take on exciting projects.
        </p>
      </section>

      {/* Application Form */}
      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <h3 className="text-3xl font-semibold text-brand-blue mb-6">Application Form</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-medium text-brand-blue">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-medium text-brand-blue">
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
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="position" className="text-lg font-medium text-brand-blue">
              <FaPencilAlt className="inline mr-2" />
              Position Applying For
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-lg font-medium text-brand-blue">
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
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="confirmPassword" className="text-lg font-medium text-brand-blue ">
              <FaLock className="inline mr-2" />
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="resume" className="text-lg font-medium text-brand-blue">
              <FaFileAlt className="inline mr-2" />
              Resume
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="p-3 border rounded-lg border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
