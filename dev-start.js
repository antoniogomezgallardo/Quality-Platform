#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PORTS = {
  WEB: 4200,
  API: 3001,
  PRISMA: 5555
};

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function killPortProcesses(ports) {
  return Promise.all(ports.map(port => {
    return new Promise((resolve) => {
      // On Windows, use netstat to find processes and taskkill to terminate
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (!stdout) {
          resolve();
          return;
        }
        
        const lines = stdout.split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const matches = line.match(/\s+(\d+)$/);
          if (matches) {
            pids.add(matches[1]);
          }
        });
        
        if (pids.size === 0) {
          resolve();
          return;
        }
        
        log(`Killing processes on port ${port}: ${Array.from(pids).join(', ')}`, colors.yellow);
        
        const killPromises = Array.from(pids).map(pid => {
          return new Promise((resolvePid) => {
            exec(`taskkill /F /PID ${pid}`, (error) => {
              // Don't throw error if process doesn't exist
              resolvePid();
            });
          });
        });
        
        Promise.all(killPromises).then(resolve);
      });
    });
  }));
}

function killAllNodeProcesses() {
  return new Promise((resolve) => {
    exec(`tasklist /FI "IMAGENAME eq node.exe" /FO CSV`, (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }
      
      const lines = stdout.split('\n').slice(1); // Skip header
      const pids = [];
      
      lines.forEach(line => {
        const match = line.match(/"node\.exe","(\d+)"/);
        if (match) {
          pids.push(match[1]);
        }
      });
      
      if (pids.length === 0) {
        resolve();
        return;
      }
      
      log(`Killing all Node.js processes: ${pids.join(', ')}`, colors.yellow);
      
      const killPromises = pids.map(pid => {
        return new Promise((resolvePid) => {
          exec(`taskkill /F /PID ${pid}`, () => resolvePid());
        });
      });
      
      Promise.all(killPromises).then(resolve);
    });
  });
}

async function cleanupAndStart() {
  try {
    log('🧹 Cleaning up existing processes...', colors.cyan);
    
    // Only kill processes on specific ports (safer approach)
    await killPortProcesses([PORTS.WEB, PORTS.API, PORTS.PRISMA, 3000, 4201, 4202, 4300]);
    
    // Wait a moment for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Then specifically target ports as backup
    await killPortProcesses([PORTS.WEB, PORTS.API, PORTS.PRISMA, 3000, 4201, 4202, 4300]);
    
    // Clean build directories with better error handling
    const dirsToClean = [
      path.join(__dirname, 'web', '.next'),
      path.join(__dirname, 'dist')
    ];
    
    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        try {
          log(`Removing ${dir}`, colors.yellow);
          // Try to remove read-only attributes first
          exec(`attrib -R "${dir}\\*.*" /S /D`, () => {
            try {
              fs.rmSync(dir, { recursive: true, force: true });
            } catch (error) {
              log(`Warning: Could not remove ${dir} (${error.code})`, colors.yellow);
            }
          });
        } catch (error) {
          log(`Warning: Could not remove ${dir} (${error.code})`, colors.yellow);
        }
      }
    }
    
    log('✅ Cleanup completed', colors.green);
    
    // Wait a moment for ports to be freed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log('🚀 Starting development servers...', colors.cyan);
    
    // Start API server
    log(`Starting API server on port ${PORTS.API}...`, colors.blue);
    const apiProcess = spawn('pnpm', ['nx', 'serve', 'api'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        PORT: PORTS.API,
        NODE_OPTIONS: '--inspect=127.0.0.1:9230' // Use different debug port
      }
    });
    
    apiProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Nest application successfully started')) {
        log(`✅ API server ready at http://localhost:${PORTS.API}`, colors.green);
      }
      // Only show important API messages
      if (output.includes('LOG') || output.includes('ERROR') || output.includes('started')) {
        console.log(`${colors.blue}[API]${colors.reset} ${output.trim()}`);
      }
    });
    
    apiProcess.stderr.on('data', (data) => {
      const error = data.toString();
      // Filter out harmless messages and debug info
      if (!error.includes('debugger') &&
          !error.includes('SVGR') &&
          !error.includes('Debugger listening') &&
          !error.includes('For help, see: https://nodejs.org') &&
          !error.includes('ws://localhost')) {
        console.error(`${colors.red}[API ERROR]${colors.reset} ${error.trim()}`);
      }
    });
    
    // Wait for API to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start Web server
    log(`Starting Web server on port ${PORTS.WEB}...`, colors.magenta);
    const webProcess = spawn('pnpm', ['nx', 'serve', 'web', `--port=${PORTS.WEB}`], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        NODE_OPTIONS: '--inspect=127.0.0.1:9231' // Use different debug port
      }
    });
    
    webProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready in')) {
        log(`✅ Web server ready at http://localhost:${PORTS.WEB}`, colors.green);
      }
      // Only show important Web messages
      if (output.includes('Ready') || output.includes('Compiled') || output.includes('Error')) {
        console.log(`${colors.magenta}[WEB]${colors.reset} ${output.trim()}`);
      }
    });
    
    webProcess.stderr.on('data', (data) => {
      const error = data.toString();
      // Filter out harmless messages and debug info
      if (!error.includes('SVGR') &&
          !error.includes('debugger') &&
          !error.includes('Debugger listening') &&
          !error.includes('For help, see: https://nodejs.org') &&
          !error.includes('ws://localhost')) {
        console.error(`${colors.red}[WEB ERROR]${colors.reset} ${error.trim()}`);
      }
    });
    
    log('🎉 Development environment is starting up!', colors.green);
    log(`📱 Web App: http://localhost:${PORTS.WEB}`, colors.cyan);
    log(`🔌 API: http://localhost:${PORTS.API}`, colors.cyan);
    log(`📊 API Docs: http://localhost:${PORTS.API}/api/docs`, colors.cyan);
    log('', colors.reset);
    log('Press Ctrl+C to stop all servers', colors.yellow);
    
    // Handle cleanup on exit
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down servers...', colors.yellow);
      apiProcess.kill();
      webProcess.kill();
      process.exit();
    });
    
  } catch (error) {
    // Don't fail completely for permission errors during cleanup
    if (error.code === 'EPERM' || error.message.includes('EPERM')) {
      log(`⚠️ Warning: ${error.message}`, colors.yellow);
      log('⚠️ Continuing with startup despite permission issues...', colors.yellow);
    } else {
      log(`❌ Error: ${error.message}`, colors.red);
      process.exit(1);
    }
  }
}

// Run the cleanup and start process
cleanupAndStart();