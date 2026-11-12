const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Project = require("./models/Project");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes);
app.use("/api/projects", commentRoutes);
app.use("/api/projects", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Team Task manager!");
})
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

    
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on port 5000");
})