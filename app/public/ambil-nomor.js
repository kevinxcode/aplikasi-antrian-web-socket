// Update clock and date
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

// Load display settings for logo, left image, and marquee
async function loadDisplaySettings() {
    try {
        const response = await fetch('/api/display-settings');
        const result = await response.json();
        
        if (result.success && result.settings) {
            // Update marquee
            if (result.settings.marquee_text) {
                document.getElementById('marqueeText').textContent = result.settings.marquee_text;
            }
            // Update logo
            if (result.settings.logo_base64) {
                const topLogo = document.getElementById('topLogo');
                const footerLogo = document.getElementById('footerLogo');
                if (topLogo) topLogo.src = result.settings.logo_base64;
                if (footerLogo) footerLogo.src = result.settings.logo_base64;
            } else {
                // Fallback to default
                const topLogo = document.getElementById('topLogo');
                const footerLogo = document.getElementById('footerLogo');
                if (topLogo) topLogo.src = 'assets/logo.png';
                if (footerLogo) footerLogo.src = 'assets/logo.png';
            }
            // Update left image
            if (result.settings.left_image_base64) {
                const bgImage = document.getElementById('bgImage');
                if (bgImage) bgImage.src = result.settings.left_image_base64;
            } else {
                // Fallback to default
                const bgImage = document.getElementById('bgImage');
                if (bgImage) bgImage.src = 'assets/bg-left.png';
            }
        }
    } catch (error) {
        console.error('Error loading display settings:', error);
        // Fallback to default on error
        document.getElementById('topLogo').src = 'assets/logo.png';
        document.getElementById('footerLogo').src = 'assets/logo.png';
        document.getElementById('bgImage').src = 'assets/bg-left.png';
    }
}

loadDisplaySettings();

// Ambil nomor antrian
async function ambilNomor(type) {
    try {
        const response = await fetch('/api/add-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });
        
        const result = await response.json();
        if (result.success) {
            const typeName = type === 'teller' ? 'Teller Service' : 'Customer Service';
            document.getElementById('nomorAntrian').textContent = result.queueItem.number;
            document.getElementById('jenisLayanan').textContent = typeName;
            
            const modal = document.getElementById('resultModal');
            modal.classList.add('show');
            
            // Show print error if exists
            if (result.printError) {
                setTimeout(() => {
                    showErrorModal('Nomor antrian berhasil dibuat, tetapi print gagal: ' + result.printError);
                }, 2500);
            }
            
            setTimeout(() => {
                modal.classList.remove('show');
            }, 2000);
        }
    } catch (error) {
        showErrorModal('Gagal mengambil nomor antrian');
    }
}

// Show error modal
function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    const errorModal = document.getElementById('errorModal');
    errorModal.classList.add('show');
    
    setTimeout(() => {
        errorModal.classList.remove('show');
    }, 4000);
}
