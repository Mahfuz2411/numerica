// ==================== GAME.JS - Core Game Logic ====================

const Game = {
    randomNumber: '',
    totalGuess: 0,
    maxGuesses: 30,
    gameOver: false,

    // Initialize game
    init() {
        this.setupEventListeners();
        this.reset();
    },

    // Setup event listeners for input
    setupEventListeners() {
        const digitBoxes = document.querySelectorAll('.digit-box');
        
        digitBoxes.forEach((box, index) => {
            // Input event - allow only digits
            box.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
                if (e.target.value.length === 1 && index < digitBoxes.length - 1) {
                    digitBoxes[index + 1].focus();
                }
            });

            // Keydown event - handle backspace and enter
            box.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    digitBoxes[index - 1].focus();
                }
                
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.submitGuess();
                }

                // Arrow keys for navigation
                if (e.key === 'ArrowLeft' && index > 0) {
                    e.preventDefault();
                    digitBoxes[index - 1].focus();
                }

                if (e.key === 'ArrowRight' && index < digitBoxes.length - 1) {
                    e.preventDefault();
                    digitBoxes[index + 1].focus();
                }
            });

            // Paste event - handle paste with digit extraction
            box.addEventListener('paste', (e) => {
                e.preventDefault();
                
                const pastedData = (e.clipboardData || window.clipboardData).getData('text');
                const digits = pastedData.replace(/[^0-9]/g, '').split('');
                
                digits.forEach((digit, offset) => {
                    if (index + offset < digitBoxes.length) {
                        digitBoxes[index + offset].value = digit;
                    }
                });

                let nextEmptyIndex = digitBoxes.findIndex(b => b.value === '');
                if (nextEmptyIndex === -1) {
                    nextEmptyIndex = digitBoxes.length - 1;
                }
                digitBoxes[nextEmptyIndex].focus();

                UI.showAlert('✓ Numbers pasted successfully!', 'success', 2000);
            });
        });

        // Submit form
        document.getElementById('submitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitGuess();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    },

    // Submit a guess
    submitGuess() {
        if (this.gameOver) return;

        const digitBoxes = document.querySelectorAll('.digit-box');
        let inputText = '';
        
        digitBoxes.forEach(box => {
            inputText += box.value;
        });

        // Validation
        if (!inputText || inputText.length === 0) {
            UI.showAlert('No input found!', 'error');
            return;
        }

        if (inputText.length !== 5) {
            UI.showAlert('Please fill all 5 digits!', 'error');
            return;
        }

        if (/[^0-9]/.test(inputText)) {
            UI.showAlert('Only digits 0-9 allowed!', 'error');
            return;
        }

        // Check if max guesses reached
        if (this.totalGuess >= this.maxGuesses) {
            this.endGame(false, inputText);
            return;
        }

        // Count correct digits
        let correct = 0;
        for (let i = 0; i < 5; i++) {
            if (inputText[i] === this.randomNumber[i]) correct++;
        }

        this.totalGuess++;
        UI.updateStats();

        // Check if won
        if (correct === 5) {
            this.endGame(true);
            return;
        }

        // Check if max guesses reached after increment
        if (this.totalGuess >= this.maxGuesses) {
            this.endGame(false, inputText);
            return;
        }

        // Play feedback sound and show result
        if (correct > 0) {
            Sounds.play('correct');
        } else {
            Sounds.play('incorrect');
        }

        UI.addGuessToList(inputText, correct);
        UI.clearInputBoxes();
    },

    // End game - win or lose
    endGame(isWon, lastGuess = null) {
        this.gameOver = true;

        if (isWon) {
            Sounds.play('win');
            const rank = this.getRank(this.totalGuess);
            
            Database.updateScores(this.totalGuess);
            
            Swal.fire({
                title: `${rank.icon} ${rank.name} ${rank.icon}`,
                text: `You guessed the number in ${this.totalGuess} moves!`,
                html: `
                    <div style="text-align: center; margin-top: 20px;">
                        <p><strong>Rank Title:</strong> ${rank.title}</p>
                        <p><strong>Number:</strong> ${this.randomNumber}</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#00c6ff',
                confirmButtonText: 'Play Again'
            }).then(() => {
                this.reset();
            });

            UI.updateStats();
        } else {
            Sounds.play('lose');
            
            Swal.fire({
                title: '☠️ GAME OVER ☠️',
                text: `You couldn't guess the number within ${this.maxGuesses} attempts.`,
                html: `<p style="font-size: 1.5rem; color: #00c6ff; font-weight: bold;">${this.randomNumber}</p>`,
                icon: 'error',
                confirmButtonColor: '#00c6ff',
                confirmButtonText: 'Try Again'
            }).then(() => {
                this.reset();
            });
        }

        UI.toggleButtons(true);
        
        // Focus on first digit box
        const firstBox = document.querySelector('.digit-box');
        if (firstBox) {
            firstBox.focus();
        }
    },

    // Get rank based on guesses
    getRank(guesses) {
        if (guesses <= 5) return { name: 'HACKER', title: 'Totally Unfair', icon: '😈' };
        if (guesses <= 8) return { name: 'LEGEND', title: 'Elite Brain', icon: '👑' };
        if (guesses <= 11) return { name: 'MASTER', title: 'Mind Reader', icon: '🧠' };
        if (guesses <= 14) return { name: 'PRO', title: 'Tactical Player', icon: '🎯' };
        if (guesses <= 17) return { name: 'SKILLED', title: 'Getting Better', icon: '⚡' };
        if (guesses <= 20) return { name: 'BEGINNER', title: 'Learning Mode', icon: '🐣' };
        return { name: 'NOOB', title: 'Try Again', icon: '☠️' };
    },

    // Reset game state
    reset() {
        this.randomNumber = this.generateRandomNumber();
        this.totalGuess = 0;
        this.gameOver = false;
        
        UI.clearInputBoxes();
        UI.clearGuessList();
        UI.updateStats();
        UI.toggleButtons(false);
        
        console.log('🎮 Game reset - Ready to play!');
    },

    // Generate a random 5-digit number
    generateRandomNumber() {
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
};