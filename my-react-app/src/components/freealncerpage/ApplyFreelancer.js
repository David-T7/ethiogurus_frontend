import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaUser, FaEnvelope, FaAward , FaPencilAlt, FaLock,FaList , FaEye, FaEyeSlash, FaChalkboardTeacher, FaCode, FaBullhorn, FaPaintBrush, FaWallet, FaCogs } from 'react-icons/fa';  // Import relevant icons
import axios from 'axios';  // Ensure axios is installed

const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    field: '',  // Selected field
    services: [],
    password: '',
    confirmPassword: '',
    resume_file: null,
  });
  const [fields, setFields] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // To handle dropdown visibility
  const [loading, setLoading] = useState(true); // To handle loading state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch fields and services from API
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldResponse = await axios.get('http://127.0.0.1:8000/api/fields/');
        setFields(fieldResponse.data);  // Assuming response contains a list of fields
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Fetch services based on the selected field
useEffect(() => {
  if (formData.field) {
    const fetchServices = async () => {
      try {
        const serviceResponse = await axios.get(`http://127.0.0.1:8000/api/field-services/?field_id=${formData.field}`);
        console.log("Service response:", serviceResponse.data);
        
        // Check for a successful response and if services are available
        if (serviceResponse.status === 200 && serviceResponse.data.length > 0) {
          setAvailableServices(serviceResponse.data);
        } else {
          setAvailableServices([]);  // No services found for this field
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setAvailableServices([]);  // Clear services on error
      }
    };

    fetchServices();
  } else {
    setAvailableServices([]);  // Clear services if no field is selected
  }
}, [formData.field]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'services') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

    // Check if password length is at least 5 characters
    if (formData.password.length < 5) {
    alert("Password must be at least 5 characters long!");
    return;
    }

    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.resume_file) {
      data.append('resume_file', formData.resume_file);
    }

    formData.services.forEach(service => {
      data.append('applied_positions', service);
    });

    console.log("fromd data before sending ")
    try {
      await axios.post('http://127.0.0.1:8000/api/resumes/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage("Application successful! Watch out for emails regarding your results.");
      // navigate('/home'); // Redirect after successful submission
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;

        // Check for email already used error and display a specific message
        if (backendErrors.email) {
         if (error.response && error.response.data) {
        const backendErrors = error.response.data;

        // Check for email already used error and display a specific message
        if (backendErrors.email) {
          alert("Email already in use!")
        }
      console.error('Error submitting application:', error);
    }}}}
  };

  if (loading) return <p>Loading...</p>;

  // Icons for the fields
  const getFieldIcon = (fieldName) => {
    switch (fieldName) {
      case 'Project Manager':
        return <FaChalkboardTeacher className="text-brand-blue mr-2" />;
      case 'Developer':
        return <FaCode className="text-brand-blue mr-2" />;
      case 'Marketing Expert':
        return <FaBullhorn className="text-brand-blue mr-2" />;
      case 'Designer':
        return <FaPaintBrush className="text-brand-blue mr-2" />;
      case 'Finance Expert':
        return <FaWallet className="text-brand-blue mr-2" />;
      case 'Product Manager':
        return <FaCogs className="text-brand-blue mr-2" />;
      default:
        return <FaCode className="text-brand-blue mr-2" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">

      {/* Introduction Section */}
      <section className="text-center mb-5">
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
              className="w-full border border-gray-300 p-2 rounded-lg"
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
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="field" className="text-lg font-normal text-brand-blue">
            <FaAward  className="inline mr-2"/>
            Field of Expertise
            </label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="cursor-pointer w-full border border-gray-300 p-2 rounded-lg flex justify-between items-center"
            >
              <span>{formData.field ? fields.find(f => f.id === formData.field).name : 'Select a Field'}</span>
              {getFieldIcon(formData.field ? fields.find(f => f.id === formData.field).name : '')}
            </div>
            {dropdownOpen && (
              <div className="absolute w-full mt-20 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    onClick={() => {
                      setFormData({ ...formData, field: field.id });
                      setDropdownOpen(false);
                    }}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {getFieldIcon(field.name)}
                    <div className="ml-2">
                      <span className="font-semibold">{field.name}</span>
                      <p className="text-sm text-gray-500">{field.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.field && (
            <div className="flex flex-col gap-2">
              <label htmlFor="services" className="text-lg font-normal text-brand-blue">
              <FaList  className="inline mr-2" />
              Services Offered
              </label>
              <select
                id="services"
                name="services"
                multiple
                value={formData.services}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                {availableServices.length === 0 ? (
                  <option disabled>No services available</option>
                ) : (
                  availableServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

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
            <label htmlFor="confirmPassword" className="text-lg font-normal text-brand-blue">
              <FaLock className="inline mr-2" />
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="resume_file" className="text-lg font-normal text-brand-blue">
            <FaFileAlt className="inline mr-2" />
            Upload Resume
            </label>
            <input
              id="resume_file"
              name="resume_file"
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
            >
            Submit Application
          </button>

          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

        </form>
      </section>
    </div>
  );
};

export default ApplyAsFreelancer;
