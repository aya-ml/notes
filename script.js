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
    
    // При изменении размера окна перерисовываем ноту
    window.addEventListener('resize', () => {
        if (gameState.currentNote) {
            repositionNote(gameState.currentNote);
        }
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
    noteImg.src = 'images/note.png';
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

// Reposition note based on staff lines - ИСПРАВЛЕНО: ЦЕНТРИРУЕМ НОТУ
function repositionNote(noteName) {
    const noteImg = document.querySelector('.note');
    if (!noteImg) return;
    
    // Получаем расстояние между линиями
    const lineSpacing = getComputedStyle(document.documentElement)
        .getPropertyValue('--staff-line-spacing').trim();
    const spacingValue = parseInt(lineSpacing);
    
    // Правильное позиционирование нот на нотном стане (центрируем по линии):
    // Ноты будут располагаться на линиях и между ними
    // Каждая линия и промежуток = spacingValue
    
    const notePositions = {
        // C4 - под первой линией
        'C4': 2.5 * spacingValue,  // Центр между подлинейкой и линией 1
        'D4': 2 * spacingValue,    // На первой линии
        'E4': 1.5 * spacingValue,  // Между линиями 1 и 2
        'F4': 1 * spacingValue,    // На второй линии
        'G4': 0.5 * spacingValue,  // Между линиями 2 и 3
        'A4': 0,                   // На третьей линии (центр стана)
        'B4': -0.5 * spacingValue, // Между линиями 3 и 4
        'C5': -1 * spacingValue,   // На четвертой линии
        'D5': -1.5 * spacingValue, // Между линиями 4 и 5
        'E5': -2 * spacingValue,   // На пятой линии
        'F5': -2.5 * spacingValue, // Над пятой линией
        'G5': -3 * spacingValue,   // Еще выше
        'A5': -3.5 * spacingValue, // Еще выше
        'B5': -4 * spacingValue    // Самая высокая
    };
    
    // Получаем позицию для текущей ноты
    const position = notePositions[noteName] || 0;
    
    // НЕ нужно вычитать половину высоты ноты, т.к. CSS уже центрирует через transform: translateY(-50%)
    noteImg.style.top = `calc(50% + ${position}px)`;
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
