const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerButton = document.getElementById("registerButton");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    message.textContent = "";
    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        let registered = false;
        let token = null;

        // 1. Attempt backend registration
        try {
            const controller = new AbortController();
            const regUrl = (window.PROJECTHUB_CONFIG?.API_AUTH || "http://localhost:5000/api/auth") + "/register";
            const response = await fetch(regUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const result = await response.json();

            if (response.ok && result.success) {
                token = result.token || ("ph_token_" + Date.now());
                registered = true;
            }
        } catch (fetchErr) {
            console.log("Backend offline or unreachable, using local student registration fallback:", fetchErr);
        }

        // 2. Offline / Local fallback registration
        if (!registered) {
            let registeredUsers = [];
            try {
                registeredUsers = JSON.parse(localStorage.getItem("ph_registered_users")) || [];
            } catch (e) {
                registeredUsers = [];
            }

            const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                throw new Error("An account with this email already exists. Please log in.");
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

            registeredUsers.push(newUser);
            localStorage.setItem("ph_registered_users", JSON.stringify(registeredUsers));

            // Also register as a student member in local members pool
            try {
                let userMembers = JSON.parse(localStorage.getItem("ph_user_members")) || [];
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                userMembers.unshift({
                    name: name,
                    role: "Full Stack Developer",
                    bio: "Passionate builder and collaborator on ProjectHub.",
                    tags: ["Web", "JavaScript", "Python"],
                    color: "purple",
                    initials: initials || "ST",
                    available: "Open to collaborate",
                    projects: 1,
                    rating: "5.0"
                });
                localStorage.setItem("ph_user_members", JSON.stringify(userMembers));
            } catch (err) {
                console.warn("Could not save to local members pool:", err);
            }

            token = "ph_token_" + btoa(email);
        }

        // Save active session token and user profile
        localStorage.setItem("token", token);
        localStorage.setItem("ph_current_user", JSON.stringify({
            name: name,
            email: email,
            loginTime: new Date().toISOString()
        }));

        message.style.color = "#86efac";
        message.textContent = `✓ Welcome to ProjectHub, ${name}! Redirecting...`;
        registerForm.reset();

        setTimeout(() => {
            window.location.href = "projects.html";
        }, 1100);

    } catch (error) {
        console.error("Registration error:", error);
        message.style.color = "#fca5a5";
        message.textContent = error.message || "Unable to complete registration.";
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});
