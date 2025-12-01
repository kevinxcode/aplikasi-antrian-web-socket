/**
 * Test Printer Thermal 58mm
 * 
 * Script standalone untuk test printer tanpa perlu jalankan aplikasi penuh
 * 
 * Cara pakai:
 * node test-printer.js
 */

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

console.log('🔍 Mencari printer USB...\n');

// Cari semua printer USB yang terdeteksi
const devices = escpos.USB.findPrinter();

if (devices.length === 0) {
    console.log('❌ Tidak ada printer thermal yang terdeteksi!');
    console.log('\nTroubleshooting:');
    console.log('1. Pastikan printer sudah dicolok ke USB');
    console.log('2. Pastikan printer dalam keadaan menyala');
    console.log('3. Coba port USB yang berbeda');
    console.log('4. Install driver printer jika diperlukan');
    console.log('5. Di Windows, mungkin perlu install Zadig untuk USB driver');
    process.exit(1);
}

console.log(`✅ Ditemukan ${devices.length} printer:\n`);
devices.forEach((device, index) => {
    console.log(`Printer ${index + 1}:`);
    console.log(`  Vendor ID: 0x${device.deviceDescriptor.idVendor.toString(16)}`);
    console.log(`  Product ID: 0x${device.deviceDescriptor.idProduct.toString(16)}`);
    console.log('');
});

console.log('🖨️  Memulai test print...\n');

// Gunakan printer pertama yang ditemukan
const device = new escpos.USB();

try {
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('❌ Error membuka printer:', error.message);
            console.log('\nJika error LIBUSB_ERROR_ACCESS di Windows:');
            console.log('1. Download Zadig: https://zadig.akeo.ie/');
            console.log('2. Jalankan Zadig');
            console.log('3. Pilih printer dari list');
            console.log('4. Install driver WinUSB');
            console.log('5. Restart aplikasi');
            process.exit(1);
        }
        
        console.log('✅ Printer berhasil dibuka!\n');
        console.log('📄 Mencetak struk test...\n');
        
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
        
        // Print struk
        printer
            .font('a')
            .align('ct')
            .style('normal')
            .size(1, 1)
            .text('BTN Syariah')
            .text('Jl. Sopo Del No 56 Jakarta Selatan')
            .text('--------------------------------')
            .text('Nomor Antrian')
            .text('')
            // Nomor antrian besar (double height & width)
            .size(2, 2)
            .style('b')
            .text('A001')
            .text('')
            // Kembali ke ukuran normal
            .size(1, 1)
            .style('normal')
            .text('CUSTOMER SERVICE')
            .text('')
            .text(dateStr)
            .text('')
            .text('TEST PRINT - BERHASIL!')
            .text('--------------------------------')
            .text('')
            .cut()
            .close(() => {
                console.log('✅ Print berhasil!');
                console.log('\n📋 Cek printer Anda, struk test sudah dicetak.');
                console.log('\nJika struk keluar dengan benar, printer siap digunakan! 🎉');
                process.exit(0);
            });
    });
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
