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

// All ports that might be used during development
const ALL_DEV_PORTS = [
  PORTS.WEB, PORTS.API, PORTS.PRISMA,
  3000, 4201, 4202, 4300, // Alternative ports
  9230, 9231, 9229, 9232  // Inspector/debugger ports
];

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

function killProcessTree(pid) {
  return new Promise((resolve) => {
    // Use Windows taskkill with /T flag to kill process tree
    exec(`taskkill /F /T /PID ${pid}`, (error) => {
      // Don't treat 'process not found' as an error
      if (error && !error.message.includes('not found') && !error.message.includes('not exist')) {
        log(`Warning: Could not kill process tree ${pid}: ${error.message}`, colors.yellow);
      }
      resolve();
    });
  });
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
          if (matches && matches[1] !== '0') { // Exclude system process
            pids.add(matches[1]);
          }
        });

        if (pids.size === 0) {
          resolve();
          return;
        }

        log(`Killing process trees on port ${port}: ${Array.from(pids).join(', ')}`, colors.yellow);

        // Kill entire process trees instead of individual processes
        const killPromises = Array.from(pids).map(pid => killProcessTree(pid));

        Promise.all(killPromises).then(() => {
          // Wait for process trees to fully terminate
          setTimeout(resolve, 1500);
        });
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

function validatePortsFree(ports) {
  return Promise.all(ports.map(port => {
    return new Promise((resolve) => {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        const isFree = !stdout || stdout.trim() === '';
        resolve({ port, isFree, processes: stdout });
      });
    });
  }));
}

function cleanDirectories() {
  const dirsToClean = [
    path.join(__dirname, 'web', '.next'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'node_modules', '.cache'),
    path.join(__dirname, 'web', '.swc')
  ];

  return Promise.all(dirsToClean.map(dir => {
    return new Promise((resolve) => {
      if (!fs.existsSync(dir)) {
        resolve();
        return;
      }

      log(`Cleaning ${path.basename(dir)} directory...`, colors.yellow);

      // Windows-specific: Remove read-only attributes first
      exec(`attrib -R "${dir}\\*.*" /S /D 2>nul`, () => {
        // Try multiple methods to remove the directory
        const removeAttempts = [
          () => fs.rmSync(dir, { recursive: true, force: true }),
          () => exec(`rmdir /S /Q "${dir}"`, () => {}),
          () => exec(`rd /S /Q "${dir}"`, () => {})
        ];

        let success = false;
        for (const attempt of removeAttempts) {
          try {
            attempt();
            success = true;
            break;
          } catch (error) {
            // Continue to next attempt
          }
        }

        if (!success) {
          log(`Warning: Could not completely clean ${dir}`, colors.yellow);
        }

        setTimeout(resolve, 200); // Small delay
      });
    });
  }));
}

