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

// Note positions on staff - ПЕРЕСЧИТАНО под новую высоту стана
// Теперь расстояние между линиями = высоте ноты (28px на десктопе)
const notePositions = {
    'C4': 112,  // Под первой линией (снизу)
    'D4': 84,   // На первой линии
    'E4': 56,   // Между 1 и 2
    'F4': 28,   // На второй линии
    'G4': 0,    // Между 2 и 3
    'A4': -28,  // На третьей линии
    'B4': -56,  // Между 3 и 4
    'C5': -84,  // На четвертой линии
    'D5': -112, // Между 4 и 5
    'E5': -140, // На пятой линии
    'F5': -168, // Над пятой линией
    'G5': -196, // Выше
    'A5': -224, // Еще выше
    'B5': -252  // Самая высокая
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
    
    // Адаптируем позиции нот под текущий размер экрана
    updateNotePositionsForScreen();
    
    // При изменении размера окна пересчитываем позиции
    window.addEventListener('resize', updateNotePositionsForScreen);
}

// Обновляем позиции нот в зависимости от размера экрана
function updateNotePositionsForScreen() {
    // Получаем текущую высоту ноты из CSS переменной
    const noteHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--note-height').trim();
    
    // Преобразуем в число (убираем 'px')
    const noteHeightValue = parseInt(noteHeight);
    
    // Если это мобильный размер, пересчитываем позиции
    if (window.innerWidth <= 768) {
        // Для мобильных позиции другие
        const mobileNotePositions = {
            'C4': noteHeightValue * 4,      // 88
            'D4': noteHeightValue * 3,      // 66
            'E4': noteHeightValue * 2,      // 44
            'F4': noteHeightValue * 1,      // 22
            'G4': 0,
            'A4': -noteHeightValue * 1,     // -22
            'B4': -noteHeightValue * 2,     // -44
            'C5': -noteHeightValue * 3,     // -66
            'D5': -noteHeightValue * 4,     // -88
            'E5': -noteHeightValue * 5,     // -110
            'F5': -noteHeightValue * 6,     // -132
            'G5': -noteHeightValue * 7,     // -154
            'A5': -noteHeightValue * 8,     // -176
            'B5': -noteHeightValue * 9      // -198
        };
        
        // Обновляем текущую ноту если она есть
        if (gameState.currentNote) {
            const noteImg = document.querySelector('.note');
            if (noteImg) {
                noteImg.style.top = `${mobileNotePositions[gameState.currentNote]}px`;
            }
        }
    } else {
        // Для десктопа используем оригинальные позиции
        if (gameState.currentNote) {
            const noteImg = document.querySelector('.note');
            if (noteImg) {
                noteImg.style.top = `${notePositions[gameState.currentNote]}px`;
            }
        }
    }
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
    
    // Позиционируем ноту в зависимости от размера экрана
    updateNotePositionsForScreen();
    
    // Устанавливаем начальную позицию
    const noteHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--note-height').trim();
    const noteHeightValue = parseInt(noteHeight);
    
    // Базовая позиция для десктопа
    let position = notePositions[gameState.currentNote];
    
    // Если мобильный, используем мобильные позиции
    if (window.innerWidth <= 768) {
        position = noteHeightValue * (4 - availableNotes.indexOf(gameState.currentNote));
    }
    
    noteImg.style.top = `${position}px`;
    
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
            <ellipse cx="14" cy="14" rx="10" ry="8" fill="#333"/>
            <rect x="13" y="14" width="2" height="14" fill="#333"/>
        </svg>
    `);
}

// Create a simple treble clef SVG as placeholder
function createTreblePlaceholder() {
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100">
            <path d="M20,20 Q28,5 40,5 Q52,5 55,20 Q58,35 48,50 Q38,65 38,80 Q38,95 48,100 Q58,105 48,110" 
                  stroke="#333" fill="none" stroke-width="2.5"/>
            <path d="M20,85 L48,85" stroke="#333" stroke-width="2.5"/>
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
