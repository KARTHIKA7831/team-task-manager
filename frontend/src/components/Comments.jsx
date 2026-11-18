// Import useState and useEffect
import { useState, useEffect } from "react";

// Import comment API
import commentApi from "../api/commentApi";

// Create Comments component
function Comments({ projectId, taskId }) {

        // Store all comments
    const [comments, setComments] = useState([]);

    // Store comment input
    const [text, setText] = useState("");

    // Store loading status
    const [loading, setLoading] = useState(true);

    // Store error message
    const [error, setError] = useState("");

    // Store success message
    const [successMessage, setSuccessMessage] = useState("");

    // Get logged-in user ID
const currentUserId = localStorage.getItem("userId");

        // Get all comments when component opens
    useEffect(() => {

        
       // Call Get Comments API
        commentApi.getComments(projectId, taskId)

            .then((response) => {

                // Store comments
                setComments(response.data.comments || []);

            })

            .catch((error) => {

                // Display error message
                setError(
                    error.response?.data?.message ||
                    "Failed to load comments"
                );

            })

            .finally(() => {

                // Stop loading
                setLoading(false);

            });

    }, [projectId, taskId]);

    // Handle adding a comment
const handleAddComment = (e) => {

    // Prevent page refresh
    e.preventDefault();

    // Clear previous error
    setError("");

    // Check empty comment
    if (!text.trim()) {
        setError("Enter a comment");
        return;
    }

    // Call Create Comment API
    commentApi.createComment(projectId, taskId, text)

        .then((response) => {

            // Add new comment to comments list
            setComments((previousComments) => [
                ...previousComments,
                response.data.comment
            ]);

            // Clear input
            setText("");

            // Show success message
            setSuccessMessage("Comment added successfully!");

        })

        .catch((error) => {

            // Display error message
            setError(
                error.response?.data?.message ||
                "Failed to add comment"
            );

        });

};

// Handle deleting a comment
const handleDeleteComment = (commentId) => {

    // Ask for confirmation
    if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
    }

    // Call Delete Comment API
    commentApi.deleteComment(projectId, taskId, commentId)

        .then(() => {

            // Remove deleted comment from comments list
            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment._id !== commentId
                )
            );

            // Show success message
            setSuccessMessage("Comment deleted successfully!");

            // Clear previous error
            setError("");

        })

        .catch((error) => {

            // Display error message
            setError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );

        });
};

   return (
    <div>

        {/* Comments heading */}
        <h3>Comments</h3>

        {/* Display success message */}
{successMessage && <p>{successMessage}</p>}

{/* Add comment form */}
<form onSubmit={handleAddComment}>

    {/* Comment input */}
    <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
    />

    <br /><br />

    {/* Post comment button */}
    <button type="submit">
        Post Comment
    </button>

</form>

        {/* Loading message */}
        {loading && <p>Loading comments...</p>}

        {/* Error message */}
        {error && <p>{error}</p>}

        {/* Empty message */}
        {!loading && !error && comments.length === 0 && (
            <p>No comments yet</p>
        )}

        {/* Display all comments */}
        {!loading && comments.map((comment) => (

            <div key={comment._id}>

                {/* Author name */}
                <h4>{comment.author?.name || "Unknown User"}</h4>

                {/* Comment text */}
                <p>{comment.text}</p>

                {/* Comment date */}
                <small>
                    {new Date(comment.createdAt).toLocaleString()}
                </small>

                {/* Delete button */}
{String(comment.author?._id) === String(currentUserId) && (

    <button onClick={() => handleDeleteComment(comment._id)}>
        Delete
    </button>

)}

                <hr />

            </div>

        ))}

    </div>
);
}

// Export Comments component
export default Comments;