// ==================== DATABASE.JS - IndexedDB Management ====================

const Database = {
    db: null,
    data: {
        id: 1,
        best: null,
        better: null,
        good: null,
        totalGames: 0,
        totalWins: 0,
        totalGuesses: 0
    },

    // Initialize database
    init() {
        const request = indexedDB.open('guessTheNumberDB', 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('scores')) {
                const store = db.createObjectStore('scores', { keyPath: 'id' });
                store.add(this.data);
            }
        };

        request.onsuccess = (e) => {
            this.db = e.target.result;
            this.loadScores();
            console.log('✓ Database initialized');
        };

        request.onerror = () => {
            console.error('Failed to open database');
        };
    },

    // Load scores from database
    loadScores() {
        const transaction = this.db.transaction('scores', 'readonly');
        const store = transaction.objectStore('scores');
        const request = store.get(1);

        request.onsuccess = (e) => {
            const record = e.target.result;
            if (record) {
                this.data.best = record.best;
                this.data.better = record.better;
                this.data.good = record.good;
                this.data.totalGames = record.totalGames || 0;
                this.data.totalWins = record.totalWins || 0;
                this.data.totalGuesses = record.totalGuesses || 0;
                console.log('✓ Scores loaded:', this.data);
            }
        };
    },

    // Update scores in database
    updateScores(moves) {
        let changed = false;

        if (this.data.best === null || moves < this.data.best) {
            this.data.good = this.data.better;
            this.data.better = this.data.best;
            this.data.best = moves;
            changed = true;
        } else if (this.data.better === null || moves < this.data.better) {
            this.data.good = this.data.better;
            this.data.better = moves;
            changed = true;
        } else if (this.data.good === null || moves < this.data.good) {
            this.data.good = moves;
            changed = true;
        }

        if (!changed) return;

        const transaction = this.db.transaction('scores', 'readwrite');
        const store = transaction.objectStore('scores');

        store.put({
            id: 1,
            best: this.data.best,
            better: this.data.better,
            good: this.data.good,
            totalGames: this.data.totalGames,
            totalWins: this.data.totalWins,
            totalGuesses: this.data.totalGuesses
        });

        transaction.oncomplete = () => {
            console.log('✓ Scores updated:', this.data);
            UI.updateScoresDisplay();
        };

        transaction.onerror = () => {
            console.error('Failed to update scores');
        };
    },

    // Track a valid game submission
    trackValidSubmission(guesses, isWin) {
        this.data.totalGames++;
        this.data.totalGuesses += guesses;
        if (isWin) {
            this.data.totalWins++;
        }

        const transaction = this.db.transaction('scores', 'readwrite');
        const store = transaction.objectStore('scores');

        store.put({
            id: 1,
            best: this.data.best,
            better: this.data.better,
            good: this.data.good,
            totalGames: this.data.totalGames,
            totalWins: this.data.totalWins,
            totalGuesses: this.data.totalGuesses
        });

        transaction.oncomplete = () => {
            console.log('✓ Game stats updated:', {
                total: this.data.totalGames,
                wins: this.data.totalWins,
                totalGuesses: this.data.totalGuesses
            });
        };

        transaction.onerror = () => {
            console.error('Failed to update game stats');
        };
    },

    // Get statistics
    getStats() {
        const avgGuess = this.data.totalGames > 0 ? (this.data.totalGuesses / this.data.totalGames).toFixed(1) : 0;
        const winRatio = this.data.totalGames > 0 ? ((this.data.totalWins / this.data.totalGames) * 100).toFixed(1) : 0;
        
        // Overall rank based on avg guess (lower is better)
        let overallRank = 'Unranked';
        if (this.data.totalGames > 0) {
            if (avgGuess <= 10) overallRank = 'S - Master';
            else if (avgGuess <= 15) overallRank = 'A - Expert';
            else if (avgGuess <= 20) overallRank = 'B - Advanced';
            else if (avgGuess <= 30) overallRank = 'C - Intermediate';
            else overallRank = 'D - Beginner';
        }

        return {
            overallRank,
            totalGames: this.data.totalGames,
            completedGames: this.data.totalWins,
            winRatio,
            avgGuess
        };
    },

    // Reset database
    resetDatabase() {
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction('scores', 'readwrite');
                const store = transaction.objectStore('scores');
                const deleteRequest = store.delete(1);

                deleteRequest.onsuccess = () => {
                    console.log('✓ Record deleted, now adding fresh data');
                    
                    // Reinitialize data
                    this.data = {
                        id: 1,
                        best: null,
                        better: null,
                        good: null,
                        totalGames: 0,
                        totalWins: 0,
                        totalGuesses: 0
                    };

                    // Add fresh record
                    const addRequest = store.add(this.data);
                    
                    addRequest.onsuccess = () => {
                        console.log('✓ Database reset successfully', this.data);
                        UI.updateScoresDisplay();
                        resolve(true);
                    };

                    addRequest.onerror = (e) => {
                        console.error('Failed to reinitialize database:', e.target.error);
                        reject(false);
                    };
                };

                deleteRequest.onerror = (e) => {
                    console.error('Failed to delete record:', e.target.error);
                    reject(false);
                };

                transaction.onerror = (e) => {
                    console.error('Transaction error:', e.target.error);
                    reject(false);
                };
            } catch (error) {
                console.error('Error in resetDatabase:', error);
                reject(false);
            }
        });
    }
};