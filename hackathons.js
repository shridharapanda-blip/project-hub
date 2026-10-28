// =====================================================
// PROJECTHUB - HACKATHONS PAGE JAVASCRIPT
// =====================================================

const API_URL = (window.PROJECTHUB_CONFIG?.API_HACKATHONS) || "http://localhost:5000/api/hackathons";

const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
const eventModal = document.getElementById("eventModal");
const eventForm = document.getElementById("eventForm");
const toast = document.getElementById("toast");

let allHackathons = [];
let activeCategory = "All";

// Preset hackathons list
const defaultHackathons = [
    {
        _id: "h1",
        title: "AWS Student Hackathon",
        description: "Build next-generation serverless, microservices, and generative AI integrations. Free $100 AWS credits per participant.",
        organizer: "AWS Student Community",
        category: "Web / App",
        theme: "Web / App",
        mode: "Online",
        location: "Online (Global)",
        prize: "₹50,000 + AWS Cloud Credits & Mentorship",
        startDate: "2026-09-28",
        deadline: "2026-09-25",
        registrationLink: "https://aws.amazon.com/students"
    },
    {
        _id: "h2",
        title: "National Innovation Challenge",
        description: "Annual national university challenge focusing on clean energy, healthcare robotics, and smart cities with prototype exhibitions.",
        organizer: "IIT Kharagpur E-Cell",
        category: "Open Innovation",
        theme: "Open Innovation",
        mode: "Hybrid",
        location: "IIT Kharagpur",
        prize: "₹1,00,000 + Incubation Support",
        startDate: "2026-10-02",
        deadline: "2026-09-29",
        registrationLink: "https://iitkgp.ac.in"
    },
    {
        _id: "h3",
        title: "Eastern Student Tech Fest",
        description: "A 36-hour sprint for student innovators, robotics enthusiasts, and open-source coders. Pitch to recruiters and VC scouts.",
        organizer: "Tech Council Odisha",
        category: "Open Innovation",
        theme: "Open Innovation",
        mode: "Offline",
        location: "Bhubaneswar",
        prize: "₹35,000 + Internship Fast-track",
        startDate: "2026-10-10",
        deadline: "2026-10-06",
        registrationLink: "https://odishatech.org"
    },
    {
        _id: "h4",
        title: "Global AI & Climate Sprint",
        description: "Develop ML predictive systems analyzing greenhouse emissions, satellite deforestation data, and municipal water waste.",
        organizer: "GreenTech Foundation",
        category: "AI / ML",
        theme: "AI / ML",
        mode: "Online",
        location: "Online",
        prize: "$5,000 USD + Cloud Compute Credits",
        startDate: "2026-10-18",
        deadline: "2026-10-15",
        registrationLink: "https://greentech.org"
    },
    {
        _id: "h5",
        title: "CyberShield Inter-College CTF",
        description: "Capture the flag competition testing reverse engineering, web exploitation, digital forensics, and binary security.",
        organizer: "IEEE Computer Society",
        category: "Open Innovation",
        theme: "Open Innovation",
        mode: "Online",
        location: "Online",
        prize: "₹60,000 + Certification Vouchers",
        startDate: "2026-10-25",
        deadline: "2026-10-22",
        registrationLink: "https://ieee.org"
    },
    {
        _id: "h6",
        title: "HealthTech Social Innovation Challenge",
        description: "Create accessible low-cost telemedicine wearables, diagnostic assistants, and rural health delivery platforms.",
        organizer: "Bio-Design Consortium",
        category: "Social Impact",
        theme: "Social Impact",
        mode: "Hybrid",
        location: "New Delhi",
        prize: "₹1,50,000 + Clinical Pilot Grants",
        startDate: "2026-11-05",
        deadline: "2026-10-31",
        registrationLink: "https://biodesign.in"
    }
];

// Show Toast
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

// Format date parts for event calendar badge
function getDateParts(dateStr) {
    if (!dateStr) return { day: "28", month: "SEP" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "28", month: "SEP" };
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    return { day, month };
}

