
import axiosInstance from "./axiosInstance";

// Get all comments
const getComments = (projectId, taskId) => {
    return axiosInstance.get(
        `/projects/${projectId}/tasks/${taskId}/comments`
    );
};

// Create a comment
const createComment = (projectId, taskId, text) => {
    return axiosInstance.post(
        `/projects/${projectId}/tasks/${taskId}/comments`,
        { text }
    );
};

// Delete a comment
const deleteComment = (projectId, taskId, commentId) => {
    return axiosInstance.delete(
        `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
    );
};

// Export all comment functions
export default {
    getComments,
    createComment,
    deleteComment
};
