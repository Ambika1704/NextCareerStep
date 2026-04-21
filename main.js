// --- Career Recommendations Logic ---
document.getElementById("recommendBtn").addEventListener("click", async () => {
    const skills = document.getElementById("skills").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!skills) {
        alert("⚠️ Please enter your skills first!");
        return;
    }

    resultsDiv.innerHTML = `
        <div class="loading">
            🔍 Analyzing your skills
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    try {
        const response = await fetch("http://127.0.0.1:5000/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills }),
        });

        const data = await response.json();
        
        if (response.status !== 200) {
            resultsDiv.innerHTML = `
                <div class="error-container">
                    <p>⚠️ ${data.error}</p>
                    <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted)">${data.suggestion || ""}</p>
                </div>
            `;
            return;
        }

        resultsDiv.innerHTML = "<h2>✨ Recommended Careers for You</h2>";
        data.forEach(job => {
            resultsDiv.innerHTML += `
                <div class="card">
                    <span class="score-badge">${job.score}% Match</span>
                    <h3>${job.role}</h3>
                    <p><strong>Required Skills:</strong> ${job.skills}</p>
                    <p><strong>Upskilling Path:</strong> ${job.upskilling}</p>
                    <p style="margin-top: 1rem; font-style: italic; color: var(--text-muted)">${job.description}</p>
                </div>`;
        });

    } catch (err) {
        resultsDiv.innerHTML = `
            <div class="error-container">
                <p>❌ Backend Server Not Responding</p>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted)">Make sure 'app.py' is running on port 5000.</p>
            </div>
        `;
    }
});

// --- AI Chat Logic ---
const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const chatMessages = document.getElementById("chatMessages");
let chatHistory = [];

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message to UI
    addMessage(text, "user");
    chatInput.value = "";

    // Show loading indicator in chat
    const loadingId = "loading-" + Date.now();
    chatMessages.innerHTML += `
        <div class="message ai-message" id="${loadingId}">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history: chatHistory }),
        });

        const data = await response.json();
        document.getElementById(loadingId).remove();

        if (data.error) {
            addMessage("Error: " + data.error, "ai");
        } else {
            addMessage(data.response, "ai");
            // Update history
            chatHistory.push({ role: "user", content: text });
            chatHistory.push({ role: "assistant", content: data.response });
            
            // Limit history to last 10 messages
            if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
        }
    } catch (err) {
        document.getElementById(loadingId).remove();
        addMessage("❌ Failed to connect to AI server.", "ai");
    }
}

function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendChatBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
