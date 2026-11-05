const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Giải phóng cổng 4100 và 3001 nếu có tiến trình cũ còn treo
if (isWin) {
  for (const port of [4100, 3001]) {
    try {
      const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const pids = new Set(
        out
          .split(/\r?\n/)
          .map((line) => line.trim().split(/\s+/).pop())
          .filter((pid) => pid && /^\d+$/.test(pid) && pid !== '0')
      );
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
        } catch {
          // ignore
        }
      }
    } catch {
      // port is free
    }
  }
}

console.log('===================================================================');
console.log('  KNOWLEDGE BATTLE - TIKTOK LIVE GAME SHOW (NO DOCKER)');
console.log('===================================================================');
console.log('-> Backend API & Socket.IO : http://localhost:4100');
console.log('-> Streamer Dashboard      : http://localhost:3001/dashboard');
console.log('-> Admin Question Bank     : http://localhost:3001/admin');
console.log('-> OBS Game Show (1920x1080): http://localhost:3001/game/KB2026');
console.log('-> OBS Game Show (1080x1920): http://localhost:3001/game/KB2026?layout=vertical');
console.log('===================================================================\n');

function spawnService(name, colorCode, cwd, args) {
  const proc = spawn(npmCmd, args, {
    cwd,
    shell: true,
    env: process.env,
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    }
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.error(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    }
  });

  proc.on('exit', (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });

  return proc;
}

const be = spawnService('BACKEND', '36', backendDir, ['run', 'start']);
const fe = spawnService('FRONTEND', '35', frontendDir, ['run', 'dev']);

function shutdown() {
  be.kill();
  fe.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

