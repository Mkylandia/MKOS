let windowZIndex = 1000;

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-date').textContent = dateString;
}

function openApp(appName) {
    const window = document.getElementById(appName + '-window');
    if (window) {
        window.style.display = 'block';
        window.style.zIndex = ++windowZIndex;
        
        // Zentriere das Fenster
        const rect = window.getBoundingClientRect();
        window.style.left = `${(window.innerWidth - 800) / 2}px`;
        window.style.top = `${(window.innerHeight - 600) / 2}px`;
        window.style.width = '800px';
        window.style.height = '600px';
        
        makeDraggable(window);
    }
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function googleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        if (query.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            event.target.value = '';
        }
    }
}

function showStartMenu() {
    // Hier könnte ein Start-Menü implementiert werden
    alert('MKOS V1 - Willkommen im modernen Desktop-Erlebnis! 🚀');
}

async function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('ai-chat-messages');
    const sendBtn = document.getElementById('ai-send-btn');
    const typingIndicator = document.getElementById('ai-typing');
    const suggestions = document.getElementById('ai-suggestions');
    const stats = document.getElementById('ai-stats');

    // User Message hinzufügen
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message user-message';
    userMessage.innerHTML = `${message}<div class="message-time">${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</div>`;
    messagesContainer.appendChild(userMessage);

    // Suggestions verstecken nach erster Nachricht
    suggestions.style.display = 'none';

    // Input leeren und Button deaktivieren
    input.value = '';
    sendBtn.disabled = true;
    sendBtn.innerHTML = '⏳';

    // Typing Indicator zeigen
    typingIndicator.style.display = 'flex';

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Stats updaten
    const messageCount = messagesContainer.querySelectorAll('.user-message').length;
    stats.textContent = `MK arbeitet... • DeepSeek V3 • Gespräch: ${messageCount} Nachrichten`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'MKOS V1 Assistant'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Du bist MK, ein intelligenter und hilfsbereiter AI-Assistant für MKOS V1. Du bist freundlich, präzise und hilfsbereit. Antworte auf Deutsch und strukturiere deine Antworten klar. Nutze Emojis sparsam aber gezielt. Du bist wie ein persönlicher digitaler Assistent, der bei allen möglichen Fragen und Aufgaben hilft.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 800,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || 'Entschuldigung, ich konnte keine Antwort generieren.';

        // Typing Indicator verstecken
        typingIndicator.style.display = 'none';

        // AI Response hinzufügen mit Typewriter Effekt
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message ai-message-content';
        messagesContainer.appendChild(aiMessage);

        // Typewriter Effekt
        let i = 0;
        const typeWriter = () => {
            if (i < aiResponse.length) {
                aiMessage.innerHTML = aiResponse.substring(0, i + 1) + '<span style="opacity: 0.5;">|</span>';
                i++;
                setTimeout(typeWriter, 20);
            } else {
                aiMessage.innerHTML = aiResponse + `<div class="message-time">${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</div>`;
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };
        typeWriter();

    } catch (error) {
        console.error('AI Request Error:', error);
        
        // Typing Indicator verstecken
        typingIndicator.style.display = 'none';

        // Error Message hinzufügen
        const errorMessage = document.createElement('div');
        errorMessage.className = 'ai-message ai-message-content';
        errorMessage.innerHTML = `🚨 <strong>Verbindungsfehler:</strong><br>Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Das könnte an einer Netzwerkunterbrechung oder API-Limit liegen.<br><br>Bitte versuche es in einem Moment erneut.<div class="message-time">${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}</div>`;
        errorMessage.style.borderColor = '#e74c3c';
        errorMessage.style.background = 'rgba(231, 76, 60, 0.1)';
        messagesContainer.appendChild(errorMessage);
    } finally {
        // Button wieder aktivieren
        sendBtn.disabled = false;
        sendBtn.innerHTML = '🚀';
        
        // Stats updaten
        const finalMessageCount = messagesContainer.querySelectorAll('.user-message').length;
        stats.textContent = `MK ist bereit • DeepSeek V3 • Gespräch: ${finalMessageCount} Nachrichten`;
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Focus zurück auf Input
        input.focus();
    }
}

function sendSuggestion(suggestion) {
    document.getElementById('ai-input').value = suggestion;
    sendAIMessage();
}

function handleAIInput(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendAIMessage();
    }
}

// Willkommensnachricht Zeit setzen
function initializeAI() {
    const welcomeTime = document.getElementById('welcome-time');
    if (welcomeTime) {
        welcomeTime.textContent = new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    }
}

// Initialisierung
updateTime();
setInterval(updateTime, 1000);
initializeAI();

// Alle Fenster draggable machen beim Laden
document.addEventListener('DOMContentLoaded', function() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(makeDraggable);
    initializeAI();
});
