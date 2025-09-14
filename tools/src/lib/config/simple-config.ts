import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '../utils/logger';

export interface QualityConfig {
  qualityCheck: {
    linting: {
      enabled: boolean;
      command: string;
      failOnError: boolean;
    };
    typeCheck: {
      enabled: boolean;
      command: string;
      failOnError: boolean;
    };
    testing: {
      enabled: boolean;
      command: string;
      coverageThreshold: number;
      failOnError: boolean;
    };
    security: {
      enabled: boolean;
      command: string;
      failOnError: boolean;
    };
    performance: {
      enabled: boolean;
      bundleSizeLimit: string;
      failOnError: boolean;
    };
  };
  qualityReport: {
    formats: ('json' | 'html' | 'console')[];
    outputDir: string;
    includeHistory: boolean;
    templatePath?: string;
  };
  workspace: {
    rootDir: string;
    excludePaths: string[];
  };
}

export class SimpleConfigManager {
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
      // Default configuration
      const defaultConfig: QualityConfig = {
        qualityCheck: {
          linting: {
            enabled: true,
            command: 'pnpm nx run-many -t lint',
            failOnError: true
          },
          typeCheck: {
            enabled: true,
            command: 'tsc --noEmit',
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
          formats: ['console'],
          outputDir: './quality-reports',
          includeHistory: false
        },
        workspace: {
          rootDir: process.cwd(),
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

      // Try to load user configuration
      const userConfig = this.loadUserConfig();

      // Merge configurations
      this.config = this.mergeConfig(defaultConfig, userConfig);

      return this.config;
    } catch (error) {
      this.logger.error('Configuration loading failed:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  private loadUserConfig(): Partial<QualityConfig> {
    const configFiles = [
      '.quality-platform.json',
      '.quality-platform.js',
      'quality-platform.config.json'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(process.cwd(), configFile);
      if (fs.existsSync(configPath)) {
        try {
          this.configPath = configPath;
          if (configFile.endsWith('.json')) {
            const content = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(content);
          }
          // For .js files, require them (simplified)
          delete require.cache[require.resolve(configPath)];
          return require(configPath);
        } catch (error) {
          this.logger.warn(`Failed to load config file ${configFile}:`, error instanceof Error ? error.message : String(error));
        }
      }
    }

    return {};
  }

  private mergeConfig(defaultConfig: QualityConfig, userConfig: Partial<QualityConfig>): QualityConfig {
    return {
      qualityCheck: {
        linting: {
          ...defaultConfig.qualityCheck.linting,
          ...userConfig.qualityCheck?.linting
        },
        typeCheck: {
          ...defaultConfig.qualityCheck.typeCheck,
          ...userConfig.qualityCheck?.typeCheck
        },
        testing: {
          ...defaultConfig.qualityCheck.testing,
          ...userConfig.qualityCheck?.testing
        },
        security: {
          ...defaultConfig.qualityCheck.security,
          ...userConfig.qualityCheck?.security
        },
        performance: {
          ...defaultConfig.qualityCheck.performance,
          ...userConfig.qualityCheck?.performance
        }
      },
      qualityReport: {
        ...defaultConfig.qualityReport,
        ...userConfig.qualityReport
      },
      workspace: {
        ...defaultConfig.workspace,
        ...userConfig.workspace
      }
    };
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
          command: 'pnpm nx run-many -t lint',
          failOnError: true
        },
        typeCheck: {
          enabled: true,
          command: 'tsc --noEmit',
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