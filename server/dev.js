/**
 * Unified Development Runner
 * Concurrently spawns the backend server (port 3001) and Vite dev server (port 5173)
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';
const nodeCmd = process.execPath;

console.log('[DevRunner] Starting Backend Server (port 3001)...');
const backend = spawn(nodeCmd, ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001' }
});

console.log('[DevRunner] Starting Vite Frontend (port 5173)...');
const frontend = spawn(npxCmd, ['vite'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env
});

const cleanup = () => {
  console.log('\n[DevRunner] Shutting down development processes...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[DevRunner] Backend exited with code ${code}`);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[DevRunner] Frontend exited with code ${code}`);
  }
});
