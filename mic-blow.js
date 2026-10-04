/* ==========================================================================
   MICROPHONE BLOW DETECTION SYSTEM FOR BIRTHDAY CANDLES
   ========================================================================== */

class MicBlowDetector {
    constructor(onBlowCallback) {
        this.onBlow = onBlowCallback;
        this.isListening = false;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.animFrame = null;
    }

    async toggle() {
        if (this.isListening) {
            this.stop();
            return false;
        } else {
            return await this.start();
        }
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);

            this.analyser.fftSize = 512;
            this.microphone.connect(this.analyser);

            this.isListening = true;
            this.listen();
            return true;
        } catch (err) {
            console.error("Microphone access denied or unsupported:", err);
            alert("Microphone permission was not granted or is not supported. You can tap the candles or tap the blow button!");
            return false;
        }
    }

    listen() {
        if (!this.isListening) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average volume in higher wind frequencies
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Threshold for blowing wind noise
        if (average > 45) {
            if (this.onBlow) {
                this.onBlow();
            }
            this.stop();
            return;
        }

        this.animFrame = requestAnimationFrame(() => this.listen());
    }

    stop() {
        this.isListening = false;
        if (this.animFrame) {
            cancelAnimationFrame(this.animFrame);
        }
        if (this.microphone && this.microphone.mediaStream) {
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}
