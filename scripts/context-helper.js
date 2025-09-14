#!/usr/bin/env node

/**
 * Context Helper Script for Quality Platform
 * Provides Claude with efficient project context loading
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ContextHelper {
  constructor() {
    this.projectRoot = process.cwd();
    this.contextData = {};
  }

  // Get essential project context
  getEssentialContext() {
    return {
      project: this.getProjectInfo(),
      git: this.getGitContext(),
      workspace: this.getWorkspaceInfo(),
      dependencies: this.getDependencyInfo(),
      scripts: this.getAvailableScripts()
    };
  }

  // Get project information
  getProjectInfo() {
    const packageJson = this.readJsonFile('package.json');
    return {
      name: packageJson?.name || 'quality-platform',
      version: packageJson?.version || 'unknown',
      description: packageJson?.description || '',
      type: 'nx-monorepo'
    };
  }

  // Get current git context
  getGitContext() {
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();

      return {
        currentBranch: branch,
        hasChanges: status.length > 0,
        changedFiles: status.split('\n').filter(line => line.trim()),
        lastCommit: lastCommit,
        isFeatureBranch: branch.startsWith('feature/'),
        isBugfixBranch: branch.startsWith('bugfix/'),
        isReleaseBranch: branch.startsWith('release/')
      };
    } catch (error) {
      return { error: 'Not a git repository or git not available' };
    }
  }

  // Get workspace information
  getWorkspaceInfo() {
    const nxJson = this.readJsonFile('nx.json');
    const workspaceProjects = this.getWorkspaceProjects();

    return {
      projects: workspaceProjects,
      targetDefaults: nxJson?.targetDefaults || {},
      namedInputs: nxJson?.namedInputs || {}
    };
  }

  // Get workspace projects
  getWorkspaceProjects() {
    const projects = {};
    const projectDirs = ['api', 'web', 'web-e2e', 'api-e2e', 'tools', 'libs/shared'];

    projectDirs.forEach(dir => {
      const projectJsonPath = path.join(this.projectRoot, dir, 'project.json');
      const packageJsonPath = path.join(this.projectRoot, dir, 'package.json');

      if (fs.existsSync(projectJsonPath)) {
        const projectJson = this.readJsonFile(path.relative(this.projectRoot, projectJsonPath));
        const packageJson = this.readJsonFile(path.relative(this.projectRoot, packageJsonPath));

        projects[dir] = {
          type: projectJson?.projectType || 'unknown',
          targets: Object.keys(projectJson?.targets || {}),
          dependencies: Object.keys(packageJson?.dependencies || {}),
          devDependencies: Object.keys(packageJson?.devDependencies || {})
        };
      }
    });

    return projects;
  }

  // Get dependency information
  getDependencyInfo() {
    const packageJson = this.readJsonFile('package.json');
    return {
      dependencies: Object.keys(packageJson?.dependencies || {}),
      devDependencies: Object.keys(packageJson?.devDependencies || {}),
      scripts: Object.keys(packageJson?.scripts || {})
    };
  }

  // Get available scripts
  getAvailableScripts() {
    const packageJson = this.readJsonFile('package.json');
    const scripts = packageJson?.scripts || {};

    // Categorize scripts
    const categorized = {
      development: [],
      quality: [],
      testing: [],
      building: [],
      tools: [],
      other: []
    };

    Object.keys(scripts).forEach(scriptName => {
      if (scriptName.includes('dev') || scriptName.includes('start')) {
        categorized.development.push(scriptName);
      } else if (scriptName.includes('quality') || scriptName.includes('lint')) {
        categorized.quality.push(scriptName);
      } else if (scriptName.includes('test')) {
        categorized.testing.push(scriptName);
      } else if (scriptName.includes('build')) {
        categorized.building.push(scriptName);
      } else if (scriptName.includes('tools')) {
        categorized.tools.push(scriptName);
      } else {
        categorized.other.push(scriptName);
      }
    });

    return categorized;
  }

  // Get context for specific feature area
  getFeatureContext(feature) {
    const contextMaps = {
      api: {
        primaryFiles: [
          'api/src/app.module.ts',
          'api/src/main.ts',
          'api/prisma/schema.prisma'
        ],
        secondaryFiles: [
          'api/src/auth',
          'api/src/products',
          'api/test'
        ]
      },
      web: {
        primaryFiles: [
          'web/src/app/layout.tsx',
          'web/src/lib/stores',
          'web/tailwind.config.js'
        ],
        secondaryFiles: [
          'web/src/components',
          'web/src/app'
        ]
      },
      tools: {
        primaryFiles: [
          'tools/src/lib/cli.ts',
          'tools/src/lib/config/simple-config.ts',
          'tools/README.md'
        ],
        secondaryFiles: [
          'tools/src/lib/commands',
          'tools/src/lib/utils'
        ]
      },
      shared: {
        primaryFiles: [
          'libs/shared/src/index.ts',
          'libs/shared/src/validation',
          'libs/shared/README.md'
        ]
      }
    };

    return contextMaps[feature] || null;
  }

  // Helper method to read JSON files safely
  readJsonFile(relativePath) {
    try {
      const fullPath = path.join(this.projectRoot, relativePath);
      if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${relativePath}:`, error.message);
    }
    return null;
  }

  // Generate context summary
  generateContextSummary() {
    const context = this.getEssentialContext();

    console.log('📋 Quality Platform Context Summary');
    console.log('=====================================');
    console.log(`Project: ${context.project.name} v${context.project.version}`);
    console.log(`Current Branch: ${context.git.currentBranch}`);
    console.log(`Has Changes: ${context.git.hasChanges ? 'Yes' : 'No'}`);
    console.log(`Last Commit: ${context.git.lastCommit}`);
    console.log('');

    console.log('Available Projects:');
    Object.keys(context.workspace.projects).forEach(project => {
      const info = context.workspace.projects[project];
      console.log(`  • ${project} (${info.type}) - Targets: ${info.targets.join(', ')}`);
    });
    console.log('');

    console.log('Available Scripts by Category:');
    Object.keys(context.scripts).forEach(category => {
      if (context.scripts[category].length > 0) {
        console.log(`  ${category}: ${context.scripts[category].join(', ')}`);
      }
    });

    return context;
  }
}

// CLI interface
if (require.main === module) {
  const helper = new ContextHelper();
  const command = process.argv[2];

  switch (command) {
    case 'summary':
      helper.generateContextSummary();
      break;
    case 'feature':
      const featureName = process.argv[3];
      if (featureName) {
        const featureContext = helper.getFeatureContext(featureName);
        console.log(JSON.stringify(featureContext, null, 2));
      } else {
        console.log('Usage: node context-helper.js feature <api|web|tools|shared>');
      }
      break;
    case 'git':
      console.log(JSON.stringify(helper.getGitContext(), null, 2));
      break;
    default:
      console.log('Usage: node context-helper.js <summary|feature|git>');
  }
}

module.exports = ContextHelper;