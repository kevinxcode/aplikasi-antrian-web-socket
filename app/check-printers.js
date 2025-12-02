/**
 * Script untuk cek printer yang terpasang
 * Jalankan: node check-printers.js
 */

const { printer: ThermalPrinter, types: PrinterTypes } = require('node-thermal-printer');

console.log('🔍 Mencari printer USB...\n');

// Test dengan auto-detect
const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'usb',
    characterSet: 'PC437_USA',
    removeSpecialCharacters: false,
    lineCharacter: "-",
    width: 32
});

async function checkPrinter() {
    try {
        // Try to get printer status
        const isConnected = await printer.isPrinterConnected();
        
        if (isConnected) {
            console.log('✅ Printer thermal terdeteksi dan siap digunakan!\n');
            console.log('📝 Catatan:');
            console.log('- Printer akan dipilih otomatis');
            console.log('- Gunakan "node test-printer.js" untuk test print');
            console.log('- Jika ada masalah, pastikan driver printer sudah terinstall\n');
        } else {
            console.log('❌ Tidak ada printer thermal yang terdeteksi\n');
            console.log('Troubleshooting:');
            console.log('1. Pastikan printer sudah dicolok ke USB');
            console.log('2. Pastikan printer dalam keadaan menyala');
            console.log('3. Coba port USB yang berbeda');
            console.log('4. Install driver printer jika diperlukan\n');
        }
    } catch (error) {
        console.log('⚠️  Tidak dapat mendeteksi printer');
        console.log('Error:', error.message);
        console.log('\nPastikan:');
        console.log('1. Printer sudah terhubung ke USB');
        console.log('2. Driver printer sudah terinstall');
        console.log('3. Printer dalam keadaan menyala\n');
    }
}

checkPrinter();
