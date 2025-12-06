const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { verifyPassword } = require('./password-config');
const { read } = require('read');

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
  return new Promise((resolve, reject) => {
    read({
      prompt: `Enter password to ${action}: `,
      silent: true,
      replace: '*',
      input: process.stdin,
      output: process.stdout
    }, (err, password) => {
      if (err) reject(err);
      else resolve(password);
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
