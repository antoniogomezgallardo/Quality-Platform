import { Command } from 'commander';
import ora from 'ora';
import * as path from 'path';
import * as fs from 'fs';
import { SimpleConfigManager, QualityConfig } from '../config/simple-config';
import { Logger } from '../utils/logger';
import { ProcessRunner } from '../utils/process-runner';
import { ReportFormatter, ReportData, ReportFormat } from '../utils/report-formatter';

export interface QualityReportOptions {
  format?: ReportFormat[];
  output?: string;
  outputDir?: string;
  includeHistory?: boolean;
  template?: string;
  silent?: boolean;
}

export interface QualityMetrics {
  codeQuality: {
    lintIssues: number;
    typeErrors: number;
    complexityScore?: number;
    maintainabilityIndex?: number;
  };
  testMetrics: {
    totalTests: number;
    passedTests: number;
    coverage: number;
    coverageByFile?: Record<string, number>;
  };
  securityMetrics: {
    vulnerabilities: number;
    vulnerabilityLevel: 'low' | 'medium' | 'high' | 'critical';
    lastAuditDate: string;
  };
  performanceMetrics: {
    bundleSize?: string;
    buildTime: number;
    dependencies: number;
    devDependencies: number;
  };
  projectHealth: {
    overallScore: number;
    trend: 'improving' | 'stable' | 'declining';
    recommendations: string[];
  };
}

export class QualityReportCommand {
  private configManager: SimpleConfigManager;
  private logger: Logger;
  private processRunner: ProcessRunner;
  private reportFormatter: ReportFormatter;

  constructor(configManager: SimpleConfigManager, logger: Logger) {
    this.configManager = configManager;
    this.logger = logger;
    this.processRunner = new ProcessRunner(logger);
    this.reportFormatter = new ReportFormatter();
  }

  getCommand(): Command {
    const command = new Command('quality:report');

    command
      .description('Generate comprehensive quality reports with metrics and trends')
      .option('-f, --format <formats>', 'Report formats (console,json,html)', this.parseFormats, ['console'])
      .option('-o, --output <path>', 'Output file path (for single format)')
      .option('-d, --output-dir <dir>', 'Output directory for multiple formats')
      .option('--include-history', 'Include historical trend data')
      .option('--template <path>', 'Custom HTML template path')
      .option('--silent', 'Run in silent mode')
      .action(async (options: QualityReportOptions) => {
        await this.executeQualityReport(options);
      });

    return command;
  }

