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
    const windowElem = document.getElementById(appName + '-window');
    if (windowElem) {
        windowElem.style.display = 'block';
        windowElem.style.zIndex = ++windowZIndex;
        
        // Zentriere das Fenster
        windowElem.style.left = `${(window.innerWidth - 800) / 2}px`;
        windowElem.style.top = `${(window.innerHeight - 600) / 2}px`;
        windowElem.style.width = '800px';
        windowElem.style.height = '600px';
        
        makeDraggable(windowElem);
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

// Initialisierung
updateTime();
setInterval(updateTime, 1000);

// Alle Fenster draggable machen beim Laden
document.addEventListener('DOMContentLoaded', function() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(makeDraggable);
});
