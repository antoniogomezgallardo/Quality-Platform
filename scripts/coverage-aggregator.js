#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue.bold('📊 Aggregating Test Coverage Reports\n'));

const coverageDirectories = [
  { name: 'API', path: 'coverage/api', type: 'backend' },
  { name: 'Web', path: 'coverage/web', type: 'frontend' },
  { name: 'Tools', path: 'coverage/tools', type: 'cli' },
  { name: 'Shared', path: 'coverage/libs/shared', type: 'shared' }
];

const outputDir = 'coverage/merged';

async function aggregateCoverage() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync('coverage')) {
      fs.mkdirSync('coverage', { recursive: true });
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let totalCoverage = {
      lines: { total: 0, covered: 0 },
      functions: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
      statements: { total: 0, covered: 0 }
    };

    const coverageData = [];

    // Collect coverage from each project
    for (const dir of coverageDirectories) {
      console.log(chalk.cyan(`📁 Processing ${dir.name} coverage...`));

      const coverageJsonPath = path.join(dir.path, 'coverage-final.json');
      const coverageSummaryPath = path.join(dir.path, 'coverage-summary.json');

      if (fs.existsSync(coverageSummaryPath)) {
        try {
          const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
          const projectCoverage = extractCoverageSummary(summary, dir.name, dir.type);
          coverageData.push(projectCoverage);

          // Add to totals
          if (summary.total) {
            totalCoverage.lines.total += summary.total.lines?.total || 0;
            totalCoverage.lines.covered += summary.total.lines?.covered || 0;
            totalCoverage.functions.total += summary.total.functions?.total || 0;
            totalCoverage.functions.covered += summary.total.functions?.covered || 0;
            totalCoverage.branches.total += summary.total.branches?.total || 0;
            totalCoverage.branches.covered += summary.total.branches?.covered || 0;
            totalCoverage.statements.total += summary.total.statements?.total || 0;
            totalCoverage.statements.covered += summary.total.statements?.covered || 0;
          }

          console.log(chalk.green(`   ✅ ${dir.name} coverage processed`));
        } catch (error) {
          console.log(chalk.yellow(`   ⚠️  Could not parse ${dir.name} coverage: ${error.message}`));
        }
      } else {
        console.log(chalk.gray(`   ⏭️  ${dir.name} coverage not found (tests may not have run)`));
      }
    }

    // Generate merged HTML report
    await generateMergedReport(coverageData, totalCoverage);

    // Generate JSON summary
    const mergedSummary = {
      timestamp: new Date().toISOString(),
      projects: coverageData,
      total: calculatePercentages(totalCoverage),
      testingLayers: {
        unit: coverageData.filter(c => c.type === 'backend' || c.type === 'frontend'),
        integration: 'See API E2E tests',
        e2e: 'See Playwright reports',
        contract: 'See API contract tests'
      }
    };

    fs.writeFileSync(
      path.join(outputDir, 'coverage-summary.json'),
      JSON.stringify(mergedSummary, null, 2)
    );

    // Display summary
    displayCoverageSummary(coverageData, totalCoverage);

    console.log(chalk.green.bold('\n🎉 Coverage aggregation completed!'));
    console.log(chalk.cyan('📄 Merged report: ') + path.resolve(outputDir, 'index.html'));
    console.log(chalk.cyan('📊 JSON summary: ') + path.resolve(outputDir, 'coverage-summary.json'));
    console.log(chalk.yellow('🌐 Serve locally: ') + 'npm run test:coverage:serve');

  } catch (error) {
    console.error(chalk.red('❌ Coverage aggregation failed:'), error.message);
    process.exit(1);
  }
}

function extractCoverageSummary(summary, name, type) {
  const total = summary.total || {};

  return {
    name,
    type,
    lines: calculatePercentage(total.lines),
    functions: calculatePercentage(total.functions),
    branches: calculatePercentage(total.branches),
    statements: calculatePercentage(total.statements),
    timestamp: new Date().toISOString()
  };
}

function calculatePercentage(metric) {
  if (!metric || metric.total === 0) {
    return { pct: 0, covered: 0, total: 0 };
  }

  return {
    pct: parseFloat(((metric.covered / metric.total) * 100).toFixed(2)),
    covered: metric.covered,
    total: metric.total
  };
}

function calculatePercentages(totals) {
  return {
    lines: calculatePercentage(totals.lines),
    functions: calculatePercentage(totals.functions),
    branches: calculatePercentage(totals.branches),
    statements: calculatePercentage(totals.statements)
  };
}

async function generateMergedReport(coverageData, totalCoverage) {
  const totalPercentages = calculatePercentages(totalCoverage);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Platform - Test Coverage Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            border-left: 4px solid #4f46e5;
        }

        .metric-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .metric-label {
            color: #6b7280;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-details {
            margin-top: 10px;
            font-size: 0.8rem;
            color: #9ca3af;
        }

        .projects-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-bottom: 30px;
        }

        .projects-section h2 {
            margin-bottom: 25px;
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }

        .project-grid {
            display: grid;
            gap: 20px;
        }

        .project-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
        }

        .project-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }

        .project-name {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1f2937;
        }

        .project-type {
            background: #ddd6fe;
            color: #5b21b6;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .coverage-bars {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }

        .coverage-bar {
            text-align: center;
        }

        .coverage-bar-label {
            font-size: 0.8rem;
            color: #6b7280;
            margin-bottom: 5px;
        }

        .progress-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 5px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            transition: width 0.3s ease;
        }

        .coverage-percent {
            font-weight: 600;
            font-size: 0.9rem;
        }

        .testing-layers {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }

        .layer-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #4f46e5;
        }

        .layer-name {
            font-weight: 600;
            color: #1f2937;
        }

        .layer-status {
            color: #059669;
            font-weight: 500;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6b7280;
            font-size: 0.9rem;
        }

        .good { color: #059669; }
        .warning { color: #d97706; }
        .poor { color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Coverage Report</h1>
            <p>Quality Platform - Comprehensive Testing Dashboard</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <div class="summary-grid">
            <div class="metric-card">
                <div class="metric-value ${getColorClass(totalPercentages.lines.pct)}">${totalPercentages.lines.pct}%</div>
                <div class="metric-label">Lines Coverage</div>
                <div class="metric-details">${totalPercentages.lines.covered} / ${totalPercentages.lines.total}</div>
            </div>

            <div class="metric-card">
                <div class="metric-value ${getColorClass(totalPercentages.functions.pct)}">${totalPercentages.functions.pct}%</div>
                <div class="metric-label">Functions Coverage</div>
                <div class="metric-details">${totalPercentages.functions.covered} / ${totalPercentages.functions.total}</div>
            </div>

            <div class="metric-card">
                <div class="metric-value ${getColorClass(totalPercentages.branches.pct)}">${totalPercentages.branches.pct}%</div>
                <div class="metric-label">Branches Coverage</div>
                <div class="metric-details">${totalPercentages.branches.covered} / ${totalPercentages.branches.total}</div>
            </div>

            <div class="metric-card">
                <div class="metric-value ${getColorClass(totalPercentages.statements.pct)}">${totalPercentages.statements.pct}%</div>
                <div class="metric-label">Statements Coverage</div>
                <div class="metric-details">${totalPercentages.statements.covered} / ${totalPercentages.statements.total}</div>
            </div>
        </div>

        <div class="projects-section">
            <h2>📊 Project Coverage Breakdown</h2>
            <div class="project-grid">
                ${coverageData.map(project => `
                    <div class="project-card">
                        <div class="project-header">
                            <div class="project-name">${project.name}</div>
                            <div class="project-type">${project.type}</div>
                        </div>
                        <div class="coverage-bars">
                            <div class="coverage-bar">
                                <div class="coverage-bar-label">Lines</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.lines.pct}%"></div>
                                </div>
                                <div class="coverage-percent ${getColorClass(project.lines.pct)}">${project.lines.pct}%</div>
                            </div>
                            <div class="coverage-bar">
                                <div class="coverage-bar-label">Functions</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.functions.pct}%"></div>
                                </div>
                                <div class="coverage-percent ${getColorClass(project.functions.pct)}">${project.functions.pct}%</div>
                            </div>
                            <div class="coverage-bar">
                                <div class="coverage-bar-label">Branches</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.branches.pct}%"></div>
                                </div>
                                <div class="coverage-percent ${getColorClass(project.branches.pct)}">${project.branches.pct}%</div>
                            </div>
                            <div class="coverage-bar">
                                <div class="coverage-bar-label">Statements</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.statements.pct}%"></div>
                                </div>
                                <div class="coverage-percent ${getColorClass(project.statements.pct)}">${project.statements.pct}%</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="testing-layers">
            <h2>🧪 Testing Layers</h2>
            <div class="layer-item">
                <div class="layer-name">🔧 Unit Tests</div>
                <div class="layer-status">✅ Jest + React Testing Library</div>
            </div>
            <div class="layer-item">
                <div class="layer-name">🔗 Integration Tests</div>
                <div class="layer-status">✅ Supertest API Testing</div>
            </div>
            <div class="layer-item">
                <div class="layer-name">📝 Contract Tests</div>
                <div class="layer-status">✅ OpenAPI Validation</div>
            </div>
            <div class="layer-item">
                <div class="layer-name">🎭 E2E Tests</div>
                <div class="layer-status">✅ Playwright Cross-Browser</div>
            </div>
        </div>

        <div class="footer">
            <p>Generated by Quality Platform Test Suite |
            <a href="coverage-summary.json" style="color: #4f46e5;">📊 View JSON Data</a></p>
        </div>
    </div>
</body>
</html>
  `.trim();

  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

function getColorClass(percentage) {
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'warning';
  return 'poor';
}

function displayCoverageSummary(coverageData, totalCoverage) {
  const Table = require('cli-table3');

  console.log(chalk.blue.bold('\n📊 Coverage Summary\n'));

  const table = new Table({
    head: [
      chalk.white.bold('Project'),
      chalk.white.bold('Type'),
      chalk.white.bold('Lines'),
      chalk.white.bold('Functions'),
      chalk.white.bold('Branches'),
      chalk.white.bold('Statements')
    ],
    colWidths: [15, 12, 10, 12, 12, 12],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  coverageData.forEach(project => {
    table.push([
      project.name,
      project.type,
      formatPercentage(project.lines.pct),
      formatPercentage(project.functions.pct),
      formatPercentage(project.branches.pct),
      formatPercentage(project.statements.pct)
    ]);
  });

  if (coverageData.length > 1) {
    const totals = calculatePercentages(totalCoverage);
    table.push([
      chalk.white.bold('TOTAL'),
      chalk.white.bold('ALL'),
      chalk.white.bold(formatPercentage(totals.lines.pct)),
      chalk.white.bold(formatPercentage(totals.functions.pct)),
      chalk.white.bold(formatPercentage(totals.branches.pct)),
      chalk.white.bold(formatPercentage(totals.statements.pct))
    ]);
  }

  console.log(table.toString());

  function formatPercentage(pct) {
    if (pct >= 80) return chalk.green(`${pct}%`);
    if (pct >= 60) return chalk.yellow(`${pct}%`);
    return chalk.red(`${pct}%`);
  }
}

aggregateCoverage().catch(error => {
  console.error(chalk.red('❌ Coverage aggregation failed:'), error);
  process.exit(1);
});