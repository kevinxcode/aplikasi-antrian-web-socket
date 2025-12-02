/**
 * Universal USB Device Detection
 * Mendeteksi SEMUA USB devices termasuk thermal printer
 */

const usb = require('usb');

console.log('🔍 Scanning ALL USB Devices...\n');

const devices = usb.getDeviceList();

console.log(`📊 Total USB devices: ${devices.length}\n`);

if (devices.length === 0) {
    console.log('❌ Tidak ada USB device yang terdeteksi\n');
    process.exit(1);
}

devices.forEach((device, index) => {
    try {
        const desc = device.deviceDescriptor;
        const vendorId = desc.idVendor;
        const productId = desc.idProduct;
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📱 Device #${index + 1}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Vendor ID:  0x${vendorId.toString(16).toUpperCase().padStart(4, '0')} (${vendorId})`);
        console.log(`Product ID: 0x${productId.toString(16).toUpperCase().padStart(4, '0')} (${productId})`);
        
        // Try to get device info
        try {
            device.open();
            
            if (desc.iManufacturer) {
                const manufacturer = device.getStringDescriptor(desc.iManufacturer);
                console.log(`Manufacturer: ${manufacturer}`);
            }
            
            if (desc.iProduct) {
                const product = device.getStringDescriptor(desc.iProduct);
                console.log(`Product: ${product}`);
            }
            
            device.close();
        } catch (e) {
            // Tidak bisa buka device, skip
        }
        
        // Identify printer type
        let deviceType = 'Unknown Device';
        let isPrinter = false;
        
        // Common thermal printer vendors
        if (vendorId === 0x1FC9 || vendorId === 8137) {
            deviceType = '🖨️  RONGTA Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x04B8 || vendorId === 1208) {
            deviceType = '🖨️  EPSON Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x0519 || vendorId === 1305) {
            deviceType = '🖨️  STAR Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x0416 || vendorId === 1046) {
            deviceType = '🖨️  CITIZEN Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x0DD4 || vendorId === 3540) {
            deviceType = '🖨️  CUSTOM Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x0483 || vendorId === 1155) {
            deviceType = '🖨️  Generic Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x6868 || vendorId === 26728) {
            deviceType = '🖨️  ZJ/ZJIANG Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x0FE6 || vendorId === 4070) {
            deviceType = '🖨️  ICS Thermal Printer';
            isPrinter = true;
        } else if (vendorId === 0x20D1 || vendorId === 8401) {
            deviceType = '🖨️  XPRINTER Thermal Printer';
            isPrinter = true;
        }
        
        console.log(`Type: ${deviceType}`);
        
        if (isPrinter) {
            console.log(`\n✅ THERMAL PRINTER TERDETEKSI!`);
            console.log(`Status: Siap digunakan`);
            console.log(`\nUntuk menggunakan printer ini:`);
            console.log(`1. Catat Vendor ID dan Product ID di atas`);
            console.log(`2. Buka Admin Panel > Pengaturan Printer`);
            console.log(`3. Centang "Gunakan USB Print Otomatis"`);
            console.log(`4. Klik "Test Print"`);
        }
        
    } catch (error) {
        console.log(`Error reading device: ${error.message}`);
    }
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
console.log('💡 Tips:');
console.log('- Jika printer Anda tidak terdeteksi, coba:');
console.log('  1. Cabut dan colok ulang kabel USB');
console.log('  2. Coba port USB yang berbeda');
console.log('  3. Restart printer');
console.log('  4. Run script ini as Administrator\n');
