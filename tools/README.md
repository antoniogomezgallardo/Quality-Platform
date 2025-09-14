# Quality Platform CLI Tools

A comprehensive CLI toolkit for automated quality checks and reporting, designed to streamline development workflows and ensure code quality standards.

## Features

- **Quality Checks**: Automated linting, type checking, testing, security auditing, and performance validation
- **Quality Reports**: Detailed reports in multiple formats (console, JSON, HTML) with business-friendly metrics
- **Configurable**: Flexible configuration system supporting multiple configuration file formats
- **CI/CD Ready**: Silent mode and exit codes optimized for continuous integration pipelines
- **Extensible**: Plugin architecture for custom quality checks and report formats

## Quick Start

### Installation

The tools are included as part of the Quality Platform monorepo. Build the tools:

```bash
pnpm nx build tools
```

### Basic Usage

```bash
# Run quality checks
pnpm quality:check

# Generate quality report
pnpm quality:report

# Help for any command
pnpm quality:check --help
pnpm quality:report --help
```

## Commands

### `quality:check`

Run comprehensive quality checks including linting, type checking, testing, and security audits.

```bash
# Basic usage
pnpm quality:check

# Skip specific checks
pnpm quality:check --skip-tests --skip-security

# CI mode (no interactive output)
pnpm quality:check --ci

# Custom coverage threshold
pnpm quality:check --coverage-threshold=90

# Save results to file
pnpm quality:check --output=quality-results.json --format=json

# Fail on warnings
pnpm quality:check --fail-on=warning
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--skip-lint` | Skip linting checks | false |
| `--skip-typecheck` | Skip TypeScript type checking | false |
| `--skip-tests` | Skip running tests | false |
| `--skip-security` | Skip security vulnerability checks | false |
| `--skip-performance` | Skip performance checks | false |
| `--coverage-threshold <number>` | Override test coverage threshold | 80 |
| `--ci` | Run in CI mode (no interactive output) | false |
| `--fail-on <level>` | Fail on error, warning, or never | "error" |
| `--output <path>` | Save report to file | - |
| `--format <format>` | Report format (console, json, html) | "console" |

### `quality:report`

Generate comprehensive quality reports with metrics and trends.

```bash
# Basic usage
pnpm quality:report

# Multiple formats
pnpm quality:report --format=console,json,html

# Custom output directory
pnpm quality:report --output-dir=./reports

# Single file output
pnpm quality:report --output=quality-report.html --format=html

# Silent mode
pnpm quality:report --silent
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --format <formats>` | Report formats (console,json,html) | ["console"] |
| `-o, --output <path>` | Output file path (for single format) | - |
| `-d, --output-dir <dir>` | Output directory for multiple formats | "./quality-reports" |
| `--include-history` | Include historical trend data | false |
| `--template <path>` | Custom HTML template path | - |
| `--silent` | Run in silent mode | false |

## Configuration

The Quality Platform CLI supports multiple configuration file formats:

- `.quality-platform.json`
- `.quality-platform.js`
- `quality-platform.config.json`

### Default Configuration

```json
{
  "qualityCheck": {
    "linting": {
      "enabled": true,
      "command": "pnpm nx run-many -t lint",
      "failOnError": true
    },
    "typeCheck": {
      "enabled": true,
      "command": "tsc --noEmit",
      "failOnError": true
    },
    "testing": {
      "enabled": true,
      "command": "pnpm nx run-many -t test",
      "coverageThreshold": 80,
      "failOnError": true
    },
    "security": {
      "enabled": true,
      "command": "pnpm audit --audit-level=high",
      "failOnError": false
    },
    "performance": {
      "enabled": false,
      "bundleSizeLimit": "200KB",
      "failOnError": false
    }
  },
  "qualityReport": {
    "formats": ["console"],
    "outputDir": "./quality-reports",
    "includeHistory": false
  },
  "workspace": {
    "rootDir": ".",
    "excludePaths": [
      "node_modules",
      "dist",
      "build",
      ".nx",
      "coverage",
      ".next"
    ]
  }
}
```

### Environment Variables

Override configuration using environment variables:

- `QP_LINT_ENABLED`: Enable/disable linting (true/false)
- `QP_TYPECHECK_ENABLED`: Enable/disable type checking (true/false)
- `QP_TEST_COVERAGE_THRESHOLD`: Override coverage threshold (number)
- `QP_REPORT_FORMAT`: Report formats (comma-separated)
- `QP_REPORT_OUTPUT_DIR`: Report output directory
- `QP_WORKSPACE_ROOT`: Workspace root directory

