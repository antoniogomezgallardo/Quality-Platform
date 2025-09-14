# Context Usage Guide

This guide explains when and how to use the Quality Platform's context management system effectively, covering both automatic and manual usage scenarios.

## Context Usage Decision Tree

### Automatic Context (Zero Configuration)

The context system automatically provides information in these scenarios without any manual intervention:

#### ✅ Use Automatic Context When:

1. **Starting Development Session**
   - Running `pnpm dev` or `pnpm dev:clean`
   - Context loads automatically and shows current branch, changes
   - Perfect for situational awareness at development start

2. **Making Git Commits**
   - Pre-commit hooks automatically load context
   - Validates branch naming and provides guidance
   - Suggests relevant updates based on changed areas

3. **Running Quality Tools**
   - CLI tools (`pnpm quality:check`, `pnpm quality:report`) load context
   - Shows branch type and changes for quality analysis
   - Integrates seamlessly with automated workflows

4. **Standard Development Workflow**
   - No specific context needs beyond awareness
   - Following established patterns and conventions
   - Working within familiar project areas

### Manual Context (Targeted Information)

Use manual context commands when you need specific information or are working outside standard workflows:

#### ✅ Use Manual Context When:

1. **Feature Area Deep Dive**
   - Need specific file recommendations for unfamiliar areas
   - Understanding architecture patterns in api/web/tools/shared
   - Starting work in new project areas

2. **Debugging and Troubleshooting**
   - Context system not working as expected
   - Need detailed git analysis beyond basic status
   - Validating project setup and configuration

3. **Project Analysis and Planning**
   - Understanding complete project structure
   - Analyzing dependencies and available commands
   - Planning development tasks across multiple areas

4. **Documentation and Training**
   - Creating documentation about project structure
   - Training new team members on project navigation
   - Understanding context system itself

## Scenario-Based Usage Examples

### Scenario 1: Starting New Feature Development

**Situation**: You're assigned to work on a new API endpoint for user profiles

**Recommended Approach**:
```bash
# 1. Start development (automatic context)
pnpm dev
# Shows: Current branch, any uncommitted changes

# 2. Get API-specific context (manual)
pnpm context:feature api
# Shows: Key API files, structure, patterns

# 3. Focus on specific files if needed
pnpm context:feature api --files-only
# Shows: Just the recommended file list
```

**Why This Approach**:
- Automatic context provides immediate project awareness
- Manual context gives focused guidance for API development
- Combines situational awareness with targeted information

### Scenario 2: Debugging Failing Tests

**Situation**: Tests are failing and you need to understand what changed

**Recommended Approach**:
```bash
# 1. Get detailed git context (manual)
pnpm context:git
# Shows: Changed files, commit info, branch details

# 2. Validate context system (if needed)
pnpm quality:check context validate
# Shows: System health, potential issues

# 3. Get structured output for analysis
pnpm quality:check context git --json
# Shows: Machine-readable format for further analysis
```

**Why This Approach**:
- Manual context provides detailed change analysis
- Validation helps rule out context system issues
- JSON output enables programmatic analysis if needed

### Scenario 3: Code Review Preparation

**Situation**: Preparing for code review, need to understand scope of changes

**Recommended Approach**:
```bash
# 1. Get complete project overview (manual)
pnpm context:summary
# Shows: Full project context, all areas

# 2. Focus on changed areas (automatic via commit)
# Pre-commit hook will show modified areas and suggestions

# 3. Validate specific feature areas if needed
pnpm context:feature web
pnpm context:feature api
```

**Why This Approach**:
- Complete overview helps understand change scope
- Automatic pre-commit guidance provides review focus
- Feature-specific context helps validate completeness

### Scenario 4: Onboarding New Team Member

**Situation**: New developer needs to understand project structure

**Recommended Approach**:
```bash
# 1. Project overview (manual)
pnpm context:summary
# Shows: High-level project structure and available commands

# 2. Explore each feature area (manual)
pnpm context:feature api --files-only
pnpm context:feature web --files-only
pnpm context:feature tools --files-only

# 3. Start development to see automatic context
pnpm dev
# Shows: How context integrates with daily workflow
```

**Why This Approach**:
- Structured learning from high-level to specific
- Files-only flag focuses on essential navigation
- Automatic context demonstrates daily usage

