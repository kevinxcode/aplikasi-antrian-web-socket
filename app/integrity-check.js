const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { verifyPassword } = require('./password-config');

const protectedFiles = {
  'index.js': '',
  'db.js': '',
  'print_api.php': '',
  'public/admin.html': '',
  'public/login.html': ''
};

function generateHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function initHashes() {
  const hashes = {};
  for (const file in protectedFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      hashes[file] = generateHash(fullPath);
    }
  }
  const hashPath = path.join(__dirname, 'file-hashes.json');
  fs.writeFileSync(hashPath, JSON.stringify(hashes, null, 2));
  console.log('✓ Hash file generated');
}

function checkIntegrity() {
  const hashPath = path.join(__dirname, 'file-hashes.json');
  if (!fs.existsSync(hashPath)) {
    console.error('✗ Hash file not found. Run: node integrity-check.js init');
    process.exit(1);
  }

  const savedHashes = JSON.parse(fs.readFileSync(hashPath));
  let modified = false;

  for (const file in savedHashes) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const currentHash = generateHash(fullPath);
      if (currentHash !== savedHashes[file]) {
        console.error(`✗ UNAUTHORIZED MODIFICATION: ${file}`);
        modified = true;
      }
    }
  }

  if (modified) {
    console.error('\n✗ File integrity check FAILED!');
    process.exit(1);
  }

  console.log('✓ All files verified');
}

async function promptPassword(action) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    process.stdout.write(`Enter password to ${action}: `);
    
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', (char) => {
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        process.stdout.write('\n');
        rl.close();
        resolve(password);
      } else if (char === '\u0003') {
        process.exit();
      } else if (char === '\u007f' || char === '\b') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        password += char;
        process.stdout.write('*');
      }
    });
  });
}

if (require.main === module) {
  const command = process.argv[2];
  
  (async () => {
    if (command === 'init') {
      const password = await promptPassword('protect files');
      if (verifyPassword(password)) {
        initHashes();
        console.log('✓ Files protected successfully');
      } else {
        console.error('✗ Wrong password!');
        process.exit(1);
      }
    } else if (command === 'unprotect') {
      const password = await promptPassword('unprotect files');
      if (verifyPassword(password)) {
        console.log('✓ Password verified. You can now unprotect files.');
        process.exit(0);
      } else {
        console.error('✗ Wrong password!');
        process.exit(1);
      }
    } else {
      checkIntegrity();
    }
  })();
}

module.exports = { checkIntegrity, initHashes };
