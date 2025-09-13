#!/usr/bin/env node

const { exec } = require('child_process');

// All ports that might be used during development
const ALL_DEV_PORTS = [
  4200, 3001, 5555,        // Main application ports
  3000, 4201, 4202, 4300,  // Alternative ports
  9230, 9231, 9229, 9232   // Inspector/debugger ports
];

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (!stdout) {
          resolve();
          return;
        }

        const lines = stdout.split('\n');
        const pids = new Set();

        lines.forEach(line => {
          const matches = line.match(/\s+(\d+)$/);
          if (matches && matches[1] !== '0') {
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
          setTimeout(resolve, 1000);
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

      const lines = stdout.split('\n').slice(1);
      const pidsToKill = [];
      const currentPid = process.pid.toString();
      let processCount = 0;

      lines.forEach(line => {
        const match = line.match(/"node\.exe","(\d+)"/);
        if (match && match[1] !== currentPid) {
          processCount++;
          const pid = match[1];

          // Check command line to identify process type
          exec(`wmic process where processid=${pid} get commandline /format:csv`, (cmdError, cmdOutput) => {
            let shouldKill = true;

            if (!cmdError && cmdOutput) {
              const isProtectedProcess =
                cmdOutput.toLowerCase().includes('claude') ||
                cmdOutput.includes('dev-stop.js') ||
                cmdOutput.includes('dev-start.js') ||
                cmdOutput.toLowerCase().includes('vscode') ||
                cmdOutput.toLowerCase().includes('code.exe');

              if (isProtectedProcess) {
                shouldKill = false;
                log(`Protecting process ${pid} (appears to be Claude Code or VS Code)`, colors.cyan);
              }
            }

            if (shouldKill) {
              pidsToKill.push(pid);
            }

            // Check if we've processed all PIDs
            processCount--;
            if (processCount === 0) {
              // All command line checks are done
              killProcesses();
            }
          });
        }
      });

      // If no processes found, resolve immediately
      if (processCount === 0) {
        log('No Node.js development processes found to kill', colors.green);
        resolve();
      }

      function killProcesses() {
        if (pidsToKill.length === 0) {
          log('No Node.js development processes found to kill', colors.green);
          resolve();
          return;
        }

        log(`Found ${pidsToKill.length} Node.js development processes, killing them...`, colors.yellow);
        log('(Protected Claude Code and VS Code processes)', colors.blue);

        const killPromises = pidsToKill.map(pid => {
          return new Promise((resolvePid) => {
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (killError && !killError.message.includes('not found')) {
                log(`Warning: Could not kill PID ${pid}`, colors.yellow);
              }
              resolvePid();
            });
          });
        });

        Promise.all(killPromises).then(() => {
          log(`Killed ${pidsToKill.length} Node.js development processes`, colors.green);

          // Give processes time to fully terminate
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }
    });
  });
}

async function stopDevelopmentEnvironment() {
  try {
    log('🛑 Stopping Quality Platform development environment...', colors.cyan);

    // Kill processes on development ports
    log('Killing processes on development ports...', colors.blue);
    await killPortProcesses(ALL_DEV_PORTS);

    // Wait for processes to terminate
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ask user if they want to kill all Node.js processes
    const args = process.argv.slice(2);
    if (args.includes('--all') || args.includes('-a')) {
      log('Killing all Node.js processes...', colors.yellow);
      await killAllNodeProcesses();
    }

    log('✅ Development environment stopped successfully', colors.green);
    log('💡 Use "pnpm dev" to start again', colors.cyan);

  } catch (error) {
    log(`❌ Error stopping development environment: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('Quality Platform Development Environment Stopper', colors.cyan);
  log('', colors.reset);
  log('Usage:', colors.yellow);
  log('  pnpm dev:stop           Stop development servers', colors.reset);
  log('  pnpm dev:stop --all     Stop all Node.js processes', colors.reset);
  log('', colors.reset);
  log('Options:', colors.yellow);
  log('  -a, --all     Kill all Node.js processes (use with caution)', colors.reset);
  log('  -h, --help    Show this help message', colors.reset);
  process.exit(0);
}

// Run the stop process
stopDevelopmentEnvironment();