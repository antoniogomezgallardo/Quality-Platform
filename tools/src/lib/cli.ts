#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { QualityCheckCommand } from './commands/quality-check';
import { QualityReportCommand } from './commands/quality-report';
import { ContextCommand } from './commands/context';
import { SimpleConfigManager } from './config/simple-config';
import { Logger } from './utils/logger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const program = new Command();
const logger = new Logger();

async function loadProjectContext(): Promise<void> {
  try {
    logger.info('🧠 Loading project context...');

    const { stdout } = await execAsync('node scripts/context-helper.js git', {
      timeout: 5000,
      cwd: process.cwd()
    });

    const context = JSON.parse(stdout);

    if (context.currentBranch) {
      logger.info(`📋 Current branch: ${chalk.blue(context.currentBranch)}`);
    }

    if (context.hasChanges) {
      logger.warn(`📋 Uncommitted changes: ${context.hasChanges ? 'Yes' : 'No'}`);
    }

    if (context.isFeatureBranch || context.isBugfixBranch || context.isReleaseBranch) {
      const branchType = context.isFeatureBranch ? 'feature' :
                        context.isBugfixBranch ? 'bugfix' : 'release';
      logger.info(`📋 Branch type: ${chalk.green(branchType)}`);
    }

    logger.success('✅ Context loaded');
  } catch (error) {
    logger.debug('Context loading failed, continuing...', error instanceof Error ? error.message : String(error));
  }
}

async function setupCLI(): Promise<Command> {
  // Load project context first
  await loadProjectContext();

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

  // Context Command
  const contextCommand = new ContextCommand(configManager, logger);
  program.addCommand(contextCommand.getCommand());

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