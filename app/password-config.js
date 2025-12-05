const crypto = require('crypto');

// GANTI PASSWORD INI!
const MASTER_PASSWORD_HASH = crypto.createHash('sha256').update('alnizar15').digest('hex');

function verifyPassword(inputPassword) {
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
  return inputHash === MASTER_PASSWORD_HASH;
}

function setPassword(newPassword) {
  const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  console.log('\nSimpan hash ini ke password-config.js:');
  console.log(`const MASTER_PASSWORD_HASH = '${newHash}';`);
}

module.exports = { verifyPassword, setPassword };
