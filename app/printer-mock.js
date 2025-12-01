// Mock Printer - Untuk Development Tanpa Printer Fisik
// Gunakan file ini jika tidak ada printer atau error Python

let printerSettings = {
    title: 'BTN Syariah',
    address: 'Jl. Sopo Del No 56 Jakarta Selatan',
    footer_note: '',
    paper_width: '58mm'
};

async function loadPrinterSettings(pool) {
    try {
        const result = await pool.query('SELECT * FROM printer_settings ORDER BY id DESC LIMIT 1');
        if (result.rows.length > 0) {
            printerSettings = result.rows[0];
        }
    } catch (error) {
        console.error('Error loading printer settings:', error);
    }
}

function printReceipt(queueData, pool) {
    return new Promise(async (resolve) => {
        try {
            await loadPrinterSettings(pool);
            
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const now = new Date();
            const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const serviceType = queueData.type === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';
            const separator = printerSettings.paper_width === '80mm' 
                ? '================================================' 
                : '========================================';
            const line = printerSettings.paper_width === '80mm'
                ? '------------------------------------------------'
                : '--------------------------------';
            
            console.log(`\n${separator}`);
            console.log(`         MOCK PRINT - STRUK (${printerSettings.paper_width})`);
            console.log(separator);
            console.log(`        ${printerSettings.title}`);
            console.log(printerSettings.address);
            console.log(line);
            console.log('      Nomor Antrian');
            console.log('');
            console.log(`         ${queueData.number}`);
            console.log('');
            console.log(`     ${serviceType}`);
            console.log('');
            console.log(dateStr);
            if (printerSettings.footer_note) {
                console.log('');
                console.log(printerSettings.footer_note);
            }
            console.log(line);
            console.log(`${separator}\n`);
            
            resolve(true);
        } catch (error) {
            console.error('Mock print error:', error);
            resolve(false);
        }
    });
}

module.exports = { printReceipt, loadPrinterSettings };
