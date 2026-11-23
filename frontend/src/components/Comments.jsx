// Import useState and useEffect
import { useState, useEffect } from "react";

// Import comment API
import commentApi from "../api/commentApi";

import './Comments.css';

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
    <div className="comments-container">

        {/* Comments heading */}
        <div className="comments-header">
            <h3>Comments</h3>
            <span>{comments.length} Comments</span>
        </div>

        {/* Success message */}
        {successMessage && (
            <p className="comment-success">{successMessage}</p>
        )}

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="comment-form">

            <textarea
                className="comment-input"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button type="submit" className="comment-post-button">
                Post Comment
            </button>

        </form>

        {/* Loading message */}
        {loading && (
            <p className="comment-status">Loading comments...</p>
        )}

        {/* Error message */}
        {error && (
            <p className="comment-error">{error}</p>
        )}

        {/* Empty message */}
        {!loading && !error && comments.length === 0 && (
            <p className="comment-status">
                No comments yet. Be the first to comment!
            </p>
        )}

        {/* Display all comments */}
        {!loading && comments.map((comment) => (

            <div className="comment-card" key={comment._id}>

                {/* Comment author */}
                <div className="comment-author">

                    <div className="comment-avatar">
                        {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="comment-author-info">
                        <h4>{comment.author?.name || "Unknown User"}</h4>

                        <small>
                            {new Date(comment.createdAt).toLocaleString()}
                        </small>
                    </div>

                </div>

                {/* Comment text */}
                <p className="comment-text">{comment.text}</p>

                {/* Delete button */}
                {String(comment.author?._id) === String(currentUserId) && (

                    <button
                        className="comment-delete-button"
                        onClick={() => handleDeleteComment(comment._id)}
                    >
                        Delete
                    </button>

                )}

            </div>

        ))}

    </div>
);

}

// Export Comments component
export default Comments;