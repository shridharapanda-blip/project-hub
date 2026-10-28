 /* =====================================================
   PROJECTHUB JAVASCRIPT
===================================================== */


/* =====================================================
   TOAST
===================================================== */

const toast = document.getElementById("toast");

function showToast(message) {

    toast.querySelector("span").textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("show");

});


document.querySelectorAll(".mobile-menu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("show");

        });

    });


/* =====================================================
   MOUSE GLOW
===================================================== */

const mouseGlow =
    document.querySelector(".mouse-glow");

document.addEventListener("mousemove", (e) => {

    mouseGlow.style.left =
        `${e.clientX}px`;

    mouseGlow.style.top =
        `${e.clientY}px`;

});


/* =====================================================
   REVEAL ANIMATION
===================================================== */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.1
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const counters =
    document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target =
        Number(counter.dataset.value);

    let current = 0;

    const update = () => {

        const increment =
            Math.ceil(target / 30);

        current += increment;

        if (current >= target) {

            counter.textContent = target;

            return;

        }

        counter.textContent = current;

        requestAnimationFrame(update);

    };

    update();

});


/* =====================================================
   FILTER PROJECTS
===================================================== */

const filterButtons =
    document.querySelectorAll(".filter");

const projectCards =
    document.querySelectorAll(".project-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const filter =
            button.dataset.filter;

        projectCards.forEach(card => {

            const category =
                card.dataset.category;

            if (
                filter === "all" ||
                category === filter
            ) {

                card.style.display = "block";

                setTimeout(() => {

                    card.style.opacity = "1";

                    card.style.transform =
                        "translateY(0)";

                }, 10);

            } else {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(10px)";

                setTimeout(() => {

                    card.style.display = "none";

                }, 200);

            }

        });

    });

});


/* =====================================================
   SEARCH
===================================================== */

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener("input", () => {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();

    const liveCards = document.querySelectorAll(".project-card");

    liveCards.forEach(card => {

        const title =
            (card.dataset.title || card.querySelector("h2")?.textContent || "").toLowerCase();

        const content =
            card.textContent.toLowerCase();

        if (
            title.includes(query) ||
            content.includes(query)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});


/* =====================================================
   LIKE BUTTON
===================================================== */

document.querySelectorAll(".like")
    .forEach(button => {

        button.addEventListener("click", () => {

            const number =
                button.querySelector("span");

            let count =
                Number(number.textContent);

            if (
                button.classList.contains("liked")
            ) {

                count--;

                button.classList.remove("liked");

                button.firstChild.textContent = "♡ ";

            } else {

                count++;

                button.classList.add("liked");

                button.firstChild.textContent = "♥ ";

            }

            number.textContent = count;

        });

    });


/* =====================================================
   SHARE
===================================================== */

document.querySelectorAll(".share")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const card =
                button.closest(".project-card");

            const title =
                card.dataset.title;

            const shareData = {

                title: title,

                text:
                    `Check out ${title} on ProjectHub!`,

                url: window.location.href

            };

            try {

                if (navigator.share) {

                    await navigator.share(
                        shareData
                    );

                } else {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    showToast(
                        "Project link copied!"
                    );

                }

            } catch (error) {

                console.log(error);

            }

        });

    });


/* =====================================================
   PROJECT MODAL
===================================================== */

const modal =
    document.getElementById("modal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

let currentActiveProjectTitle = "";

function openProjectModal({ title, category, description, authorHTML, tagsHTML }) {
    currentActiveProjectTitle = title || "Project";
    if (modalTitle) modalTitle.textContent = currentActiveProjectTitle;
    if (modalDescription) modalDescription.textContent = description || "";

    const catEl = document.getElementById("modalCategory");
    if (catEl) catEl.textContent = category || "PROJECT DETAILS";

    const metaEl = document.getElementById("modalMeta");
    if (metaEl) metaEl.innerHTML = authorHTML || "";

    const tagsEl = document.getElementById("modalTags");
    if (tagsEl) tagsEl.innerHTML = tagsHTML || "";

    // Sync saved button state
    const savedProjects = JSON.parse(localStorage.getItem("ph_saved_projects") || "[]");
    const saveBtn = document.getElementById("modalSaveBtn");
    if (saveBtn) {
        if (savedProjects.includes(currentActiveProjectTitle)) {
            saveBtn.textContent = "★ Saved";
            saveBtn.classList.add("active");
        } else {
            saveBtn.textContent = "Save Project";
            saveBtn.classList.remove("active");
        }
    }

    // Sync collaborate button state
    const collabRequests = JSON.parse(localStorage.getItem("ph_collab_requests") || "[]");
    const collabBtn = document.getElementById("modalCollaborateBtn");
    if (collabBtn) {
        if (collabRequests.includes(currentActiveProjectTitle)) {
            collabBtn.textContent = "Request Sent ✓";
        } else {
            collabBtn.textContent = "Collaborate";
        }
    }

    modal.classList.add("show");
}

function bindViewProjectBtn(button) {
    if (!button) return;
    button.addEventListener("click", () => {
        const card = button.closest(".project-card");
        if (!card) return;

        const title = card.dataset.title || card.querySelector("h2")?.textContent || "Project";
        const category = card.querySelector(".project-content small")?.textContent || "PROJECT DETAILS";
        const description = card.querySelector(".project-content p")?.textContent || "";
        const authorHTML = card.querySelector(".user") ? card.querySelector(".user").innerHTML : "";
        const tagsHTML = card.querySelector(".tags") ? card.querySelector(".tags").innerHTML : "";

        openProjectModal({ title, category, description, authorHTML, tagsHTML });
    });
}

document.querySelectorAll(".view-project").forEach(bindViewProjectBtn);

closeModal?.addEventListener("click", () => {
    modal.classList.remove("show");
});

modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});


/* =====================================================
   COMMENT SYSTEM
===================================================== */

const commentModal =
    document.getElementById("commentModal");

const closeCommentModal =
    document.getElementById("closeCommentModal");

const commentInput =
    document.getElementById("commentInput");

const commentSubmit =
    document.getElementById("commentSubmit");

const comments =
    document.getElementById("comments");


let currentCommentButton = null;


document.querySelectorAll(".comment")
    .forEach(button => {

        button.addEventListener("click", () => {

            currentCommentButton =
                button;

            commentModal.classList.add("show");

        });

    });


closeCommentModal.addEventListener(
    "click",
    () => {

        commentModal.classList.remove(
            "show"
        );

    }
);


function handleCommentSubmit() {
    const text =
        commentInput.value.trim();

    if (!text) {
        showToast(
            "Write a comment first."
        );
        return;
    }

    const comment =
        document.createElement("div");

    comment.className =
        "comment-item";

    comment.innerHTML = `
        <div class="comment-avatar">
            SP
        </div>

        <div>
            <strong>
                Shridhara Panda
            </strong>

            <p>
                ${text}
            </p>
        </div>
    `;

    comments.appendChild(comment);

    if (currentCommentButton) {
        const span =
            currentCommentButton
                .querySelector("span");

        span.textContent =
            Number(span.textContent) + 1;
    }

    commentInput.value = "";

    showToast(
        "Comment added!"
    );
}