// Format readable date
function formatDate(dateStr) {
    if (!dateStr) return "TBA";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Get saved hackathons from localStorage
function getStoredHackathons() {
    try {
        const raw = localStorage.getItem("ph_user_hackathons");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// Create a hackathon card element
function createHackathonCard(hackathon) {
    const title = hackathon.title || "Untitled Hackathon";
    const description = hackathon.description || "Student innovation sprint.";
    const organizer = hackathon.organizer || "Community Organizer";
    const mode = hackathon.mode || "Online";
    const location = hackathon.location || "Online";
    const prize = hackathon.prize || "Prize Pool Available";
    const category = hackathon.category || hackathon.theme || "Open Innovation";
    const dateParts = getDateParts(hackathon.startDate);
    const startDate = formatDate(hackathon.startDate);
    const deadline = formatDate(hackathon.deadline);
    const regLink = hackathon.registrationLink || "https://google.com";

    const savedEvents = JSON.parse(localStorage.getItem("ph_saved_events") || "[]");
    const isSaved = savedEvents.includes(title);

    const card = document.createElement("article");
    card.className = "card event-card";
    card.dataset.category = category;
    card.dataset.format = mode.toLowerCase();

    card.innerHTML = `
        <div class="event-head">
            <div>
                <div class="event-type">${escapeHTML(category)} · ${escapeHTML(mode)}</div>
                <h3>${escapeHTML(title)}</h3>
            </div>

            <div class="event-date">
                <strong>${dateParts.day}</strong>
                <span>${dateParts.month}</span>
            </div>
        </div>

        <p class="description">${escapeHTML(description)}</p>

        <div class="event-meta">
            <span>🏛 Organizer · ${escapeHTML(organizer)}</span>
            <span>📍 Location · ${escapeHTML(location)}</span>
            <span>🏆 Prize · ${escapeHTML(prize)}</span>
            <span>📅 Starts · ${startDate}</span>
            <span>⏰ Deadline · ${deadline}</span>
        </div>

        <div class="tags">
            <span class="tag">${escapeHTML(category)}</span>
            <span class="tag">${escapeHTML(mode)}</span>
        </div>

        <div class="event-bottom">
            <button class="secondary-btn save-event-btn ${isSaved ? 'active' : ''}" type="button">
                ${isSaved ? "★ Saved" : "☆ Save Event"}
            </button>

            <a class="primary-btn" href="${escapeHTML(regLink)}" target="_blank" rel="noopener noreferrer">
                Register Now ↗
            </a>
        </div>
    `;

    const saveBtn = card.querySelector(".save-event-btn");
    saveBtn.addEventListener("click", () => {
        let saved = JSON.parse(localStorage.getItem("ph_saved_events") || "[]");
        if (saved.includes(title)) {
            saved = saved.filter(t => t !== title);
            saveBtn.textContent = "☆ Save Event";
            saveBtn.classList.remove("active");
            showToast("Event removed from saved schedule");
        } else {
            saved.push(title);
            saveBtn.textContent = "★ Saved";
            saveBtn.classList.add("active");
            showToast(`"${title}" saved to your calendar! 📅`);
        }
        localStorage.setItem("ph_saved_events", JSON.stringify(saved));
    });

    return card;
}

// Render and filter hackathons
function renderHackathons() {
    if (!eventGrid) return;

    // Clear old cards
    eventGrid.querySelectorAll(".event-card").forEach(c => c.remove());

    const query = (searchInput?.value || "").trim().toLowerCase();
    const sortVal = (sortSelect?.value || "all").toLowerCase();

    const filtered = allHackathons.filter(h => {
        const cat = (h.category || h.theme || "Open Innovation").toLowerCase();
        const matchesCategory =
            activeCategory === "All" ||
            cat === activeCategory.toLowerCase() ||
            (activeCategory === "Web / App" && (cat.includes("web") || cat.includes("app")));

        const mode = (h.mode || "online").toLowerCase();
        let matchesFormat = true;
        if (sortVal === "online") matchesFormat = mode.includes("online");
        else if (sortVal === "offline") matchesFormat = mode.includes("offline") || mode.includes("person");
        else if (sortVal === "hybrid") matchesFormat = mode.includes("hybrid");

        const text = `${h.title} ${h.description} ${h.organizer} ${h.location} ${cat}`.toLowerCase();
        const matchesSearch = text.includes(query);

        return matchesCategory && matchesFormat && matchesSearch;
    });

    if (filtered.length === 0) {
        if (emptyState) {
            emptyState.style.display = "block";
            emptyState.innerHTML = `
                <strong>No matching events</strong>
                <p style="margin-top: 6px; color: var(--muted);">Try a different keyword, theme, or format.</p>
            `;
        }
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    filtered.forEach(h => {
        eventGrid.insertBefore(createHackathonCard(h), emptyState || null);
    });
}

// Load hackathons from server or fallback
async function loadHackathons() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.hackathons) && data.hackathons.length) {
            allHackathons = [...getStoredHackathons(), ...data.hackathons];
        } else {
            allHackathons = [...getStoredHackathons(), ...defaultHackathons];
        }
    } catch {
        allHackathons = [...getStoredHackathons(), ...defaultHackathons];
    }
    renderHackathons();
}

// Filter button listeners
document.querySelectorAll(".filters .filter").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filters .filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.filter || "All";
        renderHackathons();
    });
});

searchInput?.addEventListener("input", renderHackathons);
sortSelect?.addEventListener("change", renderHackathons);

// Open Add Event modal
document.querySelectorAll('[data-modal="eventModal"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (eventModal) {
            eventModal.style.display = "flex";
            eventModal.classList.add("open");
            const first = eventModal.querySelector("input");
            if (first) first.focus();
        }
    });
});

// Close modal handlers
document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        if (eventModal) {
            eventModal.style.display = "none";
            eventModal.classList.remove("open");
        }
    });
});

eventModal?.addEventListener("click", (e) => {
    if (e.target === eventModal) {
        eventModal.style.display = "none";
        eventModal.classList.remove("open");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && eventModal) {
        eventModal.style.display = "none";
        eventModal.classList.remove("open");
    }
});

// Add Hackathon Form submission
eventForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("eventName")?.value.trim();
    const theme = document.getElementById("eventTheme")?.value || "Open Innovation";
    const date = document.getElementById("eventDate")?.value;
    const link = document.getElementById("eventLink")?.value.trim();

    if (!title || !date) {
        showToast("Please enter an event name and date.");
        return;
    }

    const newHackathon = {
        _id: "user_hack_" + Date.now(),
        title,
        description: "Community student event listing. Check organizer link for official eligibility.",
        organizer: "Student Community Listing",
        category: theme,
        theme: theme,
        mode: "Online",
        location: "Online / Hybrid",
        prize: "Official Certificates & Prizes",
        startDate: date,
        deadline: date,
        registrationLink: link || "https://google.com"
    };

    const stored = getStoredHackathons();
    stored.unshift(newHackathon);
    localStorage.setItem("ph_user_hackathons", JSON.stringify(stored));

    allHackathons.unshift(newHackathon);
    renderHackathons();

    eventForm.reset();
    if (eventModal) {
        eventModal.style.display = "none";
        eventModal.classList.remove("open");
    }

    showToast(`Hackathon "${title}" added to schedule! 🚀`);
});

// Mobile menu toggle
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
});

// Initial load
loadHackathons();
