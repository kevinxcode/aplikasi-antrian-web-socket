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
            
            setTimeout(() => {
                modal.classList.remove('show');
            }, 2000);
        }
    } catch (error) {
        alert('Gagal mengambil nomor antrian');
    }
}