  async executeQualityReport(options: QualityReportOptions): Promise<void> {
    const startTime = Date.now();
    const config = this.configManager.getConfig();

    if (!options.silent) {
      this.logger.header('📊 Quality Platform - Quality Report');
      this.logger.dimmed(`Configuration: ${this.configManager.getConfigPath() || 'defaults'}`);
      this.logger.dimmed(`Working directory: ${config.workspace.rootDir}\n`);
    }

    let spinner: any;
    if (!options.silent) {
      spinner = ora('Collecting quality metrics...').start();
    }

    try {
      // Collect quality metrics
      const metrics = await this.collectQualityMetrics(config, options);

      // Generate report data
      const reportData = await this.generateQualityReportData(metrics, config, Date.now() - startTime);

      if (spinner) {
        spinner.succeed('Quality metrics collected');
      }

      // Generate and save reports
      await this.generateReports(reportData, options, config);

      if (!options.silent) {
        this.logger.success('Quality report generated successfully');
      }

    } catch (error) {
      if (spinner) {
        spinner.fail('Quality report generation failed');
      }
      this.logger.error('Quality report generation failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  private async collectQualityMetrics(config: QualityConfig, options: QualityReportOptions): Promise<QualityMetrics> {
    const metrics: QualityMetrics = {
      codeQuality: {
        lintIssues: 0,
        typeErrors: 0,
        complexityScore: 0,
        maintainabilityIndex: 85
      },
      testMetrics: {
        totalTests: 0,
        passedTests: 0,
        coverage: 0,
        coverageByFile: {}
      },
      securityMetrics: {
        vulnerabilities: 0,
        vulnerabilityLevel: 'low',
        lastAuditDate: new Date().toISOString()
      },
      performanceMetrics: {
        bundleSize: '0KB',
        buildTime: 0,
        dependencies: 0,
        devDependencies: 0
      },
      projectHealth: {
        overallScore: 0,
        trend: 'stable',
        recommendations: []
      }
    };

    await Promise.all([
      this.collectCodeQualityMetrics(metrics, config),
      this.collectTestMetrics(metrics, config),
      this.collectSecurityMetrics(metrics, config),
      this.collectPerformanceMetrics(metrics, config),
      this.collectDependencyMetrics(metrics, config)
    ]);

    // Calculate overall project health
    metrics.projectHealth = this.calculateProjectHealth(metrics);

    return metrics;
  }

  private async collectCodeQualityMetrics(metrics: QualityMetrics, config: QualityConfig): Promise<void> {
    try {
      // Run linting analysis
      if (config.qualityCheck.linting.enabled) {
        const lintResult = await this.processRunner.run(config.qualityCheck.linting.command, {
          cwd: config.workspace.rootDir,
          silent: true
        });

        metrics.codeQuality.lintIssues = this.parseLintOutput(lintResult.stdout || lintResult.stderr);
      }

      // Run TypeScript analysis
      if (config.qualityCheck.typeCheck.enabled) {
        const typeResult = await this.processRunner.run(config.qualityCheck.typeCheck.command, {
          cwd: config.workspace.rootDir,
          silent: true
        });

        metrics.codeQuality.typeErrors = this.parseTypeCheckOutput(typeResult.stdout || typeResult.stderr);
      }

      // Calculate complexity score (simplified)
      const sourceFiles = await this.countSourceFiles(config.workspace.rootDir);
      metrics.codeQuality.complexityScore = Math.max(1, Math.min(10, Math.floor(sourceFiles / 10)));

    } catch (error) {
      this.logger.warn('Failed to collect code quality metrics:', error instanceof Error ? error.message : String(error));
    }
  }

  private async collectTestMetrics(metrics: QualityMetrics, config: QualityConfig): Promise<void> {
    try {
      if (config.qualityCheck.testing.enabled) {
        // Run tests with coverage
        const testResult = await this.processRunner.run(
          `${config.qualityCheck.testing.command} --coverage --passWithNoTests`,
          {
            cwd: config.workspace.rootDir,
            silent: true
          }
        );

        const testOutput = testResult.stdout || testResult.stderr;
        metrics.testMetrics = this.parseTestOutput(testOutput);
      }
    } catch (error) {
      this.logger.warn('Failed to collect test metrics:', error instanceof Error ? error.message : String(error));
    }
  }

  private async collectSecurityMetrics(metrics: QualityMetrics, config: QualityConfig): Promise<void> {
    try {
      if (config.qualityCheck.security.enabled) {
        const securityResult = await this.processRunner.run(config.qualityCheck.security.command, {
          cwd: config.workspace.rootDir,
          silent: true
        });

        const auditOutput = securityResult.stdout || securityResult.stderr;
        metrics.securityMetrics = this.parseSecurityOutput(auditOutput);
      }
    } catch (error) {
      this.logger.warn('Failed to collect security metrics:', error instanceof Error ? error.message : String(error));
    }
  }

  private async collectPerformanceMetrics(metrics: QualityMetrics, config: QualityConfig): Promise<void> {
    try {
      // Measure build time
      const buildStartTime = Date.now();
      const buildResult = await this.processRunner.run('pnpm nx run-many -t build', {
        cwd: config.workspace.rootDir,
        silent: true
      });
      metrics.performanceMetrics.buildTime = Date.now() - buildStartTime;

      // Analyze bundle size (simplified)
      metrics.performanceMetrics.bundleSize = await this.estimateBundleSize(config.workspace.rootDir);

    } catch (error) {
      this.logger.warn('Failed to collect performance metrics:', error instanceof Error ? error.message : String(error));
    }
  }

  private async collectDependencyMetrics(metrics: QualityMetrics, config: QualityConfig): Promise<void> {
    try {
      const packageJsonPath = path.join(config.workspace.rootDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        metrics.performanceMetrics.dependencies = Object.keys(packageJson.dependencies || {}).length;
        metrics.performanceMetrics.devDependencies = Object.keys(packageJson.devDependencies || {}).length;
      }
    } catch (error) {
      this.logger.warn('Failed to collect dependency metrics:', error instanceof Error ? error.message : String(error));
    }
  }

  private calculateProjectHealth(metrics: QualityMetrics): QualityMetrics['projectHealth'] {
    let score = 100;
    const recommendations: string[] = [];

    // Code quality impact
    if (metrics.codeQuality.lintIssues > 10) {
      score -= Math.min(30, metrics.codeQuality.lintIssues * 2);
      recommendations.push(`Reduce linting issues (${metrics.codeQuality.lintIssues} found)`);
    }

    if (metrics.codeQuality.typeErrors > 0) {
      score -= Math.min(20, metrics.codeQuality.typeErrors * 5);
      recommendations.push(`Fix TypeScript errors (${metrics.codeQuality.typeErrors} found)`);
    }

    // Test coverage impact
    if (metrics.testMetrics.coverage < 80) {
      score -= (80 - metrics.testMetrics.coverage);
      recommendations.push(`Improve test coverage to at least 80% (currently ${metrics.testMetrics.coverage}%)`);
    }

    // Security impact
    if (metrics.securityMetrics.vulnerabilities > 0) {
      const securityPenalty = metrics.securityMetrics.vulnerabilityLevel === 'critical' ? 40 :
                             metrics.securityMetrics.vulnerabilityLevel === 'high' ? 25 :
                             metrics.securityMetrics.vulnerabilityLevel === 'medium' ? 15 : 10;
      score -= securityPenalty;
      recommendations.push(`Address ${metrics.securityMetrics.vulnerabilities} security vulnerabilities`);
    }

    // Performance impact
    const deps = metrics.performanceMetrics.dependencies + metrics.performanceMetrics.devDependencies;
    if (deps > 100) {
      score -= Math.min(15, (deps - 100) * 0.5);
      recommendations.push(`Consider reducing dependencies (${deps} total)`);
    }

    const trend: 'improving' | 'stable' | 'declining' = score >= 90 ? 'improving' :
                   score >= 70 ? 'stable' : 'declining';

    return {
      overallScore: Math.max(0, Math.round(score)),
      trend,
      recommendations: recommendations.length > 0 ? recommendations : ['Project health is good - maintain current practices']
    };
  }

  private async generateQualityReportData(metrics: QualityMetrics, config: QualityConfig, duration: number): Promise<ReportData> {
    const checks: Array<{
      name: string;
      status: 'passed' | 'failed' | 'warning' | 'skipped';
      message: string;
      duration: number;
      details?: any;
    }> = [
      {
        name: 'Code Quality',
        status: (metrics.codeQuality.lintIssues === 0 && metrics.codeQuality.typeErrors === 0) ? 'passed' : 'warning',
        message: `${metrics.codeQuality.lintIssues} lint issues, ${metrics.codeQuality.typeErrors} type errors`,
        duration: 1000,
        details: metrics.codeQuality
      },
      {
        name: 'Test Coverage',
        status: (metrics.testMetrics.coverage >= config.qualityCheck.testing.coverageThreshold) ? 'passed' : 'warning',
        message: `${metrics.testMetrics.coverage}% coverage (${metrics.testMetrics.passedTests}/${metrics.testMetrics.totalTests} tests passed)`,
        duration: 2000,
        details: metrics.testMetrics
      },
      {
        name: 'Security',
        status: (metrics.securityMetrics.vulnerabilities === 0) ? 'passed' : 'warning',
        message: `${metrics.securityMetrics.vulnerabilities} vulnerabilities (${metrics.securityMetrics.vulnerabilityLevel} level)`,
        duration: 1500,
        details: metrics.securityMetrics
      },
      {
        name: 'Performance',
        status: 'passed',
        message: `Bundle size: ${metrics.performanceMetrics.bundleSize}, Build time: ${this.formatDuration(metrics.performanceMetrics.buildTime)}`,
        duration: 3000,
        details: metrics.performanceMetrics
      },
      {
        name: 'Project Health',
        status: (metrics.projectHealth.overallScore >= 80) ? 'passed' : (metrics.projectHealth.overallScore >= 60) ? 'warning' : 'failed',
        message: `Overall score: ${metrics.projectHealth.overallScore}/100 (${metrics.projectHealth.trend})`,
        duration: 500,
        details: metrics.projectHealth
      }
    ];

    const passed = checks.filter(c => c.status === 'passed').length;
    const failed = checks.filter(c => c.status === 'failed').length;
    const warnings = checks.filter(c => c.status === 'warning').length;

    return {
      summary: {
        passed,
        failed,
        warnings,
        duration,
        timestamp: new Date().toISOString()
      },
      checks,
      metadata: {
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        configPath: this.configManager.getConfigPath() || undefined
      }
    };
  }

  private async generateReports(reportData: ReportData, options: QualityReportOptions, config: QualityConfig): Promise<void> {
    const formats = options.format || config.qualityReport.formats as ReportFormat[];
    const outputDir = options.outputDir || options.output ? path.dirname(options.output) : config.qualityReport.outputDir;

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    for (const format of formats) {
      let outputPath: string;

      if (options.output && formats.length === 1) {
        outputPath = options.output;
      } else {
        const extension = format === 'json' ? '.json' : format === 'html' ? '.html' : '.txt';
        outputPath = path.join(outputDir, `quality-report-${timestamp}${extension}`);
      }

      try {
        if (format === 'console') {
          if (!options.silent) {
            console.log('\n' + this.reportFormatter.formatConsole(reportData));
          }
          if (options.output || outputDir !== config.qualityReport.outputDir) {
            // Save console output to file if explicitly requested
            await this.reportFormatter.saveReport(reportData, format, outputPath);
            this.logger.info(`Console report saved to: ${outputPath}`);
          }
        } else {
          const savedPath = await this.reportFormatter.saveReport(reportData, format, outputPath);
          if (!options.silent) {
            this.logger.info(`${format.toUpperCase()} report saved to: ${savedPath}`);
          }
        }
      } catch (error) {
        this.logger.error(`Failed to generate ${format} report:`, error instanceof Error ? error.message : String(error));
      }
    }
  }

  // Utility methods for parsing output
  private parseFormats(value: string, previous: ReportFormat[]): ReportFormat[] {
    const formats = value.split(',').map(f => f.trim() as ReportFormat);
    const validFormats = formats.filter(f => ['console', 'json', 'html'].includes(f));
    return validFormats.length > 0 ? validFormats : previous;
  }

  private parseLintOutput(output: string): number {
    const matches = output.match(/(\d+)\s+problems?/i) || output.match(/(\d+)\s+errors?/i);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  private parseTypeCheckOutput(output: string): number {
    const matches = output.match(/(\d+)\s+errors?/i);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  private parseTestOutput(output: string): QualityMetrics['testMetrics'] {
    const totalMatch = output.match(/(\d+)\s+tests?/i);
    const passedMatch = output.match(/(\d+)\s+passed/i);
    const coverageMatch = output.match(/(\d+(?:\.\d+)?)%/);

    return {
      totalTests: totalMatch ? parseInt(totalMatch[1], 10) : 0,
      passedTests: passedMatch ? parseInt(passedMatch[1], 10) : 0,
      coverage: coverageMatch ? parseFloat(coverageMatch[1]) : 0,
      coverageByFile: {}
    };
  }

  private parseSecurityOutput(output: string): QualityMetrics['securityMetrics'] {
    const vulnMatch = output.match(/(\d+)\s+vulnerabilities/i);
    const vulnerabilities = vulnMatch ? parseInt(vulnMatch[1], 10) : 0;

    let vulnerabilityLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (output.includes('critical')) vulnerabilityLevel = 'critical';
    else if (output.includes('high')) vulnerabilityLevel = 'high';
    else if (output.includes('medium')) vulnerabilityLevel = 'medium';

    return {
      vulnerabilities,
      vulnerabilityLevel,
      lastAuditDate: new Date().toISOString()
    };
  }

  private async countSourceFiles(rootDir: string): Promise<number> {
    try {
      const result = await this.processRunner.run('find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l', {
        cwd: rootDir,
        silent: true
      });
      return parseInt(result.stdout.trim(), 10) || 0;
    } catch {
      return 0;
    }
  }

  private async estimateBundleSize(rootDir: string): Promise<string> {
    try {
      // This is a simplified estimation - in reality you'd analyze the built bundles
      const result = await this.processRunner.run('du -sh . 2>/dev/null || echo "Unknown"', {
        cwd: rootDir,
        silent: true
      });
      return result.stdout.split('\t')[0] || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  private formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }
}