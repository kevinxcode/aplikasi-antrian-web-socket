# Fix: Python Required for Printer

Error `gyp ERR! find Python` terjadi karena `escpos-usb` perlu compile native modules.

## Solusi 1: Install Python (Recommended)

### Windows:
```bash
# Download Python 3.x dari python.org
# Atau via chocolatey:
choco install python

# Verify:
python --version
```

### Linux/Docker:
```bash
# Tambahkan di Dockerfile
RUN apt-get update && apt-get install -y python3 make g++
```

### Kemudian install:
```bash
cd app
npm install
```

## Solusi 2: Tanpa Python (Alternative)

Gunakan library alternatif yang tidak perlu compile:

### 1. Update package.json:
```json
{
  "dependencies": {
    "node-thermal-printer": "^4.4.5"
  }
}
```

### 2. Update printer.js:
```javascript
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');

async function printReceipt(queueData, pool) {
    try {
        await loadPrinterSettings(pool);
        
        const printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: 'printer:auto',
            characterSet: 'PC858_EURO',
            removeSpecialCharacters: false,
            lineCharacter: "-",
            width: 32
        });

        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const now = new Date();
        const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const serviceType = queueData.type === 'cs' ? 'CUSTOMER SERVICE' : 'TELLER SERVICE';

        printer.alignCenter();
        printer.println(printerSettings.title);
        printer.println(printerSettings.address);
        printer.drawLine();
        printer.println('Nomor Antrian');
        printer.newLine();
        printer.setTextDoubleHeight();
        printer.setTextDoubleWidth();
        printer.bold(true);
        printer.println(queueData.number);
        printer.bold(false);
        printer.setTextNormal();
        printer.newLine();
        printer.println(serviceType);
        printer.newLine();
        printer.println(dateStr);
        if (printerSettings.footer_note) {
            printer.newLine();
            printer.println(printerSettings.footer_note);
        }
        printer.drawLine();
        printer.cut();

        await printer.execute();
        console.log('Print success:', queueData.number);
        return true;
    } catch (error) {
        console.error('Print error:', error);
        throw error;
    }
}

module.exports = { printReceipt, loadPrinterSettings };
```

## Solusi 3: Disable Printer (Development Only)

Jika hanya untuk development tanpa printer fisik:

### Update printer.js:
```javascript
async function printReceipt(queueData, pool) {
    console.log('MOCK PRINT:', queueData.number);
    console.log('Type:', queueData.type);
    console.log('Name:', queueData.name);
    return true; // Mock success
}

async function loadPrinterSettings(pool) {
    // Mock load
    return true;
}

module.exports = { printReceipt, loadPrinterSettings };
```

## Rekomendasi:

- **Production**: Gunakan Solusi 1 (Install Python)
- **Development tanpa printer**: Gunakan Solusi 3 (Mock)
- **Alternative**: Gunakan Solusi 2 (node-thermal-printer)
