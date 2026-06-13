/* ==========================================================================
   CYBERRAKSHAK UNIFIED FRONTEND-TO-BACKEND CORE LOGIC ENGINE
   Handles all Core API Networking, Token Management, and UI Component Synchronization
   ========================================================================== */

const API_BASE_URL = "http://localhost:8000/api";

// ==========================================
// 1. SECURE AUTHORIZED NETWORK FETCH PIPELINE
// ==========================================
/**
 * Global fetch interceptor that automatically attaches active JWT access tokens
 * and performs automated token refreshes if a 401 expiration event occurs.
 */
async function authorizedFetch(endpoint, options = {}) {
    let accessToken = localStorage.getItem("access");
    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";

    if (accessToken) {
        options.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // If token has expired (401 Unauthorized), initiate automated hot-swap rotation
    if (response.status === 401 && localStorage.getItem("refresh")) {
        console.warn("Session access key expired. Rotating security cryptographic keys...");
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
            accessToken = localStorage.getItem("access");
            options.headers["Authorization"] = `Bearer ${accessToken}`;
            response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        } else {
            console.error("Refresh token invalid. Terminating active security session.");
            logout();
            return null;
        }
    }
    return response;
}

/**
 * Contacts backend token refresh endpoint to issue clean, short-lived access parameters
 */
async function refreshAccessToken() {
    try {
        const res = await fetch(`${API_BASE_URL}/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: localStorage.getItem("refresh") })
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("access", data.access);
            return true;
        }
    } catch (err) {
        console.error("Critical key exchange handshake failed:", err);
    }
    return false;
}

/**
 * Clears systemic credentials storage profiles and signs out the session node
 */
function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "login.html";
}

// ==========================================
// 2. BACKEND API BOUND ACTIONS
// ==========================================

/**
 * Transmits credential hashes to /api/login/ to acquire session authority tokens
 */
async function submitLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            window.location.href = "dashboard.html";
        } else {
            alert(data.error || "Authentication rejected. Verify network telemetry keys.");
        }
    } catch (err) {
        console.error("Login endpoint access failure:", err);
        alert("Fatal error: Core backend server array unreachable.");
    }
}

/**
 * Registers new intelligence operator models onto the central system database
 */
async function submitSignup(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok || response.status === 201) {
            alert("Registration validated! Directing agent credentials to login gates.");
            window.location.href = "login.html";
        } else {
            alert(data.error || "Registration faulted. Operator callsign or email might be claimed.");
        }
    } catch (err) {
        console.error("Signup endpoint access failure:", err);
        alert("Fatal error: Core backend database connection offline.");
    }
}

/**
 * Submits raw strings to the /api/detect-scam/ engine endpoint for verification mapping
 */
async function analyzeThreatText(userInputText) {
    try {
        const response = await authorizedFetch("/detect-scam/", {
            method: "POST",
            body: JSON.stringify({ text: userInputText })
        });
        if (response && response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.error("Threat detector processing exception:", err);
    }
    return null;
}

/**
 * Queries the global /api/leaderboard/ array matrix to fetch performance statistics
 */
async function fetchGlobalLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/`);
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.error("Leaderboard parsing request error:", err);
    }
    return [];
}

// ==========================================
// 3. AUTOMATED DOM RENDERING & TELEMETRY ROUTER
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const navUser = document.getElementById("telemetry-username");
    const navXP = document.getElementById("telemetry-xp");

    // Dynamic Route A: Synchronize Navigation Telemetry Displays
    if (navUser || navXP) {
        const token = localStorage.getItem("access");
        if (!token) {
            if (navUser) navUser.textContent = "Guest_Agent";
            if (navXP) navXP.textContent = "0000 XP";
        } else {
            try {
                const res = await authorizedFetch("/profile/");
                if (res && res.ok) {
                    const profile = await res.json();
                    
                    // Populate Navbar Anchors
                    if (navUser) navUser.textContent = profile.username;
                    if (navXP) navXP.textContent = `${profile.points} XP`;
                    
                    // Dynamic Synchronization Target for dashboard.html
                    if (document.getElementById("user-name")) {
                        document.getElementById("user-name").textContent = profile.username;
                        document.getElementById("user-streak").textContent = `🔥 ${profile.streak || 0} Days`;
                        document.getElementById("user-rank").textContent = `Lvl ${profile.level || 1}`;
                        document.getElementById("xp-display").textContent = `${profile.points} / 1000 XP`;
                        
                        // Calculate level progress mapping based on standard level steps
                        const progressPercentage = (profile.points % 1000) / 10;
                        const progressBar = document.getElementById("xp-progress-bar");
                        if (progressBar) progressBar.style.width = `${progressPercentage || 15}%`;
                    }
                }
            } catch (err) {
                console.error("Navbar telemetry pipeline hook broke down:", err);
            }
        }
    }

    // Dynamic Route B: Automatically Populate Leaderboard Layout Rows inside leaderboard.html
    const leaderboardContainer = document.getElementById("leaderboard-rows");
    if (leaderboardContainer) {
        const rankings = await fetchGlobalLeaderboard();
        if (rankings && rankings.length > 0) {
            leaderboardContainer.innerHTML = ""; // Wipe default loading elements
            rankings.forEach((user, index) => {
                const row = document.createElement("div");
                row.className = "flex justify-between items-center p-5 rounded-2xl border border-zinc-900/80 bg-zinc-950/40 hover:border-emerald-500/20 card-hover transition-all duration-300";
                row.innerHTML = `
                    <div class="flex items-center gap-6">
                        <span class="w-8 text-center font-mono text-sm font-black ${index < 3 ? 'text-emerald-400' : 'text-zinc-600'}">#${index + 1}</span>
                        <span class="text-sm font-bold text-zinc-300 tracking-wide">${user.username}</span>
                        ${user.streak >= 3 ? `<span class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-500 font-mono">🔥 ${user.streak} DAY STREAK</span>` : ""}
                    </div>
                    <span class="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-3 py-1 rounded-xl">${user.points} XP <span class="text-zinc-500 ml-1">(Lvl ${user.level || 1})</span></span>
                `;
                leaderboardContainer.appendChild(row);
                
                // Synchronize global podium profiles dynamically if top slots are present on page layout
                if (index === 0 && document.getElementById("podium-1-name")) {
                    document.getElementById("podium-1-name").textContent = user.username;
                    document.getElementById("podium-1-xp").textContent = `${user.points} XP`;
                }
                if (index === 1 && document.getElementById("podium-2-name")) {
                    document.getElementById("podium-2-name").textContent = user.username;
                    document.getElementById("podium-2-xp").textContent = `${user.points} XP`;
                }
                if (index === 2 && document.getElementById("podium-3-name")) {
                    document.getElementById("podium-3-name").textContent = user.username;
                    document.getElementById("podium-3-xp").textContent = `${user.points} XP`;
                }
            });
        } else {
            leaderboardContainer.innerHTML = `<p class="text-zinc-500 text-sm italic font-mono p-4">No security operator rankings logged on matrix registers.</p>`;
        }
    }
});
