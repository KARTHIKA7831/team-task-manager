
 // Import BrowserRouter, Routes, Route and Navigate
// BrowserRouter - Enables routing in React
// Routes - Holds all application routes
// Route - Connects a URL with a page
// Navigate - Redirects the user to another page

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Signup page component
import Signup from "./pages/Signup";

// Import Login page component
import Login from "./pages/Login";

// Import Projects page component
import Projects from "./pages/Projects";

// Import Task page
import Task from "./pages/Task";

// Import ProtectedRoute component
import ProtectedRoute from "./components/ProtectedRoute";
// Import Dashboard page
import Dashboard from "./pages/Dashboard";

// Create main App component
function App() {

    // Return the application UI
    return (

        // Enable routing for the entire application
        <BrowserRouter>

           {/* Define all application routes */}
            <Routes>

                {/* Display Signup page */}
                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* Display Login page */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protect all routes inside this Route */}
                <Route element={<ProtectedRoute />}>

                    {/* Display Projects page only after access is allowed */}
                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
    path="/projects/:projectId/dashboard"
    element={<Dashboard />}
/>
{/* Display tasks for a particular project */}
<Route
    path="/projects/:projectId/tasks"
    element={<Task />}
/>
</Route>

                 {/* Redirect the home page to Login */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}

// Export App component
// This allows main.jsx to use the App component
export default App;
