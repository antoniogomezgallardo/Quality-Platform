import { cosmiconfigSync } from 'cosmiconfig';
import { z } from 'zod';
import { Logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

// Configuration Schema
export const QualityConfigSchema = z.object({
  // Quality Check Configuration
  qualityCheck: z.object({
    linting: z.object({
      enabled: z.boolean().default(true),
      command: z.string().default('pnpm nx lint'),
      failOnError: z.boolean().default(true)
    }).default({}),
    typeCheck: z.object({
      enabled: z.boolean().default(true),
      command: z.string().default('pnpm nx run-many -t typecheck'),
      failOnError: z.boolean().default(true)
    }).default({}),
    testing: z.object({
      enabled: z.boolean().default(true),
      command: z.string().default('pnpm nx run-many -t test'),
      coverageThreshold: z.number().min(0).max(100).default(80),
      failOnError: z.boolean().default(true)
    }).default({}),
    security: z.object({
      enabled: z.boolean().default(true),
      command: z.string().default('pnpm audit --audit-level=high'),
      failOnError: z.boolean().default(false)
    }).default({}),
    performance: z.object({
      enabled: z.boolean().default(false),
      bundleSizeLimit: z.string().default('200KB'),
      failOnError: z.boolean().default(false)
    }).default({})
  }).default({}),

  // Quality Report Configuration
  qualityReport: z.object({
    formats: z.array(z.enum(['json', 'html', 'console'])).default(['console']),
    outputDir: z.string().default('./quality-reports'),
    includeHistory: z.boolean().default(false),
    templatePath: z.string().optional()
  }).default(() => ({
    formats: ['console' as const],
    outputDir: './quality-reports',
    includeHistory: false
  })),

  // Global Configuration
  workspace: z.object({
    rootDir: z.string().default(process.cwd()),
    excludePaths: z.array(z.string()).default([
      'node_modules',
      'dist',
      'build',
      '.nx',
      'coverage',
      '.next'
    ])
  }).default(() => ({
    rootDir: process.cwd(),
    excludePaths: [
      'node_modules',
      'dist',
      'build',
      '.nx',
      'coverage',
      '.next'
    ]
  }))
});

export type QualityConfig = z.infer<typeof QualityConfigSchema>;

export class ConfigManager {
  private logger: Logger;
  private config: QualityConfig | null = null;
  private configPath: string | null = null;

  constructor() {
    this.logger = new Logger();
  }

  async loadConfig(): Promise<QualityConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const explorer = cosmiconfigSync('quality-platform');
      const result = explorer.search();

      let userConfig = {};
      if (result && result.config) {
        userConfig = result.config;
        this.configPath = result.filepath;
        this.logger.debug(`Loaded configuration from: ${result.filepath}`);
      } else {
        this.logger.debug('No configuration file found, using defaults');
      }

      // Merge with environment variables
      const envConfig = this.loadEnvironmentConfig();
      const mergedConfig = { ...userConfig, ...envConfig };

      // Validate and parse configuration
      this.config = QualityConfigSchema.parse(mergedConfig);

      return this.config;
    } catch (error) {
      this.logger.error('Configuration loading failed:', error instanceof Error ? error.message : String(error));

      // Return default configuration on error
      this.config = QualityConfigSchema.parse({});
      return this.config;
    }
  }

  private loadEnvironmentConfig(): Partial<QualityConfig> {
    const envConfig: any = {};

    // Quality Check environment variables
    if (process.env.QP_LINT_ENABLED !== undefined) {
      envConfig.qualityCheck = { linting: { enabled: process.env.QP_LINT_ENABLED === 'true' } };
    }
    if (process.env.QP_TYPECHECK_ENABLED !== undefined) {
      envConfig.qualityCheck = {
        ...envConfig.qualityCheck,
        typeCheck: { enabled: process.env.QP_TYPECHECK_ENABLED === 'true' }
      };
    }
    if (process.env.QP_TEST_COVERAGE_THRESHOLD !== undefined) {
      const threshold = parseInt(process.env.QP_TEST_COVERAGE_THRESHOLD, 10);
      if (!isNaN(threshold)) {
        envConfig.qualityCheck = {
          ...envConfig.qualityCheck,
          testing: { coverageThreshold: threshold }
        };
      }
    }

    // Quality Report environment variables
    if (process.env.QP_REPORT_FORMAT !== undefined) {
      const formats = process.env.QP_REPORT_FORMAT.split(',').map(f => f.trim());
      envConfig.qualityReport = { formats };
    }
    if (process.env.QP_REPORT_OUTPUT_DIR !== undefined) {
      envConfig.qualityReport = {
        ...envConfig.qualityReport,
        outputDir: process.env.QP_REPORT_OUTPUT_DIR
      };
    }

    // Workspace environment variables
    if (process.env.QP_WORKSPACE_ROOT !== undefined) {
      envConfig.workspace = { rootDir: process.env.QP_WORKSPACE_ROOT };
    }

    return envConfig;
  }

  getConfig(): QualityConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  getConfigPath(): string | null {
    return this.configPath;
  }

  async createDefaultConfig(outputPath?: string): Promise<string> {
    const defaultConfig = {
      $schema: './node_modules/@quality-platform/tools/config-schema.json',
      qualityCheck: {
        linting: {
          enabled: true,
          command: 'pnpm nx lint',
          failOnError: true
        },
        typeCheck: {
          enabled: true,
          command: 'pnpm nx run-many -t typecheck',
          failOnError: true
        },
        testing: {
          enabled: true,
          command: 'pnpm nx run-many -t test',
          coverageThreshold: 80,
          failOnError: true
        },
        security: {
          enabled: true,
          command: 'pnpm audit --audit-level=high',
          failOnError: false
        },
        performance: {
          enabled: false,
          bundleSizeLimit: '200KB',
          failOnError: false
        }
      },
      qualityReport: {
        formats: ['console', 'json'],
        outputDir: './quality-reports',
        includeHistory: false
      },
      workspace: {
        rootDir: '.',
        excludePaths: [
          'node_modules',
          'dist',
          'build',
          '.nx',
          'coverage',
          '.next'
        ]
      }
    };

    const configPath = outputPath || path.join(process.cwd(), '.quality-platform.json');

    try {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      this.logger.info(`Created default configuration at: ${configPath}`);
      return configPath;
    } catch (error) {
      this.logger.error('Failed to create configuration file:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}