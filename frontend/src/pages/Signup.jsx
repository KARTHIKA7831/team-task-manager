
// Import useState to store input values
import { useState } from "react";

// Import the signup API function
import { registerUser } from "../api/authApi";

// Import navigation function
import { useNavigate } from "react-router-dom";

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
        <div>

            {/* Display signup heading */}
            <h1>Create Account</h1>

            {/* Create signup form */}
            <form onSubmit={handleSignup}>

                {/* Name input field */}
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <br /><br />

                {/* Email input field */}
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br /><br />

                {/* Password input field */}
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                />

                <br /><br />

                {/* Signup button */}
                <button type="submit">Sign Up</button>

            </form>
        </div>
    );
}

// Export Signup component
export default Signup;
