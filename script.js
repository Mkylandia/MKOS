// Zähler, um die Z-Index-Werte nach Bedarf zu erhöhen
let windowZIndex = 1000;

/**
 * Aktualisiert die aktuelle Uhrzeit und das Datum im Widget.
 */
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

/**
 * Öffnet ein Fenster mit der ID "<appName>-window".
 * @param {string} appName - Der Namensteil vor "-window".
 */
function openApp(appName) {
    const appWindow = document.getElementById(`${appName}-window`);
    if (!appWindow) return;

    // Sichtbar machen und in den Vordergrund holen
    appWindow.classList.remove('hide');
    appWindow.classList.add('show');
    appWindow.style.display = 'block';
    appWindow.style.zIndex = ++windowZIndex;

    // Zentriere das Fenster (800×600)
    const leftPos = (window.innerWidth - 800) / 2;
    const topPos = (window.innerHeight - 600) / 2;
    appWindow.style.left = `${Math.max(leftPos, 20)}px`;
    appWindow.style.top  = `${Math.max(topPos, 20)}px`;
    appWindow.style.width  = '800px';
    appWindow.style.height = '600px';

    makeDraggable(appWindow);
}

/**
 * Schließt ein Fenster mit der ID "<appName>-window".
 * @param {string} appName - Der Namensteil vor "-window".
 */
function closeApp(appName) {
    const appWindow = document.getElementById(`${appName}-window`);
    if (!appWindow) return;

    // Leicht ausblenden, und nach kurzer Zeit display:none
    appWindow.classList.remove('show');
    appWindow.classList.add('hide');
    setTimeout(() => {
        appWindow.classList.remove('hide');
        appWindow.style.display = 'none';
    }, 200);
}

/**
 * Macht ein DOM-Element per Drag & Drop verschiebbar. 
 * Die Drag-Handles befinden sich in der .window-header.
 * @param {HTMLElement} element
 */
function makeDraggable(element) {
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
    const header = element.querySelector('.window-header');

    // Falls beim ersten Öffnen display:none war, wieder sichtbar setzen
    element.style.display = 'block';

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        posX = mouseX - e.clientX;
        posY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        element.style.top  = (element.offsetTop - posY) + "px";
        element.style.left = (element.offsetLeft - posX) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

/**
 * Öffnet bei Enter im Suchfeld eine Google-Suche in einem neuen Tab.
 * @param {KeyboardEvent} event
 */
function googleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            event.target.value = '';
        }
    }
}

/**
 * Zeigt eine simple Start-Menü-Nachricht.
 */
function showStartMenu() {
    alert('MKOS V1 – Willkommen im modernen Desktop-Erlebnis! 🚀');
}

/* Initialisierung */
updateTime();
setInterval(updateTime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    // Alle Fenster draggable machen, falls sie initial sichtbar sein sollten
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
    });
});