commentSubmit.addEventListener("click", handleCommentSubmit);

commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCommentSubmit();
    }
});


/* =====================================================
   CLOSE COMMENT MODAL
===================================================== */

commentModal.addEventListener(
    "click",
    (e) => {

        if (e.target === commentModal) {

            commentModal.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   CREATE POST
===================================================== */

const postText =
    document.getElementById("postText");

const imageInput =
    document.getElementById("imageInput");

const videoInput =
    document.getElementById("videoInput");

const mediaPreview =
    document.getElementById("mediaPreview");

const postBtn =
    document.getElementById("postBtn");

const postType =
    document.getElementById("postType");

const projectOption =
    document.getElementById("projectOption");

const eventOption =
    document.getElementById("eventOption");


let selectedPostType = "";


/* =====================================================
   IMAGE PREVIEW
===================================================== */

imageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) return;


        videoInput.value = "";

        const imageURL =
            URL.createObjectURL(file);

        mediaPreview.innerHTML = `

            <img
                src="${imageURL}"
                alt="Selected image">

        `;

        mediaPreview.style.display =
            "block";

        selectedPostType = "Photo";

        postType.textContent =
            "📷 Photo post";

        postType.style.display =
            "block";

    }
);


/* =====================================================
   VIDEO PREVIEW
===================================================== */

videoInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) return;


        imageInput.value = "";

        const videoURL =
            URL.createObjectURL(file);

        mediaPreview.innerHTML = `

            <video
                src="${videoURL}"
                controls>
            </video>

        `;

        mediaPreview.style.display =
            "block";

        selectedPostType = "Video";

        postType.textContent =
            "🎥 Video post";

        postType.style.display =
            "block";

    }
);


/* =====================================================
   PROJECT POST
===================================================== */

projectOption.addEventListener(
    "click",
    () => {

        selectedPostType =
            "Project";

        postType.textContent =
            "🚀 Project post";

        postType.style.display =
            "block";

        postText.focus();

        showToast(
            "Project post selected"
        );

    }
);


/* =====================================================
   EVENT POST
===================================================== */

eventOption.addEventListener(
    "click",
    () => {

        selectedPostType =
            "Event";

        postType.textContent =
            "📅 Event post";

        postType.style.display =
            "block";

        postText.focus();

        showToast(
            "Event post selected"
        );

    }
);


/* =====================================================
   CREATE POST
===================================================== */

postBtn.addEventListener(
    "click",
    () => {

        const text =
            postText.value.trim();

        const image =
            imageInput.files[0];

        const video =
            videoInput.files[0];


        if (
            !text &&
            !image &&
            !video &&
            !selectedPostType
        ) {

            showToast(
                "Write something or add media."
            );

            return;

        }


        createNewPost(
            text,
            image,
            video,
            selectedPostType
        );


        postText.value = "";

        imageInput.value = "";

        videoInput.value = "";

        mediaPreview.innerHTML = "";

        mediaPreview.style.display =
            "none";

        postType.innerHTML = "";

        postType.style.display =
            "none";

        selectedPostType = "";

    }
);


/* =====================================================
   CREATE NEW POST CARD
===================================================== */

function createNewPost(
    text,
    image,
    video,
    type
) {

    const feed =
        document.querySelector(".feed");

    const filters =
        document.querySelector(".filters");


    const post =
        document.createElement("article");

    post.className =
        "project-card reveal visible";

    post.dataset.title =
        type ? `${type}: ${text ? text.slice(0, 30) : "Post"}` : (text ? text.slice(0, 30) : "Community Update");

    post.dataset.category = "all";


    let mediaHTML = "";


    if (image) {

        const url =
            URL.createObjectURL(image);

        mediaHTML = `

            <div class="media-preview"
                style="display:block">

                <img
                    src="${url}"
                    alt="Post image">

            </div>

        `;

    }


    if (video) {

        const url =
            URL.createObjectURL(video);

        mediaHTML = `

            <div class="media-preview"
                style="display:block">

                <video
                    src="${url}"
                    controls>
                </video>

            </div>

        `;

    }


    const safeText =
        text || "Shared an update with the ProjectHub community.";


    post.innerHTML = `

        <div class="project-header">

            <div class="user">

                <div class="project-avatar">
                    SP
                </div>

                <div>

                    <h4>
                        Shridhara Panda
                    </h4>

                    <p>
                        VSSUT · Just now
                    </p>

                </div>

            </div>

            <span class="completed">
                ● ${type || "Update"}
            </span>

        </div>


        <div class="project-content">

            <small>
                PROJECTHUB UPDATE
            </small>

            <h2>
                ${type || "New Update"}
            </h2>

            <p>
                ${safeText}
            </p>

            ${mediaHTML}

        </div>


        <div class="project-bottom">

            <div class="actions">

                <button class="like">
                    ♡ <span>0</span>
                </button>

                <button class="comment">
                    ◌ <span>0</span>
                </button>

                <button class="share">
                    ↗ Share
                </button>

            </div>

            <button class="view-project">
                View Post →
            </button>

        </div>

    `;


    feed.insertBefore(
        post,
        filters
    );


    /* Add functionality to new buttons */

    const like =
        post.querySelector(".like");

    like.addEventListener(
        "click",
        () => {

            const span =
                like.querySelector("span");

            let count =
                Number(span.textContent);

            if (
                like.classList.contains(
                    "liked"
                )
            ) {

                count--;

                like.classList.remove(
                    "liked"
                );

                like.firstChild.textContent =
                    "♡ ";

            } else {

                count++;

                like.classList.add(
                    "liked"
                );

                like.firstChild.textContent =
                    "♥ ";

            }

            span.textContent =
                count;

        }
    );


    const share =
        post.querySelector(".share");

    share.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast(
                    "Post link copied!"
                );

            } catch {

                showToast(
                    "Post shared!"
                );

            }

        }
    );


    const comment =
        post.querySelector(".comment");

    comment.addEventListener(
        "click",
        () => {

            currentCommentButton =
                comment;

            commentModal.classList.add(
                "show"
            );

        }
    );

    const viewProjectBtn =
        post.querySelector(".view-project");

    if (viewProjectBtn) {
        bindViewProjectBtn(viewProjectBtn);
    }

    // Increment profile stats projects counter
    const statsProjectCounter =
        document.querySelector(".card.profile .counter");
    if (statsProjectCounter) {
        const val = Number(statsProjectCounter.textContent) || 0;
        statsProjectCounter.textContent = val + 1;
    }

    showToast(
        "Post published successfully!"
    );

}


