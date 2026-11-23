
 // Import useState and useEffect
import { useState, useEffect } from "react";

// Import useParams
import { useParams } from "react-router-dom";

// Import task API
import taskApi from "../api/taskApi";

// Import project API
import projectApi from "../api/projectApi";

// Import comment API
import Comments from "../components/Comments";

import './Task.css';

// Create Task component
function Task() {

    // Get project ID from URL
    const { projectId } = useParams();

    // Store all tasks
    const [tasks, setTasks] = useState([]);

    // Store project details
    const [project, setProject] = useState(null);

    // Store task title
    const [title, setTitle] = useState("");

    // Store task description
    const [description, setDescription] = useState("");

    // Store assignee
    const [assignee, setAssignee] = useState("");

    // Store due date
    const [dueDate, setDueDate] = useState("");

    // Store priority
    const [priority, setPriority] = useState("Medium");

    // Store status
    const [status, setStatus] = useState("To do");

    // Store editing task ID
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Store loading status
    const [loading, setLoading] = useState(true);

    // Store error message
    const [error, setError] = useState("");

    // Store success message
const [successMessage, setSuccessMessage] = useState("");

    // Store search text
    const [search, setSearch] = useState("");

    // Store status filter
    const [statusFilter, setStatusFilter] = useState("");

    // Store priority filter
    const [priorityFilter, setPriorityFilter] = useState("");

    // Store assignee filter
    const [assigneeFilter, setAssigneeFilter] = useState("");

    // Store My Tasks filter
    const [myTasks, setMyTasks] = useState(false);

    // Store current page
    const [page, setPage] = useState(1);

    
    
    // Get all tasks
    const getTasks = () => {

        // Start loading
        setLoading(true);

        // Clear previous error
        setError("");

        taskApi.getTasks(projectId, {
            search,
            status: statusFilter,
            priority: priorityFilter,
            assignee: assigneeFilter,
            myTasks: myTasks ? "true" : undefined,
            page
        })

            .then((response) => {
                setTasks(response.data.tasks);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Failed to load tasks"
                );
            })

            .finally(() => {
                setLoading(false);
            });

    };

    // Get project details when page opens
    useEffect(() => {

        projectApi.getProjectById(projectId)

            .then((response) => {
                console.log("Project Details:", response.data.project);
                setProject(response.data.project);
            })

            .catch((error) => {
                setError(
                    error.response?.data?.message ||
                    "Failed to load project"
                );
            });

    }, [projectId]);

   // Get tasks when filters change
