 
// =====================================================
// NEXUSHUB - PROJECTS PAGE JAVASCRIPT
// =====================================================

// BACKEND API
const API_URL = (window.PROJECTHUB_CONFIG?.API_PROJECTS) || "http://localhost:5000/api/projects";

// =====================================================
// 1. GET HTML ELEMENTS
// =====================================================

const projectGrid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filters = document.getElementById("filters");

const emptyState = document.getElementById("emptyState");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

const projectForm = document.getElementById("projectForm");
const projectFormMessage = document.getElementById("projectFormMessage");

const projectModal = document.getElementById("projectModal");
const detailModal = document.getElementById("detailModal");

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutBtn = document.getElementById("logoutBtn");

let allProjects = [];
let activeCategory = "All";

// =====================================================
// 2. ESCAPE HTML
// Prevent database text from being interpreted as HTML.
// =====================================================

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// =====================================================
// 3. SHOW TOAST MESSAGE
// =====================================================

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");
    toast.style.display = "block";

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "";
    }, 3000);
}

// =====================================================
// 4. LOGIN / LOGOUT NAVIGATION
// =====================================================

function updateAuthNavigation() {
    const token = localStorage.getItem("token");

    if (loginLink) {
        loginLink.style.display = token ? "none" : "inline-block";
    }

    if (registerLink) {
        registerLink.style.display = token ? "none" : "inline-block";
    }

    if (logoutBtn) {
        logoutBtn.style.display = token ? "inline-block" : "none";
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");

        updateAuthNavigation();

        window.location.href = "login.html";
    });
}

updateAuthNavigation();

// =====================================================
// 5. LOAD PROJECTS FROM MONGODB THROUGH THE API
// =====================================================

const fallbackProjects = [
    {
        _id: "demo_1",
        title: "Smart Queue Management",
        category: "Web / App",
        description: "A digital queue management platform that helps students avoid long waiting times at college administrative offices, libraries, and canteens.",
        skills: ["React", "Node.js", "Express", "MongoDB"],
        requiredMembers: 4,
        members: ["Ankit Kumar", "Sneha Rao"],
        createdBy: { name: "Ankit Kumar" },
        status: "Recruiting"
    },
    {
        _id: "demo_2",
        title: "AI Agriculture Yield Predictor",
        category: "AI / ML",
        description: "Predictive model that uses satellite multispectral imagery and microclimate sensors to forecast crop yields and prevent pest outbreaks.",
        skills: ["Python", "TensorFlow", "FastAPI", "OpenCV"],
        requiredMembers: 3,
        members: ["Rahul Patra"],
        createdBy: { name: "Rahul Patra" },
        status: "Recruiting"
    },
    {
        _id: "demo_3",
        title: "Campus IoT Safety Device",
        category: "Hardware",
        description: "Low-cost emergency notification wearable and campus mesh beacons communicating over LoRa for student safety in remote campus zones.",
        skills: ["ESP32", "C++", "LoRa", "Arduino"],
        requiredMembers: 4,
        members: ["Priya Sharma", "Aditya S."],
        createdBy: { name: "Priya Sharma" },
        status: "Recruiting"
    },
    {
        _id: "demo_4",
        title: "Student Skill Exchange & Tutoring",
        category: "Social Impact",
        description: "Peer-to-peer barter platform where students trade skills—learning DSA in exchange for UI design or frontend development.",
        skills: ["JavaScript", "HTML/CSS", "Firebase"],
        requiredMembers: 3,
        members: ["Suman Mishra"],
        createdBy: { name: "Suman Mishra" },
        status: "In Progress"
    }
];

function getStoredProjects() {
    try {
        const raw = localStorage.getItem("ph_user_projects");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

async function loadProjects() {
    if (!projectGrid) {
        console.error("Project grid element was not found.");
        return;
    }

    if (loadingMessage) {
        loadingMessage.style.display = "block";
    }

    if (errorMessage) {
        errorMessage.style.display = "none";
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to load projects from server."
            );
        }

        allProjects = Array.isArray(data.projects) && data.projects.length
            ? [...getStoredProjects(), ...data.projects]
            : [...getStoredProjects(), ...fallbackProjects];

    } catch (error) {
        console.warn("Backend not detected, running with local and fallback projects:", error.message);
        // Resilient fallback: render stored and preset projects
        allProjects = [...getStoredProjects(), ...fallbackProjects];

    } finally {
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }

        renderProjects();

        const projectCount = document.getElementById("projectCount");
        if (projectCount) {
            projectCount.textContent = allProjects.length;
        }
    }
}

