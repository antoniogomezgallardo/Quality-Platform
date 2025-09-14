import chalk from 'chalk';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerConfig {
  level: LogLevel;
  timestamp: boolean;
  colors: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: process.env.LOG_LEVEL as LogLevel || 'info',
      timestamp: false,
      colors: true,
      ...config
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    let formattedMessage = message;

    // Add arguments if any
    if (args.length > 0) {
      formattedMessage += ' ' + args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
    }

    // Add timestamp if enabled
    if (this.config.timestamp) {
      const timestamp = new Date().toISOString();
      formattedMessage = `[${timestamp}] ${formattedMessage}`;
    }

    // Add colors if enabled
    if (this.config.colors) {
      switch (level) {
        case 'debug':
          return chalk.gray(formattedMessage);
        case 'info':
          return chalk.blue(formattedMessage);
        case 'warn':
          return chalk.yellow(formattedMessage);
        case 'error':
          return chalk.red(formattedMessage);
      }
    }

    return formattedMessage;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  // Utility methods for CLI output
  success(message: string): void {
    if (this.config.colors) {
      console.log(chalk.green('✓'), message);
    } else {
      console.log('✓', message);
    }
  }

  failure(message: string): void {
    if (this.config.colors) {
      console.log(chalk.red('✗'), message);
    } else {
      console.log('✗', message);
    }
  }

  header(message: string): void {
    if (this.config.colors) {
      console.log(chalk.bold.cyan(message));
    } else {
      console.log(message);
    }
  }

  subtitle(message: string): void {
    if (this.config.colors) {
      console.log(chalk.bold(message));
    } else {
      console.log(message);
    }
  }

  dimmed(message: string): void {
    if (this.config.colors) {
      console.log(chalk.dim(message));
    } else {
      console.log(message);
    }
  }
}