useEffect(() => {

    // Call Task API
    taskApi.getTasks(projectId, {
        search,
        status: statusFilter,
        priority: priorityFilter,
        assignee: assigneeFilter,
        myTasks: myTasks ? "true" : undefined,
        page
    })

        .then((response) => {

            // Store tasks
            setTasks(response.data.tasks || []);

            // Clear error
            setError("");

        })

        .catch((error) => {

            // Display error
            setError(
                error.response?.data?.message ||
                "Failed to load tasks"
            );

        })

        .finally(() => {

            // Stop loading
            setLoading(false);

        });

}, [
    projectId,
    search,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    myTasks,
    page
]);

    // Create or update task
    const handleSubmit = (e) => {

        // Prevent page refresh
        e.preventDefault();

               // Check task title
        if (!title.trim()) {
    setError("Enter task title");
    console.log("Error state triggered");
    return;
}

        // Store task details
        const taskData = {
            title,
            description,
            assignee: assignee || null,
            dueDate: dueDate || null,
            priority,
            status
        };

        // Check editing mode
        if (editingTaskId) {

            // Update task
            taskApi.updateTask(projectId, editingTaskId, taskData)

            .then(() => {

    // Show success message
    setSuccessMessage("Task updated successfully!");

    // Clear previous error
    setError("");

    // Reset form
    setTitle("");
    setDescription("");
    setAssignee("");
    setDueDate("");
    setPriority("Medium");
    setStatus("To do");

    // Exit editing mode
    setEditingTaskId(null);

    // Refresh task list
    getTasks();

})

            .catch((error) => {

                setError(error.response?.data?.message || "Update failed");

            });

        } else {

            // Create new task
            taskApi.createTask(projectId, taskData)

            .then(() => {

                // Show success message
        setSuccessMessage("Task created successfully!");

                setTitle("");
                setDescription("");
                setAssignee("");
                setDueDate("");
                setPriority("Medium");
                setStatus("To do");
                

                setPage(1);
                getTasks();

            })

            .catch((error) => {

                setError(error.response?.data?.message || "Create failed");

            });
        }
    };

    // Get one task and edit
    const handleUpdate = (taskId) => {

        taskApi.getTaskById(projectId, taskId)

        .then((response) => {

            const task = response.data.task;

            setTitle(task.title);
            setDescription(task.description || "");
            setAssignee(task.assignee?._id || task.assignee || "");
            setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
            setPriority(task.priority);
            setStatus(task.status);

            setEditingTaskId(task._id);

        })

        .catch(() => {

            setError("Failed to get task");

        });
    };

    // Update task status
    const handleStatusChange = (taskId, newStatus) => {

        taskApi.updateTaskStatus(projectId, taskId, {
            status: newStatus
        })

        .then(() => getTasks())

        .catch(() => setError("Status update failed"));
    };

    // Delete task
    const handleDelete = (taskId) => {

        if (!window.confirm("Are you sure?")) return;

        taskApi.deleteTask(projectId, taskId)

.then(() => {

    // Show success message
    setSuccessMessage("Task deleted successfully!");

    // Clear previous error
    setError("");

    // Refresh task list
    getTasks();

})

.catch((error) => {

    setError(
        error.response?.data?.message ||
        "Delete failed"
    );

});

    };

    // Get project members
const members = project
    ? [
        { user: project.owner },
        ...(project.members || [])
    ]
    : [];

// Store unique members
const uniqueMembers = [];

// Check each member
members.forEach((member) => {

    const user = member.user;

    const userId = user?._id || user;

    // Check duplicate member
    const alreadyExists = uniqueMembers.some((item) => {

        const existingUser = item.user;

        const existingId = existingUser?._id || existingUser;

        return existingId === userId;

    });

    // Add only new members
    if (!alreadyExists) {
        uniqueMembers.push(member);
    }

});

    // Display Task page
    
