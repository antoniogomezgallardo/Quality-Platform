# Quality Platform Context Map

This file provides Claude with efficient context navigation patterns for the Quality Platform project.

## 🎯 Context Priority Matrix

### **Essential Context (Always Load)**
- `CLAUDE.md` - Project philosophy and guidelines
- `package.json` - Available commands and dependencies
- Current git branch status
- Current working directory and task focus

### **Feature-Specific Context (Load on Demand)**

#### **API Development**
```bash
Primary Files:
- api/src/app.module.ts (module structure)
- api/src/main.ts (bootstrap configuration)
- api/prisma/schema.prisma (data models)

Secondary Files:
- api/src/auth/ (authentication logic)
- api/src/products/ (business logic)
- api/test/ (test patterns)
```

#### **Web Development**
```bash
Primary Files:
- web/src/app/layout.tsx (app structure)
- web/src/lib/stores/ (state management)
- web/tailwind.config.js (styling system)

Secondary Files:
- web/src/components/ (UI components)
- web/src/app/ (pages and routing)
```

#### **CLI Tools Development**
```bash
Primary Files:
- tools/src/lib/cli.ts (CLI framework)
- tools/src/lib/config/simple-config.ts (configuration)
- tools/README.md (usage patterns)

Secondary Files:
- tools/src/lib/commands/ (command implementations)
- tools/src/lib/utils/ (utilities)
```

#### **Shared Libraries**
```bash
Primary Files:
- libs/shared/src/index.ts (public API)
- libs/shared/src/validation/ (validation patterns)
- libs/shared/README.md (usage guide)
```

## 🔍 Context Loading Patterns

### **Starting New Feature Development**
1. Load `CLAUDE.md` for project context
2. Check `git status` and current branch
3. Load relevant feature area's primary files
4. Use Grep to find similar patterns in codebase
5. Load secondary files only when needed

### **Debugging Issues**
1. Start with error message and reproduction steps
2. Load only the failing component/module
3. Use Grep to find related error handling patterns
4. Expand context incrementally based on findings

### **Code Review/Refactoring**
1. Load the target file(s) being reviewed
2. Check related tests and documentation
3. Use Grep to find usage patterns
4. Load dependent files only if modifications needed

## 📊 Context Efficiency Guidelines

### **File Reading Strategy**
```bash
# ✅ Efficient Context Loading
1. Use Grep to locate specific functions/patterns
2. Read targeted sections with offset/limit
3. Load related files only when cross-references found
4. Prefer smaller, focused files over large monoliths

# ❌ Context Waste
1. Reading entire large files when only need one function
2. Loading unrelated modules "just in case"
3. Repeatedly reading the same unchanged files
4. Loading test files when working on production code
```

### **Tool Selection Matrix**
```bash
Finding code patterns:     Grep → Read (targeted)
Exploring file structure:  Glob → Read (selective)
Complex multi-file tasks:  Task agent
Simple file operations:    Read/Edit directly
```

## 🎛 Context Management Commands

### **Context Reset Triggers**
When to start fresh conversation:
- Switching between major features (API ↔ Web ↔ CLI)
- Context window approaching limit
- More than 3 layers of debugging depth
- Significant time gap between work sessions

### **Essential Context Preservation**
Always carry forward:
- Current feature/task being worked on
- Recent architectural decisions made
- Patterns established in current session
- Outstanding issues/blockers

### **Context Handoff Format**
When starting new conversation:
```markdown
## Context Handoff

**Current Task**: [Brief description]
**Branch**: [Git branch name]
**Progress**: [What's been completed]
**Next Steps**: [What needs to happen next]
**Key Decisions**: [Important choices made]
**Files Modified**: [List of changed files]
```

## 🔧 Project-Specific Optimizations

### **Monorepo Navigation**
- Use workspace-relative paths consistently
- Leverage nx.json for understanding project relationships
- Focus on one project at a time (api, web, tools, libs)
- Use package.json scripts as entry points for common tasks

### **Documentation Integration**
- Reference existing README files before asking questions
- Check CLAUDE.md for project-specific guidelines
- Use TypeScript interfaces as documentation sources
- Leverage code comments for business logic context

### **Development Workflow Context**
- Always check git status before starting work
- Understand GitFlow branch naming conventions
- Reference recent commits for context on changes
- Use conventional commit format for clarity

This context map should be referenced at the start of each development session to establish efficient working patterns.