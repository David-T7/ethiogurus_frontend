import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClientLayout from "./ClientLayoutPage";
import axios from "axios";

const CreateProjectPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  // Mutation for creating a project
  const createProjectMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("access");
      return await axios.post("http://127.0.0.1:8000/api/projects/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      setSuccessMessage("Project created successfully! Redirecting...");
      setTimeout(() => navigate("/projects"), 2000); // Redirect after 2 seconds
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Title and Description are required.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("budget", formData.budget);
    data.append("deadline", formData.deadline);

    createProjectMutation.mutate(data);
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-8 mt-8">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          Create New Project
        </h1>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Project Title */}
          <div className="p-3">
            <label
              htmlFor="title"
              className="block text-lg font-normal text-brand-blue mb-2"
            >
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

          {/* Project Description */}
          <div className="p-3">
            <label
              htmlFor="description"
              className="block text-lg font-normal text-brand-blue mb-2"
            >
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Project Budget */}
          <div className="p-3">
            <label
              htmlFor="budget"
              className="block text-lg font-normal text-brand-blue mb-2"
            >
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

          {/* Project Deadline */}
          <div className="p-3">
            <label
              htmlFor="deadline"
              className="block text-lg font-normal text-brand-blue mb-2"
            >
              Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
              disabled={createProjectMutation.isLoading}
            >
              {createProjectMutation.isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default CreateProjectPage;
