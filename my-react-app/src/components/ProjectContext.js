import React, { createContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../utils/decryptToken";
const ProjectContext = createContext();

const fetchProject = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  if (!id) return null; // Return early if id is not available
  const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancers = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  if (!id) return []; // Return empty array if id is not available
  const response = await axios.get(
    `http://127.0.0.1:8000/api/projects/${id}/freelancers/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const fetchMilestones = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  if (!id) return []; // Return empty array if id is not available
  const response = await axios.get(
    `http://127.0.0.1:8000/api/projects/${id}/milestones/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const ProjectProvider = ({ children }) => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [projectId, setProjectId] = useState(null);

  // Fetch project data
  const {
    data: project,
    isLoading: loadingProject,
    isError: projectError,
  } = useQuery({
    queryKey: ["project", projectId, token],
    queryFn: fetchProject,
    enabled: !!projectId, // Only run query when projectId is available
  });

  // Fetch freelancers
  const {
    data: freelancers,
    isLoading: loadingFreelancers,
    isError: freelancersError,
  } = useQuery({
    queryKey: ["freelancers", projectId, token],
    queryFn: fetchFreelancers,
    enabled: !!projectId, // Only run query when projectId is available
  });

  // Fetch milestones
  const {
    data: milestones,
    isLoading: loadingMilestones,
    isError: milestonesError,
  } = useQuery({
    queryKey: ["milestones", projectId, token],
    queryFn: fetchMilestones,
    enabled: !!projectId, // Only run query when projectId is available
  });

  // Combine loading and error states
  const loading = loadingProject || loadingFreelancers || loadingMilestones;
  const error = projectError || freelancersError || milestonesError;

  return (
    <ProjectContext.Provider
      value={{ project, milestones, freelancers, loading, error, setProjectId }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };
