// =====================================================
// PROJECTHUB - MESSAGES & CHAT ENGINE
// =====================================================

const messenger = document.querySelector(".messenger");
const chatList = document.getElementById("chatList");
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const searchInput = document.getElementById("searchInput");

const headerName = document.getElementById("headerName");
const headerStatus = document.getElementById("headerStatus");
const headerAvatar = document.getElementById("headerAvatar");
const headerOnlineDot = document.getElementById("headerOnlineDot");
const chatCount = document.getElementById("chatCount");

// Interactive Elements
const voiceCallBtn = document.getElementById("voiceCallBtn");
const videoCallBtn = document.getElementById("videoCallBtn");
const moreOptionsBtn = document.getElementById("moreOptionsBtn");
const optionsMenu = document.getElementById("optionsMenu");
const optViewProfile = document.getElementById("optViewProfile");
const optCopyLink = document.getElementById("optCopyLink");
const optMute = document.getElementById("optMute");
const optClearChat = document.getElementById("optClearChat");

const attachFileBtn = document.getElementById("attachFileBtn");
const fileInput = document.getElementById("fileInput");
const emojiBtn = document.getElementById("emojiBtn");
const quickEmojiBar = document.getElementById("quickEmojiBar");

const callModal = document.getElementById("callModal");
const callAvatar = document.getElementById("callAvatar");
const callUserName = document.getElementById("callUserName");
const callStatusText = document.getElementById("callStatusText");
const callMuteBtn = document.getElementById("callMuteBtn");
const callVideoBtn = document.getElementById("callVideoBtn");
const callEndBtn = document.getElementById("callEndBtn");

const newMsgModal = document.getElementById("newMsgModal");
const newMsgList = document.getElementById("newMsgList");
const closeNewMsgBtn = document.getElementById("closeNewMsgBtn");
const newMessageBtn = document.getElementById("newMessageBtn");

// Default Preset Users & Conversations
const defaultUsers = {
    1: {
        name: "Aditya Sharma",
        initials: "AS",
        color: "purple",
        online: true,
        role: "Full Stack Developer",
        messages: [
            { text: "Hey! 👋", type: "received", time: "10:30 AM" },
            { text: "Let's discuss our project idea.", type: "received", time: "10:31 AM" },
            { text: "Sure! Tell me what you're thinking.", type: "sent", time: "10:32 AM" },
            { text: "I have an idea for an AI-based project.", type: "received", time: "10:33 AM" },
            { text: "That sounds interesting! 🚀", type: "sent", time: "10:34 AM" }
        ],
        replies: [
            "Sounds like a plan! Let's build a prototype this weekend. 💻",
            "Awesome, I can handle the backend API integration.",
            "I pushed the initial schema to GitHub. Check it out when free!",
            "Definitely! Let's sync up over a quick call tomorrow.",
            "Great progress today team! 🚀"
        ]
    },
    2: {
        name: "Priya Singh",
        initials: "PS",
        color: "cyan",
        online: true,
        role: "UI/UX Designer",
        messages: [
            { text: "Hi! How are you?", type: "received", time: "10:20 AM" },
            { text: "Can you share the project link?", type: "received", time: "10:21 AM" }
        ],
        replies: [
            "Awesome! I'll test the frontend responsive layout now. ✨",
            "I just updated the Figma wireframes with the dark theme.",
            "Thanks for the feedback! Adjusting colors now.",
            "Looks super clean on mobile devices too!"
        ]
    },
    3: {
        name: "Rahul Kumar",
        initials: "RK",
        color: "pink",
        online: true,
        role: "Cloud & DevOps",
        messages: [
            { text: "Thanks for your help!", type: "received", time: "9:30 AM" }
        ],
        replies: [
            "Appreciate it! Let me know if you need help with database indexing.",
            "The Docker container is running smoothly on port 5000.",
            "CI/CD pipeline passed all checks! 🚀",
            "Glad to collaborate with you on this!"
        ]
    },
    4: {
        name: "Simran Mishra",
        initials: "SM",
        color: "orange",
        online: false,
        role: "AI / ML Researcher",
        messages: [
            { text: "Let's work together.", type: "received", time: "8:00 AM" }
        ],
        replies: [
            "Great idea! I'll train the image classification model on Kaggle.",
            "Dataset preprocessing is complete. Accuracy is looking around 94%.",
            "Sure thing! Catch you online later today.",
            "Excited to submit our project for the Smart Campus hackathon!"
        ]
    }
};

// Initialize Users from LocalStorage or Defaults
let users = {};
try {
    const saved = localStorage.getItem("ph_chat_history");
    if (saved) {
        users = JSON.parse(saved);
        // Merge missing defaults or replies
        Object.keys(defaultUsers).forEach(id => {
            if (!users[id]) {
                users[id] = defaultUsers[id];
            } else if (!users[id].replies) {
                users[id].replies = defaultUsers[id].replies;
            }
        });
    } else {
        users = JSON.parse(JSON.stringify(defaultUsers));
    }
} catch (e) {
    users = JSON.parse(JSON.stringify(defaultUsers));
}

function saveUsersToStorage() {
    try {
        localStorage.setItem("ph_chat_history", JSON.stringify(users));
    } catch (e) {
        console.warn("Storage quota exceeded or error saving chat:", e);
    }
}

// State
let currentUserId = 1;
let callTimerInterval = null;
let callSeconds = 0;
let isMuted = false;
let isVideoMuted = false;

// Helpers
function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function showToast(text, icon = "fa-check") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "msg-toast";
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: #a78bfa;"></i> <span>${text}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = "0.3s";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Render Conversation List
function renderChatList() {
    chatList.innerHTML = "";
    const userIds = Object.keys(users);
    chatCount.textContent = `${userIds.length} ${userIds.length === 1 ? 'chat' : 'chats'}`;

    userIds.forEach(id => {
        const u = users[id];
        const lastMsg = u.messages.length > 0 ? u.messages[u.messages.length - 1] : { text: "No messages yet", time: "" };
        const isActive = Number(id) === Number(currentUserId);

        const btn = document.createElement("button");
        btn.className = `chat-user ${isActive ? 'active' : ''}`;
        btn.dataset.user = id;

        btn.innerHTML = `
            <div class="avatar-wrap">
                <div class="avatar ${u.color || 'purple'}">${u.initials || 'ST'}</div>
                ${u.online ? '<span class="online-dot"></span>' : ''}
            </div>
            <div class="chat-info">
                <div class="chat-name">
                    <strong>${u.name}</strong>
                    <span class="chat-time">${lastMsg.time || ''}</span>
                </div>
                <div class="chat-preview">${lastMsg.text}</div>
            </div>
        `;
        chatList.appendChild(btn);
    });
}

// Select a Conversation
function openChat(userId) {
    const user = users[userId];
    if (!user) return;

    currentUserId = userId;

    headerName.textContent = user.name;
    headerAvatar.textContent = user.initials;
    headerAvatar.className = "avatar " + (user.color || "purple");

    headerStatus.textContent = user.online ? "Online now" : "Offline";
    headerStatus.classList.toggle("offline", !user.online);
    headerOnlineDot.style.display = user.online ? "block" : "none";

    // Highlight selected conversation
    document.querySelectorAll(".chat-user").forEach(button => {
        button.classList.toggle("active", Number(button.dataset.user) === Number(userId));
    });

    // Remove unread count if any
    const selectedButton = document.querySelector(`.chat-user[data-user="${userId}"]`);
    if (selectedButton) {
        const unread = selectedButton.querySelector(".unread-count");
        if (unread) unread.remove();
    }

    renderMessages(userId);

    // Show chat on mobile
    messenger.classList.add("chat-open");
    messageInput.focus();
}

// Render Messages for conversation
function renderMessages(userId) {
    const user = users[userId];
    if (!user) return;

    messagesContainer.innerHTML = `
        <div class="date-divider">
            <span>Today</span>
        </div>
    `;

    user.messages.forEach(msg => {
        const messageElement = document.createElement("div");
        messageElement.className = "message " + msg.type;

        if (msg.type === "received") {
            const avatar = document.createElement("div");
            avatar.className = "message-avatar " + (user.color || "purple");
            avatar.textContent = user.initials;
            messageElement.appendChild(avatar);
        }

        const content = document.createElement("div");
        content.className = "message-content";

        const p = document.createElement("p");
        p.textContent = msg.text;

        const time = document.createElement("span");
        time.textContent = msg.time || "";

        content.appendChild(p);
        content.appendChild(time);
        messageElement.appendChild(content);

        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send Message Flow with Realistic Reply Simulation
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const user = users[currentUserId];
    if (!user) return;

    // 1. Add user's sent message
    const currentTime = getCurrentTime();
    user.messages.push({
        text: text,
        type: "sent",
        time: currentTime
    });

    saveUsersToStorage();
    renderMessages(currentUserId);
    renderChatList();

    messageInput.value = "";
    messageInput.focus();

    // 2. Simulated Student Auto-Reply
    headerStatus.textContent = "typing...";
    headerStatus.style.color = "#c4b5fd";

    // Show typing bubble
    const typingElement = document.createElement("div");
    typingElement.className = "message received typing-bubble-wrap";
    typingElement.innerHTML = `
        <div class="message-avatar ${user.color || 'purple'}">${user.initials}</div>
        <div class="message-content">
            <p class="typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </p>
        </div>
    `;
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        // Remove typing bubble
        typingElement.remove();
        headerStatus.textContent = user.online ? "Online now" : "Offline";
        headerStatus.style.color = user.online ? "#22c55e" : "var(--muted)";

        // Select contextual or random reply
        const replyPool = user.replies && user.replies.length > 0 
            ? user.replies 
            : ["That's awesome! Let's do it.", "Sounds good to me!", "Check out the repo when you can.", "Count me in! 🚀"];
        
        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];

        user.messages.push({
            text: randomReply,
            type: "received",
            time: getCurrentTime()
        });

        saveUsersToStorage();
        renderMessages(currentUserId);
        renderChatList();
    }, 1300);
});

// Click user to open conversation
chatList.addEventListener("click", function (event) {
    const button = event.target.closest(".chat-user");
    if (!button) return;
    openChat(Number(button.dataset.user));
});

// Click online user avatar
document.getElementById("onlineUsers").addEventListener("click", function (event) {
    const button = event.target.closest(".online-user");
    if (!button) return;
    openChat(Number(button.dataset.user));
});

