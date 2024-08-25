import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from './ClientLayoutPage';
import axios from 'axios';

const EditProjectPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [project , setProject] = useState()
  const [updatedProject, setUpdatedProject] = useState({ title: '', description: '' });

  useEffect(() => {
    const loadproject =  async () => { 
    const token = localStorage.getItem('access');
      const projectResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(projectResponse.data);
    }
    loadproject()
  }, []);

  useEffect(() => {
    if (project) {
      setUpdatedProject({ title: project.title || '', description: project.description || '' });
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const data = {
      title: updatedProject.title,
      description: updatedProject.description,
    };

    try {
      await axios.patch(`http://127.0.0.1:8000/api/projects/${id}/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-thin text-brand-blue mb-6 text-center">Edit Project</h1>
        <form onSubmit={handleUpdateProject}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={updatedProject.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-normal text-brand-blue mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={updatedProject.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default EditProjectPage;