/* =====================================================
   MODAL CONTROLS: COLLABORATE & SAVE PROJECT
===================================================== */

const modalCollaborateBtn = document.getElementById("modalCollaborateBtn");
const modalSaveBtn = document.getElementById("modalSaveBtn");
const collaborateModal = document.getElementById("collaborateModal");
const closeCollaborateModal = document.getElementById("closeCollaborateModal");
const cancelCollaborateModal = document.getElementById("cancelCollaborateModal");
const collaborateForm = document.getElementById("collaborateForm");
const collaborateProjectPrompt = document.getElementById("collaborateProjectPrompt");

if (modalSaveBtn) {
    modalSaveBtn.addEventListener("click", () => {
        let savedProjects = JSON.parse(localStorage.getItem("ph_saved_projects") || "[]");
        if (savedProjects.includes(currentActiveProjectTitle)) {
            savedProjects = savedProjects.filter(t => t !== currentActiveProjectTitle);
            modalSaveBtn.textContent = "Save Project";
            modalSaveBtn.classList.remove("active");
            showToast("Project removed from bookmarks");
        } else {
            savedProjects.push(currentActiveProjectTitle);
            modalSaveBtn.textContent = "★ Saved";
            modalSaveBtn.classList.add("active");
            showToast("Project saved to your bookmarks! ★");
        }
        localStorage.setItem("ph_saved_projects", JSON.stringify(savedProjects));
    });
}

if (modalCollaborateBtn) {
    modalCollaborateBtn.addEventListener("click", () => {
        if (modalCollaborateBtn.textContent.includes("Sent")) {
            showToast("You have already sent a collaboration request!");
            return;
        }
        if (collaborateProjectPrompt) {
            collaborateProjectPrompt.textContent = `Apply to collaborate on "${currentActiveProjectTitle}".`;
        }
        collaborateModal?.classList.add("show");
    });
}

closeCollaborateModal?.addEventListener("click", () => collaborateModal?.classList.remove("show"));
cancelCollaborateModal?.addEventListener("click", () => collaborateModal?.classList.remove("show"));
collaborateModal?.addEventListener("click", (e) => {
    if (e.target === collaborateModal) collaborateModal.classList.remove("show");
});

collaborateForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = document.getElementById("collabRole")?.value || "Developer";

    const requests = JSON.parse(localStorage.getItem("ph_collab_requests") || "[]");
    if (!requests.includes(currentActiveProjectTitle)) {
        requests.push(currentActiveProjectTitle);
        localStorage.setItem("ph_collab_requests", JSON.stringify(requests));
    }

    if (modalCollaborateBtn) {
        modalCollaborateBtn.textContent = "Request Sent ✓";
    }

    collaborateModal?.classList.remove("show");
    collaborateForm.reset();
    showToast(`Collaboration request sent for ${role}! 🤝`);
});


/* =====================================================
   SPONSORED PROJECTS: EXPLORE BUTTONS
===================================================== */

document.querySelectorAll(".explore-sponsored-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.project;
        if (type === "smart-campus") {
            openProjectModal({
                title: "Smart Campus - Next Gen Experience",
                category: "✦ SPONSORED PROJECT · WEB & IoT",
                description: "A comprehensive smart-campus platform developed to automate queue management in college administrative offices and canteens, integrate real-time shuttle tracking, and deploy emergency safety IoT beacons across campus hostels. Sponsored by EduTech Ventures with active student grant stipends.",
                authorHTML: `
                    <div class="project-avatar" style="background: linear-gradient(135deg, #7c6cff, #22d3ee);">EV</div>
                    <div>
                        <h4>EduTech Ventures</h4>
                        <p>Official Innovation Sponsor · Active Grant</p>
                    </div>
                `,
                tagsHTML: `
                    <span>IoT</span>
                    <span>ESP32</span>
                    <span>React Native</span>
                    <span>Node.js</span>
                    <span>MongoDB</span>
                `
            });
        } else if (type === "ai-agriculture") {
            openProjectModal({
                title: "AI Agriculture Platform",
                category: "✦ SPONSORED PROJECT · ARTIFICIAL INTELLIGENCE",
                description: "An AI-powered agricultural advisory system that processes satellite multispectral imagery and microclimate sensors to predict crop yields, optimize irrigation schedules, and alert farmers on crop diseases. Backed by AgroTech Global with cloud GPU compute sponsorship.",
                authorHTML: `
                    <div class="project-avatar" style="background: linear-gradient(135deg, #34d399, #059669);">AG</div>
                    <div>
                        <h4>AgroTech Global</h4>
                        <p>AgriTech Partner · Student Research Grant</p>
                    </div>
                `,
                tagsHTML: `
                    <span>Python</span>
                    <span>TensorFlow</span>
                    <span>Computer Vision</span>
                    <span>FastAPI</span>
                    <span>PyTorch</span>
                `
            });
        }
    });
});


/* =====================================================
   CREATE PROJECT MODAL
===================================================== */

const createProjectBtn = document.getElementById("createProject");
const createProjectModal = document.getElementById("createProjectModal");
const closeCreateProjectModal = document.getElementById("closeCreateProjectModal");
const cancelCreateProject = document.getElementById("cancelCreateProject");
const newProjectForm = document.getElementById("newProjectForm");

createProjectBtn?.addEventListener("click", () => {
    createProjectModal?.classList.add("show");
    document.getElementById("newProjectTitle")?.focus();
});

closeCreateProjectModal?.addEventListener("click", () => createProjectModal?.classList.remove("show"));
cancelCreateProject?.addEventListener("click", () => createProjectModal?.classList.remove("show"));
createProjectModal?.addEventListener("click", (e) => {
    if (e.target === createProjectModal) createProjectModal.classList.remove("show");
});

newProjectForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("newProjectTitle").value.trim();
    const category = document.getElementById("newProjectCategory").value;
    const description = document.getElementById("newProjectDescription").value.trim();
    const tagsRaw = document.getElementById("newProjectTags").value.trim();
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : ["Student Project"];

    if (!title || !description) return;

    // Create new project card in center feed
    const feed = document.querySelector(".feed");
    const filters = document.querySelector(".filters");

    const article = document.createElement("article");
    article.className = "project-card tilt reveal visible";
    article.dataset.category = category;
    article.dataset.title = title;

    const tagsHTML = tags.map(t => `<span>${t}</span>`).join("");
    const categoryLabels = {
        web: "WEB DEVELOPMENT",
        ai: "ARTIFICIAL INTELLIGENCE",
        hardware: "HARDWARE & IoT",
        social: "SOCIAL IMPACT"
    };

    article.innerHTML = `
        <div class="project-header">
            <div class="user">
                <div class="profile-avatar">SP</div>
                <div>
                    <h4>Shridhara Panda</h4>
                    <p>VSSUT · Just now</p>
                </div>
            </div>
            <span class="completed" style="color: var(--cyan);">● Just Launched</span>
        </div>
        <div class="project-content">
            <small>${categoryLabels[category] || "STUDENT INNOVATION"}</small>
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="tags">${tagsHTML}</div>
        </div>
        <div class="project-bottom">
            <div class="actions">
                <button class="like">♡ <span>0</span></button>
                <button class="comment">◌ <span>0</span></button>
                <button class="share">↗ Share</button>
            </div>
            <button class="view-project">View Project →</button>
        </div>
    `;

    feed.insertBefore(article, filters);

    // Setup interactive events on the new project card
    const likeBtn = article.querySelector(".like");
    likeBtn.addEventListener("click", () => {
        const num = likeBtn.querySelector("span");
        let count = Number(num.textContent);
        if (likeBtn.classList.contains("liked")) {
            count--;
            likeBtn.classList.remove("liked");
            likeBtn.firstChild.textContent = "♡ ";
        } else {
            count++;
            likeBtn.classList.add("liked");
            likeBtn.firstChild.textContent = "♥ ";
        }
        num.textContent = count;
    });

    const commentBtn = article.querySelector(".comment");
    commentBtn.addEventListener("click", () => {
        currentCommentButton = commentBtn;
        commentModal.classList.add("show");
    });

    const shareBtn = article.querySelector(".share");
    shareBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast("Project link copied!");
        } catch {
            showToast("Project shared!");
        }
    });

    const viewBtn = article.querySelector(".view-project");
    bindViewProjectBtn(viewBtn);

    // Increment sidebar Projects counter
    const projectCounters = document.querySelectorAll(".counter");
    if (projectCounters.length > 0) {
        const currentCount = Number(projectCounters[0].textContent) || 12;
        projectCounters[0].textContent = currentCount + 1;
    }

    createProjectModal?.classList.remove("show");
    newProjectForm.reset();
    showToast(`Project "${title}" published to feed! 🚀`);
});


/* =====================================================
   FIND A MENTOR MODAL
===================================================== */

const mentorBtn = document.getElementById("mentorBtn");
const mentorModal = document.getElementById("mentorModal");
const closeMentorModal = document.getElementById("closeMentorModal");

mentorBtn?.addEventListener("click", () => {
    // Update button states from localStorage
    const requestedMentors = JSON.parse(localStorage.getItem("ph_requested_mentors") || "[]");
    document.querySelectorAll(".mentor-request-btn").forEach(btn => {
        const mentorName = btn.dataset.mentor;
        if (requestedMentors.includes(mentorName)) {
            btn.textContent = "Requested ✓";
            btn.style.opacity = "0.7";
            btn.disabled = true;
        } else {
            btn.textContent = "Request Mentorship";
            btn.style.opacity = "1";
            btn.disabled = false;
        }
    });

    mentorModal?.classList.add("show");
});

closeMentorModal?.addEventListener("click", () => mentorModal?.classList.remove("show"));
mentorModal?.addEventListener("click", (e) => {
    if (e.target === mentorModal) mentorModal.classList.remove("show");
});

document.querySelectorAll(".mentor-request-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const mentorName = btn.dataset.mentor;
        let requested = JSON.parse(localStorage.getItem("ph_requested_mentors") || "[]");
        if (!requested.includes(mentorName)) {
            requested.push(mentorName);
            localStorage.setItem("ph_requested_mentors", JSON.stringify(requested));
        }

        btn.textContent = "Requested ✓";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        // Increment connections counter in left sidebar
        const counters = document.querySelectorAll(".counter");
        if (counters.length > 1) {
            const currentConnections = Number(counters[1].textContent) || 86;
            counters[1].textContent = currentConnections + 1;
        }

        showToast(`Mentorship request sent to ${mentorName}! 🎓`);
    });
});


/* =====================================================
   SPONSORSHIP MODAL
===================================================== */

const sponsorBtn = document.getElementById("sponsorBtn");
const sponsorModal = document.getElementById("sponsorModal");
const closeSponsorModal = document.getElementById("closeSponsorModal");
const cancelSponsorModal = document.getElementById("cancelSponsorModal");
const sponsorForm = document.getElementById("sponsorForm");

sponsorBtn?.addEventListener("click", () => {
    sponsorModal?.classList.add("show");
    document.getElementById("sponsorProjectName")?.focus();
});

closeSponsorModal?.addEventListener("click", () => sponsorModal?.classList.remove("show"));
cancelSponsorModal?.addEventListener("click", () => sponsorModal?.classList.remove("show"));
sponsorModal?.addEventListener("click", (e) => {
    if (e.target === sponsorModal) sponsorModal.classList.remove("show");
});

sponsorForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const projName = document.getElementById("sponsorProjectName").value.trim();
    const type = document.getElementById("sponsorType").value;
    const amount = document.getElementById("sponsorAmount").value.trim();
    const pitch = document.getElementById("sponsorPitch").value.trim();

    const application = { projName, type, amount, pitch, date: new Date().toISOString() };
    const allApps = JSON.parse(localStorage.getItem("ph_sponsorship_apps") || "[]");
    allApps.push(application);
    localStorage.setItem("ph_sponsorship_apps", JSON.stringify(allApps));

    sponsorModal?.classList.remove("show");
    sponsorForm.reset();
    showToast(`Sponsorship application for "${projName}" submitted! ✦`);
});


/* =====================================================
   HACKATHON DETAILS MODAL & VIEW ALL EVENTS
===================================================== */

const hackathonDetailModal = document.getElementById("hackathonDetailModal");
const closeHackathonModal = document.getElementById("closeHackathonModal");
const hackathonSaveBtn = document.getElementById("hackathonSaveBtn");
const viewAllEventsBtn = document.getElementById("viewAllEventsBtn");

const hackathonData = {
    aws: {
        title: "AWS Student Hackathon",
        tag: "GLOBAL CLOUD CHALLENGE",
        desc: "Build next-generation serverless, containerized, or AI-integrated student applications on AWS. Open to global university developers with $100 AWS credits per participant.",
        date: "28 SEP, 2026",
        loc: "Online (Global)",
        team: "1 - 4 Members",
        prize: "₹50,000 + AWS Cloud Credits & Mentorship"
    },
    innovation: {
        title: "Innovation Challenge",
        tag: "NATIONAL HARDWARE & AI HACKATHON",
        desc: "Annual national university challenge focusing on smart cities, clean tech, and healthcare robotics. Final prototype presentation live on-campus at IIT Kharagpur.",
        date: "02 OCT, 2026",
        loc: "IIT Kharagpur (Hybrid)",
        team: "2 - 4 Members",
        prize: "₹1,00,000 + Incubation & Seed Funding"
    },
    techfest: {
        title: "Student Tech Fest",
        tag: "OPEN SOURCE & ROBOTICS EXPO",
        desc: "A 36-hour sprint for student innovators, robotics enthusiasts, and open-source contributors from eastern India. Showcase projects to venture builders and tech recruiters.",
        date: "10 OCT, 2026",
        loc: "Bhubaneswar (In-person)",
        team: "1 - 3 Members",
        prize: "₹35,000 + Tech Goodies & Internship Fast-track"
    }
};

