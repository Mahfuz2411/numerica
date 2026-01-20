// ==================== SOUNDS.JS - Sound Effect Management ====================

const Sounds = {
    audioContext: null,

    // Initialize audio context
    init() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio context not supported');
            }
        }
    },

    // Play sound by type
    play(soundType) {
        this.init();
        if (!this.audioContext) return;

        let notes = [];
        let duration = 0;

        switch (soundType) {
            case 'correct':
                // Success beep - rising tones
                notes = [
                    { freq: 523, start: 0, duration: 0.15 },
                    { freq: 659, start: 0.2, duration: 0.15 }
                ];
                duration = 0.35;
                break;

            case 'incorrect':
                // Error buzz - falling tones
                notes = [
                    { freq: 400, start: 0, duration: 0.15 },
                    { freq: 300, start: 0.2, duration: 0.15 }
                ];
                duration = 0.35;
                break;

            case 'win':
                // Victory fanfare - rising melody
                notes = [
                    { freq: 523, start: 0, duration: 0.15 },
                    { freq: 659, start: 0.2, duration: 0.15 },
                    { freq: 784, start: 0.4, duration: 0.15 },
                    { freq: 988, start: 0.6, duration: 0.4 }
                ];
                duration = 1;
                break;

            case 'lose':
                // Sad trombone - falling melody
                notes = [
                    { freq: 400, start: 0, duration: 0.2 },
                    { freq: 300, start: 0.25, duration: 0.2 },
                    { freq: 200, start: 0.5, duration: 0.3 }
                ];
                duration = 0.8;
                break;

            default:
                return;
        }

        this.playNotes(notes);
    },

    // Play notes with oscillators
    playNotes(notes) {
        const now = this.audioContext.currentTime;

        notes.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.frequency.value = note.freq;
            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            const startTime = now + note.start;
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

            osc.start(startTime);
            osc.stop(startTime + note.duration);
        });
    }
};