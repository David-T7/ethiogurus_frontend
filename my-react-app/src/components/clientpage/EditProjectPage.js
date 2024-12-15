import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import ClientLayout from './ClientLayoutPage';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
import { FaTrashAlt } from 'react-icons/fa'; // Import the delete icon

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

const deleteProject = async ({ id, token }) => {
  const response = await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const EditProjectPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [updatedProject, setUpdatedProject] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({ title: '', description: '' }); // Error state

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

  const updateMutation = useMutation({
    mutationFn: (data) => updateProject(data),
    onSuccess: () => {
      navigate(`/projects/${id}`);
    },
    onError: (error) => {
      console.error('Failed to update project:', error);
  
      // Check for title already exists error and update the errors state
      if (error.response && error.response.data && error.response.data.title) {
        setErrors((prevState) => ({
          ...prevState,
          title: error.response.data.title, // Set title error from server response
        }));
      } else {
        // Handle other errors
        setErrors({});
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data) => deleteProject(data),
    onSuccess: () => {
      navigate('/projects');
    },
    onError: (error) => {
      console.error('Failed to delete project:', error);
  
      // Check for the validation error (Project associated with active contract)
      if (error.response && error.response.data && error.response.data.project) {
        // Set the error to be displayed in the UI
        setErrors((prevState) => ({
          ...prevState,
          project: error.response.data.project, // Project-specific error message
        }));
      } else {
        // Handle other errors
        setErrors({});
      }
    },
  });

  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [canDelete, setCanDelete] = useState(false); // State to track if the user can delete

  // Check if the user has permission to delete
  useEffect(() => {
    if (project) {
      // Assume the project has a field 'owner' or 'user' that corresponds to the creator of the project
      const userId = token?.userId; // You should retrieve the userId from the token
      setCanDelete(project.owner === userId); // If the logged-in user is the owner, they can delete
    }
  }, [project, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();

    // Basic validation before submitting
    let validationErrors = {};
    if (!updatedProject.title.trim()) {
      validationErrors.title = 'Title is required';
    }
    if (!updatedProject.description.trim()) {
      validationErrors.description = 'Description is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show validation errors
    } else {
      setErrors({}); // Clear any previous errors
      updateMutation.mutate({ id, updatedProject, token });
    }
  };

  const handleDeleteProject = () => {
    if (canDelete) {
      deleteMutation.mutate({ id, token });
      setShowModal(false); // Close modal after deletion
    } else {
      alert('You are not authorized to delete this project.');
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal without deleting
  };

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (isError) {
    return <div>Failed to load project. Please try again.</div>;
  }

  return (
    <ClientLayout>
      <div className="max-w-lg mx-auto p-6 mt-6 relative">
        <h1 className="text-3xl font-thin text-brand-blue mb-6 text-center">Edit Project</h1>
        {errors.project && (
        <div className="text-red-600 text-md mb-4">{errors.project}</div>
      )}
        {/* Delete Icon */}
        {canDelete && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute top-9 right-8 text-xl text-red-600 hover:text-red-800"
          >
            <FaTrashAlt />
          </button>
        )}

        <form onSubmit={handleUpdateProject} className="flex flex-col items-center">
          <div className="mb-6 w-full">
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
            {errors.title && (
              <div className="text-red-600 text-md mt-2">{errors.title}</div> // Error message below title input
            )}
          </div>

          <div className="mb-6 w-full">
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
            {errors.description && (
              <div className="text-red-600 text-sm mt-2">{errors.description}</div> // Error message below description input
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 w-[50%] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Updating...' : 'Update Project'}
          </button>
           {/* Display error if project is associated with an active contract */}
    
        </form>

       {/* Modal for Delete Confirmation */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-lg font-normal mb-4">
        Are you sure you want to delete this project?
      </h2>

      <div className="flex justify-between">
        <button
          onClick={handleDeleteProject}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
        >
          Yes, Delete
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </ClientLayout>
  );
};

export default EditProjectPage;
