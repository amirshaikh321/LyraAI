// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

// Sample user and assistant avatars
const userAvatar = 'https://via.placeholder.com/40/4a90c8/ffffff?text=U';
const assistantAvatar = 'https://via.placeholder.com/40/5ba3d4/ffffff?text=A';

// Handle sending messages
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // 1. Add user message
    addMessage(messageText, 'user');
    messageInput.value = '';

    // 2. Show loading message
    const loadingId = addMessage('⏳ Lyra is thinking...', 'assistant', true);

    // 3. Send query to backend
    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageText })
    })
    .then(res => res.json())
    .then(data => {
        // 4. Replace loading with model response
        removeMessage(loadingId);
        addMessage(data.response, 'assistant');
    })
    .catch(err => {
        removeMessage(loadingId);
        addMessage('⚠️ Something went wrong. Please try again.', 'assistant');
        console.error(err);
    });
}

// Add message to chat
function addMessage(text, sender, isTemp = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (isTemp) {
        messageDiv.dataset.temp = 'true';
    }

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = sender === 'user' ? userAvatar : assistantAvatar;
    avatarImg.alt = sender;
    avatarDiv.appendChild(avatarImg);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Handle code blocks
    if (text.includes('```')) {
        const parts = text.split('```');
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                if (part.trim()) {
                    const p = document.createElement('p');
                    p.textContent = part.trim();
                    contentDiv.appendChild(p);
                }
            } else {
                const codeBlock = document.createElement('div');
                codeBlock.className = 'code-block';
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = part.trim();
                pre.appendChild(code);
                codeBlock.appendChild(pre);
                contentDiv.appendChild(codeBlock);
            }
        });
    } else {
        contentDiv.innerHTML = marked.parse(text);
    }

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageDiv; // return reference
}

// Remove temporary message
function removeMessage(messageDiv) {
    if (messageDiv && messageDiv.dataset.temp) {
        messageDiv.remove();
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Handle suggestion chips
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        messageInput.value = chip.textContent.trim();
        messageInput.focus();
    });
});

// Handle new chat button
const newChatBtns = document.querySelectorAll('.new-chat-btn, .nav-btn:first-child');
newChatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Start a new chat? Current conversation will be saved to history.')) {
            messagesContainer.innerHTML = '';
            messageInput.value = '';
        }
    });
});

// Handle conversation items
const conversationItems = document.querySelectorAll('.conversation-item');
conversationItems.forEach(item => {
    item.addEventListener('click', () => {
        conversationItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Footer items
const footerItems = document.querySelectorAll('.footer-item');
footerItems.forEach(item => {
    item.addEventListener('click', () => {
        const text = item.textContent.trim();
        if (text === 'Logout') {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
            }
        } else {
            alert(`${text} feature coming soon!`);
        }
    });
});

// Voice button
document.querySelector('.voice-btn').addEventListener('click', () => {
    alert('Voice input coming soon!');
});

// Attach button
document.querySelector('.attach-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    input.onchange = e => {
        if (e.target.files[0]) {
            alert(`File "${e.target.files[0].name}" selected`);
        }
    };
    input.click();
});

console.log('Lyra chat UI connected to backend 🚀');
