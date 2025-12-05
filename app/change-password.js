const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Masukkan password baru: ', (newPassword) => {
  if (!newPassword || newPassword.trim() === '') {
    console.error('\n✗ Password tidak boleh kosong!');
    rl.close();
    process.exit(1);
  }

  const configPath = path.join(__dirname, 'password-config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const newLine = `const MASTER_PASSWORD_HASH = crypto.createHash('sha256').update('${newPassword}').digest('hex');`;
  const updatedContent = configContent.replace(
    /const MASTER_PASSWORD_HASH = .+;/,
    newLine
  );
  
  fs.writeFileSync(configPath, updatedContent);
  
  console.log('\n✓ Password berhasil diganti!');
  console.log(`✓ Password baru: ${newPassword}`);
  
  rl.close();
});
