/* ==========================================================================
   NADHEEMA SAFRIN & MOHAMMED ASHAR (35 💖) - SINGLE PAGE CONTROLLER
   ========================================================================== */

let remainingCandles = 5;
let micDetector = null;

document.addEventListener('DOMContentLoaded', () => {
    initSignaturePad();
    initFloatingBalloons();

    // Setup Mic Blow Detector
    micDetector = new MicBlowDetector(() => {
        blowAllCandles();
    });

    document.getElementById('bgm-toggle-btn').addEventListener('click', () => sounds.toggleBGM());
    document.getElementById('sfx-toggle-btn').addEventListener('click', () => sounds.toggleSFX());
});

// Flip Roast Cards
function flipCard(card) {
    sounds.playPop();
    card.classList.toggle('flipped');
}

// Cake & Candle Logic
function extinguishCandle(flameElement, event) {
    if (event) event.stopPropagation();
    if (!flameElement.classList.contains('extinguished')) {
        sounds.playPop();
        flameElement.classList.add('extinguished');
        remainingCandles--;

        if (remainingCandles <= 0) {
            onAllCandlesBlown();
        }
    }
}

function blowAllCandles() {
    sounds.playChime();
    document.querySelectorAll('.flame').forEach(f => {
        f.classList.add('extinguished');
    });
    remainingCandles = 0;
    onAllCandlesBlown();
}

async function toggleMicrophone() {
    const btn = document.getElementById('mic-btn');
    const listening = await micDetector.toggle();
    if (listening) {
        btn.classList.add('btn-primary');
        btn.innerHTML = '<i class="fas fa-microphone-slash"></i> Blow into mic now! 🎤';
    } else {
        btn.classList.remove('btn-primary');
        btn.innerHTML = '<i class="fas fa-microphone"></i> Enable Mic Blow 🎤';
    }
}

function onAllCandlesBlown() {
    sounds.playFanfare();
    triggerConfettiExplosion();
    const inst = document.getElementById('cake-instruction');
    if (inst) inst.innerHTML = '✨ Candles Blown! Wish granted for Nadheema from Ashar! 35 💖 🎉 ✨';
}

// Floating Balloons Messages from Ashar
const balloonMessages = [
    "🎈 35 is our special love symbol forever! 💖",
    "🎈 You bring the brightest smile to Ashar's face! 😊",
    "🎈 Best companion and love of my life! 💕",
    "🎈 Wishing you endless happiness & health! 🌟",
    "🎈 Forever & Always Together • 35! ✨"
];

function initFloatingBalloons() {
    const container = document.getElementById('balloon-container');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#ff4d6d', '#9d4edd', '#ffb703', '#4cc9f0', '#e85d04'];

    balloonMessages.forEach((msg, idx) => {
        const b = document.createElement('div');
        b.className = 'balloon';
        b.style.backgroundColor = colors[idx % colors.length];
        b.style.animationDelay = `${idx * 0.3}s`;
        b.innerHTML = `🎈`;

        b.onclick = () => {
            sounds.playPop();
            b.style.transform = 'scale(1.3)';
            b.style.opacity = '0';
            setTimeout(() => {
                alert(msg);
                b.style.display = 'none';
            }, 200);
        };

        container.appendChild(b);
    });
}

// Gift & Certificate Unboxing
function openGift() {
    sounds.playFanfare();
    triggerConfettiExplosion();
    document.getElementById('gift-wrapper').style.display = 'none';
    document.getElementById('certificate-box').classList.remove('hidden');
}

function downloadCertificate() {
    sounds.playChime();
    const cert = document.getElementById('printable-certificate');
    html2canvas(cert, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Nadheema_Safrin_Love_Certificate_35.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Contract Signature Canvas Pad
let sigCanvas, sigCtx, isDrawing = false;

function initSignaturePad() {
    sigCanvas = document.getElementById('signature-pad');
    if (!sigCanvas) return;
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#6b21a8';
    sigCtx.lineWidth = 3;
    sigCtx.lineCap = 'round';

    function startDraw(e) {
        isDrawing = true;
        const pos = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        const pos = getPos(e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    }

    function stopDraw() { isDrawing = false; }

    function getPos(e) {
        const rect = sigCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    sigCanvas.addEventListener('mousedown', startDraw);
    sigCanvas.addEventListener('mousemove', draw);
    sigCanvas.addEventListener('mouseup', stopDraw);
    sigCanvas.addEventListener('mouseleave', stopDraw);

    sigCanvas.addEventListener('touchstart', startDraw);
    sigCanvas.addEventListener('touchmove', draw);
    sigCanvas.addEventListener('touchend', stopDraw);
}

function clearSignature() {
    sounds.playPop();
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
}

function saveSignature() {
    sounds.playChime();
    triggerConfettiExplosion();
    alert("35 Agreement officially signed & sealed! Mohammed Ashar & Nadheema Safrin forever! 💖✨");
    closeContractModal();
}

function openContractModal() {
    sounds.playPop();
    document.getElementById('contract-modal').classList.remove('hidden');
}

function closeContractModal() {
    sounds.playPop();
    document.getElementById('contract-modal').classList.add('hidden');
}
