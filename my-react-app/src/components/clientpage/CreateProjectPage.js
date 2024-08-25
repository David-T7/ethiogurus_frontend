import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import ClientLayout from './ClientLayoutPage';
import { useNavigate } from 'react-router-dom';

const CreateProjectPage = () => {
  // State management for project fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for required fields
    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      setLoading(false); // Reset loading state if validation fails
      return;
    }

    const token = localStorage.getItem('access');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('budget', formData.budget);
    data.append('deadline', formData.deadline);

    try {
      // Send POST request to create project
      const response = await axios.post('http://127.0.0.1:8000/api/projects/', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Project created with details:', response.data);

      // Display success message
      setSuccessMessage('Project created successfully! Redirecting...');
      
      // Wait for 2 seconds and then navigate to the projects page
      setTimeout(() => {
        navigate("/projects");
      }, 2000);
    } catch (err) {
      console.error('Error creating project:', err);
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-8 mt-8">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          Create New Project
        </h1>

        {/* Display success message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="p-3">
            <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Description Input */}
          <div className="p-3">
            <label htmlFor="description" className="block text-lg font-normal text-brand-blue mb-2">
              Project Description
            </label>
            <textarea
              value={formData.description}
              name="description"
              onChange={handleChange}
              placeholder="Enter project description"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Budget Input (Optional) */}
          <div className="p-3">
            <label htmlFor="budget" className="block text-lg font-normal text-brand-blue mb-2">
              Budget (Optional)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Deadline Input (Optional) */}
          <div className="p-3">
            <label htmlFor="deadline" className="block text-lg font-normal text-brand-blue mb-2">
              Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              name="deadline"
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default CreateProjectPage;
