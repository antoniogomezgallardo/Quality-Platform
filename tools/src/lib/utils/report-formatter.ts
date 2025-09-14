import chalk from 'chalk';
const Table = require('cli-table3');
import * as fs from 'fs';
import * as path from 'path';

export interface ReportData {
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    duration: number;
    timestamp: string;
  };
  checks: Array<{
    name: string;
    status: 'passed' | 'failed' | 'warning' | 'skipped';
    message: string;
    duration: number;
    details?: any;
  }>;
  metadata: {
    version: string;
    environment: string;
    configPath?: string;
  };
}

export type ReportFormat = 'console' | 'json' | 'html';

export class ReportFormatter {
  formatConsole(data: ReportData): string {
    let output = '';

    // Header
    output += chalk.bold.cyan('Quality Platform - Quality Report\n');
    output += chalk.dim(`Generated: ${data.summary.timestamp}\n`);
    output += chalk.dim(`Duration: ${this.formatDuration(data.summary.duration)}\n\n`);

    // Summary Table
    const summaryTable = new Table({
      head: ['Metric', 'Count'],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    summaryTable.push(
      ['Passed', chalk.green(data.summary.passed.toString())],
      ['Failed', chalk.red(data.summary.failed.toString())],
      ['Warnings', chalk.yellow(data.summary.warnings.toString())],
      ['Total', (data.summary.passed + data.summary.failed + data.summary.warnings).toString()]
    );

    output += summaryTable.toString() + '\n\n';

    // Detailed Results
    output += chalk.bold('Detailed Results:\n');

    const resultsTable = new Table({
      head: ['Check', 'Status', 'Duration', 'Message'],
      style: {
        head: ['cyan'],
        border: ['gray']
      },
      colWidths: [25, 12, 12, 50]
    });

    data.checks.forEach(check => {
      const statusColor = this.getStatusColor(check.status);
      const statusIcon = this.getStatusIcon(check.status);

      resultsTable.push([
        check.name,
        statusColor(`${statusIcon} ${check.status.toUpperCase()}`),
        this.formatDuration(check.duration),
        check.message.length > 45 ? check.message.substring(0, 45) + '...' : check.message
      ]);
    });

    output += resultsTable.toString() + '\n\n';

    // Overall Status
    const overallStatus = data.summary.failed > 0 ? 'FAILED' : 'PASSED';
    const overallColor = data.summary.failed > 0 ? chalk.red : chalk.green;
    output += overallColor.bold(`Overall Status: ${overallStatus}\n`);

    return output;
  }

  formatJSON(data: ReportData): string {
    return JSON.stringify(data, null, 2);
  }

  formatHTML(data: ReportData): string {
    const timestamp = new Date(data.summary.timestamp).toLocaleString();
    const overallStatus = data.summary.failed > 0 ? 'FAILED' : 'PASSED';
    const overallClass = data.summary.failed > 0 ? 'failed' : 'passed';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Platform - Quality Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
        }
        .header .meta {
            color: #7f8c8d;
            margin: 10px 0;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #ddd;
        }
        .summary-card.passed { border-left-color: #27ae60; }
        .summary-card.failed { border-left-color: #e74c3c; }
        .summary-card.warnings { border-left-color: #f39c12; }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .summary-card.passed .number { color: #27ae60; }
        .summary-card.failed .number { color: #e74c3c; }
        .summary-card.warnings .number { color: #f39c12; }
        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .results-table th,
        .results-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .results-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status.passed { background: #d4edda; color: #155724; }
        .status.failed { background: #f8d7da; color: #721c24; }
        .status.warning { background: #fff3cd; color: #856404; }
        .status.skipped { background: #e2e3e5; color: #383d41; }
        .overall-status {
            text-align: center;
            padding: 30px;
            margin-top: 40px;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
        }
        .overall-status.passed {
            background: #d4edda;
            color: #155724;
            border: 2px solid #c3e6cb;
        }
        .overall-status.failed {
            background: #f8d7da;
            color: #721c24;
            border: 2px solid #f5c6cb;
        }
        .duration {
            color: #6c757d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Quality Platform - Quality Report</h1>
            <div class="meta">Generated: ${timestamp}</div>
            <div class="meta">Duration: ${this.formatDuration(data.summary.duration)}</div>
        </div>

        <div class="summary">
            <div class="summary-card passed">
                <h3>Passed</h3>
                <div class="number">${data.summary.passed}</div>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <div class="number">${data.summary.failed}</div>
            </div>
            <div class="summary-card warnings">
                <h3>Warnings</h3>
                <div class="number">${data.summary.warnings}</div>
            </div>
        </div>

        <h2>Detailed Results</h2>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Check</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                ${data.checks.map(check => `
                    <tr>
                        <td>${check.name}</td>
                        <td><span class="status ${check.status}">${check.status}</span></td>
                        <td class="duration">${this.formatDuration(check.duration)}</td>
                        <td>${check.message}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="overall-status ${overallClass}">
            Overall Status: ${overallStatus}
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  async saveReport(data: ReportData, format: ReportFormat, outputPath: string): Promise<string> {
    let content: string;
    let extension: string;

    switch (format) {
      case 'json':
        content = this.formatJSON(data);
        extension = '.json';
        break;
      case 'html':
        content = this.formatHTML(data);
        extension = '.html';
        break;
      default:
        content = this.formatConsole(data);
        extension = '.txt';
    }

    const fullPath = outputPath.endsWith(extension) ? outputPath : outputPath + extension;
    const directory = path.dirname(fullPath);

    // Ensure directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    return fullPath;
  }

  private getStatusColor(status: string): typeof chalk.green {
    switch (status) {
      case 'passed': return chalk.green;
      case 'failed': return chalk.red;
      case 'warning': return chalk.yellow;
      case 'skipped': return chalk.gray;
      default: return chalk.white;
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'passed': return '✓';
      case 'failed': return '✗';
      case 'warning': return '⚠';
      case 'skipped': return '○';
      default: return '?';
    }
  }

  private formatDuration(milliseconds: number): string {
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