async function cleanupAndStart() {
  try {
    log('🧹 Cleaning up existing processes...', colors.cyan);

    // Kill processes on all development ports
    await killPortProcesses(ALL_DEV_PORTS);

    // Wait for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate critical ports are free
    const portStatus = await validatePortsFree([PORTS.WEB, PORTS.API]);
    const busyPorts = portStatus.filter(p => !p.isFree);

    if (busyPorts.length > 0) {
      log('⚠️  Some ports are still busy, attempting forceful cleanup...', colors.yellow);
      busyPorts.forEach(p => log(`Port ${p.port} still occupied`, colors.yellow));

      // Second cleanup attempt for busy ports
      await killPortProcesses(busyPorts.map(p => p.port));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // Clean build directories with improved error handling
    await cleanDirectories();
    
    log('✅ Cleanup completed', colors.green);

    // Final validation that critical ports are free - with retries
    let attempts = 0;
    let allPortsFree = false;

    while (!allPortsFree && attempts < 5) {
      const finalPortCheck = await validatePortsFree([PORTS.WEB, PORTS.API]);
      const stillBusy = finalPortCheck.filter(p => !p.isFree);

      if (stillBusy.length === 0) {
        allPortsFree = true;
      } else {
        attempts++;
        log(`⚠️  Attempt ${attempts}: Some ports still busy, waiting...`, colors.yellow);
        stillBusy.forEach(p => log(`    Port ${p.port} still occupied`, colors.yellow));

        if (attempts >= 5) {
          log('❌ Critical ports still occupied after cleanup:', colors.red);
          stillBusy.forEach(p => log(`  Port ${p.port}`, colors.red));
          log('Run "pnpm dev:stop --all" or restart your terminal and try again', colors.yellow);
          process.exit(1);
        }

        // Try one more aggressive cleanup
        await killPortProcesses(stillBusy.map(p => p.port));
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    log('🚀 Starting development servers...', colors.cyan);
    
    // Start API server
    log(`Starting API server on port ${PORTS.API}...`, colors.blue);
    const apiProcess = spawn('pnpm', ['nx', 'serve', 'api'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        PORT: PORTS.API
        // Removed hardcoded inspector port to prevent conflicts
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
    
    // Wait for API to start with health check
    log('Waiting for API server to be ready...', colors.blue);
    let apiReady = false;
    let apiAttempts = 0;
    const maxAttempts = 15; // 30 seconds max

    while (!apiReady && apiAttempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      apiAttempts++;

      try {
        // Simple check if API is responding (without making HTTP request to avoid dependencies)
        const healthCheck = await new Promise((resolve) => {
          exec(`netstat -ano | findstr :${PORTS.API}`, (error, stdout) => {
            resolve(stdout && stdout.includes('LISTENING'));
          });
        });

        if (healthCheck) {
          apiReady = true;
          log('API server is ready!', colors.green);
        } else if (apiAttempts >= maxAttempts) {
          log('⚠️  API server took too long to start, continuing anyway...', colors.yellow);
          break;
        }
      } catch (error) {
        // Continue trying
      }
    }

    // Start Web server
    log(`Starting Web server on port ${PORTS.WEB}...`, colors.magenta);
    const webProcess = spawn('pnpm', ['nx', 'serve', 'web', `--port=${PORTS.WEB}`], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env
        // Removed hardcoded inspector port to prevent conflicts
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
    
    // Handle cleanup on exit - comprehensive process management
    const cleanup = async () => {
      log('\n🛑 Shutting down servers...', colors.yellow);

      try {
        // First try graceful shutdown
        if (apiProcess && !apiProcess.killed) {
          apiProcess.kill('SIGTERM');
        }
        if (webProcess && !webProcess.killed) {
          webProcess.kill('SIGTERM');
        }

        // Wait for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Force kill if still running
        if (apiProcess && !apiProcess.killed) {
          apiProcess.kill('SIGKILL');
        }
        if (webProcess && !webProcess.killed) {
          webProcess.kill('SIGKILL');
        }

        // Final cleanup - kill any remaining processes on our ports
        await killPortProcesses([PORTS.API, PORTS.WEB]);

        log('✅ Cleanup completed', colors.green);
        process.exit(0);

      } catch (error) {
        log(`Warning during cleanup: ${error.message}`, colors.yellow);
        // Force cleanup as last resort
        await killPortProcesses([PORTS.API, PORTS.WEB]);
        process.exit(0);
      }
    };

    // Multiple exit handlers for comprehensive prevention
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
    process.on('uncaughtException', (error) => {
      log(`Uncaught exception: ${error.message}`, colors.red);
      cleanup();
    });
    process.on('unhandledRejection', (reason) => {
      log(`Unhandled rejection: ${reason}`, colors.red);
      cleanup();
    });

    // Monitor for orphaned processes every 30 seconds
    const monitorInterval = setInterval(async () => {
      try {
        const portStatus = await validatePortsFree([PORTS.WEB, PORTS.API]);
        const busyPorts = portStatus.filter(p => !p.isFree);

        if (busyPorts.length > 0) {
          busyPorts.forEach(p => {
            if (!p.processes.includes('node.exe')) {
              log(`⚠️  External process detected on port ${p.port}`, colors.yellow);
            }
          });
        }
      } catch (error) {
        // Ignore monitoring errors
      }
    }, 30000);
    
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