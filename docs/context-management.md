# Context Management System Documentation

This guide provides comprehensive information about the Quality Platform's context management system, which enables automatic and manual context loading for development workflows.

## Overview

The context management system provides developers with efficient access to project information, git status, and feature-specific context through both automatic triggering and manual commands. This system is designed to enhance development productivity and provide better insight into the current state of the project.

## System Architecture

### Core Components

1. **Context Helper Script** (`scripts/context-helper.js`)
   - Central context aggregation and processing
   - Provides essential project, git, and workspace information
   - Supports feature-specific context loading

2. **Automatic Triggering Points**
   - Development server startup integration
   - Pre-commit hook context loading
   - CLI tools initialization

3. **Manual Command Interface**
   - Package.json scripts for direct access
   - CLI framework integration
   - Context validation and debugging tools

## Automatic Context Loading

### 1. Development Server Startup (`dev-start.js`)

**When Triggered**: Every time you run `pnpm dev` or `pnpm dev:clean`

**What It Does**:
- Loads project context summary before starting servers
- Displays current branch and uncommitted changes status
- Shows essential project information for development awareness
- Integrates seamlessly into the development workflow

**Output Example**:
```
🧠 Loading project context...
📋 Current Branch: feature/context-system
📋 Has Changes: Yes
✅ Context loaded
```

**Benefits**:
- Immediate awareness of current branch and changes
- Helps prevent working on wrong branch
- Provides project status at development start
- No manual intervention required

### 2. Pre-commit Hooks (`.husky/pre-commit`)

**When Triggered**: Every git commit attempt

**What It Does**:
- Loads git context during commit validation process
- Validates branch naming conventions
- Provides context-aware commit guidance
- Shows modified areas and gives relevant suggestions

**Output Example**:
```
🔍 Pre-commit Quality Checks
🧠 Loading project context...
📋 Current Branch: feature/new-api-endpoint
📁 Modified areas: api tools
💡 API changes detected - consider updating:
   • OpenAPI documentation (if endpoints changed)
   • Database migrations (if schema changed)
   • API tests (if business logic changed)
```

**Benefits**:
- Automated branch naming validation
- Context-specific commit guidance
- Prevents commits to protected branches
- Suggests related updates based on changed areas

### 3. CLI Tools Integration (`tools/src/lib/cli.ts`)

**When Triggered**: When running CLI quality tools

**What It Does**:
- Loads project context when CLI tools start
- Shows branch information and change status
- Available through `pnpm quality:check` and `pnpm quality:report`

**Output Example**:
```
🧠 Loading project context...
📋 Current branch: feature/quality-improvements
📋 Uncommitted changes: Yes
📋 Branch type: feature
✅ Context loaded
```

**Benefits**:
- Context awareness for quality tools
- Branch-specific analysis and recommendations
- Integration with automated quality processes

## Manual Context Usage

### Package.json Scripts

These scripts provide direct access to context information:

```bash
# Complete project context summary
pnpm context:summary

# Feature-specific context (specify area: api, web, tools, shared)
pnpm context:feature api
pnpm context:feature web

# Git context information
pnpm context:git
```

### CLI Framework Commands

Advanced context management through the CLI framework:

```bash
# Build tools first (required)
pnpm tools:build

# Context summary via CLI framework
node dist/tools/src/bin/quality-tools.js context summary

# Feature context via CLI framework
node dist/tools/src/bin/quality-tools.js context feature api
node dist/tools/src/bin/quality-tools.js context feature web --files-only

# Git context via CLI framework
node dist/tools/src/bin/quality-tools.js context git --json

# Validate context system
node dist/tools/src/bin/quality-tools.js context validate
```

**Note**: The CLI tools must be built before use. The Nx wrapper commands have limitations with argument passing, so direct tool usage is recommended for advanced context features.

### Direct Script Usage

For development and debugging:

```bash
# Direct access to context helper
node scripts/context-helper.js summary
node scripts/context-helper.js feature api
node scripts/context-helper.js git
```

## Context Areas and Features

### Supported Feature Areas

#### `api` - Backend Development Context
**Primary Files**:
- `api/src/app.module.ts` - Module structure and configuration
- `api/src/main.ts` - Bootstrap configuration and setup
- `api/prisma/schema.prisma` - Data models and database schema

**Secondary Files**:
- `api/src/auth/` - Authentication logic and strategies
- `api/src/products/` - Business logic and endpoints
- `api/test/` - Testing patterns and examples

#### `web` - Frontend Development Context
**Primary Files**:
- `web/src/app/layout.tsx` - Application structure and layout
- `web/src/lib/stores/` - State management with Zustand
- `web/tailwind.config.js` - Styling system configuration

**Secondary Files**:
- `web/src/components/` - UI components and reusable elements
- `web/src/app/` - Pages, routing, and app-specific logic

#### `tools` - CLI Development Context
**Primary Files**:
- `tools/src/lib/cli.ts` - CLI framework and command structure
- `tools/src/lib/config/simple-config.ts` - Configuration management
- `tools/README.md` - Usage patterns and documentation

