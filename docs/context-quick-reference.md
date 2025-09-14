# Context Management Quick Reference

## 🚀 Automatic Context (No Action Required)

| Trigger | When | What You Get |
|---------|------|--------------|
| `pnpm dev` | Development startup | Branch, changes, project overview |
| Git commit | Every commit attempt | Branch validation, change guidance |
| Quality tools | `pnpm quality:check` | Branch type, changes, quality context |

## 🛠️ Manual Context Commands

### Quick Access (Package Scripts)
```bash
pnpm context:summary                    # Complete project overview
pnpm context:feature api               # API development context
pnpm context:feature web               # Web development context
pnpm context:feature tools             # CLI tools context
pnpm context:feature shared            # Shared libraries context
pnpm context:git                       # Git status and branch info
```

### Advanced (CLI Framework)
```bash
# Direct CLI tool usage (recommended for advanced features)
node dist/tools/src/bin/quality-tools.js context summary              # Structured summary
node dist/tools/src/bin/quality-tools.js context feature api          # API context
node dist/tools/src/bin/quality-tools.js context feature web --files-only  # Web files only
node dist/tools/src/bin/quality-tools.js context git --json           # Git context as JSON
node dist/tools/src/bin/quality-tools.js context validate             # System health check

# Note: Build tools first with: pnpm tools:build
```

### Direct Script Access
```bash
node scripts/context-helper.js summary         # Raw summary
node scripts/context-helper.js feature api     # Raw feature context
node scripts/context-helper.js git            # Raw git context
```

## 🎯 When to Use What

### Use Automatic Context When:
- ✅ Starting development session
- ✅ Making regular commits
- ✅ Running quality analysis
- ✅ Following standard workflow

### Use Manual Context When:
- 🎯 Need specific feature area guidance
- 🐛 Debugging context or project issues
- 📚 Learning project structure
- 🔍 Need detailed analysis or JSON output
- ⚙️ Customizing development tools

## 🏗️ Feature Areas

| Area | Primary Files | Focus |
|------|---------------|-------|
| `api` | `app.module.ts`, `main.ts`, `schema.prisma` | Backend development |
| `web` | `layout.tsx`, `stores/`, `tailwind.config.js` | Frontend development |
| `tools` | `cli.ts`, `simple-config.ts`, `README.md` | CLI development |
| `shared` | `index.ts`, `validation/`, `README.md` | Shared libraries |

## 🚨 Troubleshooting

### Context Not Loading?
```bash
# 1. Test context helper directly
node scripts/context-helper.js summary

# 2. Validate system health
pnpm tools:build && node dist/tools/src/bin/quality-tools.js context validate

# 3. Check git repository
git status
```

### Pre-commit Issues?
```bash
# 1. Test git context manually
pnpm context:git

# 2. Bypass temporarily (if needed)
git commit --no-verify

# 3. Check hook permissions
ls -la .husky/pre-commit
```

### CLI Tools Not Working?
```bash
# 1. Build tools
pnpm tools:build

# 2. Test package scripts first
pnpm context:summary

# 3. Validate CLI setup
pnpm tools:build && node dist/tools/src/bin/quality-tools.js context validate
```

## 📋 Context Information Available

### Always Available
- 📁 Project name, version, type
- 🌿 Current branch and git status
- 📝 Changed files and last commit
- 🎯 Branch type (feature/bugfix/release)
- 📦 Available scripts and projects

### Feature-Specific
- 📄 Recommended primary files
- 📚 Secondary files for deeper work
- 🏗️ Architecture patterns
- 💡 Development guidelines

## 💡 Pro Tips

1. **Start with automatic** - Let `pnpm dev` show you the basics
2. **Use validation** - `pnpm quality:check context validate` catches issues early
3. **Feature focus** - Use `--files-only` when you just need file lists
4. **JSON for tools** - Use `--json` flags for programmatic access
5. **Direct access** - Use `node scripts/context-helper.js` for debugging

## 🔗 Full Documentation

- **[Complete Documentation](context-management.md)** - Architecture, troubleshooting, integration
- **[Usage Guide](context-usage-guide.md)** - Scenarios, examples, best practices
- **[Context Map](.claude/context-map.md)** - Navigation patterns for Claude Code