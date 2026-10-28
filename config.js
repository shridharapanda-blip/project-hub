// =====================================================
// PROJECTHUB - GLOBAL CONFIGURATION
// =====================================================

// Automatically switches between Localhost (development) and Cloud (production)
const isLocalhost = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

// Set this to your live Render backend URL:
const PRODUCTION_BACKEND_URL = "https://projecthub-backend-j21s.onrender.com";

const BACKEND_URL = isLocalhost 
    ? "http://localhost:5000" 
    : PRODUCTION_BACKEND_URL;

window.PROJECTHUB_CONFIG = {
    BACKEND_URL: BACKEND_URL,
    API_AUTH: `${BACKEND_URL}/api/auth`,
    API_PROJECTS: `${BACKEND_URL}/api/projects`,
    API_MEMBERS: `${BACKEND_URL}/api/members`,
    API_HACKATHONS: `${BACKEND_URL}/api/hackathons`,
    API_MESSAGES: `${BACKEND_URL}/api/messages`
};
