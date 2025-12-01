/**
 * Script untuk cek printer yang terpasang
 * Jalankan: node check-printers.js
 */

try {
    const escpos = require('escpos');
    escpos.USB = require('escpos-usb');
    
    console.log('🔍 Mencari printer USB...\n');
    
    const devices = escpos.USB.findPrinter();
    
    if (devices.length === 0) {
        console.log('❌ Tidak ada printer thermal yang terdeteksi\n');
        console.log('Troubleshooting:');
        console.log('1. Pastikan printer sudah dicolok ke USB');
        console.log('2. Pastikan printer dalam keadaan menyala');
        console.log('3. Coba port USB yang berbeda');
        process.exit(1);
    }
    
    console.log(`✅ Ditemukan ${devices.length} printer:\n`);
    
    devices.forEach((device, index) => {
        const vendorId = '0x' + device.deviceDescriptor.idVendor.toString(16).padStart(4, '0');
        const productId = '0x' + device.deviceDescriptor.idProduct.toString(16).padStart(4, '0');
        
        console.log(`Printer ${index + 1}:`);
        console.log(`  Vendor ID:  ${vendorId}`);
        console.log(`  Product ID: ${productId}`);
        console.log(`  Manufacturer: ${device.deviceDescriptor.iManufacturer || 'N/A'}`);
        console.log(`  Product: ${device.deviceDescriptor.iProduct || 'N/A'}`);
        console.log('');
        
        if (index === 0) {
            console.log('  ⭐ Printer ini akan dipilih secara otomatis\n');
        }
    });
    
    console.log('📝 Catatan:');
    console.log('- Printer pertama akan dipilih otomatis');
    console.log('- Jika ingin pilih printer spesifik, gunakan Vendor ID & Product ID');
    console.log('- Contoh: new escpos.USB(0x04b8, 0x0e15)\n');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPastikan dependencies sudah terinstall:');
    console.log('npm install escpos escpos-usb');
}
