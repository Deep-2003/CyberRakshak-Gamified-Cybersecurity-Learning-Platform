/**
 * ==========================================================================
 * CYBERRAKSHAK GLOBAL CORE APPLICATION ENGINE (app.js)
 * Manages identity assertions, real-time metrics telemetry, and notification loops.
 * ==========================================================================
 */

// Global App State Scope 
const CyberState = {
    storageKey: 'cyberrakshak_user_session',
    fallbackProfile: {
        username: "Rakshak_Agent",
        xp: 120,
        completedSimulations: 0,
        scanHistoryCount: 0,
        joinedDate: "2026-06-12"
    }
};

/**
 * Initialization Sequence on DOM Content Assembly
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Guard session status check across platform nodes
    if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        checkAuthState();
    }
    
    // 2. Synchronize telemetry node displays if viewport contains metric flags
    renderProfileMetrics();
});

/**
 * Authentication Guard Mechanism
 * Asserts structural state parameters or routes context to login portal
 */
function checkAuthState() {
    const activeSession = localStorage.getItem(CyberState.storageKey);
    
    if (!activeSession) {
        console.warn("Unauthorized profile access vector interrupted. Redirecting initialization route.");
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Profile Registration/Mock Login State Initializer
 */
function initializeMockSession(customUser = {}) {
    const initialProfile = { ...CyberState.fallbackProfile, ...customUser };
    localStorage.setItem(CyberState.storageKey, JSON.stringify(initialProfile));
    window.location.href = 'dashboard.html';
}

/**
 * Returns Active User Telemetry Payload from Persistent Storage Matrix
 */
function getUserTelemetry() {
    const rawData = localStorage.getItem(CyberState.storageKey);
    if (!rawData) return CyberState.fallbackProfile;
    try {
        return JSON.parse(rawData);
    } catch (e) {
        return CyberState.fallbackProfile;
    }
}

/**
 * Dynamic Math Matrix: Calculates level based on logarithmic XP curve
 * Level = Floor(SquareRoot(XP / 100)) + 1
 */
function calculateCyberLevel(xpValue) {
    if (!xpValue || xpValue <= 0) return 1;
    return Math.floor(Math.sqrt(xpValue / 100)) + 1;
}

/**
 * Dynamic Core Telemetry UI Parser
 * Scans layout DOM tree for specific target selector flags and maps persistent data nodes
 */
function renderProfileMetrics() {
    const profile = getUserTelemetry();
    const activeLevel = calculateCyberLevel(profile.xp);
    
    // Target assignment definitions
    const nodes = {
        name: document.getElementById('telemetry-username'),
        xp: document.getElementById('telemetry-xp'),
        level: document.getElementById('telemetry-level'),
        simCount: document.getElementById('telemetry-sims'),
        scansCount: document.getElementById('telemetry-scans'),
        progressBar: document.getElementById('telemetry-progress-bar')
    };

    // Safely update components matching valid active layouts
    if (nodes.name) nodes.name.textContent = profile.username;
    if (nodes.xp) nodes.xp.textContent = `${profile.xp} XP`;
    if (nodes.level) nodes.level.textContent = `Lvl ${activeLevel}`;
    if (nodes.simCount) nodes.simCount.textContent = profile.completedSimulations;
    if (nodes.scansCount) nodes.scansCount.textContent = profile.scanHistoryCount;

    // Updates fluid loading bar nodes on user panels
    if (nodes.progressBar) {
        const nextLevelXpFloor = Math.pow(activeLevel - 1, 2) * 100;
        const nextLevelXpCeil = Math.pow(activeLevel, 2) * 100;
        const layerRange = nextLevelXpCeil - nextLevelXpFloor;
        const progressXp = profile.xp - nextLevelXpFloor;
        
        const relativePercentage = Math.min(Math.max((progressXp / layerRange) * 100, 5), 100);
        nodes.progressBar.style.width = `${relativePercentage}%`;
    }
}

/**
 * Central State Update Interface Hook
 * Increases telemetry scores dynamically following user interactions or security validations
 */
function awardUserMetrics(xpGained = 0, incrementSim = false, incrementScan = false) {
    const currentProfile = getUserTelemetry();
    
    // Mutation values
    currentProfile.xp += parseInt(xpGained);
    if (incrementSim) currentProfile.completedSimulations += 1;
    if (incrementScan) currentProfile.scanHistoryCount += 1;
    
    // Save state mutation updates to local environment storage instance
    localStorage.setItem(CyberState.storageKey, JSON.stringify(currentProfile));
    
    // Force live updates to matching layouts immediately
    renderProfileMetrics();
    
    if (xpGained > 0) {
        showGlobalNotification(`🛡️ Data Threat Cleaned! Gained +${xpGained} Experience Elements.`);
    }
}

/**
 * Reusable Global Custom Notification Alert Injector
 */
function showGlobalNotification(alertText) {
    // Check or append notification container zone inside layout node
    let container = document.getElementById('cyber-alert-zone');
    if (!container) {
        container = document.createElement('div');
        container.id = 'cyber-alert-zone';
        container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const item = document.createElement('div');
    item.className = 'bg-zinc-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto';
    item.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.15)';
    item.innerHTML = `<div>${alertText}</div>`;
    
    container.appendChild(item);

    // Fade out sequence
    setTimeout(() => {
        item.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => item.remove(), 300);
    }, 4000);
}

/**
 * Destroys Current User Telemetry Tokens and Directs Navigation Flow to Authentication View
 */
function logout() {
    localStorage.removeItem(CyberState.storageKey);
    window.location.href = 'login.html';
}

/**
 * Global API Pipeline Overrides: Intercept metrics tracking inside ai-detector.html dynamically
 */
const baselineFetch = window.fetch;
window.fetch = async function(...args) {
    const url = args[0];
    const options = args[1];

    if (typeof url === 'string' && url.includes('/api/user/log-scan') && options && options.body) {
        console.log("CyberRakshak intercepting local telemetry payload vectors...");
        
        try {
            const data = JSON.parse(options.body);
            // Award values safely inside mock framework parameters: 25 XP for danger detections, 10 XP for safe evaluations
            const scoreReward = (data.score >= 60) ? 25 : 10;
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    awardUserMetrics(scoreReward, false, true);
                    resolve(new Response(JSON.stringify({ status: 'success', synced: true }), { status: 200 }));
                }, 400);
            });
        } catch(e) {
            console.error("Payload error during metrics routing intercept pass.", e);
        }
    }
    return baselineFetch.apply(this, args);
};
