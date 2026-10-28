const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const projectRoutes = require("./routes/projectroutes");
const memberRoutes = require("./routes/memberroutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const hackathonroutes = require("./routes/hackathonroutes");
const messageRoutes = require("./routes/messageroutes");
const notificationRoutes = require("./routes/notificationroutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/hackathons", hackathonroutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to ProjectHub Backend API"
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();