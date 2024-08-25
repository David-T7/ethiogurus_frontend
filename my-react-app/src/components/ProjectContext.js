// ProjectContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = async (id) => {
    try {
      const token = localStorage.getItem('access');
      setLoading(true);
      const projectResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(projectResponse.data);

      const freelancersResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/freelancers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFreelancers(freelancersResponse.data);

      const milestonesResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/milestones/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMilestones(milestonesResponse.data);
    } catch (err) {
      setError('Failed to fetch project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{ project, milestones, freelancers, loading, error, fetchProjectDetails }}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };
