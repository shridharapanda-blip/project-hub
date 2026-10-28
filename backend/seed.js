const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/user");
const Project = require("./models/project");
const Member = require("./models/member");
const Hackathon = require("./models/hackathon");

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/projecthub");
        console.log("Connected to MongoDB successfully.");

        // Clear existing collections
        console.log("Cleaning old records...");
        await User.deleteMany({});
        await Project.deleteMany({});
        await Member.deleteMany({});
        await Hackathon.deleteMany({});

        // 1. Create Users
        console.log("Seeding demo users...");
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

        const rahul = await User.create({
            name: "Rahul Kumar",
            email: "rahul.kumar@vssut.ac.in",
            password: hashedPassword,
            college: "VSSUT Burla",
            branch: "Computer Science",
            year: "3rd Year",
            skills: ["AWS", "Docker", "Kubernetes", "Linux"],
            role: "student",
            bio: "DevOps & cloud engineering student."
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

        console.log("✓ Created 5 student & mentor accounts.");

        // 2. Create Members
        console.log("Seeding Member profiles...");
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
        console.log("✓ Created Member profiles.");

        // 3. Create Projects
        console.log("Seeding Projects...");
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
                demoLink: "https://projecthub-demo.vercel.app/campus",
                likes: [aditya._id, priya._id, rahul._id],
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
                demoLink: "https://projecthub-demo.vercel.app/agri",
                likes: [alex._id, priya._id],
                isPublic: true
            },
            {
                title: "Decentralized Academic Credential Verification",
                description: "Verifiable student credentials and degree issuance on Polygon network to eliminate fake certificates and streamline university transcript verification.",
                category: "Open Source",
                skills: ["Solidity", "Ethers.js", "Node.js", "React"],
                creator: aditya._id,
                members: [aditya._id, rahul._id],
                requiredMembers: 2,
                status: "Open",
                githubLink: "https://github.com/projecthub/credential-verify",
                likes: [alex._id, simran._id],
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
                likes: [alex._id, aditya._id, rahul._id],
                isPublic: true
            }
        ]);
        console.log("✓ Created 4 sample Projects.");

        // 4. Create Hackathons
        console.log("Seeding Hackathons...");
        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const nextMonthEnd = new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000);

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
                endDate: nextMonthEnd,
                deadline: new Date(nextMonth.getTime() - 5 * 24 * 60 * 60 * 1000),
                createdBy: alex._id
            },
            {
                title: "Smart India Techathon & HackVSSUT",
                description: "Annual 36-hour offline hackathon focused on AI/ML, IoT, and Smart City solutions.",
                organizer: "VSSUT Innovation Council",
                mode: "Offline",
                location: "Burla, Odisha, India",
                registrationLink: "https://vssut.ac.in/hackathon",
                prize: "₹1,50,000 Cash Pool + Incubation Support",
                startDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000),
                deadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
                createdBy: simran._id
            }
        ]);
        console.log("✓ Created 2 Hackathons.");

        console.log("\n==============================================");
        console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        console.log("Demo Student Credentials:");
        console.log("  Email:    alex.chen@vssut.ac.in");
        console.log("  Password: Password123!");
        console.log("==============================================");

        process.exit(0);

    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
