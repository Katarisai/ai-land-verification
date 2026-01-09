#!/usr/bin/env node
// Auto-restart wrapper for chatbot server

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 10;
const RESTART_DELAY = 2000;

function startServer() {
  restartCount++;
  
  if (restartCount > MAX_RESTARTS) {
    console.error(`❌ Server failed to start after ${MAX_RESTARTS} attempts. Giving up.`);
    process.exit(1);
  }

  console.log(`\n🔄 Starting server (attempt ${restartCount}/${MAX_RESTARTS})...`);

  serverProcess = spawn('node', ['chatbot.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  serverProcess.on('close', (code, signal) => {
    if (code !== 0 || signal) {
      console.error(`\n❌ Server crashed with code ${code}, signal ${signal}`);
      console.log(`⏳ Restarting in 2 seconds...`);
      setTimeout(startServer, RESTART_DELAY);
    }
  });

  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err.message);
    setTimeout(startServer, RESTART_DELAY);
  });
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down server...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});