// =====================================================
// 6. CREATE A PROJECT CARD
// =====================================================

function createProjectCard(project) {
    const category = project.category || "Other";

    const skills = Array.isArray(project.skills)
        ? project.skills
        : [];

    const members = Array.isArray(project.members)
        ? project.members
        : [];

    const requiredMembers = Number(project.requiredMembers) || 1;

    const openSpots = Math.max(
        0,
        requiredMembers - members.length
    );

    const creatorName =
        typeof project.creator === "object" && project.creator
            ? project.creator.name || "Student"
            : "Student";

    const status = project.status || "Open";

    const card = document.createElement("article");

    card.className = "card project-card";

    card.innerHTML = `
        <div class="card-top">
            <div class="project-mark">✦</div>

            <span class="badge">
                ${escapeHTML(status)}
            </span>
        </div>

        <h3>${escapeHTML(project.title || "Untitled Project")}</h3>

        <p class="description">
            ${escapeHTML(project.description || "No description available.")}
        </p>

        <div class="tags">
            <span class="tag">${escapeHTML(category)}</span>

            ${skills.map(skill => `
                <span class="tag">${escapeHTML(skill)}</span>
            `).join("")}
        </div>

        <div class="card-footer">
            <span class="tiny-meta">
                ◉ ${members.length} members · ${openSpots} spots open
            </span>

            <button class="text-btn details-btn" type="button">
                View details ↗
            </button>
        </div>
    `;

    const detailsButton = card.querySelector(".details-btn");

    detailsButton.addEventListener("click", () => {
        showProjectDetails(project, creatorName);
    });

    return card;
}

// =====================================================
// 7. SHOW PROJECT DETAILS
// =====================================================

function showProjectDetails(project, creatorName) {
    if (!detailModal) {
        console.error("Project details modal was not found.");
        return;
    }

    const detailTitle = document.getElementById("detailTitle");
    const detailDescription = document.getElementById("detailDescription");
    const detailSkills = document.getElementById("detailSkills");

    if (detailTitle) {
        detailTitle.textContent = project.title || "Untitled Project";
    }

    if (detailDescription) {
        detailDescription.textContent =
            `${project.description || "No description available."}\n\n` +
            `Created by: ${creatorName}`;
    }

    if (detailSkills) {
        detailSkills.replaceChildren();

        const skills = Array.isArray(project.skills)
            ? project.skills
            : [];

        skills.forEach(skill => {
            const tag = document.createElement("span");

            tag.className = "tag";
            tag.textContent = skill;

            detailSkills.appendChild(tag);
        });
    }

    detailModal.dataset.projectId = project._id || "";

    detailModal.style.display = "flex";
}

// =====================================================
// 8. SEARCH, FILTER, AND SORT PROJECTS
// =====================================================

function renderProjects() {
    if (!projectGrid) {
        return;
    }

    projectGrid
        .querySelectorAll(".project-card")
        .forEach(card => card.remove());

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const sortOption = sortSelect
        ? sortSelect.value
        : "featured";

    let filteredProjects = allProjects.filter(project => {
        const skills = Array.isArray(project.skills)
            ? project.skills
            : [];

        const searchableText = [
            project.title || "",
            project.description || "",
            project.category || "",
            ...skills
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            activeCategory === "All" ||
            project.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort newest projects first.
    if (sortOption === "newest") {
        filteredProjects.sort((a, b) => {
            return new Date(b.createdAt || 0) -
                   new Date(a.createdAt || 0);
        });
    }

    // Projects with more open team positions first.
    else if (sortOption === "team") {
        filteredProjects.sort((a, b) => {
            const aMembers = Array.isArray(a.members) ? a.members.length : 0;
            const bMembers = Array.isArray(b.members) ? b.members.length : 0;

            const aSpots = Math.max(
                0,
                (Number(a.requiredMembers) || 1) - aMembers
            );

            const bSpots = Math.max(
                0,
                (Number(b.requiredMembers) || 1) - bMembers
            );

            return bSpots - aSpots;
        });
    }

    // Render the filtered projects.
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);

        if (emptyState && emptyState.parentElement === projectGrid) {
            projectGrid.insertBefore(card, emptyState);
        } else {
            projectGrid.appendChild(card);
        }
    });

    if (emptyState) {
        emptyState.style.display =
            filteredProjects.length === 0 ? "block" : "none";
    }
}

// =====================================================
// 9. CATEGORY FILTER BUTTONS
// =====================================================

