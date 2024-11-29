import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import ClientLayout from './ClientLayoutPage';
import axios from 'axios';

const fetchProject = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateProject = async ({ id, updatedProject, token }) => {
  const response = await axios.patch(`http://127.0.0.1:8000/api/projects/${id}/`, updatedProject, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const EditProjectPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const [updatedProject, setUpdatedProject] = useState({ title: '', description: '' });

  // Fetch the project data
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id, token],
    queryFn: fetchProject,
  });

  // Populate the `updatedProject` state when `project` data is fetched
  useEffect(() => {
    if (project) {
      setUpdatedProject({ title: project.title || '', description: project.description || '' });
    }
  }, [project]);

  // Mutation for updating the project
  const mutation = useMutation({
    mutationFn: (data) => updateProject(data),
    onSuccess: () => {
      navigate(`/projects/${id}`);
    },
    onError: (error) => {
      console.error('Failed to update project:', error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    mutation.mutate({ id, updatedProject, token });
  };

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (isError) {
    return <div>Failed to load project. Please try again.</div>;
  }

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
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default EditProjectPage;
