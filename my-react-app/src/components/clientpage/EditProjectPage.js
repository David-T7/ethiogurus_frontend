import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: '',
    description: '',
    status: '',
    freelancers: [],
  });
  const [newFreelancer, setNewFreelancer] = useState({ name: '', role: '' });

  useEffect(() => {
    // Fetch project data
    const fetchProjectData = async () => {
      // Replace with actual API call
      const fetchedProject = {
        title: 'Website Redesign',
        description: 'Redesign the company website with a modern look and feel.',
        status: 'In Progress',
        freelancers: [
          { id: 1, name: 'John Doe', profilePic: null, role: 'Frontend Developer' },
        ],
      };
      setProject(fetchedProject);
    };
    
    fetchProjectData();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleFreelancerChange = (e) => {
    const { name, value } = e.target;
    setNewFreelancer({ ...newFreelancer, [name]: value });
  };

  const handleAddFreelancer = () => {
    if (newFreelancer.name && newFreelancer.role) {
      setProject({
        ...project,
        freelancers: [...project.freelancers, { id: Date.now(), ...newFreelancer }],
      });
      setNewFreelancer({ name: '', role: '' });
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    // Replace with actual API call
    console.log('Project updated:', project);
    navigate(`/projects/${projectId}`);
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 mt-6">
        <h1 className="text-4xl font-thin text-brand-blue mb-6 text-center">Edit Project</h1>

        <form onSubmit={handleUpdateProject}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-normal text-brand-blue mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
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