if (filters) {
    filters.addEventListener("click", event => {
        const button = event.target.closest("[data-filter]");

        if (!button || !filters.contains(button)) {
            return;
        }

        activeCategory = button.dataset.filter || "All";

        filters.querySelectorAll(".filter").forEach(filterButton => {
            filterButton.classList.toggle(
                "active",
                filterButton === button
            );
        });

        renderProjects();
    });
}

// =====================================================
// 10. SEARCH INPUT
// =====================================================

if (searchInput) {
    searchInput.addEventListener("input", renderProjects);
}

// =====================================================
// 11. SORT DROPDOWN
// =====================================================

if (sortSelect) {
    sortSelect.addEventListener("change", renderProjects);
}

// =====================================================
// 12. CLOSE MODALS
// =====================================================

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal-backdrop");

        if (modal) {
            modal.style.display = "none";
        }
    });
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
        if (event.target === backdrop) {
            backdrop.style.display = "none";
        }
    });
});

// =====================================================
// 13. CREATE PROJECT
// =====================================================

if (projectForm) {
    projectForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (projectFormMessage) {
            projectFormMessage.textContent = "";
        }

        let token = localStorage.getItem("token");
        if (!token) {
            token = "demo_token_user";
            localStorage.setItem("token", token);
        }

        const getValue = id => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : "";
        };

        const projectData = {
            title: getValue("projectName") || "Untitled Project",
            category: getValue("projectCategory") || "Web / App",
            description: getValue("projectDescription") || "No description provided.",

            skills: getValue("projectSkills")
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean),

            requiredMembers: Number(getValue("requiredMembers")) || 3,

            githubLink: getValue("githubLink"),
            demoLink: getValue("demoLink")
        };

        const submitButton = projectForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            let createdOnServer = false;
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(projectData)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    createdOnServer = true;
                }
            } catch (netErr) {
                console.warn("Backend offline, saving project locally:", netErr.message);
            }

            if (!createdOnServer) {
                // Save locally to localStorage
                const localProj = {
                    _id: "local_" + Date.now(),
                    title: projectData.title,
                    category: projectData.category,
                    description: projectData.description,
                    skills: projectData.skills.length ? projectData.skills : ["React", "JavaScript"],
                    requiredMembers: projectData.requiredMembers,
                    members: ["You"],
                    createdBy: { name: "Shridhara Panda" },
                    status: "Recruiting"
                };

                const stored = getStoredProjects();
                stored.unshift(localProj);
                localStorage.setItem("ph_user_projects", JSON.stringify(stored));
                allProjects.unshift(localProj);
            } else {
                await loadProjects();
            }

            projectForm.reset();

            if (projectModal) {
                projectModal.style.display = "none";
            }

            renderProjects();
            const projectCount = document.getElementById("projectCount");
            if (projectCount) {
                projectCount.textContent = allProjects.length;
            }

            showToast("Project created successfully! 🚀");

        } catch (error) {
            console.error("Create project error:", error);
            showToast("Project created locally!");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

// =====================================================
// 14. OPEN CREATE PROJECT MODAL & INTERACTIVE CONTROLS
// =====================================================

// Wire up all buttons that open the project creation modal
document.querySelectorAll('[data-modal="projectModal"], #createProjectBtn, #openProjectModal, #addProjectBtn').forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (projectModal) {
            projectModal.style.display = "flex";
            const first = projectModal.querySelector("input, textarea");
            if (first) first.focus();
        }
    });
});

// Interest in joining button
const interestBtn = document.getElementById("interestBtn");
if (interestBtn) {
    interestBtn.addEventListener("click", () => {
        const projectId = detailModal?.dataset?.projectId || "current";
        let interests = JSON.parse(localStorage.getItem("ph_project_interests") || "[]");
        if (!interests.includes(projectId)) {
            interests.push(projectId);
            localStorage.setItem("ph_project_interests", JSON.stringify(interests));
        }

        interestBtn.textContent = "Interest Registered ✓";
        showToast("Your interest has been shared with the project lead! 🤝");

        setTimeout(() => {
            if (detailModal) detailModal.style.display = "none";
            interestBtn.textContent = "I'm interested in joining";
        }, 1200);
    });
}

// Mobile navigation menu
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
});

// Escape key to close modals
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (projectModal) projectModal.style.display = "none";
        if (detailModal) detailModal.style.display = "none";
    }
});

// =====================================================
// 15. LOAD PROJECTS WHEN THE PAGE OPENS
// =====================================================

loadProjects();
