/**
 * Test Print untuk ICS Thermal Printer
 * VID: 0x0FE6, PID: 0x811E
 */

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

console.log('🖨️  Test Print - ICS Thermal Printer\n');

try {
    // Auto-detect printer
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    
    device.open(function(error) {
        if (error) {
            console.error('❌ Gagal membuka printer:', error.message);
            console.log('\nTroubleshooting:');
            console.log('1. Pastikan printer menyala');
            console.log('2. Coba run as Administrator');
            console.log('3. Restart printer dan coba lagi\n');
            process.exit(1);
        }
        
        console.log('✅ Koneksi printer berhasil!');
        console.log('📄 Mencetak struk test...\n');
        
        const now = new Date();
        const dateStr = now.toLocaleString('id-ID');
        
        printer
            .align('CT')
            .style('B')
            .size(1, 1)
            .text('BTN Syariah')
            .style('NORMAL')
            .size(0, 0)
            .text('Jl. Sopo Del No 56')
            .text('Jakarta Selatan')
            .text('--------------------------------')
            .text('Nomor Antrian')
            .text('')
            .size(2, 2)
            .style('B')
            .text('A001')
            .style('NORMAL')
            .size(0, 0)
            .text('')
            .text('CUSTOMER SERVICE')
            .text('')
            .text(dateStr)
            .text('--------------------------------')
            .text('TEST PRINT BERHASIL!')
            .text('Printer: ICS Thermal')
            .text('VID: 0x0FE6 | PID: 0x811E')
            .text('--------------------------------')
            .feed(3)
            .cut()
            .close();
        
        console.log('✅ Print berhasil dikirim!');
        console.log('📋 Cek printer, struk test seharusnya keluar.\n');
        console.log('🎉 Printer siap digunakan!\n');
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPastikan:');
    console.log('1. Printer terhubung ke USB');
    console.log('2. Printer dalam keadaan menyala');
    console.log('3. npm install sudah dijalankan\n');
    process.exit(1);
}
