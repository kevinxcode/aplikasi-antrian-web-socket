// Browser-based printing - no thermal printer dependencies needed
// This file is kept for compatibility but no longer used for actual printing

let printerSettings = {
    title: 'BTN Syariah',
    address: 'Jl. ABC DEF No 00 Jakarta Selatan',
    footer_note: '',
    paper_width: '58mm'
};

// Load settings from database
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

// Legacy function - now printing is handled by browser
function printReceipt(queueData, pool) {
    return new Promise(async (resolve, reject) => {
        try {
            // Load latest settings
            await loadPrinterSettings(pool);
            
            // Console log for debugging
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const now = new Date();
            const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const serviceType = queueData.type === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';
            
            console.log('\n🖨️  BROWSER PRINT READY:');
            console.log(`   ${printerSettings.title}`);
            console.log(`   ${printerSettings.address}`);
            console.log(`   Nomor: ${queueData.number}`);
            console.log(`   ${serviceType}`);
            console.log(`   ${dateStr}\n`);
            
            resolve(true);
        } catch (error) {
            console.error('Print preparation error:', error);
            reject(error);
        }
    });
}

module.exports = { printReceipt, loadPrinterSettings };
