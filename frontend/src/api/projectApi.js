
// Import axios instance
import axiosInstance from "./axiosInstance";

// Create a new project
const createProject = (projectData) => {
    return axiosInstance.post("/projects", projectData);
};

// Get all projects
const getProjects = () => {
    return axiosInstance.get("/projects");
};

// Get one project
const getProjectById = (projectId) => {
    return axiosInstance.get(`/projects/${projectId}`);
};

// Update a project
const updateProject = (projectId, projectData) => {
    return axiosInstance.put(`/projects/${projectId}`, projectData);
};

// Delete a project
const deleteProject = (projectId) => {
    return axiosInstance.delete(`/projects/${projectId}`);
};

// Add a member to project
const addMember = (projectId, email) => {
    return axiosInstance.post(
        `/projects/${projectId}/members`,
        { email }
    );
};

// Remove a project member
const removeMember = (projectId, userId) => {
    return axiosInstance.delete(
        `/projects/${projectId}/members/${userId}`
    );
};

// Export all project functions
export default {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember
};
