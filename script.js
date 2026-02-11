// Game state
const gameState = {
    currentNote: null,
    correctCount: 0,
    attemptsCount: 0,
    pianoKeys: [],
    isProcessing: false
};

// Note to piano key mapping
const noteToKey = {
    'C4': 'C', 'D4': 'D', 'E4': 'E', 'F4': 'F', 'G4': 'G', 'A4': 'A', 'B4': 'B',
    'C5': 'C', 'D5': 'D', 'E5': 'E', 'F5': 'F', 'G5': 'G', 'A5': 'A', 'B5': 'B'
};

// Available notes for the game (only white keys for now)
const availableNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];

// DOM elements
const noteContainer = document.getElementById('note-container');
const pianoElement = document.querySelector('.piano');
const correctCounter = document.getElementById('correct-counter');
const attemptsCounter = document.getElementById('attempts-counter');
const accuracyCounter = document.getElementById('accuracy-counter');

// Initialize the game
function initGame() {
    createPiano();
    generateRandomNote();
    updateScoreboard();
    positionStaffLines();
    
    // При изменении размера окна перерисовываем ноту
    window.addEventListener('resize', () => {
        if (gameState.currentNote) {
            repositionNote(gameState.currentNote);
        }
    });
}

function positionStaffLines() {
    const lines = document.querySelectorAll('.staff-line');

    const spacing = parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--staff-line-spacing')
    );

    lines.forEach((line, index) => {
        line.style.top = `${index * spacing}px`;
    });
}

// Create piano keys
function createPiano() {
    // White keys: C, D, E, F, G, A, B
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    // Очищаем пианино перед созданием
    pianoElement.innerHTML = '';
    
    whiteKeys.forEach((key, index) => {
        const whiteKey = document.createElement('div');
        whiteKey.className = 'piano-key white-key';
        whiteKey.dataset.note = key;
        
        const keyLabel = document.createElement('div');
        keyLabel.className = 'key-label';
        keyLabel.textContent = key;
        
        whiteKey.appendChild(keyLabel);
        pianoElement.appendChild(whiteKey);
        
        // Add click event
        whiteKey.addEventListener('click', () => handlePianoClick(key, whiteKey));
        
        // Store reference
        gameState.pianoKeys.push({
            element: whiteKey,
            note: key
        });
    });
}

// Handle piano key click
function handlePianoClick(key, keyElement) {
    if (gameState.isProcessing) return;
    
    gameState.isProcessing = true;
    gameState.attemptsCount++;
    
    // Check if the key matches the current note
    const correctKey = noteToKey[gameState.currentNote];
    const isCorrect = key === correctKey;
    
    // Visual feedback
    if (isCorrect) {
        keyElement.classList.add('active');
        gameState.correctCount++;
        setTimeout(() => {
            keyElement.classList.remove('active');
            generateRandomNote();
            gameState.isProcessing = false;
        }, 300);
    } else {
        keyElement.classList.add('wrong');
        setTimeout(() => {
            keyElement.classList.remove('wrong');
            gameState.isProcessing = false;
        }, 300);
    }
    
    updateScoreboard();
}

// Generate a random note and display it on the staff
function generateRandomNote() {
    // Select a random note
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    gameState.currentNote = availableNotes[randomIndex];
    
    // Clear previous note
    noteContainer.innerHTML = '';
    
    // Create note image
    const noteImg = document.createElement('img');
    noteImg.src = 'images/nt.png';
    noteImg.alt = 'Musical Note';
    noteImg.className = 'note';
    
    // Add to container
    noteContainer.appendChild(noteImg);
    
    // Позиционируем ноту
    repositionNote(gameState.currentNote);
    
    // Если изображение не загружается, создаем placeholder
    noteImg.onerror = function() {
        this.src = createNotePlaceholder();
    };
}

// Reposition note based on staff lines - С ДОПОЛНИТЕЛЬНЫМИ ЛИНИЯМИ
function repositionNote(noteName) {
    const noteImg = document.querySelector('.note');
    if (!noteImg) return;

    const spacing = parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--staff-line-spacing')
    );

    const step = spacing / 2;

    const noteSteps = {
        'C4': 6,
        'D4': 5,
        'E4': 4,
        'F4': 3,
        'G4': 2,
        'A4': 1,
        'B4': 0,
        'C5': -1,
        'D5': -2,
        'E5': -3,
        'F5': -4,
        'G5': -5,
        'A5': -6,
        'B5': -7
    };

    const middleLineCenter =
        (2 * spacing) + (3 / 2);

    const offset = noteSteps[noteName] * step;

    noteImg.style.top = `${middleLineCenter + offset}px`;

    addLedgerLines(noteName);
}

// Функция для добавления дополнительных линий
function addLedgerLines(noteName) {
    const noteContainer = document.querySelector('.note-container');
    if (!noteContainer) return;

    // удалить старые линии
    document.querySelectorAll('.ledger-line').forEach(line => line.remove());

    const spacing = parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--staff-line-spacing')
    );

    const step = spacing / 2;
    const middleLineCenter = 2 * spacing;

    const noteSteps = {
        'C4': 6,
        'A5': -6,
        'B5': -6
    };

    if (!(noteName in noteSteps)) return;

    const offset = noteSteps[noteName] * step;
    const ledgerY = middleLineCenter + offset;

    const line = document.createElement('div');
    line.className = 'ledger-line';
    line.style.top = `${ledgerY}px`;

    noteContainer.appendChild(line);
}

// Update scoreboard
function updateScoreboard() {
    correctCounter.textContent = gameState.correctCount;
    attemptsCounter.textContent = gameState.attemptsCount;
    
    // Calculate accuracy
    const accuracy = gameState.attemptsCount > 0 
        ? Math.round((gameState.correctCount / gameState.attemptsCount) * 100) 
        : 0;
    accuracyCounter.textContent = `${accuracy}%`;
}

// Create a simple note SVG as placeholder
function createNotePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <ellipse cx="15" cy="15" rx="11" ry="9" fill="#333"/>
            <rect x="14" y="15" width="2" height="15" fill="#333"/>
        </svg>
    `);
}

// Create a simple treble clef SVG as placeholder
function createTreblePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 150">
            <path d="M30,30 Q45,15 60,15 Q75,15 82,30 Q89,45 72,60 Q55,75 55,105 Q55,135 72,150 Q89,165 72,180" 
                  stroke="#333" fill="none" stroke-width="3.5"/>
            <path d="M30,135 L72,135" stroke="#333" stroke-width="3.5"/>
        </svg>
    `);
}

// Create placeholder images if they don't exist
function createPlaceholderImages() {
    const trebleImg = document.querySelector('.clef');
    
    // Если treble.png не загружается, используем placeholder
    trebleImg.onerror = function() {
        this.src = createTreblePlaceholder();
    };
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Call the function to create placeholder images
createPlaceholderImages();