### Scenario 5: Infrastructure Changes

**Situation**: Making changes to build system, CI/CD, or project configuration

**Recommended Approach**:
```bash
# 1. Validate current context system (manual)
pnpm tools:build && node dist/tools/src/bin/quality-tools.js context validate
# Shows: System health before changes

# 2. Get complete project overview (manual)
pnpm context:summary
# Shows: All dependencies and scripts that might be affected

# 3. Test changes with development workflow (automatic)
pnpm dev
# Ensures context still loads correctly after changes
```

**Why This Approach**:
- Validation ensures baseline functionality
- Complete overview helps identify impact areas
- Testing ensures changes don't break integration

## Command Comparison Matrix

| Need | Automatic Solution | Manual Solution | Best Choice |
|------|-------------------|-----------------|-------------|
| Daily development awareness | `pnpm dev` | `pnpm context:summary` | Automatic |
| Commit guidance | Pre-commit hook | `pnpm context:git` | Automatic |
| API development focus | N/A | `pnpm context:feature api` | Manual |
| Debugging context issues | N/A | `node dist/tools/src/bin/quality-tools.js context validate` | Manual |
| JSON output for scripts | N/A | `node dist/tools/src/bin/quality-tools.js context git --json` | Manual |
| Quick branch status | Pre-commit or CLI tools | `pnpm context:git` | Either |
| File recommendations | N/A | `pnpm context:feature <area> --files-only` | Manual |
| Complete project overview | N/A | `pnpm context:summary` | Manual |

## Performance and Efficiency Guidelines

### When to Prefer Automatic Context

1. **Standard Workflows**: Regular development, commits, quality checks
2. **Team Consistency**: Everyone gets same context automatically
3. **Reduced Cognitive Load**: No need to remember commands
4. **Integration Benefits**: Works seamlessly with existing tools

### When to Prefer Manual Context

1. **Specific Information Needs**: Targeted data not in automatic flows
2. **Debugging Scenarios**: Troubleshooting context or project issues
3. **Learning and Exploration**: Understanding project structure
4. **Customization Needs**: Specific output formats or filtering

## Troubleshooting Context Usage

### Common Issues and Solutions

#### Context Not Loading During Development
**Problem**: `pnpm dev` doesn't show context information

**Solutions**:
1. Test context helper directly: `node scripts/context-helper.js summary`
2. Check if script exists and is executable
3. Verify git repository is properly initialized
4. Run context validation: `pnpm quality:check context validate`

#### Pre-commit Context Failures
**Problem**: Git commits fail due to context loading issues

**Solutions**:
1. Test git context manually: `pnpm context:git`
2. Check pre-commit hook permissions
3. Verify context helper script accessibility from git hooks
4. Test commit with `git commit --no-verify` temporarily

#### Manual Commands Not Working
**Problem**: Manual context commands return errors or no output

**Solutions**:
1. Verify context helper script exists: `ls -la scripts/context-helper.js`
2. Check package.json scripts are properly defined
3. Ensure CLI tools are built: `pnpm tools:build`
4. Run system validation: `pnpm tools:build && node dist/tools/src/bin/quality-tools.js context validate`

#### Incomplete Context Information
**Problem**: Context commands return partial information

**Solutions**:
1. Check git repository status: `git status`
2. Verify package.json and nx.json files exist
3. Ensure workspace projects are properly configured
4. Test individual context components separately

## Integration with Development Tools

### IDE Integration

Context information can be integrated with development environments:

```bash
# Get JSON output for IDE plugins
pnpm quality:check context git --json
pnpm quality:check context feature api --json

# File lists for IDE navigation
pnpm context:feature web --files-only
```

### CI/CD Integration

Context can inform build and deployment processes:

```bash
# Branch analysis in CI
pnpm context:git --json | jq '.currentBranch'

# Change area detection
pnpm context:git --json | jq '.changedFiles[]'
```

### Documentation Generation

Context helps maintain accurate documentation:

```bash
# Project overview for README updates
pnpm context:summary

# Feature documentation updates
pnpm context:feature api
```

This usage guide helps developers understand when to rely on automatic context loading versus when to use manual commands for specific information needs. The system is designed to provide seamless integration for common workflows while offering detailed manual control when needed.