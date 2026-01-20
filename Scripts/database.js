// ==================== DATABASE.JS - IndexedDB Management ====================

const Database = {
    db: null,
    data: {
        id: 1,
        best: null,
        better: null,
        good: null
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
            good: this.data.good
        });

        transaction.oncomplete = () => {
            console.log('✓ Scores updated:', this.data);
            UI.updateScoresDisplay();
        };

        transaction.onerror = () => {
            console.error('Failed to update scores');
        };
    }
};