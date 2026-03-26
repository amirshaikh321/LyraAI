// =======================
// Markdown Configuration
// =======================
marked.setOptions({
    gfm: true,
    breaks: true
});

// =======================
// Get DOM elements
// =======================
const messageInput = document.getElementById('messageInput');
const sendBtn      = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

const userAvatar      = '\img\abc.png';
const assistantAvatar = 'https://via.placeholder.com/40/5ba3d4/ffffff?text=A';

// =======================
// ✅ CHANGE 1 — Conversation memory (added here, just before sendMessage)
// =======================
let conversationHistory = [];   // stores all turns for this session


// =======================
// Send Message
// =======================
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    addMessage(messageText, 'user');
    messageInput.value = '';

    // ✅ CHANGE 2 — push user turn to history before fetching
    
conversationHistory.push({ role: 'user', content: messageText });


    const loadingMsg = addMessage('⏳ **Lyra is thinking...**', 'assistant', true);

    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: messageText,
            
history: conversationHistory   // ✅ CHANGE 3 — send history to backend

        })
    })
    .then(res => res.json())
    .then(data => {
        removeMessage(loadingMsg);
        const reply = data.response || '⚠️ No response from model.';
        addMessage(reply, 'assistant');
        
conversationHistory.push({ role: 'assistant', content: reply });  // ✅ CHANGE 4 — save reply

    })
    .catch(err => {
        removeMessage(loadingMsg);
        addMessage('⚠️ Something went wrong. Please try again.', 'assistant');
        console.error(err);
    });
}

// =======================
// Add Message to Chat
// =======================
function addMessage(text, sender, isTemp = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    if (isTemp) messageDiv.dataset.temp = 'true';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = sender === 'user' ? userAvatar : assistantAvatar;
    avatarImg.alt = sender;
    avatarDiv.appendChild(avatarImg);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = marked.parse(text);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
}

// =======================
// Remove Temporary Message
// =======================
function removeMessage(messageDiv) {
    if (messageDiv && messageDiv.dataset.temp) messageDiv.remove();
}

// =======================
// Event Listeners
// =======================
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// =======================
// Suggestion Chips
// =======================
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        messageInput.value = chip.textContent.trim();
        messageInput.focus();
    });
});

// =======================
// New Chat  ✅ CHANGE 5 — reset history on new chat
// =======================
document.querySelectorAll('.new-chat-btn, .nav-btn:first-child').forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Start a new chat?')) {
            messagesContainer.innerHTML = '';
            messageInput.value = '';
            
conversationHistory = [];   // ✅ wipe memory for fresh session

        }
    });
});

// =======================
// Conversation List
// =======================
document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.conversation-item')
            .forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// =======================
// Footer Actions
// =======================
document.querySelectorAll('.footer-item').forEach(item => {
    item.addEventListener('click', () => {
        const text = item.textContent.trim();
        if (text === 'Logout') {
            if (confirm('Are you sure you want to logout?')) alert('Logged out successfully!');
        } else {
            alert(`${text} feature coming soon!`);
        }
    });
});

// =======================
// Voice Button
// =======================
document.querySelector('.voice-btn').addEventListener('click', () => {
    alert('🎤 Voice input coming soon!');
});

// =======================
// Attach Button
// =======================
document.querySelector('.attach-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    input.onchange = e => {
        if (e.target.files[0]) alert(`📎 File "${e.target.files[0].name}" selected`);
    };
    input.click();
});

console.log('✅ Lyra UI connected with Markdown + Memory + Backend');