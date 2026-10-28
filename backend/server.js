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

// One-click Cloud Database Seeder Route
app.get("/api/seed", async (req, res) => {
    try {
        const User = require("./models/user");
        const Project = require("./models/project");
        const Member = require("./models/member");
        const Hackathon = require("./models/hackathon");
        const bcrypt = require("bcryptjs");

        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.json({ success: true, message: "Database is already seeded with records!", count: userCount });
        }

        const hashedPassword = await bcrypt.hash("Password123!", 12);
        const alex = await User.create({
            name: "Alex Chen",
            email: "alex.chen@vssut.ac.in",
            password: hashedPassword,
            college: "VSSUT Burla",
            branch: "Computer Science & Engineering",
            year: "3rd Year",
            skills: ["JavaScript", "React", "Node.js", "Python"],
            role: "student",
            bio: "Full stack developer passionate about building collaborative student platforms."
        });

        const aditya = await User.create({
            name: "Aditya Sharma",
            email: "aditya.sharma@vssut.ac.in",
            password: hashedPassword,
            college: "VSSUT Burla",
            branch: "Information Technology",
            year: "4th Year",
            skills: ["Node.js", "Express", "MongoDB", "Docker"],
            role: "student",
            bio: "Backend developer and open source enthusiast."
        });

        const priya = await User.create({
            name: "Priya Singh",
            email: "priya.singh@vssut.ac.in",
            password: hashedPassword,
            college: "VSSUT Burla",
            branch: "Electronics & Telecommunication",
            year: "3rd Year",
            skills: ["UI/UX Design", "Figma", "CSS3", "React Native"],
            role: "student",
            bio: "UI/UX designer crafting clean, accessible student web interfaces."
        });

        const simran = await User.create({
            name: "Simran Mishra",
            email: "simran.mishra@vssut.ac.in",
            password: hashedPassword,
            college: "VSSUT Burla",
            branch: "Electrical Engineering",
            year: "4th Year",
            skills: ["Python", "TensorFlow", "PyTorch", "OpenCV"],
            role: "mentor",
            bio: "AI/ML researcher and senior peer mentor."
        });

        await Member.create([
            {
                user: alex._id,
                name: alex.name,
                bio: alex.bio,
                college: alex.college,
                branch: alex.branch,
                year: alex.year,
                skills: alex.skills,
                interests: ["Web3", "Distributed Systems", "AI Tools"],
                github: "https://github.com/alexchen",
                linkedin: "https://linkedin.com/in/alexchen"
            },
            {
                user: aditya._id,
                name: aditya.name,
                bio: aditya.bio,
                college: aditya.college,
                branch: aditya.branch,
                year: aditya.year,
                skills: aditya.skills,
                interests: ["Microservices", "REST APIs", "Cloud Native"],
                github: "https://github.com/adityasharma",
                linkedin: "https://linkedin.com/in/adityasharma"
            },
            {
                user: priya._id,
                name: priya.name,
                bio: priya.bio,
                college: priya.college,
                branch: priya.branch,
                year: priya.year,
                skills: priya.skills,
                interests: ["Design Systems", "Prototyping", "Frontend Architecture"],
                github: "https://github.com/priyasingh",
                linkedin: "https://linkedin.com/in/priyasingh"
            },
            {
                user: simran._id,
                name: simran.name,
                bio: simran.bio,
                college: simran.college,
                branch: simran.branch,
                year: simran.year,
                skills: simran.skills,
                interests: ["Deep Learning", "Computer Vision", "Edge AI"],
                github: "https://github.com/simranmishra",
                linkedin: "https://linkedin.com/in/simranmishra"
            }
        ]);

        await Project.create([
            {
                title: "Smart Campus IoT & Realtime Navigation",
                description: "An integrated indoor navigation and facility monitoring system using ESP32 BLE beacons and a responsive PWA client for university students.",
                category: "AI/ML",
                skills: ["IoT", "ESP32", "Python", "FastAPI", "React"],
                creator: alex._id,
                members: [alex._id, aditya._id],
                requiredMembers: 4,
                status: "Open",
                githubLink: "https://github.com/projecthub/smart-campus",
                isPublic: true
            },
            {
                title: "AI Agriculture & Soil Nutrient Diagnostics",
                description: "Deep learning model for early detection of crop leaf pathogens using mobile camera images with real-time fertilizer recommendations.",
                category: "AI/ML",
                skills: ["Python", "TensorFlow", "PyTorch", "FastAPI"],
                creator: simran._id,
                members: [simran._id, alex._id],
                requiredMembers: 3,
                status: "Open",
                githubLink: "https://github.com/projecthub/ai-agri",
                isPublic: true
            },
            {
                title: "Student Collaborative Code Review Platform",
                description: "Peer-to-peer code mentorship tool allowing engineering students to submit PRs, get automated lint reviews, and schedule live pair-programming sessions.",
                category: "Web Development",
                skills: ["React", "Express", "MongoDB", "WebSockets"],
                creator: priya._id,
                members: [priya._id, alex._id],
                requiredMembers: 3,
                status: "Open",
                githubLink: "https://github.com/projecthub/code-review",
                isPublic: true
            }
        ]);

        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await Hackathon.create([
            {
                title: "AWS Student Cloud Innovation Challenge 2026",
                description: "Build scalable cloud-native architectures solving regional sustainability and educational accessibility challenges.",
                organizer: "AWS Academy & Student Developers",
                mode: "Online",
                location: "Global / Remote",
                registrationLink: "https://aws.amazon.com/events/student-challenge",
                prize: "$10,000 + AWS Cloud Credits",
                startDate: nextMonth,
                endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
                deadline: new Date(nextMonth.getTime() - 5 * 24 * 60 * 60 * 1000),
                createdBy: alex._id
            }
        ]);

        res.json({ success: true, message: "🎉 Cloud database successfully seeded in MongoDB Atlas!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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