## CI/CD Integration

### GitHub Actions

```yaml
name: Quality Checks
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - name: Quality Check
        run: pnpm quality:check --ci --fail-on=error
      - name: Generate Report
        run: pnpm quality:report --format=json --output=quality-metrics.json --silent
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: quality-report
          path: quality-metrics.json
```

### GitLab CI

```yaml
quality_check:
  stage: test
  script:
    - pnpm install
    - pnpm quality:check --ci --fail-on=error
    - pnpm quality:report --format=json --output=quality-metrics.json --silent
  artifacts:
    reports:
      junit: quality-metrics.json
    paths:
      - quality-metrics.json
```

## Report Formats

### Console Output

Human-readable output with colors, tables, and status indicators:

```
🔍 Quality Platform - Quality Check
Configuration: .quality-platform.json
Working directory: /project/root

┌──────────┬───────┐
│ Metric   │ Count │
├──────────┼───────┤
│ Passed   │ 4     │
│ Failed   │ 1     │
│ Warnings │ 0     │
│ Total    │ 5     │
└──────────┴───────┘

Overall Status: FAILED
```

### JSON Output

Machine-readable format for integration:

```json
{
  "summary": {
    "passed": 4,
    "failed": 1,
    "warnings": 0,
    "duration": 12500,
    "timestamp": "2025-09-14T10:15:30.000Z"
  },
  "checks": [
    {
      "name": "Linting",
      "status": "passed",
      "message": "All linting checks passed",
      "duration": 2300
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "environment": "ci",
    "configPath": ".quality-platform.json"
  }
}
```

### HTML Output

Rich web-based report with styling and interactivity:

- Executive summary with visual indicators
- Detailed results tables
- Responsive design for mobile viewing
- Print-friendly layout

## Exit Codes

The CLI uses standard exit codes:

- `0`: Success (all checks passed)
- `1`: Failure (checks failed or errors occurred)

Exit behavior can be controlled with the `--fail-on` option:

- `error`: Exit 1 only on failed checks (default)
- `warning`: Exit 1 on failed checks or warnings
- `never`: Always exit 0 (useful for reporting)

## Troubleshooting

### Common Issues

#### Command not found

```bash
# Build tools first
pnpm nx build tools

# Or install globally
npm link ./tools
```

#### Permission errors

```bash
# On Unix systems, ensure scripts are executable
chmod +x dist/tools/src/bin/quality-tools.js
```

#### Configuration not found

The CLI will use defaults if no configuration file is found. Create a configuration file:

```bash
# Generate default configuration
node dist/tools/src/bin/quality-tools.js init
```

#### CI/CD timeouts

For long-running checks in CI environments:

```bash
# Increase timeout (if supported by your CI system)
timeout 600 pnpm quality:check --ci

# Or skip expensive checks
pnpm quality:check --skip-tests --ci
```

## Development

### Building

```bash
# Build the CLI tools
pnpm nx build tools

# Watch mode for development
pnpm nx build tools --watch
```

### Testing

```bash
# Run tests
pnpm nx test tools

# Run tests with coverage
pnpm nx test tools --coverage
```

### Adding New Commands

1. Create command file in `src/lib/commands/`
2. Implement command class extending base patterns
3. Register in `src/lib/cli.ts`
4. Add to `package.json` scripts
5. Update documentation

### Adding New Checks

1. Extend `QualityCheckCommand` class
2. Add configuration options
3. Implement check logic in `runCustomCheck()`
4. Add to command registration

## License

This project is part of the Quality Platform monorepo and follows the same licensing terms.

## Support

For issues, feature requests, or contributions:

1. Check existing issues in the repository
2. Create a new issue with detailed information
3. Follow the contributing guidelines
4. Include relevant logs and configuration details

## Version History

### v1.0.0 (Current)

- Initial release with core quality checking functionality
- Support for linting, type checking, testing, security auditing
- Configurable report generation in multiple formats
- CI/CD integration support
- Comprehensive documentation and examples

### Roadmap

- **v1.1.0**: Plugin system for custom checks
- **v1.2.0**: Historical trend analysis
- **v1.3.0**: Integration with external quality tools
- **v2.0.0**: Enhanced reporting with visual dashboards