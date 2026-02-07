// Game state
const gameState = {
    currentNote: null,
    correctCount: 0,
    attemptsCount: 0,
    pianoKeys: [],
    notePositions: [],
    isProcessing: false
};

// Note to piano key mapping
const noteToKey = {
    'C4': 'C', 'D4': 'D', 'E4': 'E', 'F4': 'F', 'G4': 'G', 'A4': 'A', 'B4': 'B',
    'C5': 'C', 'D5': 'D', 'E5': 'E', 'F5': 'F', 'G5': 'G', 'A5': 'A', 'B5': 'B'
};

// Note positions on staff (vertical positions in pixels)
const notePositions = {
    'C4': 142, 'D4': 130, 'E4': 118, 'F4': 106, 'G4': 94, 'A4': 82, 'B4': 70,
    'C5': 58, 'D5': 46, 'E5': 34, 'F5': 22, 'G5': 10, 'A5': -2, 'B5': -14
};

// Available notes for the game (only white keys for now)
const availableNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];

// DOM elements
const noteContainer = document.getElementById('note-container');
const currentNoteName = document.getElementById('current-note-name');
const pianoElement = document.querySelector('.piano');
const correctCounter = document.getElementById('correct-counter');
const attemptsCounter = document.getElementById('attempts-counter');
const accuracyCounter = document.getElementById('accuracy-counter');
const hintBtn = document.getElementById('hint-btn');
const newNoteBtn = document.getElementById('new-note-btn');
const hintModal = document.getElementById('hint-modal');
const closeModal = document.getElementById('close-modal');
const hintNote = document.getElementById('hint-note');

// Initialize the game
function initGame() {
    createPiano();
    generateRandomNote();
    updateScoreboard();
    
    // Event listeners
    hintBtn.addEventListener('click', showHint);
    newNoteBtn.addEventListener('click', generateRandomNote);
    closeModal.addEventListener('click', () => {
        hintModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === hintModal) {
            hintModal.style.display = 'none';
        }
    });
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
    
    // Update current note display
    currentNoteName.textContent = gameState.currentNote;
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

// Show hint modal
function showHint() {
    hintNote.textContent = gameState.currentNote;
    hintModal.style.display = 'flex';
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Create placeholder images if they don't exist
// In a real implementation, you would have actual images in the /images/ folder
// For this demo, we'll create data URLs for the images
function createPlaceholderImages() {
    // Check if images exist, if not create placeholders
    const trebleImg = document.querySelector('.clef');
    const noteImg = document.querySelector('.note');
    
    // If treble.png doesn't load, use a placeholder
    trebleImg.onerror = function() {
        this.src = createTreblePlaceholder();
    };
    
    // If note.png doesn't load, use a placeholder
    if (noteImg) {
        noteImg.onerror = function() {
            this.src = createNotePlaceholder();
        };
    }
}

// Create a simple treble clef SVG as placeholder
function createTreblePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
            <path d="M30,40 Q40,10 60,10 Q80,10 85,40 Q90,70 70,90 Q50,110 50,140 Q50,170 70,180 Q90,190 70,200" 
                  stroke="#333" fill="none" stroke-width="4"/>
            <path d="M30,160 L70,160" stroke="#333" stroke-width="4"/>
        </svg>
    `);
}

// Create a simple note SVG as placeholder
function createNotePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100">
            <ellipse cx="25" cy="25" rx="20" ry="15" fill="#333"/>
            <rect x="23" y="25" width="4" height="60" fill="#333"/>
        </svg>
    `);
}

// Call the function to create placeholder images
createPlaceholderImages();
