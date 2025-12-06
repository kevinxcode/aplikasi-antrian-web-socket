const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { read } = require('read');

read({ prompt: 'Masukkan password baru: ', silent: true, replace: '*' }, (err, newPassword) => {
  if (err) {
    console.error('\n✗ Error:', err.message);
    process.exit(1);
  }

  if (!newPassword || newPassword.trim() === '') {
    console.error('\n✗ Password tidak boleh kosong!');
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
});
