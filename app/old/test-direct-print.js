/**
 * Direct USB Print Test
 */

const usb = require('usb');

console.log('🖨️  Direct USB Print Test\n');

// Find ICS printer (VID: 0x0FE6, PID: 0x811E)
const device = usb.findByIds(0x0FE6, 0x811E);

if (!device) {
    console.log('❌ Printer tidak ditemukan');
    console.log('Pastikan printer ICS (VID: 0x0FE6) terhubung dan menyala\n');
    process.exit(1);
}

console.log('✅ Printer ICS ditemukan!');

try {
    device.open();
    console.log('✅ Device opened');
    
    const iface = device.interface(0);
    
    if (iface.isKernelDriverActive()) {
        iface.detachKernelDriver();
    }
    
    iface.claim();
    console.log('✅ Interface claimed');
    
    // ESC/POS commands for test print
    const commands = Buffer.from([
        0x1B, 0x40, // Initialize
        0x1B, 0x61, 0x01, // Center align
        0x1B, 0x21, 0x30, // Double height + width
        ...Buffer.from('BTN Syariah\n'),
        0x1B, 0x21, 0x00, // Normal
        ...Buffer.from('Jl. Sopo Del No 56\n'),
        ...Buffer.from('Jakarta Selatan\n'),
        ...Buffer.from('--------------------------------\n'),
        ...Buffer.from('Nomor Antrian\n\n'),
        0x1B, 0x21, 0x30, // Double
        ...Buffer.from('A001\n'),
        0x1B, 0x21, 0x00, // Normal
        ...Buffer.from('\nCUSTOMER SERVICE\n\n'),
        ...Buffer.from(new Date().toLocaleString('id-ID') + '\n'),
        ...Buffer.from('--------------------------------\n'),
        ...Buffer.from('TEST PRINT BERHASIL!\n'),
        0x1D, 0x56, 0x00, // Cut paper
    ]);
    
    const endpoint = iface.endpoint(1);
    
    endpoint.transfer(commands, (error) => {
        if (error) {
            console.error('❌ Transfer error:', error.message);
        } else {
            console.log('✅ Print berhasil dikirim!');
            console.log('📋 Cek printer, struk seharusnya keluar\n');
        }
        
        iface.release(() => {
            device.close();
            process.exit(error ? 1 : 0);
        });
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nCoba run as Administrator\n');
    process.exit(1);
}
