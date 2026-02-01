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
    
    if (messageText === '') {
        return;
    }
    
    // Add user message
    addMessage(messageText, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Simulate assistant response
    setTimeout(() => {
        const responses = [
            "I'd be happy to help you with that!",
            "That's a great question! Let me explain...",
            "Sure! Here's what I think about that:",
            "Absolutely! Let me break this down for you.",
            "Of course! I can help you with that."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'assistant');
    }, 1000);
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = sender === 'user' ? userAvatar : assistantAvatar;
    avatarImg.alt = sender;
    avatarDiv.appendChild(avatarImg);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Check if message contains code blocks
    if (text.includes('```')) {
        // Parse code blocks
        const parts = text.split('```');
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                // Regular text
                if (part.trim()) {
                    const p = document.createElement('p');
                    p.textContent = part.trim();
                    contentDiv.appendChild(p);
                }
            } else {
                // Code block
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
        contentDiv.textContent = text;
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        const chipText = chip.textContent.trim();
        messageInput.value = chipText;
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
            console.log('New chat started');
        }
    });
});

// Handle conversation items
const conversationItems = document.querySelectorAll('.conversation-item');
conversationItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        conversationItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        console.log('Loaded conversation:', item.textContent.trim());
    });
});

// Handle footer items
const footerItems = document.querySelectorAll('.footer-item');
footerItems.forEach(item => {
    item.addEventListener('click', () => {
        const itemText = item.textContent.trim();
        if (itemText === 'Logout') {
            if (confirm('Are you sure you want to logout?')) {
                console.log('User logged out');
                alert('Logged out successfully!');
            }
        } else {
            console.log('Clicked:', itemText);
            alert(`${itemText} feature coming soon!`);
        }
    });
});

// Handle voice button
const voiceBtn = document.querySelector('.voice-btn');
voiceBtn.addEventListener('click', () => {
    alert('Voice input feature coming soon!');
});

// Handle attach button
const attachBtn = document.querySelector('.attach-btn');
attachBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            alert(`File "${file.name}" ready to upload!`);
        }
    };
    input.click();
});

// Auto-resize input on focus
messageInput.addEventListener('focus', () => {
    messageInput.style.boxShadow = '0 0 0 3px rgba(74, 144, 200, 0.1)';
});

messageInput.addEventListener('blur', () => {
    messageInput.style.boxShadow = 'none';
});

// Add some welcome interactivity
console.log('Chat interface loaded successfully!');
console.log('Type a message and press Enter or click Send to chat with the assistant.');