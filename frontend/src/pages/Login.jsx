
// Import useState to store input values
import { useState } from "react";

// Import the login API function
import { loginUser } from "../api/authApi";

// Import useNavigate from React Router
// useNavigate - Helps us move to another page
import { useNavigate } from "react-router-dom";

import './Login.css';

// Create Login component
function Login() {

    // Create navigation function
const navigate = useNavigate();

    // Store the user's email
    const [email, setEmail] = useState("");

    // Store the user's password
    const [password, setPassword] = useState("");

    // Handle login form submission
    const handleLogin = async (e) => {

        // Prevent page refresh
        e.preventDefault();

        try {

            // Store login details in an object
            const userData = {
                email,
                password
            };

            // Send login details to the backend
            const response = await loginUser(userData);

            // Save JWT token in localStorage
            localStorage.setItem("token", response.data.token);

            // Display token in browser console
            console.log("JWT Token:", response.data.token);

            // Save user ID in localStorage
localStorage.setItem("userId", response.data.user.id);

// Navigate to Projects page after successful login
        navigate("/projects", { replace: true });

            // Display success message
            alert(response.data.message);

        } catch (error) {

            // Display error message
            alert(error.response?.data?.message || "Login failed");
        }
    };

    // Display login page
   
return (
    // Main background container
    <div className="login-container">

        {/* Login card */}
        <div className="login-card">

            {/* Login heading */}
            <h1 className="login-title">
                Welcome Back!
            </h1>

            {/* Subtitle */}
            <p className="login-subtitle">
                Login to your Team Task Manager account
            </p>

            {/* Login form */}
            <form onSubmit={handleLogin}>

                {/* Email field */}
                <div className="form-group">

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                {/* Password field */}
                <div className="form-group">

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                {/* Login button */}
                <button
                    type="submit"
                    className="login-button"
                >
                    Login
                </button>

            </form>

        </div>

    </div>
);

}

// Export Login component
export default Login;
