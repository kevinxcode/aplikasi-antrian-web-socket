// USB Print Configuration
let usbPrintEnabled = false;

async function loadPrintSettings() {
    try {
        const response = await fetch('/api/printer-settings');
        const result = await response.json();
        if (result.success && result.settings) {
            usbPrintEnabled = result.settings.use_usb_print || result.settings.use_qz_tray || false;
        }
    } catch (error) {
        console.error('Error loading print settings:', error);
    }
}

loadPrintSettings();

function updateDateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById('date').textContent = `${dayName}, ${date} ${month} ${year}`;
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

async function loadDisplaySettings() {
    try {
        const response = await fetch('/api/display-settings');
        const result = await response.json();
        
        if (result.success && result.settings) {
            if (result.settings.marquee_text) {
                document.getElementById('marqueeText').textContent = result.settings.marquee_text;
            }
            if (result.settings.logo_base64) {
                const topLogo = document.getElementById('topLogo');
                const footerLogo = document.getElementById('footerLogo');
                if (topLogo) topLogo.src = result.settings.logo_base64;
                if (footerLogo) footerLogo.src = result.settings.logo_base64;
            }
            if (result.settings.left_image_base64) {
                const bgImage = document.getElementById('bgImage');
                if (bgImage) bgImage.src = result.settings.left_image_base64;
            }
        }
    } catch (error) {
        console.error('Error loading display settings:', error);
    }
}

loadDisplaySettings();

const socket = io();

socket.on('disconnect', () => {
    document.getElementById('disconnectBanner').style.display = 'block';
    document.querySelectorAll('.queue-button').forEach(btn => btn.disabled = true);
});

socket.on('connect', () => {
    document.getElementById('disconnectBanner').style.display = 'none';
    document.querySelectorAll('.queue-button').forEach(btn => btn.disabled = false);
});

async function ambilNomor(type) {
    try {
        const response = await fetch('/api/add-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, autoPrint: usbPrintEnabled })
        });
        
        const result = await response.json();
        if (result.success) {
            const typeName = type === 'teller' ? 'Teller Service' : 'Customer Service';
            document.getElementById('nomorAntrian').textContent = result.queueItem.number;
            document.getElementById('jenisLayanan').textContent = typeName;
            
            const printErrorAlert = document.getElementById('printErrorAlert');
            if (result.printError) {
                document.getElementById('printErrorMessage').textContent = 'Gagal print: ' + result.printError;
                printErrorAlert.style.display = 'block';
            } else {
                printErrorAlert.style.display = 'none';
            }
            
            const modal = document.getElementById('resultModal');
            modal.classList.add('show');
            
            if (!usbPrintEnabled) {
                setTimeout(() => {
                    window.open(`/print-receipt/${result.queueItem.number}`, '_blank', 'width=300,height=400');
                }, 300);
            }
            
            setTimeout(() => {
                modal.classList.remove('show');
            }, result.printError ? 4000 : 2000);
        }
    } catch (error) {
        showErrorModal('Gagal mengambil nomor antrian');
    }
}

function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    const errorModal = document.getElementById('errorModal');
    errorModal.classList.add('show');
    
    setTimeout(() => {
        errorModal.classList.remove('show');
    }, 4000);
}