let currentHackathonEventKey = "";

document.querySelectorAll(".event.event-clickable").forEach(card => {
    card.addEventListener("click", () => {
        const key = card.dataset.event || "aws";
        currentHackathonEventKey = key;
        const data = hackathonData[key] || hackathonData.aws;

        document.getElementById("hackathonModalTitle").textContent = data.title;
        document.getElementById("hackathonModalTag").textContent = data.tag;
        document.getElementById("hackathonModalDesc").textContent = data.desc;
        document.getElementById("hackathonModalDate").textContent = data.date;
        document.getElementById("hackathonModalLocation").textContent = data.loc;
        document.getElementById("hackathonModalTeam").textContent = data.team;
        document.getElementById("hackathonModalPrize").textContent = data.prize;

        const savedEvents = JSON.parse(localStorage.getItem("ph_saved_events") || "[]");
        if (savedEvents.includes(key)) {
            hackathonSaveBtn.textContent = "★ Saved in Calendar";
        } else {
            hackathonSaveBtn.textContent = "☆ Save Event";
        }

        hackathonDetailModal?.classList.add("show");
    });
});

closeHackathonModal?.addEventListener("click", () => hackathonDetailModal?.classList.remove("show"));
hackathonDetailModal?.addEventListener("click", (e) => {
    if (e.target === hackathonDetailModal) hackathonDetailModal.classList.remove("show");
});

hackathonSaveBtn?.addEventListener("click", () => {
    let savedEvents = JSON.parse(localStorage.getItem("ph_saved_events") || "[]");
    if (savedEvents.includes(currentHackathonEventKey)) {
        savedEvents = savedEvents.filter(k => k !== currentHackathonEventKey);
        hackathonSaveBtn.textContent = "☆ Save Event";
        showToast("Event removed from saved schedule");
    } else {
        savedEvents.push(currentHackathonEventKey);
        hackathonSaveBtn.textContent = "★ Saved in Calendar";
        showToast("Event saved to your personal schedule! 📅");
    }
    localStorage.setItem("ph_saved_events", JSON.stringify(savedEvents));
});

viewAllEventsBtn?.addEventListener("click", () => {
    window.location.href = "hackathons.html";
});


/* =====================================================
   NOTIFICATION ACTION BUTTONS
===================================================== */

document.querySelectorAll(".accept-connection-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.dataset.name || "User";
        btn.textContent = "Connected ✓";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        const declineBtn = btn.nextElementSibling;
        if (declineBtn) declineBtn.style.display = "none";

        // Increment connection count in profile stats
        const counters = document.querySelectorAll(".counter");
        if (counters.length > 1) {
            const currentConnections = Number(counters[1].textContent) || 86;
            counters[1].textContent = currentConnections + 1;
        }

        showToast(`You are now connected with ${name}! 🤝`);
    });
});

document.querySelectorAll(".decline-connection-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = btn.closest(".notification-item");
        if (item) {
            item.style.opacity = "0";
            setTimeout(() => item.remove(), 200);
        }
        showToast("Connection request dismissed");
    });
});

document.querySelectorAll(".notif-view-project").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationPanel?.classList.remove("show");
        const title = btn.dataset.title;
        let matchedCard = null;
        document.querySelectorAll(".project-card").forEach(c => {
            if (c.dataset.title && c.dataset.title.toLowerCase().includes(title.toLowerCase())) {
                matchedCard = c;
            }
        });
        if (matchedCard) {
            matchedCard.scrollIntoView({ behavior: "smooth", block: "center" });
            const viewBtn = matchedCard.querySelector(".view-project");
            if (viewBtn) viewBtn.click();
        } else {
            openProjectModal({
                title: "AI Agriculture Platform",
                category: "ARTIFICIAL INTELLIGENCE",
                description: "An intelligent platform that helps farmers understand crop demand, pricing and agricultural trends."
            });
        }
    });
});

document.querySelectorAll(".notif-view-comment").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationPanel?.classList.remove("show");
        commentModal?.classList.add("show");
    });
});

document.querySelectorAll(".notif-view-hackathon").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationPanel?.classList.remove("show");
        const card = document.querySelector(`.event[data-event="${btn.dataset.event}"]`);
        if (card) card.click();
        else window.location.href = "hackathons.html";
    });
});


/* =====================================================
   3D TILT EFFECT
===================================================== */

const tiltCards =
    document.querySelectorAll(".tilt");


tiltCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        (e) => {

            if (
                window.innerWidth < 800
            ) return;


            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) /
                    centerY) * -2;


            const rotateY =
                ((x - centerX) /
                    centerX) * 2;


            card.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-2px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =====================================================
   KEYBOARD ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "Escape") {

            modal?.classList.remove("show");
            commentModal?.classList.remove("show");
            mobileMenu?.classList.remove("show");
            createProjectModal?.classList.remove("show");
            mentorModal?.classList.remove("show");
            sponsorModal?.classList.remove("show");
            hackathonDetailModal?.classList.remove("show");
            collaborateModal?.classList.remove("show");
            notificationPanel?.classList.remove("show");

        }

    }
);
(() => {
    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    // Show temporary notification messages.
    const toast = (message) => {
        const node = $("#toast");

        if (!node) return;

        node.textContent = message;
        node.classList.add("show");

        clearTimeout(window.__toastTimer);

        window.__toastTimer = setTimeout(() => {
            node.classList.remove("show");
        }, 2600);
    };

    // Mobile navigation menu.
    const menu = $(".menu-btn");
    const nav = $(".nav-links");

    menu?.addEventListener("click", () => {
        nav?.classList.toggle("open");
    });

    $$(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            nav?.classList.remove("open");
        });
    });

    // Open modals.
    $$("[data-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = $("#" + button.dataset.modal);

            modal?.classList.add("show");

            const firstInput = $("input, textarea, select", modal);

            setTimeout(() => firstInput?.focus(), 80);
        });
    });

    // Close modals using close buttons.
    $$(".close-modal").forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".modal-backdrop")?.classList.remove("show");
        });
    });

    // Close modal by clicking outside it.
    $$(".modal-backdrop").forEach((backdrop) => {
        backdrop.addEventListener("click", (event) => {
            if (event.target === backdrop) {
                backdrop.classList.remove("show");
            }
        });
    });

    // Close modal with Escape key.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            $$(".modal-backdrop.show").forEach((modal) => {
                modal.classList.remove("show");
            });
        }
    });

    // Search, filter and sort functionality.
    const grid = $("#projectGrid, #memberGrid, #eventGrid");

    if (grid) {
        let category = "All";

        const cards = () => $$(":scope > .card", grid);

        const search = $("#searchInput");
        const sort = $("#sortSelect");
        const empty = $("#emptyState");

        const apply = () => {
            const term = (search?.value || "").trim().toLowerCase();

            let shown = 0;

            const items = cards();

            items.forEach((card) => {
                const categoryMatch =
                    category === "All" ||
                    card.dataset.category === category;

                const textMatch = (
                    card.dataset.search || card.textContent
                ).toLowerCase().includes(term);

                let selectMatch = true;

                if (sort?.value === "available") {
                    selectMatch = card.dataset.available === "yes";
                }

                if (sort?.value === "mentor") {
                    selectMatch = card.dataset.mentor === "yes";
                }

                if (
                    sort?.value === "online" ||
                    sort?.value === "offline" ||
                    sort?.value === "hybrid"
                ) {
                    selectMatch = card.dataset.format === sort.value;
                }

                const visible =
                    categoryMatch && textMatch && selectMatch;

                card.style.display = visible ? "" : "none";

                if (visible) shown++;
            });

            // Sort project cards.
            if (
                sort &&
                ["newest", "team"].includes(sort.value) &&
                grid.id === "projectGrid"
            ) {
                items
                    .sort((a, b) => {
                        if (sort.value === "newest") {
                            return Number(b.dataset.new) - Number(a.dataset.new);
                        }

                        return Number(b.dataset.team) - Number(a.dataset.team);
                    })
                    .forEach((card) => {
                        grid.insertBefore(card, empty);
                    });
            }

            // Sort hackathon events by the newest listing.
            if (
                sort?.value === "newest" &&
                grid.id === "eventGrid"
            ) {
                items
                    .sort((a, b) => {
                        return Number(b.dataset.new) - Number(a.dataset.new);
                    })
                    .forEach((card) => {
                        grid.insertBefore(card, empty);
                    });
            }

            if (empty) {
                empty.style.display = shown ? "none" : "block";
            }
        };

        // Category buttons.
        $$(".filter").forEach((button) => {
            button.addEventListener("click", () => {
                $$(".filter").forEach((item) => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                category = button.dataset.filter;

                apply();
            });
        });

        search?.addEventListener("input", apply);
        sort?.addEventListener("change", apply);

        apply();
    }

    // Open project details.
    $$(".details-btn").forEach((button) => {
        button.addEventListener("click", () => {
            $("#detailTitle").textContent = button.dataset.title;

            $("#detailDescription").textContent =
                button.dataset.description;

            const skills = (button.dataset.skills || "")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);

            // Escape HTML special characters before inserting skill names.
            $("#detailSkills").innerHTML = skills
                .map((skill) => {
                    const safeSkill = skill.replace(
                        /[&<>"']/g,
                        (character) => ({
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        })[character]
                    );

                    return `<span class="tag">${safeSkill}</span>`;
                })
                .join("");

            $("#detailModal").classList.add("show");
        });
    });

    // Join a project preview.
    $("#interestBtn")?.addEventListener("click", () => {
        $("#detailModal").classList.remove("show");

        toast(
            "Interest saved in this demo. Add a backend to send a real request."
        );
    });

    // Connect to members.
    $$(".connect-btn").forEach((button) => {
        button.addEventListener("click", () => {
            toast(
                `Connection request preview for ${button.dataset.name}. Backend not connected yet.`
            );
        });
    });

    // Save or unsave hackathon events.
    $$(".save-event").forEach((button) => {
        button.addEventListener("click", () => {
            const saved = button.dataset.saved === "yes";

            button.dataset.saved = saved ? "no" : "yes";

            button.textContent = saved ? "☆ Save event" : "★ Saved";

            button.classList.toggle("secondary-btn", !saved);

            toast(
                saved
                    ? "Event removed from saved list."
                    : "Event saved in this browser preview."
            );
        });
    });

    // Create project preview.
    $("#projectForm")?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = $("#projectName").value.trim();

        const description =
            $("#projectDescription").value.trim();

        const category = $("#projectCategory").value;

        if (!name || !description) return;

        const card = document.createElement("article");

        card.className = "card project-card";

        card.dataset.category = category;

        card.dataset.search =
            `${name} ${description} ${category}`.toLowerCase();

        card.dataset.team = "0";
        card.dataset.new = "99";

        card.innerHTML = `
            <div class="card-top">
                <div class="project-mark">✦</div>
                <span class="badge purple">Your preview</span>
            </div>

            <h3></h3>

            <p class="description"></p>

            <div class="tags">
                <span class="tag"></span>
                <span class="tag">New idea</span>
            </div>

            <div class="card-footer">
                <span class="tiny-meta">
                    ◉ Just created · Looking for teammates
                </span>
                <span class="text-btn">Draft</span>
            </div>
        `;

        $("h3", card).textContent = name;

        $(".description", card).textContent = description;

        $(".tags .tag", card).textContent = category;

        $("#projectGrid")?.insertBefore(card, $("#emptyState"));

        $("#projectModal").classList.remove("show");

        event.target.reset();

        toast(
            "Project preview created. It will disappear when you refresh."
        );
    });

    // Create member profile preview.
    $("#joinForm")?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = $("#memberName").value.trim();

        const role = $("#memberRole").value;

        const skills = $("#memberSkills").value.trim();

        const card = document.createElement("article");

        card.className = "card member-card";

        card.dataset.category = role.includes("AI")
            ? "AI / ML"
            : role.includes("Frontend")
                ? "Frontend"
                : role.includes("Backend") || role.includes("Full-Stack")
                    ? "Backend"
                    : role.includes("Design")
                        ? "UI/UX"
                        : "Cybersecurity";

        card.dataset.search = `${name} ${role} ${skills}`.toLowerCase();

        card.dataset.available = "yes";
        card.dataset.mentor = "no";

        const initials = name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0] || "")
            .join("")
            .toUpperCase();

        card.innerHTML = `
            <div class="member-avatar"></div>

            <h3></h3>

            <div class="member-role"></div>

            <div class="member-college">
                Community member · Add your university later
            </div>

            <div class="member-skills"></div>

            <div class="member-stats">
                <div><strong>0</strong><span>Projects</span></div>
                <div><strong>New</strong><span>Member</span></div>
                <div><strong>Open</strong><span>Availability</span></div>
            </div>

            <button class="secondary-btn full-btn connect-btn">
                Connect
            </button>
        `;

        $(".member-avatar", card).textContent = initials;

        $("h3", card).textContent = name;

        $(".member-role", card).textContent = role;

        skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
            .slice(0, 4)
            .forEach((skill) => {
                const span = document.createElement("span");

                span.className = "tag";
                span.textContent = skill;

                $(".member-skills", card).append(span);
            });

        $(".connect-btn", card).dataset.name = name;

        $(".connect-btn", card).addEventListener("click", () => {
            toast(`Connection request preview for ${name}.`);
        });

        $("#memberGrid")?.insertBefore(card, $("#emptyState"));

        $("#joinModal").classList.remove("show");

        event.target.reset();

        toast(
            "Member profile preview created. It will disappear when you refresh."
        );
    });

    // Add hackathon event preview.
    $("#eventForm")?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = $("#eventName").value.trim();

        const theme = $("#eventTheme").value;

        const dateValue = $("#eventDate").value;

        const link = $("#eventLink").value.trim();

        if (!name || !dateValue) return;

        const date = new Date(`${dateValue}T12:00:00`);

        const day = String(date.getDate()).padStart(2, "0");

        const month = date.toLocaleString("en-US", {
            month: "short"
        });

        const card = document.createElement("article");

        card.className = "card event-card";

        card.dataset.category = theme;

        card.dataset.search = `${name} ${theme}`.toLowerCase();

        card.dataset.format = "online";

        card.dataset.new = "99";

        card.innerHTML = `
            <div class="event-head">
                <div>
                    <div class="event-type"></div>
                    <h3></h3>
                </div>

                <div class="event-date">
                    <strong></strong>
                    <span></span>
                </div>
            </div>

            <p class="description">
                New event shared by the community. Check the organizer's
                official page for eligibility and final details.
            </p>

            <div class="event-meta">
                <span>◷ Date · ${date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })}</span>

                <span>⌘ Format · To be confirmed</span>
            </div>

            <div class="tags">
                <span class="tag"></span>
                <span class="tag">Community listing</span>
            </div>

            <div class="event-bottom">
                <span class="tiny-meta">Preview listing</span>
                <button class="primary-btn save-event">☆ Save event</button>
            </div>
        `;

        $(".event-type", card).textContent = `${theme} · Community`;

        $("h3", card).textContent = name;

        $(".event-date strong", card).textContent = day;

        $(".event-date span", card).textContent = month;

        $(".tags .tag", card).textContent = theme;

        $(".save-event", card).addEventListener("click", (clickEvent) => {
            const button = clickEvent.currentTarget;

            const saved = button.dataset.saved === "yes";

            button.dataset.saved = saved ? "no" : "yes";

            button.textContent = saved ? "☆ Save event" : "★ Saved";

            toast(
                saved
                    ? "Event removed from saved list."
                    : "Event saved in this browser preview."
            );
        });

        if (link) {
            const linkButton = document.createElement("a");

            linkButton.href = link;
            linkButton.target = "_blank";
            linkButton.rel = "noopener noreferrer";
            linkButton.className = "text-btn";
            linkButton.textContent = "Official page ↗";

            $(".event-bottom", card).append(linkButton);
        }

        $("#eventGrid")?.insertBefore(card, $("#emptyState"));

        $("#eventModal").classList.remove("show");

        event.target.reset();

        toast("Event preview added. Verify its details before sharing.");
    });
})();

