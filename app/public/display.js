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

// Slideshow otomatis
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Ganti slide setiap 5 detik
setInterval(nextSlide, 5000);

// Update waktu real-time
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);
