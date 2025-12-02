/**
 * Test Rongta 58mm Series Printer
 * Khusus untuk troubleshooting Rongta printer
 */

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

console.log('🔍 Rongta 58mm Series - Printer Detection Test\n');

try {
    const devices = escpos.USB.findPrinter();
    
    console.log(`📊 Total USB devices ditemukan: ${devices.length}\n`);
    
    if (devices.length === 0) {
        console.log('❌ TIDAK ADA PRINTER USB YANG TERDETEKSI\n');
        console.log('Troubleshooting:');
        console.log('1. Pastikan printer Rongta sudah dicolok ke USB');
        console.log('2. Pastikan printer dalam keadaan menyala (cek lampu indikator)');
        console.log('3. Coba cabut dan colok ulang kabel USB');
        console.log('4. Coba port USB yang berbeda');
        console.log('5. Restart printer dan coba lagi');
        console.log('6. Di Windows, cek Device Manager apakah printer terdeteksi\n');
        process.exit(1);
    }
    
    devices.forEach((device, index) => {
        const vendorId = device.deviceDescriptor.idVendor;
        const productId = device.deviceDescriptor.idProduct;
        
        console.log(`🖨️  Printer #${index + 1}:`);
        console.log(`   Vendor ID:  0x${vendorId.toString(16).toUpperCase()} (${vendorId})`);
        console.log(`   Product ID: 0x${productId.toString(16).toUpperCase()} (${productId})`);
        
        // Check if it's Rongta
        if (vendorId === 8137 || vendorId === 0x1fc9) {
            console.log(`   ✅ RONGTA 58MM SERIES TERDETEKSI!`);
            console.log(`   Status: IDLE - Siap digunakan`);
        } else {
            console.log(`   ℹ️  Thermal Printer (bukan Rongta)`);
        }
        console.log('');
    });
    
    // Try to print test
    console.log('📄 Mencoba test print ke printer pertama...\n');
    
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    
    device.open(function(error) {
        if (error) {
            console.error('❌ Gagal membuka koneksi printer:', error.message);
            console.log('\nKemungkinan penyebab:');
            console.log('- Printer sedang digunakan aplikasi lain');
            console.log('- Driver printer belum terinstall');
            console.log('- Permission USB tidak cukup (coba run as Administrator)\n');
            process.exit(1);
        }
        
        console.log('✅ Koneksi printer berhasil dibuka!');
        console.log('🖨️  Mencetak struk test...\n');
        
        printer
            .align('CT')
            .style('B')
            .size(1, 1)
            .text('RONGTA 58MM TEST')
            .style('NORMAL')
            .size(0, 0)
            .text('--------------------------------')
            .text('Printer: Rongta 58mm Series')
            .text('Status: Connected & Working')
            .text('--------------------------------')
            .text('Nomor Antrian Test')
            .size(2, 2)
            .style('B')
            .text('A001')
            .size(0, 0)
            .style('NORMAL')
            .text('CUSTOMER SERVICE')
            .text(new Date().toLocaleString('id-ID'))
            .text('--------------------------------')
            .text('Test Print Berhasil!')
            .feed(3)
            .cut()
            .close();
        
        console.log('✅ Test print berhasil dikirim ke printer!');
        console.log('📋 Cek printer Anda, struk test seharusnya sudah keluar.\n');
        console.log('🎉 Printer Rongta 58mm Series siap digunakan!\n');
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPastikan:');
    console.log('1. npm install sudah dijalankan');
    console.log('2. Printer terhubung ke USB');
    console.log('3. Driver printer sudah terinstall\n');
    process.exit(1);
}
