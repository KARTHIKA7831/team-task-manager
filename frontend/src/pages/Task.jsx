
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

        <div>

            {/* Page heading */}
            <h1>Team Tasks</h1>

            {/* Project name */}
            <h2>{project?.name}</h2>

            {/* Create or Edit Task */}
            <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>

            {/* Display success message */}
{successMessage && <p>{successMessage}</p>}

            <form onSubmit={handleSubmit}>

                {/* Task title */}
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                     />

                     {/* Error message */}
{error && <p>{error}</p>}

                <br /><br />

                {/* Task description */}
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                {/* Select assignee */}
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

                <br /><br />

                {/* Due date */}
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <br /><br />

                {/* Priority */}
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <br /><br />

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="Done">Done</option>
                </select>

                <br /><br />

                {/* Submit button */}
                <button type="submit">
                    {editingTaskId ? "Update Task" : "Create Task"}
                </button>

                {/* Cancel editing */}
                {editingTaskId && (
                    <button type="button" onClick={() => {
                        setTitle("");
                        setDescription("");
                        setAssignee("");
                        setDueDate("");
                        setPriority("Medium");
                        setStatus("To do");
                        setEditingTaskId(null);
                    }}>
                        Cancel
                    </button>
                )}

            </form>

            <hr />

            {/* Search tasks */}
            <h2>Find Tasks</h2>

            <input
                type="text"
                placeholder="Search task"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            <br /><br />

            {/* Filter by status */}
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

            <br /><br />

            {/* Filter by priority */}
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

            <br /><br />

            {/* Filter by assignee */}
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

            <br /><br />

            {/* My Tasks */}
            <label>
                <input
                    type="checkbox"
                    checked={myTasks}
                    onChange={(e) => {
                        setMyTasks(e.target.checked);
                        setPage(1);
                    }}
                />
                My Tasks
            </label>

            <hr />

            {/* Loading message */}
            {loading && <p>Loading...</p>}


            {/* Empty message */}
            {!loading && !error && tasks.length === 0 && (
                <p>No tasks found</p>
            )}

            {/* Display all tasks */}
            {!loading && tasks.map((task) => (

                <div key={task._id}>

                    <hr />

                    {/* Task title */}
                    <h3>{task.title}</h3>

                    {/* Task description */}
                    <p>{task.description}</p>

                    {/* Assignee */}
                    <p>
                        Assignee: {task.assignee?.name || "Nobody"}
                    </p>

                    {/* Due date */}
                    <p>
                        Due Date: {
                            task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No due date"
                        }
                    </p>

                    {/* Priority */}
                    <p>Priority: {task.priority}</p>

                    {/* Overdue */}
                    {task.isOverdue && (
                        <p>OVERDUE!</p>
                    )}

                    {/* Update status */}
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(
                            task._id,
                            e.target.value
                        )}
                    >
                        <option value="To do">To do</option>
                        <option value="In progress">In progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <br /><br />

                    {/* Edit button */}
                    <button onClick={() => handleUpdate(task._id)}>
                        Edit
                    </button>

                    {/* Delete button */}
                    <button onClick={() => handleDelete(task._id)}>
                        Delete
                    </button>

                    {/* Comments component */}
<Comments
    projectId={projectId}
    taskId={task._id}
/>

                </div>
            ))}

            <hr />

            {/* Previous page */}
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>

            {/* Current page */}
            <span> Page {page} </span>

            {/* Next page */}
            <button
                onClick={() => setPage(page + 1)}
                disabled={tasks.length < 10}
            >
                Next
            </button>

        </div>
    );
}

// Export Task component
export default Task;
