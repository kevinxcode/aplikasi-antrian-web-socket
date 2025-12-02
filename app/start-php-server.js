const { spawn } = require('child_process');
const path = require('path');

// Start PHP built-in server
const phpServer = spawn('php', ['-S', 'localhost:3001', '-t', __dirname], {
    stdio: 'inherit'
});

console.log('PHP server started on http://localhost:3001');

phpServer.on('error', (err) => {
    console.error('Failed to start PHP server:', err);
});

process.on('SIGINT', () => {
    phpServer.kill();
    process.exit();
});
