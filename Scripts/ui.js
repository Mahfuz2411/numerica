// ==================== UI.JS - UI Management ====================

const UI = {
    // Initialize UI
    init() {
        this.updateStats();
    },

    // Update game statistics
    updateStats() {
        const attemptsLeft = Game.maxGuesses - Game.totalGuess;
        const rank = Game.getRank(Game.totalGuess);

        document.getElementById('attemptsLeftDisplay').textContent = attemptsLeft;
        document.getElementById('guessesMadeDisplay').textContent = Game.totalGuess;
        document.getElementById('rankDisplay').textContent = rank.icon;
    },

    // Add guess to feedback list
    addGuessToList(inputText, correct) {
        const guessList = document.getElementById('guessList');
        const guessItem = document.createElement('div');
        guessItem.className = `guess-item ${correct > 0 ? 'success' : 'error'}`;
        
        const matchText = correct === 1 ? 'digit' : 'digits';
        guessItem.textContent = `${inputText} → ${correct} correct ${matchText}`;
        
        guessList.appendChild(guessItem);
    },

    // Clear input boxes
    clearInputBoxes() {
        const digitBoxes = document.querySelectorAll('.digit-box');
        digitBoxes.forEach(box => {
            box.value = '';
        });
        // Focus on first box after a tiny delay to ensure it sticks
        setTimeout(() => {
            if (digitBoxes.length > 0) {
                digitBoxes[0].focus();
            }
        }, 10);
    },

    // Clear guess list
    clearGuessList() {
        document.getElementById('guessList').innerHTML = '';
    },

    // Toggle submit/reset buttons
    toggleButtons(resetMode) {
        const submitBtn = document.getElementById('submitBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        if (resetMode) {
            submitBtn.parentElement.style.display = 'none';
            resetBtn.style.display = 'inline-block';
        } else {
            submitBtn.parentElement.style.display = 'block';
            resetBtn.style.display = 'none';
        }
    },

    // Show alert message
    showAlert(message, type = 'info', duration = 3000) {
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    },

    // Update scores display
    updateScoresDisplay() {
        const bestScore = Database.data.best;
        const betterScore = Database.data.better;
        const goodScore = Database.data.good;

        document.getElementById('bestScore').textContent = bestScore === null ? '-' : bestScore;
        document.getElementById('betterScore').textContent = betterScore === null ? '-' : betterScore;
        document.getElementById('goodScore').textContent = goodScore === null ? '-' : goodScore;
    }
};