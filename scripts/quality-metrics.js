#!/usr/bin/env node

/**
 * Quality Metrics Collection Script
 *
 * This script collects and reports various quality metrics from the codebase:
 * - Test coverage
 * - Code quality (ESLint issues)
 * - Bundle size analysis
 * - Performance metrics
 * - Security vulnerabilities
 * - Technical debt assessment
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

class QualityMetrics {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      testCoverage: null,
      codeQuality: null,
      bundleSize: null,
      performance: null,
      security: null,
      technicalDebt: null,
    };
  }

  async collectAllMetrics() {
    log('🔍 Collecting Quality Metrics...', colors.bold + colors.cyan);
    log('═══════════════════════════════════', colors.cyan);

    try {
      await this.collectTestCoverage();
      await this.collectCodeQuality();
      await this.collectBundleSize();
      await this.collectPerformanceMetrics();
      await this.collectSecurityMetrics();
      await this.calculateTechnicalDebt();

      this.generateReport();
      this.saveMetrics();

      log('\n✅ Quality metrics collection completed!', colors.bold + colors.green);

    } catch (error) {
      log(`\n❌ Error collecting metrics: ${error.message}`, colors.red);
      process.exit(1);
    }
  }

  async collectTestCoverage() {
    log('\n📊 Collecting Test Coverage...', colors.blue);

    return new Promise((resolve) => {
      exec('npx jest --coverage --silent', (error, stdout, stderr) => {
        if (error) {
          log('⚠️  No tests found or Jest not configured', colors.yellow);
          this.metrics.testCoverage = {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0,
            status: 'no-tests',
          };
          resolve();
          return;
        }

        try {
          // Parse coverage from Jest output
          const coverageRegex = /All files\s*\|\s*(\d+(?:\.\d+)?)\s*\|\s*(\d+(?:\.\d+)?)\s*\|\s*(\d+(?:\.\d+)?)\s*\|\s*(\d+(?:\.\d+)?)/;
          const match = stdout.match(coverageRegex);

          if (match) {
            this.metrics.testCoverage = {
              statements: parseFloat(match[1]),
              branches: parseFloat(match[2]),
              functions: parseFloat(match[3]),
              lines: parseFloat(match[4]),
              status: 'available',
            };

            const avgCoverage = (
              this.metrics.testCoverage.statements +
              this.metrics.testCoverage.branches +
              this.metrics.testCoverage.functions +
              this.metrics.testCoverage.lines
            ) / 4;

            log(`   Statements: ${this.metrics.testCoverage.statements}%`, colors.white);
            log(`   Branches: ${this.metrics.testCoverage.branches}%`, colors.white);
            log(`   Functions: ${this.metrics.testCoverage.functions}%`, colors.white);
            log(`   Lines: ${this.metrics.testCoverage.lines}%`, colors.white);
            log(`   Average: ${avgCoverage.toFixed(2)}%`, colors.bold);
          } else {
            this.metrics.testCoverage = { status: 'parse-error' };
          }
        } catch (parseError) {
          this.metrics.testCoverage = { status: 'error', message: parseError.message };
        }

        resolve();
      });
    });
  }

  async collectCodeQuality() {
    log('\n🔧 Analyzing Code Quality...', colors.blue);

    return new Promise((resolve) => {
      exec('npx eslint . --format json', (error, stdout, stderr) => {
        try {
          const results = JSON.parse(stdout || '[]');

          let totalErrors = 0;
          let totalWarnings = 0;
          let totalFiles = results.length;
          let filesWithIssues = 0;

          results.forEach(file => {
            const errors = file.messages.filter(msg => msg.severity === 2).length;
            const warnings = file.messages.filter(msg => msg.severity === 1).length;

            totalErrors += errors;
            totalWarnings += warnings;

            if (errors > 0 || warnings > 0) {
              filesWithIssues++;
            }
          });

          this.metrics.codeQuality = {
            totalFiles,
            filesWithIssues,
            errors: totalErrors,
            warnings: totalWarnings,
            qualityScore: Math.max(0, 100 - (totalErrors * 10) - (totalWarnings * 2)),
          };

          log(`   Files analyzed: ${totalFiles}`, colors.white);
          log(`   Files with issues: ${filesWithIssues}`, colors.white);
          log(`   Errors: ${totalErrors}`, totalErrors > 0 ? colors.red : colors.green);
          log(`   Warnings: ${totalWarnings}`, totalWarnings > 0 ? colors.yellow : colors.green);
          log(`   Quality Score: ${this.metrics.codeQuality.qualityScore}/100`, colors.bold);

        } catch (parseError) {
          this.metrics.codeQuality = {
            status: 'error',
            message: 'Could not parse ESLint output',
          };
          log('⚠️  Could not analyze code quality', colors.yellow);
        }

        resolve();
      });
    });
  }

  async collectBundleSize() {
    log('\n📦 Analyzing Bundle Size...', colors.blue);

    // Check if built files exist
    const webDistPath = path.join(__dirname, '..', 'dist', 'web');
    const apiDistPath = path.join(__dirname, '..', 'dist', 'api');

    this.metrics.bundleSize = {
      web: this.analyzeBundleDirectory(webDistPath),
      api: this.analyzeBundleDirectory(apiDistPath),
    };

    if (this.metrics.bundleSize.web.totalSize > 0) {
      log(`   Web bundle: ${(this.metrics.bundleSize.web.totalSize / 1024 / 1024).toFixed(2)} MB`, colors.white);
    } else {
      log('   Web bundle: Not built', colors.yellow);
    }

    if (this.metrics.bundleSize.api.totalSize > 0) {
      log(`   API bundle: ${(this.metrics.bundleSize.api.totalSize / 1024 / 1024).toFixed(2)} MB`, colors.white);
    } else {
      log('   API bundle: Not built', colors.yellow);
    }
  }

  analyzeBundleDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return { totalSize: 0, files: 0 };
    }

    let totalSize = 0;
    let files = 0;

    function calculateSize(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          calculateSize(fullPath);
        } else {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
          files++;
        }
      }
    }

    calculateSize(dirPath);
    return { totalSize, files };
  }

  async collectPerformanceMetrics() {
    log('\n⚡ Collecting Performance Metrics...', colors.blue);

    // This is a simplified version - in a real scenario, you'd use tools like:
    // - Lighthouse for web performance
    // - Artillery or k6 for load testing
    // - Node.js performance measurement APIs

    this.metrics.performance = {
      webVitals: {
        // Placeholder - would be collected from actual performance tests
        lcp: null, // Largest Contentful Paint
        fid: null, // First Input Delay
        cls: null, // Cumulative Layout Shift
      },
      apiPerformance: {
        // Placeholder - would be collected from load testing
        avgResponseTime: null,
        throughput: null,
        errorRate: null,
      },
      status: 'placeholder',
      note: 'Performance metrics require running performance tests with tools like Lighthouse, Artillery, or k6',
    };

    log('   ⚠️  Performance metrics collection requires additional tools', colors.yellow);
    log('   💡 Consider integrating Lighthouse, Artillery, or k6 for complete metrics', colors.cyan);
  }

  async collectSecurityMetrics() {
    log('\n🔒 Analyzing Security...', colors.blue);

    return new Promise((resolve) => {
      exec('npm audit --json', (error, stdout, stderr) => {
        try {
          const auditResult = JSON.parse(stdout);

          this.metrics.security = {
            vulnerabilities: {
              info: auditResult.metadata?.vulnerabilities?.info || 0,
              low: auditResult.metadata?.vulnerabilities?.low || 0,
              moderate: auditResult.metadata?.vulnerabilities?.moderate || 0,
              high: auditResult.metadata?.vulnerabilities?.high || 0,
              critical: auditResult.metadata?.vulnerabilities?.critical || 0,
            },
            totalVulnerabilities: auditResult.metadata?.vulnerabilities?.total || 0,
            securityScore: 100,
          };

          // Calculate security score
          const vulns = this.metrics.security.vulnerabilities;
          this.metrics.security.securityScore = Math.max(0,
            100 - (vulns.critical * 20) - (vulns.high * 10) - (vulns.moderate * 5) - (vulns.low * 1)
          );

          log(`   Critical: ${vulns.critical}`, vulns.critical > 0 ? colors.red : colors.green);
          log(`   High: ${vulns.high}`, vulns.high > 0 ? colors.red : colors.green);
          log(`   Moderate: ${vulns.moderate}`, vulns.moderate > 0 ? colors.yellow : colors.green);
          log(`   Low: ${vulns.low}`, vulns.low > 0 ? colors.yellow : colors.green);
          log(`   Security Score: ${this.metrics.security.securityScore}/100`, colors.bold);

        } catch (parseError) {
          this.metrics.security = {
            status: 'error',
            message: 'Could not parse npm audit output',
          };
          log('⚠️  Could not analyze security vulnerabilities', colors.yellow);
        }

        resolve();
      });
    });
  }

  calculateTechnicalDebt() {
    log('\n📈 Calculating Technical Debt...', colors.blue);

    // Technical debt is calculated based on:
    // - Code quality issues
    // - Test coverage gaps
    // - Security vulnerabilities
    // - Performance issues

    let debtScore = 0;
    let factors = [];

    // Code quality debt
    if (this.metrics.codeQuality && typeof this.metrics.codeQuality.qualityScore === 'number') {
      const qualityDebt = (100 - this.metrics.codeQuality.qualityScore) * 0.3;
      debtScore += qualityDebt;
      factors.push(`Code Quality: ${qualityDebt.toFixed(1)}`);
    }

    // Test coverage debt
    if (this.metrics.testCoverage && this.metrics.testCoverage.status === 'available') {
      const avgCoverage = (
        this.metrics.testCoverage.statements +
        this.metrics.testCoverage.branches +
        this.metrics.testCoverage.functions +
        this.metrics.testCoverage.lines
      ) / 4;
      const coverageDebt = (100 - avgCoverage) * 0.25;
      debtScore += coverageDebt;
      factors.push(`Test Coverage: ${coverageDebt.toFixed(1)}`);
    }

    // Security debt
    if (this.metrics.security && typeof this.metrics.security.securityScore === 'number') {
      const securityDebt = (100 - this.metrics.security.securityScore) * 0.3;
      debtScore += securityDebt;
      factors.push(`Security: ${securityDebt.toFixed(1)}`);
    }

    this.metrics.technicalDebt = {
      totalScore: Math.min(100, debtScore),
      factors,
      status: debtScore < 20 ? 'low' : debtScore < 50 ? 'moderate' : 'high',
    };

    const color = debtScore < 20 ? colors.green : debtScore < 50 ? colors.yellow : colors.red;
    log(`   Technical Debt Score: ${debtScore.toFixed(1)}/100`, color + colors.bold);
    log(`   Status: ${this.metrics.technicalDebt.status.toUpperCase()}`, color);
  }

  generateReport() {
    log('\n📋 Quality Metrics Summary', colors.bold + colors.magenta);
    log('═══════════════════════════════════', colors.magenta);

    // Overall quality score
    let overallScore = 100;
    let scoringFactors = 0;

    if (this.metrics.testCoverage?.status === 'available') {
      const avgCoverage = (
        this.metrics.testCoverage.statements +
        this.metrics.testCoverage.branches +
        this.metrics.testCoverage.functions +
        this.metrics.testCoverage.lines
      ) / 4;
      overallScore = (overallScore * scoringFactors + avgCoverage) / (scoringFactors + 1);
      scoringFactors++;
    }

    if (this.metrics.codeQuality?.qualityScore !== undefined) {
      overallScore = (overallScore * scoringFactors + this.metrics.codeQuality.qualityScore) / (scoringFactors + 1);
      scoringFactors++;
    }

    if (this.metrics.security?.securityScore !== undefined) {
      overallScore = (overallScore * scoringFactors + this.metrics.security.securityScore) / (scoringFactors + 1);
      scoringFactors++;
    }

    const scoreColor = overallScore >= 80 ? colors.green : overallScore >= 60 ? colors.yellow : colors.red;
    log(`\n🎯 Overall Quality Score: ${overallScore.toFixed(1)}/100`, scoreColor + colors.bold);

    // Recommendations
    log('\n💡 Recommendations:', colors.bold + colors.cyan);

    if (this.metrics.testCoverage?.status !== 'available') {
      log('   • Set up unit and integration tests', colors.white);
    }

    if (this.metrics.codeQuality?.errors > 0) {
      log('   • Fix ESLint errors to improve code quality', colors.white);
    }

    if (this.metrics.security?.vulnerabilities?.high > 0 || this.metrics.security?.vulnerabilities?.critical > 0) {
      log('   • Address high and critical security vulnerabilities', colors.white);
    }

    if (this.metrics.technicalDebt?.status === 'high') {
      log('   • Focus on reducing technical debt', colors.white);
    }
  }

  saveMetrics() {
    const metricsDir = path.join(__dirname, '..', 'reports');
    const metricsFile = path.join(metricsDir, 'quality-metrics.json');

    // Ensure reports directory exists
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true });
    }

    // Save current metrics
    fs.writeFileSync(metricsFile, JSON.stringify(this.metrics, null, 2));

    // Also save historical data
    const historyFile = path.join(metricsDir, 'quality-history.json');
    let history = [];

    if (fs.existsSync(historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      } catch (error) {
        // If history file is corrupted, start fresh
        history = [];
      }
    }

    history.push(this.metrics);

    // Keep only last 30 entries
    if (history.length > 30) {
      history = history.slice(-30);
    }

    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

    log(`\n💾 Metrics saved to ${metricsFile}`, colors.green);
    log(`📊 History saved to ${historyFile}`, colors.green);
  }
}

// Run metrics collection if this script is called directly
if (require.main === module) {
  const qualityMetrics = new QualityMetrics();
  qualityMetrics.collectAllMetrics().catch(console.error);
}

module.exports = QualityMetrics;