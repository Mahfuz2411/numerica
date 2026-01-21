// ==================== UI.JS - UI Management ====================

const UI = {
    // Initialize UI
    init() {
        this.updateStats();
        this.setupBackButton();
    },

    // Setup back to games button
    setupBackButton() {
        const backBtn = document.getElementById('backToGamesBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                APP.backToGames();
            });
        }
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
        const backBtn = document.getElementById('backToGamesBtn');
        
        if (resetMode) {
            submitBtn.parentElement.style.display = 'none';
            resetBtn.style.display = 'inline-block';
            if (backBtn) backBtn.style.display = 'inline-block';
        } else {
            submitBtn.parentElement.style.display = 'block';
            resetBtn.style.display = 'none';
            if (backBtn) backBtn.style.display = 'none';
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

        // Update player statistics
        const stats = Database.getStats();
        document.getElementById('overallRankStat').textContent = stats.overallRank;
        document.getElementById('totalGamesStat').textContent = stats.totalGames;
        document.getElementById('completedGamesStat').textContent = stats.completedGames;
        document.getElementById('winRatioStat').textContent = stats.winRatio + '%';
        document.getElementById('avgGuessStat').textContent = stats.avgGuess;
    },

    // Show custom popup
    showPopup(options) {
        const overlay = document.getElementById('customPopup');
        const header = document.getElementById('popupHeader');
        const body = document.getElementById('popupBody');
        const confirmBtn = document.getElementById('popupConfirm');
        const closeBtn = document.getElementById('popupClose');
        const buttonsContainer = document.querySelector('.popup-buttons');

        header.innerHTML = options.title || '';
        body.innerHTML = options.html || options.text || '';
        confirmBtn.textContent = options.confirmButtonText || 'OK';

        // Clear existing buttons except confirm
        const existingCancel = document.getElementById('popupCancel');
        if (existingCancel) {
            existingCancel.remove();
        }

        // Handle danger mode (e.g., delete confirmation)
        if (options.isDanger) {
            confirmBtn.className = 'btn btn-danger';
        } else {
            confirmBtn.className = 'btn btn-primary';
        }

        // Create cancel button if needed
        if (options.onCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'popupCancel';
            cancelBtn.className = 'btn btn-secondary';
            cancelBtn.textContent = options.cancelButtonText || 'Cancel';
            buttonsContainer.appendChild(cancelBtn);

            // Handle cancel button click
            cancelBtn.onclick = (e) => {
                e.stopPropagation();
                overlay.classList.remove('active');
                options.onCancel();
            };
        }

        overlay.classList.add('active');

        // Handle confirm button
        confirmBtn.onclick = (e) => {
            e.stopPropagation();
            overlay.classList.remove('active');
            if (options.onConfirm) {
                options.onConfirm();
            }
        };

        // Handle close button
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            overlay.classList.remove('active');
            if (options.onCancel) {
                options.onCancel();
            } else if (options.onConfirm) {
                options.onConfirm();
            }
        };

        // Handle overlay click (outside popup) - prevent closing
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                e.stopPropagation();
                // Don't close on outside click for dangerous operations
            }
        };
    }
};