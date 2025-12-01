// Fungsi untuk memutar suara
function playSound(number, counter) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `Nomor antrian ${number}, silakan menuju loket ${counter}`;
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => 
        voice.lang === 'id-ID' || 
        voice.lang === 'id_ID' || 
        voice.name.includes('Indonesia')
    );
    
    if (indonesianVoice) {
        utterance.voice = indonesianVoice;
    }
    
    speechSynthesis.speak(utterance);
}

// Load voices
speechSynthesis.getVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
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

// Fungsi untuk fetch data antrian (fallback)
async function fetchQueueData() {
    try {
        const response = await fetch('/api/queue');
        const data = await response.json();
        
        document.getElementById('cs1').textContent = data.cs1;
        document.getElementById('cs2').textContent = data.cs2;
        document.getElementById('t1').textContent = data.t1;
        document.getElementById('t2').textContent = data.t2;
        
    } catch (error) {
        console.error('Error fetching queue data:', error);
    }
}

// Fetch data pertama kali
fetchQueueData();

// Fetch data setiap 3 detik sebagai fallback
setInterval(fetchQueueData, 3000);

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