**Secondary Files**:
- `tools/src/lib/commands/` - Individual command implementations
- `tools/src/lib/utils/` - Utility functions and helpers

#### `shared` - Shared Libraries Context
**Primary Files**:
- `libs/shared/src/index.ts` - Public API and exports
- `libs/shared/src/validation/` - Validation patterns and schemas
- `libs/shared/README.md` - Usage guide and documentation

## Context Information Provided

### Essential Context (Always Available)

1. **Project Information**
   - Name, version, description
   - Project type (nx-monorepo)
   - Available workspace projects

2. **Git Context**
   - Current branch name
   - Uncommitted changes status
   - Changed files list
   - Last commit information
   - Branch type detection (feature/bugfix/release)

3. **Workspace Information**
   - Available projects and their types
   - Build targets per project
   - Dependencies and dev dependencies

4. **Available Scripts**
   - Categorized by purpose (development, quality, testing, building, tools)
   - Direct access to common development commands

### Feature-Specific Context

When requesting context for a specific area, you get:

1. **Recommended File Hierarchy**
   - Primary files to understand first
   - Secondary files for deeper implementation details

2. **Architecture Patterns**
   - How the feature area is organized
   - Key architectural decisions and patterns

3. **Development Guidelines**
   - Best practices for the specific area
   - Common patterns and conventions

## Best Practices

### When to Use Automatic vs Manual Context

#### Use Automatic Context When:
- Starting development sessions (`pnpm dev`)
- Making git commits (automatic via pre-commit)
- Running quality analysis tools
- You want seamless integration without manual commands

#### Use Manual Context When:
- Debugging context loading issues
- Need specific feature area information
- Working on context system improvements
- Need detailed git analysis
- Validating project setup

### Context Loading Strategies

#### For New Feature Development:
1. Start with automatic context via `pnpm dev`
2. Use `pnpm context:feature <area>` for specific focus
3. Use `--files-only` flag for targeted file recommendations
4. Reference context map for navigation patterns

#### For Debugging:
1. Use `pnpm quality:check context validate` to check system health
2. Use `node scripts/context-helper.js git` for detailed git analysis
3. Use `--json` flags for programmatic parsing
4. Check context helper script directly for issues

#### For Project Analysis:
1. Use `pnpm context:summary` for complete overview
2. Use CLI framework commands for structured output
3. Combine with git status for complete picture
4. Reference `.claude/context-map.md` for navigation guidance

## Troubleshooting

### Common Issues and Solutions

#### Context Loading Timeout
**Symptoms**: Context loading takes too long or fails
**Solutions**:
1. Check if git repository is accessible
2. Verify Node.js and script permissions
3. Run `pnpm quality:check context validate` to identify issues
4. Check if context helper script exists and is executable

#### Missing Context Information
**Symptoms**: Context commands return partial or no information
**Solutions**:
1. Verify project structure matches expected patterns
2. Check if required files (package.json, nx.json) exist
3. Ensure git repository is initialized and has commits
4. Run context validation to identify missing components

#### Pre-commit Context Failures
**Symptoms**: Pre-commit hook fails due to context issues
**Solutions**:
1. Verify context helper script is accessible from git hooks
2. Check script permissions and execution environment
3. Test context loading manually: `node scripts/context-helper.js git`
4. Ensure git repository has proper HEAD reference

#### CLI Framework Context Issues
**Symptoms**: CLI tools don't show context information
**Solutions**:
1. Verify CLI tools are properly built: `pnpm tools:build`
2. Check if context commands are registered in CLI framework
3. Test context loading through package.json scripts first
4. Validate CLI configuration and setup

### Validation Commands

Run these commands to validate your context system:

```bash
# Validate entire context system
pnpm quality:check context validate

# Test individual components
node scripts/context-helper.js summary
pnpm context:git
pnpm context:feature api

# Check pre-commit integration
git add . && git commit --dry-run
```

## Integration with Development Workflow

### GitFlow Integration

The context system is fully integrated with GitFlow methodology:

1. **Branch Validation**: Prevents direct commits to develop/main
2. **Branch Type Detection**: Identifies feature/bugfix/release branches
3. **Context-Aware Suggestions**: Provides relevant guidance based on branch type
4. **Change Area Analysis**: Suggests related updates based on modified areas

### Quality Assurance Integration

Context information enhances quality processes:

1. **Automated Quality Checks**: Context helps target relevant quality validations
2. **Risk Assessment**: Branch and change information enables risk analysis
3. **Documentation Sync**: Context helps identify documentation that needs updates
4. **Test Strategy**: Change areas suggest appropriate testing approaches

### Development Environment Integration

Seamless integration with development tools:

1. **Server Startup**: Context loading during development server initialization
2. **IDE Integration**: Context information available for editor integrations
3. **Build Process**: Context can inform build optimizations and validations
4. **Debugging Support**: Context helps identify relevant debugging information

This context management system provides a foundation for efficient development workflows, enabling both automated and manual access to essential project information while maintaining consistency with GitFlow methodology and quality assurance practices.