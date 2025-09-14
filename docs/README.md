# Quality Platform Documentation

Welcome to the Quality Platform documentation. This directory contains comprehensive guides, references, and tutorials for the platform.

## 🧠 Context Management System

**New!** The Quality Platform includes an advanced context management system that provides automatic and manual access to project information.

### Quick Start
- **[Quick Reference](context-quick-reference.md)** - Essential commands and troubleshooting
- **[Usage Guide](context-usage-guide.md)** - When to use automatic vs manual context
- **[Complete Documentation](context-management.md)** - Full system architecture and integration

### Automatic Context Features
- 🚀 Development server startup integration (`pnpm dev`)
- 🔒 Pre-commit hook validation and guidance
- 🛠️ CLI tools integration for quality analysis

### Manual Context Commands
```bash
# Quick access via package scripts
pnpm context:summary              # Complete project overview
pnpm context:feature api          # Feature-specific guidance
pnpm context:git                  # Git status and branch info

# Advanced CLI framework commands
pnpm quality:check context validate    # System health check
```

## 📚 Core Documentation

### Setup and Configuration
- **[Setup and Troubleshooting](SETUP_AND_TROUBLESHOOTING.md)** - Installation, environment setup, common issues
- **[Project Structure](PROJECT_STRUCTURE.md)** - Monorepo organization and architecture
- **[Technology Decisions](technology-decisions.md)** - Tech stack rationale and alternatives

### Development Guides
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing strategy and examples
- **[Development Guides](development/)** - Feature development and contribution guidelines
- **[Frontend Development](frontend/)** - React, Next.js, and UI development guides

### Architecture and Design
- **[Architecture](architecture/)** - System design, patterns, and decisions
- **[API Documentation](api/)** - Backend services and endpoints
- **[Database Design](database/)** - Schema, migrations, and data patterns

## 🎓 Training and Tutorials

- **[Training Materials](training/)** - ISTQB preparation and quality engineering education
- **[Tutorials](tutorials/)** - Step-by-step learning guides
- **[Project Documentation](project/)** - Project-specific guides and standards

## 🚀 Deployment and Operations

- **[Deployment Guides](deployment/)** - Production deployment and infrastructure
- **[Operations](guides/)** - Monitoring, maintenance, and troubleshooting

## 🔍 Finding Information

### By Role
- **Developers**: Start with [Setup](SETUP_AND_TROUBLESHOOTING.md) and [Context Quick Reference](context-quick-reference.md)
- **QA Engineers**: See [Testing Guide](TESTING_GUIDE.md) and [Training Materials](training/)
- **DevOps**: Check [Deployment](deployment/) and [Architecture](architecture/)
- **Product Managers**: Review [Project Structure](PROJECT_STRUCTURE.md) and [Technology Decisions](technology-decisions.md)

### By Task
- **Getting Started**: [Setup](SETUP_AND_TROUBLESHOOTING.md) → [Context Quick Reference](context-quick-reference.md) → [Development Guides](development/)
- **Adding Features**: [Context Usage Guide](context-usage-guide.md) → [Testing Guide](TESTING_GUIDE.md) → [API Documentation](api/)
- **Troubleshooting**: [Context Management](context-management.md) → [Setup and Troubleshooting](SETUP_AND_TROUBLESHOOTING.md)
- **Learning**: [Training](training/) → [Tutorials](tutorials/) → [Testing Guide](TESTING_GUIDE.md)

## 💡 Quick Tips

1. **Start with context** - Use `pnpm dev` for automatic context or `pnpm context:summary` for manual overview
2. **Validate setup** - Run `pnpm quality:check context validate` to ensure everything works
3. **Follow GitFlow** - Check [Context Management](context-management.md) for branch naming and workflows
4. **Test everything** - See [Testing Guide](TESTING_GUIDE.md) for comprehensive testing approaches

## 📖 Contributing to Documentation

When contributing to documentation:

1. **Use context system** - Run `pnpm context:feature <area>` to understand the area you're documenting
2. **Follow patterns** - Check existing docs for structure and style
3. **Link related content** - Connect new docs with existing guides
4. **Test examples** - Ensure all code examples work with current setup
5. **Update index** - Add new docs to relevant sections in this README

## 📞 Getting Help

- **Context Issues**: Check [Context Management Documentation](context-management.md)
- **Development Issues**: See [Setup and Troubleshooting](SETUP_AND_TROUBLESHOOTING.md)
- **Testing Questions**: Review [Testing Guide](TESTING_GUIDE.md)
- **Architecture Questions**: Explore [Architecture Documentation](architecture/)

---

This documentation is maintained alongside the code and updated automatically through our quality assurance processes. For the most current information, always refer to the latest version in the repository.