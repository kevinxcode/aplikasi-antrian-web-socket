const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function printReceipt(queueNumber, queueType, settings) {
    return new Promise((resolve, reject) => {
        const serviceType = queueType === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';
        const dateStr = new Date().toLocaleString('id-ID');
        
        // ESC/POS commands
        let data = Buffer.from([
            0x1B, 0x40, // Init
            0x1B, 0x61, 0x01, // Center
            0x1B, 0x21, 0x30, 0x1B, 0x45, 0x01 // Double + Bold
        ]);
        data = Buffer.concat([data, Buffer.from(settings.title + '\n')]);
        data = Buffer.concat([data, Buffer.from([0x1B, 0x45, 0x00, 0x1B, 0x21, 0x00])]);
        data = Buffer.concat([data, Buffer.from(settings.address + '\n')]);
        data = Buffer.concat([data, Buffer.from('--------------------------------\n')]);
        data = Buffer.concat([data, Buffer.from('Nomor Antrian\n\n')]);
        data = Buffer.concat([data, Buffer.from([0x1B, 0x21, 0x30, 0x1B, 0x45, 0x01])]);
        data = Buffer.concat([data, Buffer.from(queueNumber + '\n')]);
        data = Buffer.concat([data, Buffer.from([0x1B, 0x45, 0x00, 0x1B, 0x21, 0x00])]);
        data = Buffer.concat([data, Buffer.from('\n' + serviceType + '\n\n')]);
        data = Buffer.concat([data, Buffer.from(dateStr + '\n')]);
        data = Buffer.concat([data, Buffer.from('--------------------------------\n')]);
        if (settings.footer) {
            data = Buffer.concat([data, Buffer.from(settings.footer + '\n')]);
        }
        data = Buffer.concat([data, Buffer.from('\n\n\n')]);
        data = Buffer.concat([data, Buffer.from([0x1D, 0x56, 0x00])]); // Cut
        
        // Save to temp file
        const tempFile = path.join(__dirname, 'temp_print.prn');
        fs.writeFileSync(tempFile, data);
        
        // Find printer
        exec('wmic printer get name', (error, stdout) => {
            if (error) {
                fs.unlinkSync(tempFile);
                return reject(new Error('Cannot find printer'));
            }
            
            const printers = stdout.split('\n')
                .map(line => line.trim())
                .filter(line => line && line !== 'Name');
            
            const thermal = printers.find(p => 
                p.toLowerCase().includes('pos') || 
                p.toLowerCase().includes('thermal') ||
                p.toLowerCase().includes('rongta') ||
                p.toLowerCase().includes('epson') ||
                p.toLowerCase().includes('xprinter')
            );
            
            if (!thermal) {
                fs.unlinkSync(tempFile);
                return reject(new Error('No thermal printer found'));
            }
            
            // Print using copy command
            const printCmd = `copy /b "${tempFile}" "\\\\localhost\\${thermal}"`;
            exec(printCmd, (err) => {
                fs.unlinkSync(tempFile);
                
                if (err) {
                    reject(new Error(`Print failed: ${err.message}`));
                } else {
                    console.log(`Print OK: ${thermal}`);
                    resolve();
                }
            });
        });
    });
}

module.exports = { printReceipt };
