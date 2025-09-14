#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { QualityCheckCommand } from './commands/quality-check';
import { QualityReportCommand } from './commands/quality-report';
import { SimpleConfigManager } from './config/simple-config';
import { Logger } from './utils/logger';

const program = new Command();
const logger = new Logger();

async function setupCLI(): Promise<Command> {
  // Initialize configuration
  const configManager = new SimpleConfigManager();
  await configManager.loadConfig();

  program
    .name('quality-platform-tools')
    .description('Quality Platform CLI Tools for automated quality checks and reporting')
    .version(process.env.npm_package_version || '1.0.0');

  // Quality Check Command
  const qualityCheckCommand = new QualityCheckCommand(configManager, logger);
  program.addCommand(qualityCheckCommand.getCommand());

  // Quality Report Command
  const qualityReportCommand = new QualityReportCommand(configManager, logger);
  program.addCommand(qualityReportCommand.getCommand());

  // Global error handling
  program.exitOverride((err) => {
    if (err.code === 'commander.help' || err.code === 'commander.helpDisplayed') {
      process.exit(0);
    }
    if (err.code === 'commander.version') {
      process.exit(0);
    }
    logger.error('Command failed:', err.message);
    process.exit(1);
  });

  return program;
}

// CLI Entry Point
export async function runCLI(argv: string[] = process.argv): Promise<void> {
  try {
    const cli = await setupCLI();
    await cli.parseAsync(argv);
  } catch (error) {
    logger.error('CLI initialization failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Self-executing when run directly
if (require.main === module) {
  runCLI().catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

export { setupCLI };