const { spawn } = require('child_process');

// Kill any existing node processes
const killProcess = spawn('taskkill', ['/f', '/im', 'node.exe'], { stdio: 'inherit' });

killProcess.on('close', () => {
  console.log('Starting server...');
  
  // Start the server
  const server = spawn('node', ['index.js'], { 
    stdio: 'inherit',
    cwd: __dirname
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });
});