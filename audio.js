/* ==========================================================================
   WEB AUDIO API SOUND FX & BACKGROUND MUSIC ENGINE
   ========================================================================== */

class SoundEngine {
    constructor() {
        this.audioCtx = null;
        this.sfxEnabled = true;
        this.bgmEnabled = false;
        this.bgmInterval = null;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // --- Sound Effects Synthesizer ---
    playPop() {
        if (!this.sfxEnabled) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
    }

    playBuzzer() {
        if (!this.sfxEnabled) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.audioCtx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.25);
    }

    playChime() {
        if (!this.sfxEnabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.08);

            gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(this.audioCtx.currentTime + idx * 0.08);
            osc.stop(this.audioCtx.currentTime + idx * 0.08 + 0.3);
        });
    }

    playFanfare() {
        if (!this.sfxEnabled) return;
        this.init();
        const melody = [
            { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.4 },  { f: 783.99, d: 0.5 }
        ];
        let t = this.audioCtx.currentTime;
        melody.forEach(note => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, t);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(t);
            osc.stop(t + note.d);
            t += note.d;
        });
    }

    // --- Happy Birthday Melodic Synth Background Engine ---
    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        const btn = document.getElementById('bgm-toggle-btn');
        if (this.bgmEnabled) {
            btn.classList.add('active');
            this.startBGM();
        } else {
            btn.classList.remove('active');
            this.stopBGM();
        }
        return this.bgmEnabled;
    }

    startBGM() {
        this.init();
        this.stopBGM();

        // Happy birthday melody notes & duration
        const notes = [
            { f: 264, d: 0.3 }, { f: 264, d: 0.3 }, { f: 297, d: 0.6 }, { f: 264, d: 0.6 }, { f: 352, d: 0.6 }, { f: 330, d: 1.0 },
            { f: 264, d: 0.3 }, { f: 264, d: 0.3 }, { f: 297, d: 0.6 }, { f: 264, d: 0.6 }, { f: 396, d: 0.6 }, { f: 352, d: 1.0 },
            { f: 264, d: 0.3 }, { f: 264, d: 0.3 }, { f: 528, d: 0.6 }, { f: 440, d: 0.6 }, { f: 352, d: 0.6 }, { f: 330, d: 0.6 }, { f: 297, d: 0.6 },
            { f: 466, d: 0.3 }, { f: 466, d: 0.3 }, { f: 440, d: 0.6 }, { f: 352, d: 0.6 }, { f: 396, d: 0.6 }, { f: 352, d: 1.2 }
        ];

        let noteIdx = 0;

        const playNextNote = () => {
            if (!this.bgmEnabled) return;
            const note = notes[noteIdx];

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, this.audioCtx.currentTime + note.d * 0.9);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + note.d * 0.9);

            noteIdx = (noteIdx + 1) % notes.length;
            this.bgmInterval = setTimeout(playNextNote, note.d * 1000);
        };

        playNextNote();
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearTimeout(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        const btn = document.getElementById('sfx-toggle-btn');
        if (this.sfxEnabled) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        return this.sfxEnabled;
    }
}

const sounds = new SoundEngine();
