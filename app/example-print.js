/**
 * Contoh Kode Lengkap - Print Struk Thermal 58mm
 * 
 * File ini berisi contoh lengkap cara menggunakan printer thermal
 * dengan berbagai variasi format dan style.
 * 
 * Cara pakai:
 * node example-print.js
 */

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

// Contoh 1: Print Struk Sederhana
function printSimple() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        printer
            .font('a')
            .align('ct')
            .text('Struk Sederhana')
            .text('A001')
            .cut()
            .close();
    });
}

// Contoh 2: Print dengan Format Lengkap (Seperti di Aplikasi)
function printFull() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        // Format tanggal Indonesia
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const now = new Date();
        const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
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
            // Nomor besar
            .size(2, 2)
            .style('b')
            .text('A001')
            .text('')
            // Kembali normal
            .size(1, 1)
            .style('normal')
            .text('CUSTOMER SERVICE')
            .text('')
            .text(dateStr)
            .text('')
            .text('Terima kasih atas kunjungan Anda')
            .text('--------------------------------')
            .text('')
            .cut()
            .close();
    });
}

// Contoh 3: Print dengan Berbagai Style
function printStyles() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        printer
            .font('a')
            .align('ct')
            
            // Normal
            .style('normal')
            .size(1, 1)
            .text('Text Normal')
            .text('')
            
            // Bold
            .style('b')
            .text('Text Bold')
            .text('')
            
            // Underline
            .style('normal')
            .underline(true)
            .text('Text Underline')
            .underline(false)
            .text('')
            
            // Size variations
            .size(1, 1)
            .text('Size 1x1')
            .size(2, 1)
            .text('Size 2x1 (Wide)')
            .size(1, 2)
            .text('Size 1x2 (Tall)')
            .size(2, 2)
            .text('Size 2x2')
            .text('')
            
            // Alignment
            .size(1, 1)
            .align('lt')
            .text('Left Align')
            .align('ct')
            .text('Center Align')
            .align('rt')
            .text('Right Align')
            .text('')
            
            .cut()
            .close();
    });
}

// Contoh 4: Print dengan Garis dan Spasi
function printWithLines() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        printer
            .font('a')
            .align('ct')
            .size(1, 1)
            
            // Garis penuh
            .text('================================')
            .text('Garis Penuh')
            .text('================================')
            .text('')
            
            // Garis putus-putus
            .text('--------------------------------')
            .text('Garis Putus-putus')
            .text('--------------------------------')
            .text('')
            
            // Garis titik-titik
            .text('................................')
            .text('Garis Titik-titik')
            .text('................................')
            .text('')
            
            // Spasi kosong
            .text('')
            .text('')
            .text('Spasi Kosong di Atas')
            .text('')
            
            .cut()
            .close();
    });
}

// Contoh 5: Print Tabel Sederhana
function printTable() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        printer
            .font('a')
            .size(1, 1)
            .align('ct')
            .text('DAFTAR ANTRIAN')
            .text('--------------------------------')
            
            // Header tabel
            .align('lt')
            .text('No.   Nama           Status')
            .text('--------------------------------')
            
            // Data tabel
            .text('A001  John Doe       Waiting')
            .text('A002  Jane Smith     Called')
            .text('A003  Bob Johnson    Waiting')
            .text('--------------------------------')
            
            .align('ct')
            .text('Total: 3 antrian')
            .text('')
            
            .cut()
            .close();
    });
}

// Contoh 6: Print dengan Barcode (Opsional - perlu setup)
function printWithBarcode() {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        printer
            .font('a')
            .align('ct')
            .size(1, 1)
            .text('Struk dengan Barcode')
            .text('')
            
            // Print barcode
            .barcode('A001', 'CODE39', {
                width: 2,
                height: 50,
                position: 'BELOW',
                font: 'A'
            })
            .text('')
            
            .cut()
            .close();
    });
}

// Contoh 7: Print Multiple Copies
function printMultiple(copies = 3) {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
    
    device.open(function(error) {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        for (let i = 1; i <= copies; i++) {
            printer
                .font('a')
                .align('ct')
                .size(1, 1)
                .text(`Copy ${i} of ${copies}`)
                .text('A001')
                .text('CUSTOMER SERVICE')
                .text('')
                .cut();
        }
        
        printer.close();
    });
}

// Contoh 8: Print dengan Error Handling
function printWithErrorHandling(queueNumber) {
    return new Promise((resolve, reject) => {
        try {
            const device = new escpos.USB();
            const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
            
            device.open(function(error) {
                if (error) {
                    console.error('Printer error:', error);
                    return reject(error);
                }
                
                printer
                    .font('a')
                    .align('ct')
                    .size(2, 2)
                    .text(queueNumber)
                    .text('')
                    .cut()
                    .close(() => {
                        console.log('Print success:', queueNumber);
                        resolve(true);
                    });
            });
        } catch (error) {
            console.error('Print error:', error);
            reject(error);
        }
    });
}

// Contoh 9: Print dengan Retry Logic
async function printWithRetry(queueNumber, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await printWithErrorHandling(queueNumber);
            console.log('Print berhasil pada percobaan ke-' + (i + 1));
            return true;
        } catch (error) {
            console.log(`Percobaan ${i + 1} gagal:`, error.message);
            if (i < maxRetries - 1) {
                console.log('Mencoba lagi dalam 2 detik...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.error('Print gagal setelah ' + maxRetries + ' percobaan');
    return false;
}

// Contoh 10: Cek Printer Tersedia
function checkPrinter() {
    console.log('Mencari printer...');
    const devices = escpos.USB.findPrinter();
    
    if (devices.length === 0) {
        console.log('Tidak ada printer yang terdeteksi');
        return false;
    }
    
    console.log(`Ditemukan ${devices.length} printer:`);
    devices.forEach((device, index) => {
        console.log(`${index + 1}. Vendor: 0x${device.deviceDescriptor.idVendor.toString(16)}, Product: 0x${device.deviceDescriptor.idProduct.toString(16)}`);
    });
    
    return true;
}

// Menu untuk memilih contoh
console.log('=================================');
console.log('Contoh Print Thermal 58mm');
console.log('=================================\n');
console.log('Pilih contoh yang ingin dijalankan:');
console.log('1. Print Sederhana');
console.log('2. Print Lengkap (Seperti Aplikasi)');
console.log('3. Print Berbagai Style');
console.log('4. Print dengan Garis');
console.log('5. Print Tabel');
console.log('6. Print dengan Barcode');
console.log('7. Print Multiple Copies');
console.log('8. Print dengan Error Handling');
console.log('9. Print dengan Retry');
console.log('10. Cek Printer\n');

// Jalankan contoh (ubah angka sesuai yang ingin dicoba)
const example = process.argv[2] || '2';

switch(example) {
    case '1':
        printSimple();
        break;
    case '2':
        printFull();
        break;
    case '3':
        printStyles();
        break;
    case '4':
        printWithLines();
        break;
    case '5':
        printTable();
        break;
    case '6':
        printWithBarcode();
        break;
    case '7':
        printMultiple(3);
        break;
    case '8':
        printWithErrorHandling('A001');
        break;
    case '9':
        printWithRetry('A001');
        break;
    case '10':
        checkPrinter();
        break;
    default:
        console.log('Menjalankan contoh 2 (Print Lengkap)...\n');
        printFull();
}

console.log('\nCara pakai:');
console.log('node example-print.js [nomor]');
console.log('Contoh: node example-print.js 3');