// NOTIFICATION PANEL

const notificationBtn = document.getElementById("notificationBtn");
const notificationPanel = document.getElementById("notificationPanel");
const closeNotifications = document.getElementById("closeNotifications");
const markNotificationsRead = document.getElementById("markNotificationsRead");
const notificationDot = notificationBtn.querySelector(".notification-dot");

// Open and close the panel
notificationBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    notificationPanel.classList.toggle("show");
});

// Close using the X button
closeNotifications.addEventListener("click", function () {
    notificationPanel.classList.remove("show");
});

// Close when clicking outside the panel
document.addEventListener("click", function (event) {
    if (
        !notificationPanel.contains(event.target) &&
        !notificationBtn.contains(event.target)
    ) {
        notificationPanel.classList.remove("show");
    }
});

// Clicking inside the panel should not close it
notificationPanel.addEventListener("click", function (event) {
    event.stopPropagation();
});

// Mark notifications as read
markNotificationsRead.addEventListener("click", function () {
    notificationDot.style.display = "none";

    document.querySelectorAll(".notification-item").forEach(function (item) {
        item.style.background = "transparent";
    });

    markNotificationsRead.textContent = "All caught up!";
});
// Open the messaging page
document.getElementById("messageBtn").addEventListener("click", function () {
    window.location.href = "messages.html";
});
/* ==========================================
   PROJECTHUB PROFILE CUSTOMIZATION
========================================== */

