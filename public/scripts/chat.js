// const { socket } = require("socket.io");

// Chat functionality
const chatContainer = document.querySelector('.chat-container');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const newChatButton = document.querySelector('.new-chat-button');
const chatHistory = document.querySelector('.chat-history');

// Store current chat ID and all chats
let currentChatId = Date.now();
const chats = new Map();

// Initialize chat history from localStorage
function initializeChats() {
    try {
        const savedChats = localStorage.getItem('chatHistory');
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats);
            parsedChats.forEach(chat => {
                chats.set(chat.id, chat);
                addChatToSidebar(chat.id, chat.title);
            });
            // Load the most recent chat if exists
            if (parsedChats.length > 0) {
                loadChat(parsedChats[parsedChats.length - 1].id);
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Save chats to localStorage
function saveChats() {
    try {
        const chatsArray = Array.from(chats.values());
        localStorage.setItem('chatHistory', JSON.stringify(chatsArray));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Add a chat to the sidebar
function addChatToSidebar(chatId, title) {
    const chatElement = document.createElement('div');
    chatElement.classList.add('chat-history-item');
    chatElement.innerHTML = `
        <div class="chat-button" data-chat-id="${chatId}">
            ${title || 'New Chat'}
        </div>
        <button class="delete-chat" data-chat-id="${chatId}">×</button>
    `;
    chatElement.style.display = 'flex';
    chatElement.style.justifyContent = 'space-between';
    chatElement.style.alignItems = 'center';
    chatElement.style.padding = 'var(--spacing-sm)';
    chatElement.style.margin = 'var(--spacing-xs) 0';
    chatElement.style.borderRadius = 'var(--border-radius)';
    chatElement.style.backgroundColor = 'black';
    chatElement.style.cursor = 'pointer';

    chatHistory.insertBefore(chatElement, chatHistory.firstChild);
}

// Load a specific chat
function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats.get(chatId);
    if (chat) {
        chatContainer.innerHTML = '';
        chat.messages.forEach(msg => {
            addMessage(msg.content, msg.isUser, false);
        });
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Message handling
function addMessage(message, isUser = true, save = true) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.textContent = message;
    
    messageElement.appendChild(contentElement);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (save) {
        // Save message to current chat
        if (!chats.has(currentChatId)) {
            chats.set(currentChatId, {
                id: currentChatId,
                title: message.slice(0, 30) + '...',
                messages: []
            });
            addChatToSidebar(currentChatId, message.slice(0, 30) + '...');
        }
        
        const chat = chats.get(currentChatId);
        chat.messages.push({ content: message, isUser });
        saveChats();
    }
}

// Event listeners
sendButton?.addEventListener('click', sendMessage);
messageInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

newChatButton?.addEventListener('click', () => {
    currentChatId = Date.now();
    chatContainer.innerHTML = '';
    messageInput.value = '';
    messageInput.focus();
});

// Chat history click handlers
chatHistory.addEventListener('click', (e) => {
    const chatButton = e.target.closest('.chat-button');
    const deleteButton = e.target.closest('.delete-chat');

    if (chatButton) {
        const chatId = parseInt(chatButton.dataset.chatId);
        loadChat(chatId);
    } else if (deleteButton) {
        const chatId = parseInt(deleteButton.dataset.chatId);
        chats.delete(chatId);
        saveChats();
        deleteButton.parentElement.remove();
        if (currentChatId === chatId) {
            chatContainer.innerHTML = '';
            currentChatId = Date.now();
        }
    }
});

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';

    try {

        socket.emit('ai-message', message);

        // Replace with your actual API endpoint
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        // Add bot response to chat
        addMessage(data.response, false);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong. Please try again.', false);
    }
}

// Mobile sidebar elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const sidebarCloseBtn = document.querySelector('.sidebar-close');

// Function to toggle sidebar
function toggleSidebar(show = true) {
    sidebar.classList.toggle('show', show);
    sidebarOverlay.classList.toggle('show', show);
}

// Sidebar event listeners
sidebarToggle?.addEventListener('click', () => toggleSidebar(true));
sidebarCloseBtn?.addEventListener('click', () => toggleSidebar(false));
sidebarOverlay?.addEventListener('click', () => toggleSidebar(false));

// Close sidebar when clicking a chat in mobile view
chatHistory?.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        toggleSidebar(false);
    }
});

// Initialize the chat history when the page loads
document.addEventListener('DOMContentLoaded', initializeChats);
