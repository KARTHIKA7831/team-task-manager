
import axiosInstance from "./axiosInstance";

// Get project dashboard
const getDashboard = (projectId) => {
    return axiosInstance.get(
        `/projects/${projectId}/dashboard`
    );
};

// Export dashboard API
export default {
    getDashboard
};
