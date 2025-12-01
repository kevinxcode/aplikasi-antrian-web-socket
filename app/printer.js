let escpos, USB;
try {
    escpos = require('escpos');
    USB = require('escpos-usb');
    escpos.USB = USB;
} catch (error) {
    console.warn('⚠️  Printer libraries not available, using mock mode');
    console.warn('   To enable real printer: install Python and run "npm install"');
}

let printerSettings = {
    title: 'BTN Syariah',
    address: 'Jl. ABC DEF No 00 Jakarta Selatan',
    footer_note: '',
    paper_width: '58mm',
    printer_vendor_id: null,
    printer_product_id: null
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

function printReceipt(queueData, pool) {
    return new Promise(async (resolve, reject) => {
        try {
            // Load latest settings
            await loadPrinterSettings(pool);
            
            // Check if printer libraries available
            if (!escpos || !USB) {
                // Mock print to console
                const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                const now = new Date();
                const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const serviceType = queueData.type === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';
                
                console.log('\n🖨️  MOCK PRINT:');
                console.log(`   ${printerSettings.title}`);
                console.log(`   ${printerSettings.address}`);
                console.log(`   Nomor: ${queueData.number}`);
                console.log(`   ${serviceType}`);
                console.log(`   ${dateStr}\n`);
                
                return resolve(true);
            }
            
            // Auto-select printer (atau gunakan vendor/product ID jika ada di settings)
            let device;
            if (printerSettings.printer_vendor_id && printerSettings.printer_product_id) {
                // Manual select dengan Vendor & Product ID
                const vendorId = parseInt(printerSettings.printer_vendor_id, 16);
                const productId = parseInt(printerSettings.printer_product_id, 16);
                device = new escpos.USB(vendorId, productId);
                console.log(`Using specific printer: ${printerSettings.printer_vendor_id}:${printerSettings.printer_product_id}`);
            } else {
                // Auto-select printer pertama
                device = new escpos.USB();
                console.log('Auto-selecting first available printer');
            }
            
            const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
            
            device.open(function(error) {
                if (error) {
                    console.error('Printer error:', error);
                    return reject(error);
                }
                
                // Format tanggal
                const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                const now = new Date();
                const dayName = days[now.getDay()];
                const date = now.getDate();
                const monthName = months[now.getMonth()];
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const dateStr = `${dayName}, ${date} ${monthName} ${year} ${hours}:${minutes}`;
                
                // Tentukan layanan
                const serviceType = queueData.type === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';
                
                // Tentukan lebar garis berdasarkan ukuran kertas
                const separator = printerSettings.paper_width === '80mm' 
                    ? '------------------------------------------------' 
                    : '--------------------------------';
                
                printer
                    .font('a')
                    .align('ct')
                    .style('normal')
                    .size(1, 1)
                    .text(printerSettings.title)
                    .text(printerSettings.address)
                    .text(separator)
                    .text('Nomor Antrian')
                    .text('')
                    // Nomor antrian besar (double height & width)
                    .size(2, 2)
                    .style('b')
                    .text(queueData.number)
                    .text('')
                    // Kembali ke ukuran normal
                    .size(1, 1)
                    .style('normal')
                    .text(serviceType)
                    .text('')
                    .text(dateStr)
                    .text('');
                
                // Tambahkan footer note jika ada
                if (printerSettings.footer_note && printerSettings.footer_note.trim()) {
                    printer.text(printerSettings.footer_note);
                }
                
                printer
                    .text(separator)
                    .text('')
                    .cut()
                    .close(() => {
                        console.log('Print success:', queueData.number);
                        resolve(true);
                    });
            });
        } catch (error) {
            console.error('Print error:', error);
            reject(error);
        }
    });
}

module.exports = { printReceipt, loadPrinterSettings };