return (
    <div className="task-page">

        {/* Main content */}
        <div className="task-content">

            {/* Page heading */}
            <div className="task-header">
                <div>
                    <p className="task-label">PROJECT WORKSPACE</p>
                    <h1>Team Tasks</h1>
                    <p className="task-project-name">
                        {project?.name}
                    </p>
                </div>
            </div>

            {/* Create / Edit Task */}
            <div className="task-form-card">

                <h2>
                    {editingTaskId ? "Edit Task" : "Create New Task"}
                </h2>

                {/* Success message */}
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}

                {/* Error message */}
                {error && (
                    <p className="task-error-message">{error}</p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="task-form-grid">

                        {/* Task title */}
                        <div className="task-field full-width">
                            <label>Task Title</label>
                            <input
                                type="text"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={120}
                            />
                        </div>

                        {/* Description */}
                        <div className="task-field full-width">
                            <label>Task Description</label>
                            <textarea
                                placeholder="Describe your task..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Assignee */}
                        <div className="task-field">
                            <label>Assign To</label>
                            <select
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                            >
                                <option value="">Nobody</option>

                                {uniqueMembers.map((member) => {
                                    const user = member.user;
                                    const userId = user?._id || user;

                                    return (
                                        <option key={userId} value={userId}>
                                            {user?.name || "Team member"}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Due date */}
                        <div className="task-field">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        {/* Priority */}
                        <div className="task-field">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="task-field">
                            <label>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="To do">To do</option>
                                <option value="In progress">In progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                    </div>

                    {/* Form buttons */}
                    <div className="task-form-actions">

                        <button type="submit" className="task-primary-button">
                            {editingTaskId ? "Update Task" : "Create Task"}
                        </button>

                        {editingTaskId && (
                            <button
                                type="button"
                                className="task-cancel-button"
                                onClick={() => {
                                    setTitle("");
                                    setDescription("");
                                    setAssignee("");
                                    setDueDate("");
                                    setPriority("Medium");
                                    setStatus("To do");
                                    setEditingTaskId(null);
                                    setError("");
                                }}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* Search and Filters */}
            <div className="task-filter-card">

                <h2>Find Tasks</h2>

                <div className="task-filter-grid">

                    {/* Search */}
                    <div className="task-field">
                        <label>Search Tasks</label>
                        <input
                            type="text"
                            placeholder="Search task..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Status filter */}
                    <div className="task-field">
                        <label>Filter by Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="To do">To do</option>
                            <option value="In progress">In progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* Priority filter */}
                    <div className="task-field">
                        <label>Filter by Priority</label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => {
                                setPriorityFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Member filter */}
                    <div className="task-field">
                        <label>Filter by Member</label>
                        <select
                            value={assigneeFilter}
                            onChange={(e) => {
                                setAssigneeFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Members</option>

                            {uniqueMembers.map((member) => {
                                const user = member.user;
                                const userId = user?._id || user;

                                if (!userId) return null;

                                return (
                                    <option key={userId} value={userId}>
                                        {user?.name || "Team member"}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                </div>

                {/* My Tasks */}
                <label className="my-tasks-option">
                    <input
                        type="checkbox"
                        checked={myTasks}
                        onChange={(e) => {
                            setMyTasks(e.target.checked);
                            setPage(1);
                        }}
                    />
                    My Tasks Only
                </label>

            </div>

            {/* Task list heading */}
            <div className="task-list-heading">
                <h2>All Tasks</h2>
            </div>

            {/* Loading */}
            {loading && (
                <p className="task-status-message">Loading tasks...</p>
            )}

            {/* Empty message */}
            {!loading && !error && tasks.length === 0 && (
                <p className="task-status-message">
                    No tasks found. Create your first task!
                </p>
            )}

            {/* Task cards */}
            {!loading && tasks.map((task) => (

                <div className="task-card" key={task._id}>

                    {/* Task heading */}
                    <div className="task-card-header">
                        <h3>{task.title}</h3>

                        {task.isOverdue && (
                            <span className="overdue-badge">
                                OVERDUE!
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="task-description">
                        {task.description || "No description available"}
                    </p>

                    {/* Task details */}
                    <div className="task-details">

                        <p>
                            <strong>Assignee:</strong>{" "}
                            {task.assignee?.name || "Nobody"}
                        </p>

                        <p>
                            <strong>Due Date:</strong>{" "}
                            {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No due date"}
                        </p>

                        <p>
                            <strong>Priority:</strong>{" "}
                            <span className={`priority-${task.priority?.toLowerCase()}`}>
                                {task.priority}
                            </span>
                        </p>

                    </div>

                    {/* Status update */}
                    <div className="task-status-control">
                        <label>Update Status</label>

                        <select
                            value={task.status}
                            onChange={(e) =>
                                handleStatusChange(task._id, e.target.value)
                            }
                        >
                            <option value="To do">To do</option>
                            <option value="In progress">In progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* Edit and Delete */}
                    <div className="task-card-actions">

                        <button
                            type="button"
                            className="task-edit-button"
                            onClick={() => handleUpdate(task._id)}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="task-delete-button"
                            onClick={() => handleDelete(task._id)}
                        >
                            Delete
                        </button>

                    </div>

                    {/* Comments */}
                    <div className="task-comments">
                        <Comments
                            projectId={projectId}
                            taskId={task._id}
                        />
                    </div>

                </div>

            ))}

            {/* Pagination */}
            <div className="task-pagination">

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>Page {page}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={tasks.length < 10}
                >
                    Next
                </button>

            </div>

        </div>

    </div>
);

}

// Export Task component
export default Task;
