/**
 * Test Printer Thermal 58mm
 */

const { printer: ThermalPrinter, types: PrinterTypes } = require('node-thermal-printer');

console.log('🖨️  Test Print Thermal Printer\n');

// Create printer instance (auto-detect USB printer)
const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'usb',
    characterSet: 'PC437_USA',
    removeSpecialCharacters: false,
    lineCharacter: "-",
    width: 32  // 58mm paper
});

async function testPrint() {
    try {
        console.log('📄 Mencetak struk test...\n');
        
        const now = new Date();
        const dateStr = now.toLocaleString('id-ID');
        
        printer.alignCenter();
        printer.println('BTN Syariah');
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
        printer.println(dateStr);
        printer.newLine();
        printer.println('TEST PRINT - BERHASIL!');
        printer.drawLine();
        printer.newLine();
        printer.cut();
        
        await printer.execute();
        
        console.log('✅ Print berhasil!');
        console.log('\n📋 Cek printer Anda, struk test sudah dicetak.');
        console.log('\nJika struk keluar dengan benar, printer siap digunakan! 🎉');
        
    } catch (error) {
        console.error('❌ Print error:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Pastikan printer sudah dicolok ke USB');
        console.log('2. Pastikan printer dalam keadaan menyala');
        console.log('3. Coba port USB yang berbeda');
        console.log('4. Di Windows, mungkin perlu install driver printer');
        process.exit(1);
    }
}

testPrint();
