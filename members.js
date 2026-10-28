// =============================================
// PROJECTHUB - MEMBERS PAGE JAVASCRIPT
// =============================================

const API_URL = (window.PROJECTHUB_CONFIG?.API_MEMBERS) || "http://localhost:5000/api/members";

const memberGrid = document.getElementById("memberGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const joinModal = document.getElementById("joinModal");
const joinForm = document.getElementById("joinForm");
const toast = document.getElementById("toast");

let allMembers = [];
let activeCategory = "All";

// Preset community member profiles
const defaultMembers = [
    {
        _id: "m1",
        name: "Aarav Sharma",
        role: "Frontend Developer",
        category: "Frontend",
        college: "VSSUT, Burla · 3rd Year",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        projects: 12,
        year: "3rd Year",
        available: "yes",
        mentor: "no"
    },
    {
        _id: "m2",
        name: "Diya Patel",
        role: "AI / ML Researcher",
        category: "AI / ML",
        college: "IIT Kharagpur · 4th Year",
        skills: ["PyTorch", "Python", "Computer Vision", "NLP"],
        projects: 8,
        year: "4th Year",
        available: "yes",
        mentor: "yes"
    },
    {
        _id: "m3",
        name: "Rohan Nair",
        role: "Backend Architect",
        category: "Backend",
        college: "NIT Rourkela · 4th Year",
        skills: ["Node.js", "Go", "Docker", "PostgreSQL", "Redis"],
        projects: 15,
        year: "4th Year",
        available: "yes",
        mentor: "no"
    },
    {
        _id: "m4",
        name: "Ananya Roy",
        role: "UI/UX Product Designer",
        category: "UI/UX",
        college: "CET Bhubaneswar · 2nd Year",
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
        projects: 9,
        year: "2nd Year",
        available: "yes",
        mentor: "no"
    },
    {
        _id: "m5",
        name: "Siddharth Verma",
        role: "Cybersecurity Analyst",
        category: "Cybersecurity",
        college: "VSSUT, Burla · 3rd Year",
        skills: ["Wireshark", "Linux", "Ethical Hacking", "Cryptography"],
        projects: 6,
        year: "3rd Year",
        available: "yes",
        mentor: "no"
    },
    {
        _id: "m6",
        name: "Sneha Mohapatra",
        role: "Full-Stack Engineer & Mentor",
        category: "Backend",
        college: "VSSUT, Burla · Alumni",
        skills: ["React", "Express", "MongoDB", "System Design", "AWS"],
        projects: 19,
        year: "Alumni",
        available: "yes",
        mentor: "yes"
    }
];

// Show Toast message
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// Escape HTML utility
function escapeHTML(str = "") {
    return String(str).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

// Get stored members from localStorage
function getStoredMembers() {
    try {
        const raw = localStorage.getItem("ph_user_members");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Create a member card element
function createMemberCard(member) {
    const card = document.createElement("article");
    card.className = "card member-card";

    const name = member.name || "Student Member";
    const role = member.role || (member.skills && member.skills[0] ? `${member.skills[0]} Developer` : (member.branch || "Developer"));
    const category = member.category || (
        member.skills && member.skills.some(s => /ai|ml|python|tensor/i.test(s)) ? "AI / ML" :
        member.skills && member.skills.some(s => /node|express|mongo|docker|backend/i.test(s)) ? "Backend" :
        member.skills && member.skills.some(s => /design|figma|ui|ux/i.test(s)) ? "UI/UX" :
        "Frontend"
    );
    const college = member.college || "University Student";
    const skills = Array.isArray(member.skills) ? member.skills : [];
    const projects = member.projects || (Math.floor(Math.random() * 8) + 4);
    const year = member.year || "3rd Year";
    const isMentor = member.mentor === "yes" || (member.user && member.user.role === "mentor");

    card.dataset.category = category;
    card.dataset.mentor = isMentor ? "yes" : "no";
    card.dataset.available = member.available || "yes";

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase();

    // Check if user already requested connection
    const connectedList = JSON.parse(localStorage.getItem("ph_connected_members") || "[]");
    const isConnected = connectedList.includes(name);

    card.innerHTML = `
        <div class="member-avatar">${escapeHTML(initials)}</div>

        <h3>${escapeHTML(name)}</h3>

        <div class="member-role">${escapeHTML(role)}</div>

        <div class="member-college">${escapeHTML(college)}</div>

        <div class="member-skills">
            ${skills.map(s => `<span class="tag">${escapeHTML(s)}</span>`).join("")}
        </div>

        <div class="member-stats">
            <div><strong>${projects}</strong><span>Projects</span></div>
            <div><strong>${escapeHTML(year)}</strong><span>Level</span></div>
            <div><strong>${isMentor ? "Mentor" : "Open"}</strong><span>Status</span></div>
        </div>

        <button class="secondary-btn full-btn connect-btn ${isConnected ? 'active' : ''}" data-name="${escapeHTML(name)}">
            ${isConnected ? "Requested ✓" : "Connect"}
        </button>
    `;

    const connectBtn = card.querySelector(".connect-btn");
    connectBtn.addEventListener("click", () => {
        let list = JSON.parse(localStorage.getItem("ph_connected_members") || "[]");
        if (list.includes(name)) {
            list = list.filter(n => n !== name);
            connectBtn.textContent = "Connect";
            connectBtn.classList.remove("active");
            showToast(`Connection request to ${name} cancelled`);
        } else {
            list.push(name);
            connectBtn.textContent = "Requested ✓";
            connectBtn.classList.add("active");
            showToast(`Connection request sent to ${name}! 🤝`);
        }
        localStorage.setItem("ph_connected_members", JSON.stringify(list));
    });

    return card;
}

// Filter and render all members
function renderMembers() {
    if (!memberGrid) return;

    memberGrid.innerHTML = "";

    const query = (searchInput?.value || "").trim().toLowerCase();
    const sortVal = sortSelect?.value || "all";

    const filtered = allMembers.filter(member => {
        // Category check
        const matchesCategory =
            activeCategory === "All" ||
            (member.category && member.category.toLowerCase().includes(activeCategory.toLowerCase())) ||
            (member.role && member.role.toLowerCase().includes(activeCategory.toLowerCase()));

        // Sort / availability check
        let matchesSort = true;
        if (sortVal === "available") {
            matchesSort = member.available === "yes";
        } else if (sortVal === "mentor") {
            matchesSort = member.mentor === "yes";
        }

        // Search check
        const skillsText = (member.skills || []).join(" ").toLowerCase();
        const fullText = `${member.name} ${member.role} ${member.college} ${skillsText}`.toLowerCase();
        const matchesQuery = fullText.includes(query);

        return matchesCategory && matchesSort && matchesQuery;
    });

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.style.gridColumn = "1 / -1";
        empty.style.textAlign = "center";
        empty.style.padding = "40px 20px";
        empty.innerHTML = `
            <h3>No members found</h3>
            <p style="color: var(--muted); margin-top: 6px;">Try adjusting your search terms or filters.</p>
        `;
        memberGrid.appendChild(empty);
        return;
    }

    filtered.forEach(m => memberGrid.appendChild(createMemberCard(m)));
}

// Load members from server or fallback
async function loadMembers() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.members) && data.members.length) {
            allMembers = [...getStoredMembers(), ...data.members];
        } else {
            allMembers = [...getStoredMembers(), ...defaultMembers];
        }
    } catch {
        // Offline resilient fallback
        allMembers = [...getStoredMembers(), ...defaultMembers];
    }
    renderMembers();
}

