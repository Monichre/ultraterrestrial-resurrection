# 🚀 Claude Code Command Reference

Quick reference for custom commands with arguments, flags, and usage examples.

## Agent Commands

### `/agents [list|status|info]`
**Description**: Manage and view project agents  
**Arguments**:
- `list` - Show all available agents with colors and icons
- `status` - Display agent activity and health
- `info <agent-name>` - Detailed information about specific agent

**Examples**:
```bash
/agents list
/agents info apps-app-agent
/agents status
```

---

## Development Commands

### `/build [target] [--flags]`
**Description**: Build project components with framework detection  
**Arguments**:
- `target` - Specific component/app to build (optional)

**Flags**:
- `--api` - Focus on API/backend build
- `--ui` - Focus on UI/frontend build  
- `--docs` - Include documentation generation
- `--watch` - Enable watch mode
- `--production` - Production build optimization

**Examples**:
```bash
/build                    # Build entire project
/build apps/app --ui      # Build main app UI only
/build --api --watch      # Watch API changes
```

### `/implement [feature-description] [--flags]`
**Description**: Implement new features with intelligent persona activation  
**Arguments**:
- `feature-description` - Natural language description of feature

**Flags**:
- `--type component|api|service|feature` - Specify implementation type
- `--framework <name>` - Target specific framework
- `--test` - Include test generation
- `--docs` - Generate documentation

**Examples**:
```bash
/implement "user authentication with OAuth"
/implement "responsive navigation menu" --type component --framework react
/implement "document search API" --type api --test
```

### `/improve [target] [--flags]`
**Description**: Evidence-based code enhancement  
**Arguments**:
- `target` - File, component, or system to improve

**Flags**:
- `--performance` - Focus on performance optimization
- `--security` - Security hardening and vulnerability fixes
- `--quality` - Code quality and maintainability
- `--accessibility` - Accessibility compliance improvements
- `--loop` - Iterative improvement mode

**Examples**:
```bash
/improve src/components/mindmap --performance
/improve --security --loop
/improve auth-system --quality --docs
```

---

## Analysis Commands

### `/analyze [target] [--flags]`
**Description**: Multi-dimensional code and system analysis  
**Arguments**:
- `target` - System, component, or file to analyze

**Flags**:
- `--think` - Multi-file analysis (~4K tokens)
- `--think-hard` - Deep architectural analysis (~10K tokens)  
- `--ultrathink` - Critical system redesign analysis (~32K tokens)
- `--focus performance|security|quality|architecture`
- `--scope file|module|project|system`

**Examples**:
```bash
/analyze --think-hard --focus architecture
/analyze src/features/mindmap --focus performance
/analyze --ultrathink --scope system
```

### `/troubleshoot [symptoms] [--flags]`
**Description**: Problem investigation and root cause analysis  
**Arguments**:
- `symptoms` - Description of issues or error messages

**Flags**:
- `--logs` - Include log analysis
- `--performance` - Performance bottleneck investigation
- `--security` - Security vulnerability assessment

**Examples**:
```bash
/troubleshoot "slow mindmap rendering" --performance
/troubleshoot "authentication failures" --logs --security
```

---

## Quality Commands

### `/test [type] [--flags]`
**Description**: Comprehensive testing workflows  
**Arguments**:
- `type` - Test type: unit|integration|e2e|performance

**Flags**:
- `--coverage` - Generate coverage reports
- `--watch` - Run tests in watch mode
- `--ci` - CI/CD pipeline compatible output

**Examples**:
```bash
/test e2e --coverage
/test unit --watch
/test performance --ci
```

### `/cleanup [target] [--flags]`
**Description**: Technical debt reduction and code cleanup  
**Arguments**:
- `target` - Specific area to clean up

**Flags**:
- `--deps` - Clean up dependencies
- `--files` - Remove unused files
- `--format` - Apply code formatting
- `--lint` - Fix linting issues

**Examples**:
```bash
/cleanup --deps --files
/cleanup src/legacy --format --lint
```

---

## Documentation Commands

### `/document [target] [--flags]`
**Description**: Generate comprehensive documentation  
**Arguments**:
- `target` - Component, API, or system to document

**Flags**:
- `--api` - Generate API documentation
- `--components` - Component library documentation
- `--readme` - Update README files
- `--examples` - Include code examples

**Examples**:
```bash
/document --api --examples
/document src/components --components --readme
```

---

## Advanced Workflow Commands

### `/workflow [operation] [--flags]`
**Description**: Orchestrate complex multi-step operations  
**Arguments**:
- `operation` - Workflow type or custom workflow name

**Flags**:
- `--parallel` - Enable parallel execution where possible
- `--validate` - Add validation steps
- `--rollback` - Enable rollback on failure

### `/task [operation] [--flags]`
**Description**: Long-term project management and orchestration  
**Arguments**:
- `operation` - Task operation or project phase

**Flags**:
- `--estimate` - Include time estimation
- `--dependencies` - Map task dependencies
- `--milestone` - Mark as project milestone

---

## Flag Categories

### 🧠 Thinking Flags
- `--think` - Multi-file analysis (~4K tokens)
- `--think-hard` - Deep architectural analysis (~10K tokens)
- `--ultrathink` - Critical system analysis (~32K tokens)

### 🎯 Focus Flags
- `--focus performance` - Performance optimization focus
- `--focus security` - Security analysis and hardening
- `--focus quality` - Code quality and maintainability
- `--focus architecture` - System design and structure

### 📊 Scope Flags
- `--scope file` - Single file analysis
- `--scope module` - Module/directory level
- `--scope project` - Entire project scope
- `--scope system` - System-wide analysis

### ⚙️ Behavior Flags
- `--validate` - Pre-operation validation and risk assessment
- `--safe-mode` - Maximum validation with conservative execution
- `--loop` - Enable iterative improvement mode
- `--verbose` - Maximum detail and explanation
- `--uc` - Ultra-compressed output (30-50% token reduction)

---

## Quick Reference Card

| Command | Purpose | Common Flags | Example |
|---------|---------|--------------|---------|
| `/analyze` | System analysis | `--think-hard --focus` | `/analyze --focus security` |
| `/build` | Project building | `--api --ui --watch` | `/build apps/app --ui` |
| `/implement` | Feature creation | `--type --framework` | `/implement auth --type api` |
| `/improve` | Enhancement | `--performance --loop` | `/improve --performance --loop` |
| `/test` | Testing workflows | `--coverage --watch` | `/test e2e --coverage` |
| `/document` | Documentation | `--api --examples` | `/document --api --examples` |

---

*Use `/help` for basic Claude Code commands or reference this file for custom project commands.*