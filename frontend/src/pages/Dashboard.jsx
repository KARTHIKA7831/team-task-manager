
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Import dashboard API
import dashboardApi from "../api/dashboardApi";

// Create Dashboard component
function Dashboard() {

    // Get project ID from URL
    const { projectId } = useParams();

    // Store dashboard details
    const [dashboard, setDashboard] = useState(null);

    // Store loading status
    const [loading, setLoading] = useState(true);

    // Store error message
    const [error, setError] = useState("");

    // Fetch dashboard data when the page loads
    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await dashboardApi.getDashboard(projectId);

                setDashboard(response.data.dashboard);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        if (projectId) {
            fetchDashboard();
        }

    }, [projectId]);

    // Show loading message
    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    // Show error message
    if (error) {
        return <p>{error}</p>;
    }

    // Show message if dashboard data is empty
    if (!dashboard) {
        return <p>No dashboard data available</p>;
    }

    // Display dashboard information
    

return (
    <div className="dashboard-container">

        <h1>Project Dashboard</h1>

        <div className="dashboard-cards">

            <div className="dashboard-card">
                <h3>To do</h3>
                <h2>{dashboard.todoCount}</h2>
            </div>

            <div className="dashboard-card">
                <h3>In Progress</h3>
                <h2>{dashboard.inProgressCount}</h2>
            </div>

            <div className="dashboard-card">
                <h3>Done</h3>
                <h2>{dashboard.doneCount}</h2>
            </div>

            <div className="dashboard-card">
                <h3>Overdue</h3>
                <h2>{dashboard.overdueCount}</h2>
            </div>
            
<h2>Open Tasks Per Member</h2>

<div>
    {dashboard.openTasksPerMember.map((member) => (
        <div key={member.userId}>

            <h3>{member.name}</h3>

            <p>Role: {member.role}</p>

            <p>Open Tasks: {member.openTasks}</p>

        </div>
    ))}
</div>


        </div>

    </div>
);

}
export default Dashboard;
