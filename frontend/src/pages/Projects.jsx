
 // Import useState and useEffect
import { useState, useEffect } from "react";

// Import project API functions
import projectApi from "../api/projectApi";

// Import Navbar component
import Navbar from "../components/Navbar";

// Import useNavigate
import { useNavigate } from "react-router-dom";

import './Projects.css';

// Create Projects component
function Projects() {

    // Store all projects
    const [projects, setProjects] = useState([]);

    // Store project name
    const [name, setName] = useState("");

    // Store project description
    const [description, setDescription] = useState("");

    // Store the project ID currently being edited
    const [editingProjectId, setEditingProjectId] = useState(null);

    // Store loading status
    const [loading, setLoading] = useState(true);

    // Store error message
    const [error, setError] = useState("");

    // Store member email
const [memberEmail, setMemberEmail] = useState("");

// Store member message
const [memberMessage, setMemberMessage] = useState("");

    // Get all projects from backend
const getProjects = () => {

    // Call Get Projects API
    projectApi.getProjects()

        .then((response) => {

            // Store projects from backend
            setProjects(response.data.projects);

            // Stop loading
            setLoading(false);

        })

        .catch((error) => {

            // Display error message
            setError(
                error.response?.data?.message ||
                "Failed to load projects"
            );

            // Stop loading
            setLoading(false);

        });
};

// Get projects when page opens
useEffect(() => {

    // Fetch projects from backend
    projectApi.getProjects()

        .then((response) => {

            // Store projects
            setProjects(response.data.projects);

            // Stop loading
            setLoading(false);

        })

        .catch((error) => {

            // Display error message
            setError(
                error.response?.data?.message ||
                "Failed to load projects"
            );

            // Stop loading
            setLoading(false);

        });

}, []);
    // Handle project form submission
    const handleCreate = (e) => {

        // Prevent page refresh
        e.preventDefault();

        // Clear previous error
        setError("");

        // Check project name
        if (!name.trim()) {

            // Display error message
            setError("Enter project name");

            return;
        }

        // Check whether user is editing a project
        if (editingProjectId) {

            // Update existing project
            projectApi.updateProject(editingProjectId, {
                name: name.trim(),
                description: description
            })

            .then(() => {

                // Clear project name
                setName("");

                // Clear project description
                setDescription("");

                // Clear editing project ID
                setEditingProjectId(null);

                // Refresh project list
                getProjects();

            })

            .catch((error) => {

                // Display update error
                setError(
                    error.response?.data?.message ||
                    "Update failed"
                );

            });

        } else {

            // Create a new project
            projectApi.createProject({
                name: name.trim(),
                description: description
            })

            .then(() => {

                // Clear project name
                setName("");

                // Clear project description
                setDescription("");

                // Refresh project list
                getProjects();

            })

            .catch((error) => {

                // Display create error
                setError(
                    error.response?.data?.message ||
                    "Create failed"
                );

            });
        }
    };

    // Handle Edit button click
    const handleUpdate = (project) => {

        // Clear previous error
        setError("");

        // Get existing project name
        setName(project.name);

        // Get existing project description
        setDescription(project.description || "");

        // Store project ID
        setEditingProjectId(project._id);

    };

    // Cancel editing
    const handleCancel = () => {

        // Clear project name
        setName("");

        // Clear project description
        setDescription("");

        // Clear editing project ID
        setEditingProjectId(null);

        // Clear error
        setError("");

    };

    // Delete a project
    const handleDelete = (id) => {

        // Ask for confirmation
        if (!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }

        // Call Delete Project API
        projectApi.deleteProject(id)

            .then(() => {

                // Refresh project list
                getProjects();

            })

            .catch((error) => {

                // Display delete error
                setError(
                    error.response?.data?.message ||
                    "Failed to delete project"
                );

            });
    };

    // Handle adding a member
const handleAddMember = (e, projectId) => {

    // Prevent page refresh
    e.preventDefault();

    // Clear previous message
    setMemberMessage("");

    // Check email
    if (!memberEmail.trim()) {
        setMemberMessage("Enter member email");
        return;
    }

    // Call Add Member API
    projectApi.addMember(projectId, memberEmail)

        .then((response) => {

            // Show success message
            setMemberMessage(response.data.message);

            // Clear email
            setMemberEmail("");

        })

        .catch((error) => {

            // Show error message
            setMemberMessage(
                error.response?.data?.message ||
                "Failed to add member"
            );

        });
};

// Handle removing a member
const handleRemoveMember = (projectId, userId) => {

    // Ask for confirmation
    if (!window.confirm("Are you sure you want to remove this member?")) {
        return;
    }

    // Call Remove Member API
    projectApi.removeMember(projectId, userId)

        .then((response) => {

            // Show success message
            setMemberMessage(response.data.message);

            // Refresh project list
            getProjects();

        })

        .catch((error) => {

            // Show error message
            setMemberMessage(
                error.response?.data?.message ||
                "Failed to remove member"
            );

        });
};

    // Create navigation function
const navigate = useNavigate();

// Handle logout
const handleLogout = () => {

    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove user ID from localStorage
    localStorage.removeItem("userId");

    // Navigate to Login page
    navigate("/login", { replace: true });
};

    // Display Projects page
    

return (
    <div className="projects-page">

        {/* Display Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="projects-content">

            {/* Page heading */}
            <div className="projects-header">

                <div>
                    <p className="page-label">WORKSPACE</p>

                    <h1>My Projects</h1>

                    <p className="page-description">
                        Manage your projects and team members
                    </p>
                </div>

                {/* Logout button */}
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* Create / Edit Project */}
            <div className="project-form-card">

                <h2>
                    {editingProjectId ? "Edit Project" : "Create Project"}
                </h2>

                <form onSubmit={handleCreate}>

                    <div className="project-form-fields">

                        {/* Project Name */}
                        <div className="project-field">

                            <label>Project Name</label>

                            <input
                                type="text"
                                placeholder="Enter project name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={60}
                                required
                            />

                        </div>

                        {/* Project Description */}
                        <div className="project-field">

                            <label>Project Description</label>

                            <textarea
                                placeholder="Enter project description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                        </div>

                    </div>

                    {/* Form buttons */}
                    <div className="project-form-actions">

                        <button type="submit" className="primary-button">
                            {editingProjectId ? "Update Project" : "Create Project"}
                        </button>

                        {editingProjectId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            {/* Loading message */}
            {loading && (
                <p className="status-message">Loading projects...</p>
            )}

            {/* Error message */}
            {error && (
                <p className="error-message">{error}</p>
            )}

            {/* Empty projects message */}
            {!loading && !error && projects.length === 0 && (
                <p className="empty-message">
                    No projects found. Create your first project!
                </p>
            )}

            {/* Projects list */}
            {!loading && projects.length > 0 && (

                <div className="projects-section">

                    <h2>Your Projects</h2>

                    <div className="projects-grid">

                        {projects.map((project) => (

                            <div className="project-card" key={project._id}>

                                {/* Project details */}
                                <div className="project-card-header">

                                    <h3>{project.name}</h3>

                                    <p>
                                        {project.description || "No description available"}
                                    </p>

                                </div>

                                {/* Team members */}
                                <div className="members-section">

                                    <h4>Team Members</h4>

                                    <div className="member-list">

                                        {project.members?.map((member) => {

                                            const user = member.user;
                                            const userId = user?._id || user;

                                            const ownerId =
                                                project.owner?._id || project.owner;

                                            if (String(userId) === String(ownerId)) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    className="member-row"
                                                    key={userId}
                                                >

                                                    <span>
                                                        {user?.name || "Team Member"}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="remove-button"
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                project._id,
                                                                userId
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>
                                            );
                                        })}

                                    </div>

                                </div>

                                {/* Project action buttons */}
                                <div className="project-actions">

                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() => handleUpdate(project)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDelete(project._id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                                {/* Navigation buttons */}
                                <div className="project-navigation">

                                    <button
                                        type="button"
                                        className="view-tasks-button"
                                        onClick={() =>
                                            navigate(`/projects/${project._id}/tasks`)
                                        }
                                    >
                                        View Tasks
                                    </button>

                                    <button
                                        type="button"
                                        className="view-dashboard-button"
                                        onClick={() =>
                                            navigate(`/projects/${project._id}/dashboard`)
                                        }
                                    >
                                        View Dashboard
                                    </button>

                                </div>

                                {/* Add member form */}
                                <form
                                    className="add-member-form"
                                    onSubmit={(e) =>
                                        handleAddMember(e, project._id)
                                    }
                                >

                                    <h4>Add Team Member</h4>

                                    <input
                                        type="email"
                                        placeholder="Enter member email"
                                        value={memberEmail}
                                        onChange={(e) =>
                                            setMemberEmail(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="add-member-button"
                                    >
                                        Add Member
                                    </button>

                                </form>

                                {/* Member message */}
                                {memberMessage && (
                                    <p className="member-message">
                                        {memberMessage}
                                    </p>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    </div>
);


}

// Export Projects component
export default Projects;
