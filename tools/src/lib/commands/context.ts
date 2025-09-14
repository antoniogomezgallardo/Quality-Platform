import { Command } from 'commander';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { SimpleConfigManager } from '../config/simple-config';
import { Logger } from '../utils/logger';

const execAsync = promisify(exec);

export class ContextCommand {
  constructor(
    private configManager: SimpleConfigManager,
    private logger: Logger
  ) {}

  getCommand(): Command {
    const command = new Command('context')
      .description('Project context management and analysis');

    // Context summary subcommand
    command
      .command('summary')
      .description('Display comprehensive project context summary')
      .option('--json', 'Output in JSON format')
      .action(async (options) => {
        await this.handleSummary(options);
      });

    // Context feature subcommand
    command
      .command('feature <area>')
      .description('Get context for specific feature area (api, web, tools, shared)')
      .option('--files-only', 'Show only recommended files')
      .action(async (area, options) => {
        await this.handleFeature(area, options);
      });

    // Git context subcommand
    command
      .command('git')
      .description('Display git-specific context information')
      .option('--json', 'Output in JSON format')
      .action(async (options) => {
        await this.handleGit(options);
      });

    // Context validation subcommand
    command
      .command('validate')
      .description('Validate project context and identify issues')
      .action(async () => {
        await this.handleValidate();
      });

    return command;
  }

  private async handleSummary(options: { json?: boolean }): Promise<void> {
    try {
      this.logger.info('📋 Generating project context summary...');

      const { stdout } = await execAsync('node scripts/context-helper.js summary', {
        timeout: 10000,
        cwd: process.cwd()
      });

      if (options.json) {
        // Parse and format as clean JSON
        const lines = stdout.split('\n');
        const context = {
          timestamp: new Date().toISOString(),
          summary: stdout.trim()
        };
        console.log(JSON.stringify(context, null, 2));
      } else {
        console.log(stdout);
      }

      this.logger.success('✅ Context summary generated');
    } catch (error) {
      this.logger.error('Failed to generate context summary:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async handleFeature(area: string, options: { filesOnly?: boolean }): Promise<void> {
    const validAreas = ['api', 'web', 'tools', 'shared'];

    if (!validAreas.includes(area)) {
      this.logger.error(`Invalid feature area: ${area}`);
      this.logger.info(`Valid areas: ${validAreas.join(', ')}`);
      process.exit(1);
    }

    try {
      this.logger.info(`📁 Loading context for ${chalk.blue(area)} feature area...`);

      const { stdout } = await execAsync(`node scripts/context-helper.js feature ${area}`, {
        timeout: 10000,
        cwd: process.cwd()
      });

      const context = JSON.parse(stdout);

      if (options.filesOnly) {
        // Show only file recommendations
        if (context.primaryFiles) {
          console.log(chalk.blue('📄 Primary Files:'));
          context.primaryFiles.forEach((file: string) => {
            console.log(`  • ${file}`);
          });
        }

        if (context.secondaryFiles) {
          console.log(chalk.yellow('📄 Secondary Files:'));
          context.secondaryFiles.forEach((file: string) => {
            console.log(`  • ${file}`);
          });
        }
      } else {
        // Full context output
        console.log(chalk.blue(`🎯 Context for ${area.toUpperCase()} Feature Area`));
        console.log(chalk.blue('='.repeat(40)));
        console.log(JSON.stringify(context, null, 2));
      }

      this.logger.success(`✅ ${area} context loaded`);
    } catch (error) {
      this.logger.error(`Failed to load ${area} context:`, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async handleGit(options: { json?: boolean }): Promise<void> {
    try {
      this.logger.info('🔄 Loading git context...');

      const { stdout } = await execAsync('node scripts/context-helper.js git', {
        timeout: 10000,
        cwd: process.cwd()
      });

      const context = JSON.parse(stdout);

      if (options.json) {
        console.log(JSON.stringify(context, null, 2));
      } else {
        console.log(chalk.blue('🔄 Git Context'));
        console.log(chalk.blue('='.repeat(20)));
        console.log(`Branch: ${chalk.green(context.currentBranch || 'unknown')}`);
        console.log(`Has Changes: ${context.hasChanges ? chalk.yellow('Yes') : chalk.green('No')}`);
        console.log(`Last Commit: ${chalk.cyan(context.lastCommit || 'unknown')}`);

        if (context.changedFiles && context.changedFiles.length > 0) {
          console.log(chalk.yellow('Modified Files:'));
          context.changedFiles.forEach((file: string) => {
            console.log(`  • ${file}`);
          });
        }

        // Branch type information
        if (context.isFeatureBranch) {
          console.log(`Branch Type: ${chalk.blue('Feature Branch')}`);
        } else if (context.isBugfixBranch) {
          console.log(`Branch Type: ${chalk.red('Bugfix Branch')}`);
        } else if (context.isReleaseBranch) {
          console.log(`Branch Type: ${chalk.magenta('Release Branch')}`);
        }
      }

      this.logger.success('✅ Git context loaded');
    } catch (error) {
      this.logger.error('Failed to load git context:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async handleValidate(): Promise<void> {
    try {
      this.logger.info('🔍 Validating project context...');

      // Check if context helper script exists
      const contextHelperExists = await this.checkFileExists('scripts/context-helper.js');
      const contextMapExists = await this.checkFileExists('.claude/context-map.md');

      let issuesFound = 0;

      console.log(chalk.blue('🔍 Context Validation Results'));
      console.log(chalk.blue('='.repeat(30)));

      // Validate context helper script
      if (contextHelperExists) {
        console.log(`✅ Context helper script: ${chalk.green('Found')}`);
      } else {
        console.log(`❌ Context helper script: ${chalk.red('Missing')}`);
        issuesFound++;
      }

      // Validate context map
      if (contextMapExists) {
        console.log(`✅ Context map documentation: ${chalk.green('Found')}`);
      } else {
        console.log(`❌ Context map documentation: ${chalk.red('Missing')}`);
        issuesFound++;
      }

      // Test context loading
      try {
        const { stdout } = await execAsync('node scripts/context-helper.js summary', {
          timeout: 5000,
          cwd: process.cwd()
        });
        console.log(`✅ Context loading test: ${chalk.green('Passed')}`);
      } catch (error) {
        console.log(`❌ Context loading test: ${chalk.red('Failed')}`);
        issuesFound++;
      }

      // Check git status
      try {
        const { stdout } = await execAsync('git status --porcelain', {
          timeout: 5000,
          cwd: process.cwd()
        });
        console.log(`✅ Git repository: ${chalk.green('Valid')}`);
      } catch (error) {
        console.log(`❌ Git repository: ${chalk.red('Invalid or not found')}`);
        issuesFound++;
      }

      console.log('');
      if (issuesFound === 0) {
        this.logger.success(`✅ Context validation passed - no issues found`);
      } else {
        this.logger.warn(`⚠️  Context validation completed with ${issuesFound} issue(s)`);
        process.exit(1);
      }
    } catch (error) {
      this.logger.error('Context validation failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      await execAsync(`test -f "${filePath}"`, { cwd: process.cwd() });
      return true;
    } catch {
      return false;
    }
  }
}