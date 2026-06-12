let currentUser = null;
let xp = 1247;

// Login & Signup Functions
function attemptLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email && password) {
        currentUser = email.split('@')[0];
        alert(`✅ Welcome back, ${currentUser}!`);
        window.location.href = 'dashboard.html';
    } else {
        alert("Please fill all fields");
    }
}

function attemptSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    if (name && email) {
        currentUser = name;
        alert(`🎉 Account created successfully! Welcome, ${name}`);
        window.location.href = 'dashboard.html';
    } else {
        alert("Please fill all fields");
    }
}

function logout() {
    currentUser = null;
    window.location.href = 'index.html';
}

function claimXP() {
    xp += 150;
    alert(`🎉 +150 XP! New Total: ${xp}`);
}

function analyzeScam() {
    const input = document.getElementById('messageInput');
    const result = document.getElementById('result');
    if (!input || !result) return;
    
    result.classList.remove('hidden');
    result.innerHTML = `
        <div class="bg-zinc-900 border border-emerald-500/50 rounded-3xl p-8 mt-8">
            <p class="text-rose-400 text-xl font-bold">🚨 HIGH RISK SCAM DETECTED (92%)</p>
            <p class="mt-4 text-zinc-300">This message shows classic phishing patterns. Do NOT click any links or share OTP.</p>
            <button onclick="claimXP()" class="mt-6 w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl">Claim 150 XP</button>
        </div>
    `;
}

function startSimulation(num) {
    const msgs = {
        1: "📧 Phishing Email Simulation Started!",
        2: "📱 OTP Fraud Call Simulation Started!",
        3: "🔐 Password Fortress Challenge Started!"
    };
    alert(msgs[num] || "Simulation Started!");
    claimXP();
}