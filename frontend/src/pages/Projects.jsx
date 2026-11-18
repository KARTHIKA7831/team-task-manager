
 // Import useState and useEffect
import { useState, useEffect } from "react";

// Import project API functions
import projectApi from "../api/projectApi";

// Import Navbar component
import Navbar from "../components/Navbar";

// Import useNavigate
import { useNavigate } from "react-router-dom";

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

        <div>

            {/* Display Navbar */}
            <Navbar />

            {/* Display page heading */}
            <h1>My Projects</h1>

            {/* Display Create Project heading */}
            <h2>
                {editingProjectId ? "Edit Project" : "Create Project"}
            </h2>

            {/* Create project form */}
            <form onSubmit={handleCreate}>

                {/* Enter project name */}
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    required
                />

                <br /><br />

                {/* Enter project description */}
                <textarea
                    placeholder="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                {/* Submit project details */}
                <button type="submit">

                    {/* Change button text based on editing state */}
                    {editingProjectId ? "Update Project" : "Create Project"}

                </button>

                {/* Show Cancel button only while editing */}
                {editingProjectId && (

                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>

                )}

            </form>

                       {/* Display loading message */}
            {loading && <p>Loading...</p>}

            {/* Display error message */}
            {error && <p>{error}</p>}

            {/* Display empty message */}
            {!loading && !error && projects.length === 0 && (
                <p>No projects found</p>
            )}

            {/* Display all projects */}
            {!loading && projects.map((project) => (

                <div key={project._id}>

                    {/* Display project name */}
                    <h3>{project.name}</h3>

                    {/* Display project description */}
                    <p>{project.description}</p>

                    {/* Remove Member */}
{project.members?.map((member) => {

    const user = member.user;
    const userId = user?._id || user;

    const ownerId = project.owner?._id || project.owner;

    if (String(userId) === String(ownerId)) {
        return null;
    }

    return (
        <div key={userId}>
            <span>{user?.name || "Team Member"}</span>

            <button
                onClick={() => handleRemoveMember(project._id, userId)}
            >
                Remove
            </button>
        </div>
    );
})}

                    {/* Edit project button */}
                    <button onClick={() => handleUpdate(project)}>
                        Edit
                    </button>

                    {/* Delete project button */}
                    <button onClick={() => handleDelete(project._id)}>
                        Delete
                    </button>

                    {/* Open project tasks */}
<button onClick={() => navigate(`/projects/${project._id}/tasks`)}>
    View Tasks
</button>

{/* Open project dashboard */}
<button onClick={() => navigate(`/projects/${project._id}/dashboard`)}>
    View Dashboard
</button>

{/* Add Member Form */}
<form onSubmit={(e) => handleAddMember(e, project._id)}>

    {/* Enter member email */}
    <input
        type="email"
        placeholder="Enter member email"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        required
    />

    {/* Add Member Button */}
    <button type="submit">
        Add Member
    </button>

</form>

{/* Display member message */}
{memberMessage && <p>{memberMessage}</p>}

                </div>
                

            ))}

            {/* Display Logout button at the bottom */}
        <button onClick={handleLogout}>
            Logout
        </button>

        </div>
    );
}

// Export Projects component
export default Projects;
