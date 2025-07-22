function showLetter() {
    const greeting = document.querySelector('.greeting');
    const envelope = document.querySelector('.envelope-container');
    const letterContainer = document.querySelector('.letter-container');

    if (greeting) greeting.classList.add('hidden');
    if (envelope) envelope.classList.add('hidden');
    if (letterContainer) letterContainer.classList.remove('hidden');
}

// Function to handle voice note display
function handleVoiceNote() {
    const input = document.getElementById('voice-note-input').value.toLowerCase().trim();
    const responseContainer = document.getElementById('response-container');
    const voiceNote = document.getElementById('voice-note');
    const noMessage = document.getElementById('no-message');

    // Define affirmative responses
    const affirmativeResponses = ['yes', 'haan', 'ha', 'yup', 'yeah', 'ok', 'okay', 'sure', 'hm', 'hmm', 'vo', 'h'];

    // Show the response container
    responseContainer.style.display = 'block';
    
    // Check if input is affirmative
    if (affirmativeResponses.includes(input)) {
        voiceNote.style.display = 'block';
        noMessage.style.display = 'none';
        voiceNote.play().catch(e => console.log('Error playing audio:', e));
    } else {
        voiceNote.style.display = 'none';
        noMessage.style.display = 'block';
    }
}

// Add event listener for Enter key on input field
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('voice-note-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleVoiceNote();
            }
        });
    }
});
let scratchContext = null;

function initScratchCard() {
    const scratchCard = document.querySelector('.scratch-card');
    const scratchArea = document.querySelector('.scratch-area');
    const scratchOverlay = document.querySelector('.scratch-overlay');

    // Create canvas for scratch effect
    const canvas = document.createElement('canvas');
    canvas.width = scratchArea.offsetWidth;
    canvas.height = scratchArea.offsetHeight;
    scratchArea.appendChild(canvas);
    scratchContext = canvas.getContext('2d', { willReadFrequently: true });

    // Set up initial canvas
    scratchContext.fillStyle = '#ff69b4';
    scratchContext.fillRect(0, 0, canvas.width, canvas.height)

    // Add event listeners for touch and mouse
    scratchArea.addEventListener('mousedown', startScratch);
    scratchArea.addEventListener('touchstart', startScratch);
    document.addEventListener('mouseup', endScratch);
    document.addEventListener('touchend', endScratch);
    scratchArea.addEventListener('mousemove', handleScratch);
    scratchArea.addEventListener('touchmove', handleScratch);
}

function startScratch(e) {
    isScratching = true;
    const pos = getCursorPosition(e, scratchArea);
    drawScratch(pos.x, pos.y);
}

function endScratch() {
    isScratching = false;
    checkIfScratched();
}

function handleScratch(e) {
    if (!isScratching) return;
    const pos = getCursorPosition(e, scratchArea);
    drawScratch(pos.x, pos.y);
}

function getCursorPosition(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    return { x, y };
}

function drawScratch(x, y) {
    if (!scratchContext) return;
    
    scratchContext.globalCompositeOperation = 'destination-out';
    scratchContext.lineWidth = 50;
    scratchContext.lineCap = 'round';
    
    scratchContext.beginPath();
    scratchContext.moveTo(x, y);
    scratchContext.lineTo(x, y);
    scratchContext.stroke();
}

function checkIfScratched() {
    const canvas = document.querySelector('.scratch-area canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let totalPixels = imageData.width * imageData.height;
    let transparentPixels = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
            transparentPixels++;
        }
    }

    const percentage = (transparentPixels / totalPixels) * 100;
    
    if (percentage > 50) {
        document.querySelector('.scratch-card').classList.add('scratched');
    }
}

function showLetter() {
    const greeting = document.querySelector('.greeting');
    const letterContainer = document.querySelector('.letter-container');
    
    // Add animation class to greeting
    greeting.classList.add('fade-out');
    
    // Wait for animation to finish
    setTimeout(() => {
        greeting.style.display = 'none';
        letterContainer.classList.remove('hidden');
        letterContainer.style.display = 'block';
        
        // Add animation class to letter container
        letterContainer.classList.add('fade-in');
    }, 1000);
}

// Initialize the scratch card when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    initScratchCard();
    const scratchButton = document.querySelector('.scratch-button');
    if (scratchButton) {
        scratchButton.addEventListener('click', showLetter);
    }
});

// Resize canvas when window is resized
window.addEventListener('resize', function() {
    const scratchArea = document.querySelector('.scratch-area');
    const canvas = scratchArea.querySelector('canvas');
    if (canvas) {
        canvas.width = scratchArea.offsetWidth;
        canvas.height = scratchArea.offsetHeight;
    }
});