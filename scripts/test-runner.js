#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const Table = require('cli-table3');

console.log(chalk.blue.bold('🧪 Quality Platform - Comprehensive Test Suite\n'));

const testSuites = [
  {
    name: 'Unit Tests',
    description: 'Jest unit tests for all projects',
    command: 'nx run-many -t test --coverage --verbose',
    icon: '🔧',
    category: 'unit'
  },
  {
    name: 'Integration Tests',
    description: 'Supertest API integration tests',
    command: 'nx run api-e2e:test',
    icon: '🔗',
    category: 'integration'
  },
  {
    name: 'Contract Tests',
    description: 'OpenAPI contract validation',
    command: 'nx run api:test --testNamePattern="Contract"',
    icon: '📝',
    category: 'contract'
  },
  {
    name: 'Component Tests',
    description: 'React Testing Library component tests',
    command: 'nx run web:test --coverage',
    icon: '⚛️',
    category: 'component'
  },
  {
    name: 'E2E Tests',
    description: 'Playwright end-to-end tests',
    command: 'nx run web-e2e:test',
    icon: '🎭',
    category: 'e2e'
  }
];

async function runTests() {
  const results = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  console.log(chalk.yellow('🚀 Running comprehensive test suite...\n'));

  for (const suite of testSuites) {
    console.log(chalk.cyan(`${suite.icon} Running ${suite.name}...`));
    console.log(chalk.gray(`   ${suite.description}`));

    const startTime = Date.now();

    try {
      const output = execSync(suite.command, {
        encoding: 'utf8',
        timeout: 300000, // 5 minutes timeout
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;

      // Parse test results from output
      const testStats = parseTestOutput(output, suite.category);

      results.push({
        name: suite.name,
        status: 'PASSED',
        duration: `${(duration / 1000).toFixed(1)}s`,
        tests: testStats.tests,
        passed: testStats.passed,
        failed: testStats.failed,
        coverage: testStats.coverage
      });

      totalTests += testStats.tests;
      totalPassed += testStats.passed;
      totalFailed += testStats.failed;

      console.log(chalk.green(`   ✅ ${suite.name} completed in ${(duration / 1000).toFixed(1)}s`));

    } catch (error) {
      const duration = Date.now() - startTime;

      // Parse failed test results
      const testStats = parseTestOutput(error.stdout || error.message, suite.category);

      results.push({
        name: suite.name,
        status: 'FAILED',
        duration: `${(duration / 1000).toFixed(1)}s`,
        tests: testStats.tests,
        passed: testStats.passed,
        failed: testStats.failed,
        coverage: testStats.coverage,
        error: error.message
      });

      totalTests += testStats.tests;
      totalPassed += testStats.passed;
      totalFailed += testStats.failed;

      console.log(chalk.red(`   ❌ ${suite.name} failed after ${(duration / 1000).toFixed(1)}s`));
    }

    console.log('');
  }

  // Display results table
  displayResults(results, { totalTests, totalPassed, totalFailed });

  // Generate coverage report
  console.log(chalk.blue('📊 Generating coverage report...'));
  try {
    execSync('node scripts/coverage-aggregator.js', { stdio: 'inherit' });
    console.log(chalk.green('✅ Coverage report generated at coverage/merged/index.html'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Coverage aggregation skipped (some tests may not have run)'));
  }

  // Exit with appropriate code
  const hasFailures = results.some(r => r.status === 'FAILED');
  if (hasFailures) {
    console.log(chalk.red('\n❌ Some test suites failed. See details above.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n🎉 All test suites passed!'));
    process.exit(0);
  }
}

function parseTestOutput(output, category) {
  const defaultStats = { tests: 0, passed: 0, failed: 0, coverage: 'N/A' };

  if (!output) return defaultStats;

  try {
    // Jest output parsing
    if (category === 'unit' || category === 'component') {
      const testMatch = output.match(/Tests:\s+(\d+)\s+passed(?:,\s+(\d+)\s+failed)?/);
      const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)/);

      if (testMatch) {
        const passed = parseInt(testMatch[1]) || 0;
        const failed = parseInt(testMatch[2]) || 0;
        return {
          tests: passed + failed,
          passed: passed,
          failed: failed,
          coverage: coverageMatch ? `${coverageMatch[1]}%` : 'N/A'
        };
      }
    }

    // Playwright output parsing
    if (category === 'e2e') {
      const passedMatch = output.match(/(\d+)\s+passed/);
      const failedMatch = output.match(/(\d+)\s+failed/);

      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;

      return {
        tests: passed + failed,
        passed: passed,
        failed: failed,
        coverage: 'E2E'
      };
    }

    // Supertest/Integration output parsing
    if (category === 'integration' || category === 'contract') {
      const testMatch = output.match(/(\d+)\s+passing/);
      const failMatch = output.match(/(\d+)\s+failing/);

      const passed = testMatch ? parseInt(testMatch[1]) : 0;
      const failed = failMatch ? parseInt(failMatch[1]) : 0;

      return {
        tests: passed + failed,
        passed: passed,
        failed: failed,
        coverage: 'API'
      };
    }

  } catch (error) {
    console.log(chalk.yellow(`⚠️  Could not parse test output for ${category}`));
  }

  return defaultStats;
}

function displayResults(results, totals) {
  console.log(chalk.blue.bold('\n📋 Test Results Summary\n'));

  const table = new Table({
    head: [
      chalk.white.bold('Test Suite'),
      chalk.white.bold('Status'),
      chalk.white.bold('Duration'),
      chalk.white.bold('Tests'),
      chalk.white.bold('Passed'),
      chalk.white.bold('Failed'),
      chalk.white.bold('Coverage')
    ],
    colWidths: [20, 10, 12, 8, 8, 8, 12],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  results.forEach(result => {
    const statusColor = result.status === 'PASSED' ? 'green' : 'red';
    const statusIcon = result.status === 'PASSED' ? '✅' : '❌';

    table.push([
      result.name,
      chalk[statusColor](`${statusIcon} ${result.status}`),
      result.duration,
      result.tests.toString(),
      chalk.green(result.passed.toString()),
      result.failed > 0 ? chalk.red(result.failed.toString()) : '0',
      result.coverage
    ]);
  });

  console.log(table.toString());

  // Summary statistics
  const passedSuites = results.filter(r => r.status === 'PASSED').length;
  const failedSuites = results.filter(r => r.status === 'FAILED').length;

  console.log(chalk.blue.bold('\n📊 Overall Statistics'));
  console.log(`${chalk.white('Test Suites:')} ${chalk.green(`${passedSuites} passed`)}, ${failedSuites > 0 ? chalk.red(`${failedSuites} failed`) : '0 failed'}`);
  console.log(`${chalk.white('Total Tests:')} ${chalk.cyan(totals.totalTests)}`);
  console.log(`${chalk.white('Passed:')} ${chalk.green(totals.totalPassed)}`);
  console.log(`${chalk.white('Failed:')} ${totals.totalFailed > 0 ? chalk.red(totals.totalFailed) : chalk.green('0')}`);

  if (totals.totalTests > 0) {
    const successRate = ((totals.totalPassed / totals.totalTests) * 100).toFixed(1);
    console.log(`${chalk.white('Success Rate:')} ${successRate >= 90 ? chalk.green(`${successRate}%`) : chalk.yellow(`${successRate}%`)}`);
  }

  // Coverage information
  console.log(chalk.blue.bold('\n📈 Coverage Reports Available:'));
  console.log(chalk.cyan('• Unit Tests: ') + 'coverage/api/index.html');
  console.log(chalk.cyan('• Component Tests: ') + 'coverage/web/index.html');
  console.log(chalk.cyan('• Merged Report: ') + 'coverage/merged/index.html');
  console.log(chalk.cyan('• View Live: ') + 'npm run test:coverage:serve');
}

// Handle CLI arguments
const args = process.argv.slice(2);
const suiteArg = args.find(arg => arg.startsWith('--suite='));

if (suiteArg) {
  const suiteName = suiteArg.split('=')[1];
  const suite = testSuites.find(s => s.category === suiteName || s.name.toLowerCase().includes(suiteName.toLowerCase()));

  if (suite) {
    console.log(chalk.blue(`🎯 Running specific test suite: ${suite.name}\n`));

    try {
      execSync(suite.command, { stdio: 'inherit' });
      console.log(chalk.green(`\n✅ ${suite.name} completed successfully`));
    } catch (error) {
      console.log(chalk.red(`\n❌ ${suite.name} failed`));
      process.exit(1);
    }
  } else {
    console.log(chalk.red(`❌ Test suite "${suiteName}" not found`));
    console.log(chalk.yellow('Available suites: unit, integration, contract, component, e2e'));
    process.exit(1);
  }
} else {
  runTests().catch(error => {
    console.error(chalk.red('❌ Test runner failed:'), error.message);
    process.exit(1);
  });
}