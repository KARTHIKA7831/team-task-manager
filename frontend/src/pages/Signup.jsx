
// Import useState to store input values
import { useState } from "react";

// Import the signup API function
import { registerUser } from "../api/authApi";

// Import navigation function
import { useNavigate } from "react-router-dom";

import './Signup.css';

// Create Signup component
function Signup() {

    // Store the user's name
    const [name, setName] = useState("");

    // Store the user's email
    const [email, setEmail] = useState("");

    // Store the user's password
    const [password, setPassword] = useState("");
        // Create navigation function
    const navigate = useNavigate();

    // Handle form submission
    const handleSignup = async (e) => {

        // Prevent page refresh
        e.preventDefault();

        try {

            // Store user details in an object
            const userData = {
                name,
                email,
                password
            };

            // Send signup details to the backend
            const response = await registerUser(userData);

            // Display success message
            alert(response.data.message);
            // Navigate to login page after successful signup
navigate("/login");

        } catch (error) {

           // Display error message
            alert(error.response?.data?.message || "Signup failed");
        
        }
    };

    // Display the signup page
    
return (
    // Main background container
    <div className="signup-container">

        {/* Signup card */}
        <div className="signup-card">

            {/* Signup heading */}
            <h1 className="signup-title">
                Create Account
            </h1>

            {/* Subtitle */}
            <p className="signup-subtitle">
                Join our Team Task Manager
            </p>

            {/* Signup form */}
            <form onSubmit={handleSignup}>

                {/* Name field */}
                <div className="signup-form-group">

                    <label htmlFor="name">Full Name</label>

                    <input
                        id="name"
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                </div>

                {/* Email field */}
                <div className="signup-form-group">

                    <label htmlFor="email">Email Address</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>

                {/* Password field */}
                <div className="signup-form-group">

                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />

                    <small className="password-hint">
                        Password must be at least 8 characters
                    </small>

                </div>

                {/* Signup button */}
                <button
                    type="submit"
                    className="signup-button"
                >
                    Create Account
                </button>

            </form>

            <p className="signup-login-link">
    Already have an account?{" "}
    <span onClick={() => navigate("/login")}>
        Sign In
    </span>
</p>

        </div>

    </div>
);

}

// Export Signup component
export default Signup;
