import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaSpinner, FaUserPlus } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';
import { ProjectContext } from '../ProjectContext';

const ProjectDetailPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const { project, milestones, freelancers, loading, error, setProjectId } = useContext(ProjectContext);

  useEffect(() => {
    setProjectId(id);
  }, [id, setProjectId]);

  const calculateProgress = () => {
    if (milestones?.length === 0) return 0;
    const completedMilestones = milestones?.filter((milestone) => milestone.is_completed).length;
    return Math.round((completedMilestones / milestones?.length) * 100);
  };

  const handleEditProject = () => {
    navigate(`/project/${id}/edit`);
  };

  const handleCreateDispute = () => {
    navigate(`/project/${id}/createdispute`);
  };

  const handleAddFreelancer = () => {
    navigate(`/hire-talent/requirements`);
  };

  const handleContactFreelancer = (freelancerId) => {
    navigate(`/contact-freelancer/${freelancerId}`);
  };

  const progress = calculateProgress();

  return (
    <ClientLayout>
      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div className="flex justify-center p-2 mt-2">
          <FaSpinner className="animate-spin text-3xl text-brand-blue" />
        </div>
      ) : (
        project && (
          <div className="max-w-3xl mx-auto p-6 mt-6 mb-4 bg-brand-gray-light shadow-lg rounded-lg border border-gray-300">
            <div className="flex justify-between mb-6">
              <h1 className="text-4xl font-thin text-brand-blue flex items-center">
                {project.title}
                <span
                  className={`text-4xl font-thin ${ProjeectStatusStyle(project.status)}`}
                  style={{ minWidth: '100px', textAlign: 'center' }}
                >
                  ({project.status})
                </span>
              </h1>
              <div className="flex space-x-4">
                {(project.status === 'in_progress' || project.status === 'open') && (
                  <button
                    onClick={handleEditProject}
                    className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark-blue transition-transform transform hover:scale-105 shadow-md"
                  >
                    Edit Project
                  </button>
                )}
                {project.status === 'in_progress' && (
                  <button
                    onClick={handleCreateDispute}
                    className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-md"
                  >
                    Create Dispute
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-normal text-brand-blue mb-2">Project Details</h2>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <span className="block mt-2 text-sm text-gray-700">
                Created on: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Freelancer Section */}
            <div className="mb-8">
              <h2 className="text-xl font-normal text-brand-blue mb-4">Freelancers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freelancers?.length > 0 ? (
                  freelancers?.map((freelancer) => (
                    <div
                      key={freelancer.id}
                      className="flex items-center p-4 bg-brand-gray-light text-brand-gray-dark rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      {freelancer.profile_picture ? (
                        <img
                          src={`http://127.0.0.1:8000/${freelancer.profile_picture}`}
                          alt={`${freelancer.full_name}'s profile`}
                          className="w-12 h-12 rounded-full border-2 border-brand-blue"
                        />
                      ) : (
                        <FaUserCircle className="w-12 h-12 text-brand-dark-blue" />
                      )}
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-normal">{freelancer.full_name}</h3>
                        <p className="text-sm">{freelancer.professional_title}</p>
                      </div>
                      <button
                        onClick={() => handleContactFreelancer(freelancer.id)}
                        className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark-blue transition-transform transform hover:scale-105 shadow-md"
                      >
                        Contact
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-700">No freelancers yet.</div>
                )}
              </div>

              {freelancers?.length === 0 ? (
                <div className="mt-8">
                  <Link
                    to="/find-talent"
                    className="flex items-center md:w-[25%] justify-center bg-brand-green text-white px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-green-600"
                  >
                    <FaUserPlus className="mr-2" /> Hire a Talent
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAddFreelancer}
                  className="mt-4 bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark-blue transition-transform transform hover:scale-105 shadow-md"
                >
                  Add Freelancer
                </button>
              )}
            </div>

            {/* Milestones Section */}
            {milestones?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-normal text-brand-blue mb-4">Milestones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-6 rounded-lg shadow-md bg-brand-gray-light text-brand-gray-dark"
                    >
                      <h3 className="text-lg font-normal mb-2">{milestone.title}</h3>
                      <p className="mb-4">Status: {milestone.status}</p>
                      <p className="text-sm text-red-600">
                        Deadline: {new Date(milestone.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Completion Section */}
            {/* <div className="mb-4">
              <h2 className="text-xl font-normal text-brand-blue mb-2">Project Completion</h2>
              <div className="relative w-full h-6 bg-brand-gray-light rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-700">{progress}% completed</p>
            </div> */}
          </div>
        )
      )}
    </ClientLayout>
  );
};

const ProjeectStatusStyle = (status) => {
  switch (status) {
    case 'open':
      return 'text-yellow';
    case 'in_progress':
      return 'text-blue';
    case 'completed':
      return 'text-green';
    case 'cancelled':
      return 'text-red';
    default:
      return 'text-blue';
  }
};

export default ProjectDetailPage;
