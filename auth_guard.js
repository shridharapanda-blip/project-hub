// =====================================================
// PROJECTHUB - AUTHENTICATION GUARD
// =====================================================
(function () {
    const token = localStorage.getItem("token");
    // If user has no active session, redirect to login page immediately
    if (!token) {
        window.location.replace("login.html");
    }
})();
