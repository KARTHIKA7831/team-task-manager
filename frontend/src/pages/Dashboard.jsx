
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Import dashboard API
import dashboardApi from "../api/dashboardApi";

import './Dashboard.css';

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

        {/* Dashboard heading */}
        <div className="dashboard-header">
            <p className="dashboard-label">PROJECT OVERVIEW</p>
            <h1>Project Dashboard</h1>
            <p className="dashboard-subtitle">
                Track your team's task progress
            </p>
        </div>

        {/* Dashboard summary cards */}
        <div className="dashboard-cards">

            {/* To do card */}
            <div className="dashboard-card todo-card">
                <div className="dashboard-card-icon">📝</div>
                <h3>To Do</h3>
                <h2>{dashboard.todoCount}</h2>
                <p>Tasks waiting to start</p>
            </div>

            {/* In Progress card */}
            <div className="dashboard-card progress-card">
                <div className="dashboard-card-icon">⏳</div>
                <h3>In Progress</h3>
                <h2>{dashboard.inProgressCount}</h2>
                <p>Tasks currently working on</p>
            </div>

            {/* Done card */}
            <div className="dashboard-card done-card">
                <div className="dashboard-card-icon">✅</div>
                <h3>Completed</h3>
                <h2>{dashboard.doneCount}</h2>
                <p>Tasks successfully completed</p>
            </div>

            {/* Overdue card */}
            <div className="dashboard-card overdue-card">
                <div className="dashboard-card-icon">⚠️</div>
                <h3>Overdue</h3>
                <h2>{dashboard.overdueCount}</h2>
                <p>Tasks past their due date</p>
            </div>

        </div>

        {/* Member task details */}
        <div className="member-section">

            <div className="member-section-header">
                <h2>Open Tasks Per Member</h2>
                <p>Track pending work assigned to each team member</p>
            </div>

            <div className="member-list">

                {dashboard.openTasksPerMember.map((member) => (

                    <div className="member-card" key={member.userId}>

                        <div className="member-info">
                            <div className="member-avatar">
                                {member.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        </div>

                        <div className="member-task-count">
                            <span>Open Tasks</span>
                            <h2>{member.openTasks}</h2>
                        </div>

                    </div>

                ))}

            </div>

        </div>

    </div>
);

}
export default Dashboard;