// Category filter buttons
document.querySelectorAll(".filters .filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filters .filter").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.filter || "All";
        renderMembers();
    });
});

// Search and sort listeners
searchInput?.addEventListener("input", renderMembers);
sortSelect?.addEventListener("change", renderMembers);

// Modal triggers for creating profile
document.querySelectorAll('[data-modal="joinModal"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (joinModal) {
            joinModal.style.display = "flex";
            const first = joinModal.querySelector("input");
            if (first) first.focus();
        }
    });
});

// Close modal handlers
document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        if (joinModal) joinModal.style.display = "none";
    });
});

joinModal?.addEventListener("click", (e) => {
    if (e.target === joinModal) {
        joinModal.style.display = "none";
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && joinModal) {
        joinModal.style.display = "none";
    }
});

// Handle profile creation form submission
joinForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("memberName")?.value.trim();
    const role = document.getElementById("memberRole")?.value || "Developer";
    const skillsRaw = document.getElementById("memberSkills")?.value.trim();
    const skills = skillsRaw ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : ["JavaScript"];

    if (!name) return;

    let cat = "Frontend";
    if (role.includes("AI")) cat = "AI / ML";
    else if (role.includes("Backend") || role.includes("Full-Stack")) cat = "Backend";
    else if (role.includes("Design") || role.includes("UI/UX")) cat = "UI/UX";
    else if (role.includes("Cybersecurity")) cat = "Cybersecurity";

    const newMember = {
        _id: "user_mem_" + Date.now(),
        name,
        role,
        category: cat,
        college: "VSSUT, Burla · Student",
        skills,
        projects: 1,
        year: "1st Year",
        available: "yes",
        mentor: "no"
    };

    const stored = getStoredMembers();
    stored.unshift(newMember);
    localStorage.setItem("ph_user_members", JSON.stringify(stored));

    allMembers.unshift(newMember);
    renderMembers();

    joinForm.reset();
    joinModal.style.display = "none";
    showToast(`Profile created for ${name}! Welcome to ProjectHub 🎉`);
});

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
});

// Initial load
loadMembers();
