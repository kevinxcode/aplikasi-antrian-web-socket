// Pre-load voices
let selectedVoice = null;
let audioEnabled = false;

function loadVoices() {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        selectedVoice = voices.find(v => v.lang.includes('id')) || voices[0];
    }
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

// Try auto-enable audio, show button if blocked
window.addEventListener('load', () => {
    const testUtterance = new SpeechSynthesisUtterance('');
    
    testUtterance.onstart = () => {
        audioEnabled = true;
        console.log('Audio auto-enabled');
    };
    
    testUtterance.onerror = () => {
        showEnableButton();
    };
    
    speechSynthesis.speak(testUtterance);
    
    // Fallback: show button after 1 second if audio not enabled
    setTimeout(() => {
        if (!audioEnabled) {
            showEnableButton();
        }
    }, 1000);
});

function showEnableButton() {
    const btn = document.createElement('button');
    btn.textContent = '🔊 Aktifkan Suara';
    btn.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 15px 30px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;';
    btn.onclick = () => {
        audioEnabled = true;
        speechSynthesis.speak(new SpeechSynthesisUtterance('Suara aktif'));
        btn.remove();
    };
    
    const style = document.createElement('style');
    style.textContent = '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }';
    document.head.appendChild(style);
    
    document.body.appendChild(btn);
}

// Fungsi untuk memutar suara
function playSound(number, counter) {
    // Auto-enable jika belum aktif (untuk kasus lupa klik)
    if (!audioEnabled) {
        audioEnabled = true;
        const btn = document.querySelector('button');
        if (btn) btn.remove();
    }
    
    setTimeout(() => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        setTimeout(() => {
            const text = `Nomor antrian ${number}, silakan menuju loket ${counter}`;
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.95;
            utterance.volume = 1;
            
            if (selectedVoice) utterance.voice = selectedVoice;
            
            speechSynthesis.speak(utterance);
        }, 100);
    }, 50);
}

// WebSocket connection
const socket = io();

socket.on('queueUpdated', (data) => {
    // Update nomor antrian
    document.getElementById('cs1').textContent = data.counters.cs1.current;
    document.getElementById('cs2').textContent = data.counters.cs2.current;
    document.getElementById('t1').textContent = data.counters.t1.current;
    document.getElementById('t2').textContent = data.counters.t2.current;
    
    // Mainkan suara jika ada panggilan baru
    if (data.called) {
        playSound(data.called.number, data.called.counterName || data.called.counter);
    }
});

// Initial load via WebSocket (no polling needed)

// Load display settings
async function loadDisplaySettings() {
    try {
        const response = await fetch('/api/display-settings');
        const result = await response.json();
        
        if (result.success && result.settings) {
            if (result.settings.marquee_text) {
                document.getElementById('marqueeText').textContent = result.settings.marquee_text;
            }
            if (result.settings.logo_base64) {
                const headerLogo = document.getElementById('headerLogo');
                if (headerLogo) headerLogo.src = result.settings.logo_base64;
            } else {
                const headerLogo = document.getElementById('headerLogo');
                if (headerLogo) headerLogo.src = '';
            }
            if (result.settings.left_image_base64) {
                const bgImage = document.getElementById('bgImage');
                if (bgImage) bgImage.src = result.settings.left_image_base64;
            } else {
                const bgImage = document.getElementById('bgImage');
                if (bgImage) bgImage.src = '';
            }
        }
    } catch (error) {
        console.error('Error loading display settings:', error);
        document.getElementById('headerLogo').src = '';
        document.getElementById('bgImage').src = '';
    }
}

// Load settings pertama kali
loadDisplaySettings();

// Listen for settings updates
socket.on('displaySettingsUpdated', (data) => {
    if (data.marquee_text) {
        document.getElementById('marqueeText').textContent = data.marquee_text;
    }
    if (data.logo_base64) {
        const headerLogo = document.getElementById('headerLogo');
        if (headerLogo) headerLogo.src = data.logo_base64;
    }
    if (data.left_image_base64) {
        const bgImage = document.getElementById('bgImage');
        if (bgImage) bgImage.src = data.left_image_base64;
    }
});

// Update waktu real-time
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Update tanggal
function updateDate() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('date').textContent = `${dayName}, ${day} ${month} ${year}`;
}

updateClock();
updateDate();
setInterval(updateClock, 1000);
