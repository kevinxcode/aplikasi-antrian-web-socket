/**
 * Test Print menggunakan Windows Printer Driver
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🖨️  Test Print - Windows Printer\n');

// ESC/POS Commands
const ESC = '\x1B';
const INIT = ESC + '\x40';
const CENTER = ESC + '\x61\x01';
const BOLD_ON = ESC + '\x45\x01';
const BOLD_OFF = ESC + '\x45\x00';
const TEXT_DOUBLE = "\x1B\x21\x30";
const TEXT_NORMAL = "\x1B\x21\x00";
const CUT = '\x1D\x56\x00';

// Build print data
let printData = '';
printData += INIT;
printData += CENTER;
printData += TEXT_DOUBLE + BOLD_ON;
printData += 'BTN Syariah\n';
printData += BOLD_OFF + TEXT_NORMAL;
printData += 'Jl. Sopo Del No 56\n';
printData += 'Jakarta Selatan\n';
printData += '--------------------------------\n';
printData += 'Nomor Antrian\n\n';
printData += TEXT_DOUBLE + BOLD_ON;
printData += 'A001\n';
printData += BOLD_OFF + TEXT_NORMAL;
printData += '\nCUSTOMER SERVICE\n\n';
printData += new Date().toLocaleString('id-ID') + '\n';
printData += '--------------------------------\n';
printData += 'TEST PRINT BERHASIL!\n';
printData += '--------------------------------\n';
printData += '\n\n\n';
printData += CUT;

// Save to temp file
const tempFile = path.join(__dirname, 'temp_print.prn');
fs.writeFileSync(tempFile, printData, 'binary');

console.log('📄 File print dibuat: temp_print.prn');
console.log('🔍 Mencari printer...\n');

// Get printer list
exec('wmic printer get name', (error, stdout) => {
    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }
    
    const printers = stdout.split('\n')
        .map(line => line.trim())
        .filter(line => line && line !== 'Name');
    
    console.log('📋 Printer yang tersedia:');
    printers.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
    
    // Find thermal printer (biasanya ada kata POS, Thermal, atau brand)
    const thermalPrinter = printers.find(p => 
        p.toLowerCase().includes('pos') || 
        p.toLowerCase().includes('thermal') ||
        p.toLowerCase().includes('ics') ||
        p.toLowerCase().includes('rongta') ||
        p.toLowerCase().includes('epson') ||
        p.toLowerCase().includes('xprinter')
    );
    
    if (thermalPrinter) {
        console.log(`\n✅ Thermal printer ditemukan: ${thermalPrinter}`);
        console.log('📤 Mengirim ke printer...\n');
        
        // Print using copy command
        exec(`copy /b "${tempFile}" "\\\\localhost\\${thermalPrinter}"`, (err) => {
            fs.unlinkSync(tempFile);
            
            if (err) {
                console.error('❌ Print error:', err.message);
                console.log('\nCoba manual:');
                console.log(`copy /b temp_print.prn "\\\\localhost\\${thermalPrinter}"\n`);
            } else {
                console.log('✅ Print berhasil dikirim!');
                console.log('📋 Cek printer, struk seharusnya keluar\n');
            }
        });
    } else {
        console.log('\n⚠️  Thermal printer tidak ditemukan di Windows');
        console.log('\nSolusi:');
        console.log('1. Install printer di Windows (Control Panel > Devices and Printers)');
        console.log('2. Pastikan printer sudah "Ready"');
        console.log('3. Jalankan script ini lagi\n');
        
        fs.unlinkSync(tempFile);
    }
});
