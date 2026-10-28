const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");
const demoLoginBtn = document.getElementById("demoLoginBtn");

// Demo quick-login button
if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", function () {
        document.getElementById("email").value = "alex.chen@vssut.ac.in";
        document.getElementById("password").value = "Password123!";
        message.style.color = "#c4b5fd";
        message.textContent = "⚡ Loaded demo student credentials. Logging in...";
        setTimeout(() => {
            loginForm.dispatchEvent(new Event("submit"));
        }, 400);
    });
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    message.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        let loggedIn = false;
        let token = null;
        let userName = email.split("@")[0];

        // 1. Attempt backend authentication
        try {
            const controller = new AbortController();
            const authUrl = (window.PROJECTHUB_CONFIG?.API_AUTH || "http://localhost:5000/api/auth") + "/login";
            const response = await fetch(authUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const result = await response.json();

            if (response.ok && result.success && result.token) {
                token = result.token;
                if (result.user && result.user.name) {
                    userName = result.user.name;
                }
                loggedIn = true;
            }
        } catch (fetchErr) {
            console.log("Backend offline or unreachable, falling back to local student authentication:", fetchErr);
        }

        // 2. Offline / Local fallback authentication
        if (!loggedIn) {
            // Check registered local users
            let registeredUsers = [];
            try {
                registeredUsers = JSON.parse(localStorage.getItem("ph_registered_users")) || [];
            } catch (e) {
                registeredUsers = [];
            }

            const matchedUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (matchedUser) {
                if (matchedUser.password && matchedUser.password !== password) {
                    throw new Error("Invalid password for this account.");
                }
                userName = matchedUser.name || userName;
                token = "ph_token_" + btoa(email);
                loggedIn = true;
            } else if (email.includes("@") && password.length >= 4) {
                // Allow student demo login
                token = "ph_token_demo_" + Date.now();
                loggedIn = true;
            } else {
                throw new Error("Please enter a valid email and a password of at least 4 characters.");
            }
        }

        // Store active session token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("ph_current_user", JSON.stringify({
            name: userName,
            email: email,
            loginTime: new Date().toISOString()
        }));

        message.style.color = "#86efac";
        message.textContent = `✓ Welcome back, ${userName}! Redirecting...`;

        setTimeout(() => {
            window.location.href = "home.html";
        }, 900);

    } catch (error) {
        console.error("Login error:", error);
        message.style.color = "#fca5a5";
        message.textContent = error.message || "Unable to log in. Please check your credentials.";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Log In";
    }
});
