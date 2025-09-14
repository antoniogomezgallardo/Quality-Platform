import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface ProcessResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}

export interface RunOptions {
  cwd?: string;
  timeout?: number;
  silent?: boolean;
  env?: Record<string, string>;
}

export class ProcessRunner {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || new Logger();
  }

  async run(command: string, options: RunOptions = {}): Promise<ProcessResult> {
    const startTime = Date.now();
    const { cwd = process.cwd(), timeout = 300000, silent = false, env = {} } = options;

    if (!silent) {
      this.logger.debug(`Running command: ${chalk.dim(command)}`);
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout,
        env: { ...process.env, ...env },
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      const duration = Date.now() - startTime;

      if (!silent && stderr && stderr.trim()) {
        this.logger.warn('Command stderr:', stderr.trim());
      }

      return {
        success: true,
        exitCode: 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      if (!silent) {
        this.logger.error(`Command failed: ${command}`);
        if (error.stdout) this.logger.debug('stdout:', error.stdout);
        if (error.stderr) this.logger.debug('stderr:', error.stderr);
      }

      return {
        success: false,
        exitCode: error.code || 1,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message || '',
        duration
      };
    }
  }

  async runStream(command: string, args: string[] = [], options: RunOptions = {}): Promise<ProcessResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const { cwd = process.cwd(), silent = false, env = {} } = options;

      if (!silent) {
        this.logger.debug(`Running command: ${chalk.dim([command, ...args].join(' '))}`);
      }

      const childProcess = spawn(command, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: silent ? 'pipe' : 'inherit'
      });

      let stdout = '';
      let stderr = '';

      if (childProcess.stdout) {
        childProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
      }

      if (childProcess.stderr) {
        childProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }

      childProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        const exitCode = code || 0;

        resolve({
          success: exitCode === 0,
          exitCode,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          duration
        });
      });

      childProcess.on('error', (error) => {
        const duration = Date.now() - startTime;
        if (!silent) {
          this.logger.error(`Process error: ${error.message}`);
        }

        resolve({
          success: false,
          exitCode: 1,
          stdout: stdout.trim(),
          stderr: error.message,
          duration
        });
      });
    });
  }

  async runParallel(commands: Array<{ command: string; options?: RunOptions }>): Promise<ProcessResult[]> {
    this.logger.info(`Running ${commands.length} commands in parallel...`);

    const promises = commands.map(({ command, options = {} }) =>
      this.run(command, { ...options, silent: true })
    );

    const results = await Promise.all(promises);

    // Log summary
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    if (failed > 0) {
      this.logger.warn(`${successful}/${results.length} commands succeeded, ${failed} failed`);
    } else {
      this.logger.success(`All ${successful} commands succeeded`);
    }

    return results;
  }

  formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
      return `${minutes}m ${seconds}s`;
    }
  }
}