// Search Conversations
searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    document.querySelectorAll(".chat-user").forEach(button => {
        const userId = Number(button.dataset.user);
        const user = users[userId];
        if (!user) return;

        const matches = user.name.toLowerCase().includes(query) || 
                        user.messages.some(m => m.text.toLowerCase().includes(query));

        button.style.display = matches ? "flex" : "none";
        if (matches) visibleCount++;
    });

    chatCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'chat' : 'chats'}`;
});

// Quick Emoji Bar & Emoji Picker
if (emojiBtn && quickEmojiBar) {
    emojiBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const isHidden = quickEmojiBar.style.display === "none";
        quickEmojiBar.style.display = isHidden ? "flex" : "none";
    });

    quickEmojiBar.addEventListener("click", function (e) {
        const pill = e.target.closest(".emoji-pill");
        if (!pill) return;
        const emoji = pill.dataset.emoji || pill.textContent;
        messageInput.value += emoji + " ";
        messageInput.focus();
    });
}

// File Attachment Simulation
if (attachFileBtn && fileInput) {
    attachFileBtn.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        if (!fileInput.files || fileInput.files.length === 0) return;
        const file = fileInput.files[0];
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

        const user = users[currentUserId];
        if (!user) return;

        user.messages.push({
            text: `📎 Sent attachment: ${file.name} (${fileSizeMB} MB)`,
            type: "sent",
            time: getCurrentTime()
        });

        saveUsersToStorage();
        renderMessages(currentUserId);
        renderChatList();
        showToast(`Sent file: ${file.name}`, "fa-paperclip");
        fileInput.value = "";
    });
}

// More Options Menu Toggle
if (moreOptionsBtn && optionsMenu) {
    moreOptionsBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        optionsMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
        if (!optionsMenu.contains(e.target) && e.target !== moreOptionsBtn) {
            optionsMenu.classList.remove("show");
        }
    });

    // View Profile
    if (optViewProfile) {
        optViewProfile.addEventListener("click", function () {
            optionsMenu.classList.remove("show");
            const u = users[currentUserId];
            showToast(`${u.name} — ${u.role || 'Student Developer'}`, "fa-user");
        });
    }

    // Copy Link
    if (optCopyLink) {
        optCopyLink.addEventListener("click", function () {
            optionsMenu.classList.remove("show");
            navigator.clipboard.writeText(window.location.href);
            showToast("Chat link copied to clipboard!", "fa-link");
        });
    }

    // Mute Notifications
    if (optMute) {
        optMute.addEventListener("click", function () {
            optionsMenu.classList.remove("show");
            const u = users[currentUserId];
            showToast(`Muted notifications for ${u.name}`, "fa-bell-slash");
        });
    }

    // Clear Chat
    if (optClearChat) {
        optClearChat.addEventListener("click", function () {
            optionsMenu.classList.remove("show");
            const u = users[currentUserId];
            if (confirm(`Clear all messages with ${u.name}?`)) {
                u.messages = [{ text: "Chat history cleared.", type: "received", time: getCurrentTime() }];
                saveUsersToStorage();
                renderMessages(currentUserId);
                renderChatList();
                showToast("Chat cleared", "fa-trash");
            }
        });
    }
}

// Voice and Video Calls Simulation
function startCall(isVideo = false) {
    const user = users[currentUserId];
    if (!user) return;

    callUserName.textContent = user.name;
    callAvatar.textContent = user.initials;
    callAvatar.className = `call-avatar ${user.color || 'purple'}`;
    callStatusText.textContent = isVideo ? "Starting video call..." : "Calling...";

    callModal.classList.add("active");
    callSeconds = 0;
    isMuted = false;
    isVideoMuted = isVideo;

    if (callMuteBtn) {
        callMuteBtn.classList.remove("active");
        callMuteBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    }
    if (callVideoBtn) {
        callVideoBtn.classList.toggle("active", isVideo);
        callVideoBtn.innerHTML = isVideo ? '<i class="fa-solid fa-video"></i>' : '<i class="fa-solid fa-video-slash"></i>';
    }

    // Simulated connection after 2 seconds
    setTimeout(() => {
        if (!callModal.classList.contains("active")) return;
        callStatusText.textContent = "Connected (00:00)";

        if (callTimerInterval) clearInterval(callTimerInterval);
        callTimerInterval = setInterval(() => {
            callSeconds++;
            const mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
            const secs = String(callSeconds % 60).padStart(2, "0");
            callStatusText.textContent = `Connected (${mins}:${secs})`;
        }, 1000);
    }, 2000);
}

function endCall() {
    if (callTimerInterval) clearInterval(callTimerInterval);
    callTimerInterval = null;
    callModal.classList.remove("active");
    showToast(`Call ended (${callSeconds > 0 ? callSeconds + 's' : 'Cancelled'})`, "fa-phone-slash");
}

if (voiceCallBtn) {
    voiceCallBtn.addEventListener("click", () => startCall(false));
}
if (videoCallBtn) {
    videoCallBtn.addEventListener("click", () => startCall(true));
}
if (callEndBtn) {
    callEndBtn.addEventListener("click", endCall);
}
if (callMuteBtn) {
    callMuteBtn.addEventListener("click", function () {
        isMuted = !isMuted;
        callMuteBtn.classList.toggle("active", isMuted);
        callMuteBtn.innerHTML = isMuted 
            ? '<i class="fa-solid fa-microphone-slash"></i>' 
            : '<i class="fa-solid fa-microphone"></i>';
        showToast(isMuted ? "Microphone muted" : "Microphone unmuted", "fa-microphone");
    });
}
if (callVideoBtn) {
    callVideoBtn.addEventListener("click", function () {
        isVideoMuted = !isVideoMuted;
        callVideoBtn.classList.toggle("active", isVideoMuted);
        callVideoBtn.innerHTML = isVideoMuted 
            ? '<i class="fa-solid fa-video"></i>' 
            : '<i class="fa-solid fa-video-slash"></i>';
        showToast(isVideoMuted ? "Camera turned on" : "Camera turned off", "fa-video");
    });
}

// New Message Modal (Start chat with any student)
if (newMessageBtn && newMsgModal && newMsgList) {
    newMessageBtn.addEventListener("click", function () {
        // Populate modal with available members
        newMsgList.innerHTML = "";

        // Combine preset students with any registered in local storage
        let studentPool = [
            { id: 1, name: "Aditya Sharma", role: "Full Stack Dev", initials: "AS", color: "purple" },
            { id: 2, name: "Priya Singh", role: "UI/UX Designer", initials: "PS", color: "cyan" },
            { id: 3, name: "Rahul Kumar", role: "Cloud & DevOps", initials: "RK", color: "pink" },
            { id: 4, name: "Simran Mishra", role: "AI / ML Researcher", initials: "SM", color: "orange" },
            { id: 5, name: "Aisha Patel", role: "Frontend Engineer", initials: "AP", color: "cyan" },
            { id: 6, name: "Rohan Verma", role: "Cybersecurity Analyst", initials: "RV", color: "pink" }
        ];

        try {
            const extra = JSON.parse(localStorage.getItem("ph_user_members")) || [];
            extra.forEach((m, idx) => {
                studentPool.push({
                    id: 100 + idx,
                    name: m.name,
                    role: m.role || "Student Developer",
                    initials: m.initials || "ST",
                    color: m.color || "purple"
                });
            });
        } catch (e) {}

        studentPool.forEach(student => {
            const item = document.createElement("button");
            item.className = "new-msg-item";
            item.innerHTML = `
                <div class="avatar ${student.color}">${student.initials}</div>
                <div>
                    <strong>${student.name}</strong>
                    <div style="font-size: 11px; color: var(--muted);">${student.role}</div>
                </div>
            `;

            item.addEventListener("click", function () {
                newMsgModal.classList.remove("active");
                // If not in users, create a new conversation thread
                if (!users[student.id]) {
                    users[student.id] = {
                        name: student.name,
                        initials: student.initials,
                        color: student.color,
                        online: true,
                        role: student.role,
                        messages: [
                            { text: `Hi ${student.name.split(" ")[0]}! Found your profile on ProjectHub. Let's collaborate!`, type: "sent", time: getCurrentTime() }
                        ],
                        replies: [
                            "Hey! Thanks for reaching out. What project are you building?",
                            "Awesome to connect with you on ProjectHub!",
                            "Sounds great! Happy to collaborate."
                        ]
                    };
                    saveUsersToStorage();
                    renderChatList();
                }
                openChat(student.id);
                showToast(`Opened conversation with ${student.name}`, "fa-comment");
            });

            newMsgList.appendChild(item);
        });

        newMsgModal.classList.add("active");
    });

    if (closeNewMsgBtn) {
        closeNewMsgBtn.addEventListener("click", () => newMsgModal.classList.remove("active"));
    }
}

// Global Escape Key to close modals and dropdowns
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        if (callModal) callModal.classList.remove("active");
        if (newMsgModal) newMsgModal.classList.remove("active");
        if (optionsMenu) optionsMenu.classList.remove("show");
        if (quickEmojiBar) quickEmojiBar.style.display = "none";
    }
});

// Return to conversation list on mobile
const mobileBack = document.getElementById("mobileBack");
if (mobileBack) {
    mobileBack.addEventListener("click", function () {
        messenger.classList.remove("chat-open");
    });
}

// Initial Boot
renderChatList();
openChat(1);
