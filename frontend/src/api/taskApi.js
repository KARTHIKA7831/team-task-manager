
 // Import axios instance
import axiosInstance from "./axiosInstance";

// Create a new task
const createTask = (projectId, taskData) => {
    return axiosInstance.post(`/projects/${projectId}/tasks`, taskData);
};

// Get all tasks
const getTasks = (projectId, filters = {}) => {
    return axiosInstance.get(`/projects/${projectId}/tasks`, {
        params: filters
    });
};

// Get one task
const getTaskById = (projectId, taskId) => {
    return axiosInstance.get(`/projects/${projectId}/tasks/${taskId}`);
};

// Update a task
const updateTask = (projectId, taskId, taskData) => {
    return axiosInstance.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
};

// Update task status or assignee
const updateTaskStatus = (projectId, taskId, taskData) => {
    return axiosInstance.patch(`/projects/${projectId}/tasks/${taskId}`, taskData);
};

// Delete a task
const deleteTask = (projectId, taskId) => {
    return axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);
};

// Export all task functions
export default {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask
};
