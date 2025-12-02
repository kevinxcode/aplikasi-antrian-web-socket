/**
 * Test menggunakan node-thermal-printer
 */

const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

console.log('🖨️  Test Print - Thermal Printer\n');

const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'usb',
    characterSet: 'PC437_USA',
    removeSpecialCharacters: false,
    lineCharacter: "-",
    width: 32
});

async function testPrint() {
    try {
        const isConnected = await printer.isPrinterConnected();
        
        if (!isConnected) {
            console.log('❌ Printer tidak terhubung');
            console.log('Pastikan printer menyala dan terhubung ke USB\n');
            process.exit(1);
        }
        
        console.log('✅ Printer terhubung!');
        console.log('📄 Mencetak struk test...\n');
        
        printer.alignCenter();
        printer.bold(true);
        printer.setTextDoubleHeight();
        printer.println('BTN Syariah');
        printer.bold(false);
        printer.setTextNormal();
        printer.println('Jl. Sopo Del No 56');
        printer.println('Jakarta Selatan');
        printer.drawLine();
        printer.println('Nomor Antrian');
        printer.newLine();
        printer.setTextDoubleHeight();
        printer.setTextDoubleWidth();
        printer.bold(true);
        printer.println('A001');
        printer.bold(false);
        printer.setTextNormal();
        printer.newLine();
        printer.println('CUSTOMER SERVICE');
        printer.newLine();
        printer.println(new Date().toLocaleString('id-ID'));
        printer.drawLine();
        printer.println('TEST PRINT BERHASIL!');
        printer.drawLine();
        printer.newLine();
        printer.cut();
        
        await printer.execute();
        
        console.log('✅ Print berhasil!');
        console.log('📋 Cek printer, struk seharusnya sudah keluar\n');
        console.log('🎉 Printer siap digunakan!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Run as Administrator');
        console.log('2. Restart printer');
        console.log('3. Coba port USB lain\n');
        process.exit(1);
    }
}

testPrint();
