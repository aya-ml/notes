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

// Note positions on staff (vertical positions in pixels)
// ИСПРАВЛЕНО: теперь правильное расположение нот на нотном стане
// Линия 5 (самая верхняя) -> Линия 1 (самая нижняя)
const notePositions = {
    'C4': 125,  // Под первой линией
    'D4': 115,  // На первой линии
    'E4': 105,  // Между 1 и 2
    'F4': 95,   // На второй линии
    'G4': 85,   // Между 2 и 3
    'A4': 75,   // На третьей линии
    'B4': 65,   // Между 3 и 4
    'C5': 55,   // На четвертой линии
    'D5': 45,   // Между 4 и 5
    'E5': 35,   // На пятой линии
    'F5': 25,   // Над пятой линией
    'G5': 15,   // Выше
    'A5': 5,    // Еще выше
    'B5': -5    // Самая высокая
};

// Available notes for the game (only white keys for now)
const availableNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];

// DOM elements
const noteContainer = document.getElementById('note-container');
const pianoElement = document.querySelector('.piano');
const correctCounter = document.getElementById('correct-counter');
const attemptsCounter = document.getElementById('attempts-counter');
const accuracyCounter = document.getElementById('accuracy-counter');
const newNoteBtn = document.getElementById('new-note-btn');

// Initialize the game
function initGame() {
    createPiano();
    generateRandomNote();
    updateScoreboard();
    
    // Event listeners
    newNoteBtn.addEventListener('click', generateRandomNote);
}

// Create piano keys
function createPiano() {
    // White keys: C, D, E, F, G, A, B
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    whiteKeys.forEach((key, index) => {
        const whiteKey = document.createElement('div');
        whiteKey.className = 'piano-key white-key';
        whiteKey.dataset.note = key;
        whiteKey.dataset.type = 'white';
        
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
            note: key,
            type: 'white'
        });
        
        // Add black keys between certain white keys
        if (index !== 2 && index !== 6) { // No black key between E-F and B-C
            const blackKey = document.createElement('div');
            blackKey.className = 'piano-key black-key';
            blackKey.dataset.type = 'black';
            
            // Position the black key
            blackKey.style.left = `calc(${(index + 1) * (100 / 7)}% - 15px)`;
            
            pianoElement.appendChild(blackKey);
            
            // Store reference
            gameState.pianoKeys.push({
                element: blackKey,
                note: null, // Black keys not used in this version
                type: 'black'
            });
        }
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
        }, 800);
    } else {
        keyElement.classList.add('wrong');
        setTimeout(() => {
            keyElement.classList.remove('wrong');
            gameState.isProcessing = false;
        }, 800);
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
    noteImg.src = 'images/note.png';
    noteImg.alt = 'Musical Note';
    noteImg.className = 'note';
    
    // Position the note on the staff
    const notePosition = notePositions[gameState.currentNote];
    noteImg.style.top = `${notePosition}px`;
    
    // Add to container
    noteContainer.appendChild(noteImg);
    
    // Если изображение не загружается, создаем placeholder
    noteImg.onerror = function() {
        this.src = createNotePlaceholder();
    };
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 80">
            <ellipse cx="20" cy="20" rx="15" ry="12" fill="#333"/>
            <rect x="19" y="20" width="2" height="50" fill="#333"/>
        </svg>
    `);
}

// Create a simple treble clef SVG as placeholder
function createTreblePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 160">
            <path d="M25,30 Q35,5 50,5 Q65,5 70,30 Q75,55 60,70 Q45,85 45,110 Q45,135 60,145 Q75,155 60,160" 
                  stroke="#333" fill="none" stroke-width="3"/>
            <path d="M25,125 L60,125" stroke="#333" stroke-width="3"/>
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
