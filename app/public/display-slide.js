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

socket.on('disconnect', () => {
    document.getElementById('disconnectBanner').style.display = 'block';
});

socket.on('connect', () => {
    document.getElementById('disconnectBanner').style.display = 'none';
});


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

// Slideshow variables
let slides = [];
let currentSlide = 0;
let slideInterval = null;

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
                document.querySelector('.header-logo img').src = result.settings.logo_base64;
            }
        }
    } catch (error) {
        console.error('Error loading display settings:', error);
    }
}

async function loadSlides() {
    try {
        const response = await fetch('/api/slides');
        const result = await response.json();
        
        if (result.success && result.slides && result.slides.length > 0) {
            slides = result.slides;
            const container = document.querySelector('.slideshow-container');
            container.innerHTML = '';
            
            slides.forEach((slide, index) => {
                const img = document.createElement('img');
                img.src = slide.image_base64;
                img.className = index === 0 ? 'slide active' : 'slide';
                img.alt = `Slide ${index + 1}`;
                container.appendChild(img);
            });
            
            if (slideInterval) clearInterval(slideInterval);
            if (slides.length > 1) {
                currentSlide = 0;
                slideInterval = setInterval(nextSlide, 5000);
            }
        }
    } catch (error) {
        console.error('Error loading slides:', error);
    }
}

function nextSlide() {
    const slideElements = document.querySelectorAll('.slide');
    if (slideElements.length === 0) return;
    
    slideElements[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slideElements.length;
    slideElements[currentSlide].classList.add('active');
}

// Load settings pertama kali
loadDisplaySettings();
loadSlides();

setTimeout(async () => {
    try {
        const response = await fetch('/api/premium-status');
        const result = await response.json();
        
        if (result.success && !result.is_activated) {
            const modal = document.getElementById('premiumModal');
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error checking premium status:', error);
    }
}, 60000);

// Listen for settings updates
socket.on('displaySettingsUpdated', (data) => {
    if (data.marquee_text) {
        document.getElementById('marqueeText').textContent = data.marquee_text;
    }
    if (data.logo_base64) {
        document.querySelector('.header-logo img').src = data.logo_base64;
    }
});

socket.on('slidesUpdated', () => {
    loadSlides();
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
