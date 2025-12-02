/**
 * Test Print dengan Raw ESC/POS Commands
 * Mirip dengan kode React Native yang working
 */

const usb = require('usb');

console.log('🖨️  Test Print - Raw ESC/POS\n');

// Find ICS printer
const device = usb.findByIds(0x0FE6, 0x811E);

if (!device) {
    console.log('❌ Printer tidak ditemukan');
    process.exit(1);
}

console.log('✅ Printer ICS ditemukan!');

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';
const INIT = ESC + '\x40';
const CENTER = ESC + '\x61\x01';
const LEFT = ESC + '\x61\x00';
const BOLD_ON = ESC + '\x45\x01';
const BOLD_OFF = ESC + '\x45\x00';
const CUT = ESC + '\x69';
const TEXT_DOUBLE = "\x1B\x21\x30";
const TEXT_NORMAL = "\x1B\x21\x00";

try {
    device.open();
    console.log('✅ Device opened');
    
    const iface = device.interface(0);
    
    if (iface.isKernelDriverActive()) {
        iface.detachKernelDriver();
    }
    
    iface.claim();
    console.log('✅ Interface claimed');
    
    // Build print data
    let printData = '';
    printData += INIT;
    printData += CENTER;
    printData += TEXT_DOUBLE;
    printData += BOLD_ON;
    printData += 'BTN Syariah\n';
    printData += BOLD_OFF;
    printData += TEXT_NORMAL;
    printData += 'Jl. Sopo Del No 56\n';
    printData += 'Jakarta Selatan\n';
    printData += '--------------------------------\n';
    printData += 'Nomor Antrian\n\n';
    printData += TEXT_DOUBLE;
    printData += BOLD_ON;
    printData += 'A001\n';
    printData += BOLD_OFF;
    printData += TEXT_NORMAL;
    printData += '\nCUSTOMER SERVICE\n\n';
    printData += new Date().toLocaleString('id-ID') + '\n';
    printData += '--------------------------------\n';
    printData += 'TEST PRINT BERHASIL!\n';
    printData += 'Printer: ICS Thermal\n';
    printData += '--------------------------------\n';
    printData += '\n\n\n';
    printData += CUT;
    
    const buffer = Buffer.from(printData, 'binary');
    
    // Find OUT endpoint
    const endpoints = iface.endpoints;
    const outEndpoint = endpoints.find(ep => ep.direction === 'out');
    
    if (!outEndpoint) {
        console.log('❌ OUT endpoint tidak ditemukan');
        process.exit(1);
    }
    
    console.log('📄 Mengirim data ke printer...\n');
    
    // Send in chunks (seperti di React Native)
    const chunkSize = 64;
    let offset = 0;
    
    const sendChunk = () => {
        if (offset >= buffer.length) {
            console.log('✅ Print berhasil dikirim!');
            console.log('📋 Cek printer, struk seharusnya keluar\n');
            
            setTimeout(() => {
                iface.release(() => {
                    device.close();
                    process.exit(0);
                });
            }, 1000);
            return;
        }
        
        const chunk = buffer.slice(offset, offset + chunkSize);
        offset += chunkSize;
        
        outEndpoint.transfer(chunk, (error) => {
            if (error) {
                console.error('❌ Transfer error:', error.message);
                process.exit(1);
            }
            // Send next chunk after small delay
            setTimeout(sendChunk, 10);
        });
    };
    
    sendChunk();
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nCoba:');
    console.log('1. Run as Administrator');
    console.log('2. Restart printer\n');
    process.exit(1);
}