(function () {
    const editor = document.getElementById("profileEditor");

    if (!editor) return;

    const profileBtn = document.getElementById("profileBtn");
    const profileAvatarBtn = document.getElementById("profileAvatarBtn");

    const closeBtn = document.getElementById("closeProfileEditor");
    const cancelBtn = document.getElementById("cancelProfileEditor");

    const form = document.getElementById("profileForm");

    const nameInput = document.getElementById("profileName");
    const usernameInput = document.getElementById("profileUsername");
    const collegeInput = document.getElementById("profileCollege");
    const branchInput = document.getElementById("profileBranch");
    const yearInput = document.getElementById("profileYear");
    const locationInput = document.getElementById("profileLocation");
    const bioInput = document.getElementById("profileBio");
    const skillsInput = document.getElementById("profileSkills");

    const githubInput = document.getElementById("profileGithub");
    const linkedinInput = document.getElementById("profileLinkedin");
    const portfolioInput = document.getElementById("profilePortfolio");

    const imageInput = document.getElementById("profileImageInput");
    const coverInput = document.getElementById("coverInput");

    const imagePreview = document.getElementById("profileImagePreview");
    const coverPreview = document.getElementById("coverPreview");
    const initials = document.getElementById("profileInitials");

    const previewName = document.getElementById("previewName");
    const previewCollege = document.getElementById("previewCollege");
    const saveMessage = document.getElementById("profileSaveMessage");

    const navAvatar = document.getElementById("profileAvatarBtn");

    let profileImageData = "";
    let coverImageData = "";

    let originalProfile = null;

    const STORAGE_KEY = "projectHubProfile";

    // Default profile
    const defaultProfile = {
        name: "Shridhara Panda",
        username: "",
        college: "VSSUT, Burla",
        branch: "Computer Science Engineering",
        year: "1st Year",
        location: "",
        bio: "",
        skills: ["JavaScript", "HTML", "CSS", "C++", "DSA"],
        github: "",
        linkedin: "",
        portfolio: "",
        image: "",
        cover: ""
    };


    // Read saved profile
    function getSavedProfile() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return { ...defaultProfile };
            }

            return {
                ...defaultProfile,
                ...JSON.parse(saved)
            };
        } catch (error) {
            console.error("Could not load profile:", error);
            return { ...defaultProfile };
        }
    }


    // Update the profile editor
    function fillForm(profile) {
        nameInput.value = profile.name || "";
        usernameInput.value = profile.username || "";
        collegeInput.value = profile.college || "";
        branchInput.value = profile.branch || "";
        yearInput.value = profile.year || "1st Year";
        locationInput.value = profile.location || "";
        bioInput.value = profile.bio || "";

        skillsInput.value = Array.isArray(profile.skills)
            ? profile.skills.join(", ")
            : profile.skills || "";

        githubInput.value = profile.github || "";
        linkedinInput.value = profile.linkedin || "";
        portfolioInput.value = profile.portfolio || "";

        profileImageData = profile.image || "";
        coverImageData = profile.cover || "";

        updateImagePreview();
        updateCoverPreview();
        updateLivePreview(profile);
    }


    // Show profile picture or initials
    function updateImagePreview() {
        const name = nameInput.value.trim() || "SP";

        initials.textContent = name
            .split(/\s+/)
            .map(part => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        if (profileImageData) {
            imagePreview.src = profileImageData;
            imagePreview.style.display = "block";
            initials.style.display = "none";
        } else {
            imagePreview.removeAttribute("src");
            imagePreview.style.display = "none";
            initials.style.display = "flex";
        }
    }


    // Show cover picture
    function updateCoverPreview() {
        if (coverImageData) {
            coverPreview.src = coverImageData;
            coverPreview.style.display = "block";
        } else {
            coverPreview.removeAttribute("src");
            coverPreview.style.display = "none";
        }
    }


    // Update preview text
    function updateLivePreview(profile) {
        previewName.textContent = profile.name || "Your Name";
        previewCollege.textContent = profile.college || "Your College";
    }


    // Update the existing profile card on home.html
    function updateHomeProfile(profile) {
        const profileCard = document.querySelector(".card.profile");

        if (profileCard) {
            const nameHeading = profileCard.querySelector("h2");
            const college = profileCard.querySelector(".college");
            const course = profileCard.querySelector(".course");
            const profileAvatar = profileCard.querySelector(".profile-avatar");
            const skillsContainer = profileCard.querySelector(".skills");

            if (nameHeading) {
                nameHeading.textContent = profile.name;
            }

            if (college) {
                college.textContent = profile.college;
            }

            if (course) {
                course.textContent = profile.branch;
            }

            if (profileAvatar) {
                if (profile.image) {
                    profileAvatar.textContent = "";
                    profileAvatar.style.backgroundImage =
                        `url("${profile.image}")`;

                    profileAvatar.style.backgroundSize = "cover";
                    profileAvatar.style.backgroundPosition = "center";
                } else {
                    profileAvatar.style.backgroundImage = "";
                    profileAvatar.textContent = profile.name
                        .split(/\s+/)
                        .map(part => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                }
            }

            if (skillsContainer) {
                skillsContainer.replaceChildren();

                profile.skills.forEach(function (skill) {
                    if (!skill.trim()) return;

                    const tag = document.createElement("span");
                    tag.textContent = skill.trim();
                    skillsContainer.appendChild(tag);
                });
            }
        }

        // Update navbar avatar
        if (navAvatar) {
            if (profile.image) {
                navAvatar.textContent = "";
                navAvatar.style.backgroundImage =
                    `url("${profile.image}")`;

                navAvatar.style.backgroundSize = "cover";
                navAvatar.style.backgroundPosition = "center";
            } else {
                navAvatar.style.backgroundImage = "";
                navAvatar.textContent = profile.name
                    .split(/\s+/)
                    .map(part => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
            }
        }

        // Update create-post avatar
        document.querySelectorAll(".small-avatar").forEach(function (avatar) {
            if (profile.image) {
                avatar.textContent = "";
                avatar.style.backgroundImage = `url("${profile.image}")`;
                avatar.style.backgroundSize = "cover";
                avatar.style.backgroundPosition = "center";
            } else {
                avatar.style.backgroundImage = "";
                avatar.textContent = profile.name
                    .split(/\s+/)
                    .map(part => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
            }
        });
    }


    // Open editor
    function openEditor() {
        originalProfile = getSavedProfile();

        fillForm(originalProfile);

        saveMessage.textContent = "";

        editor.classList.add("open");
        document.body.style.overflow = "hidden";
    }


    // Close editor
    function closeEditor() {
        editor.classList.remove("open");
        document.body.style.overflow = "";
        saveMessage.textContent = "";
    }


    // Open using View Profile
    if (profileBtn) {
        profileBtn.addEventListener("click", openEditor);
    }

    // Open using navbar avatar
    if (profileAvatarBtn) {
        profileAvatarBtn.addEventListener("click", openEditor);
    }

    // Close buttons
    closeBtn.addEventListener("click", closeEditor);
    cancelBtn.addEventListener("click", closeEditor);

    // Close when clicking the overlay
    editor.addEventListener("click", function (event) {
        if (event.target === editor) {
            closeEditor();
        }
    });

    // Close with Escape
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            editor.classList.contains("open")
        ) {
            closeEditor();
        }
    });


    // Update preview as name changes
    nameInput.addEventListener("input", function () {
        updateImagePreview();

        previewName.textContent =
            nameInput.value.trim() || "Your Name";
    });

    collegeInput.addEventListener("input", function () {
        previewCollege.textContent =
            collegeInput.value.trim() || "Your College";
    });


    // Read uploaded image
    function readImage(file, callback) {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");
            return;
        }

        // Keep uploads within a reasonable size for local browser storage.
        if (file.size > 2 * 1024 * 1024) {
            alert("Please choose an image smaller than 2 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            callback(reader.result);
        };

        reader.onerror = function () {
            alert("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    }


    // Upload profile picture
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];

        readImage(file, function (imageData) {
            profileImageData = imageData;
            updateImagePreview();
        });
    });


    // Upload cover picture
    coverInput.addEventListener("change", function () {
        const file = coverInput.files[0];

        readImage(file, function (imageData) {
            coverImageData = imageData;
            updateCoverPreview();
        });
    });


    // Save profile
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = {
            name: nameInput.value.trim(),
            username: usernameInput.value.trim(),
            college: collegeInput.value.trim(),
            branch: branchInput.value.trim(),
            year: yearInput.value,
            location: locationInput.value.trim(),
            bio: bioInput.value.trim(),

            skills: skillsInput.value
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean)
                .slice(0, 30),

            github: githubInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            portfolio: portfolioInput.value.trim(),

            image: profileImageData,
            cover: coverImageData
        };

        if (!profile.name || !profile.college) {
            saveMessage.textContent =
                "Please enter your name and college.";

            return;
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(profile)
            );
        } catch (error) {
            console.error("Profile save failed:", error);

            saveMessage.textContent =
                "Storage is full. Try a smaller image.";

            return;
        }

        updateHomeProfile(profile);
        updateLivePreview(profile);

        // Update previewed initials
        updateImagePreview();

        saveMessage.textContent = "✓ Profile saved successfully!";

        // Briefly show success before closing
        setTimeout(function () {
            closeEditor();
        }, 900);
    });


    // Load saved profile when the page opens
    updateHomeProfile(getSavedProfile());

})(); 