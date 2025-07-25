# Documentation Standards

This document outlines the standards and guidelines for creating and maintaining documentation across the Ultraterrestrial project.

## 📋 General Principles

### 1. Clarity and Accessibility
- Write for your audience (developers, users, contributors)
- Use clear, concise language
- Avoid jargon unless necessary (define when used)
- Include practical examples and code samples

### 2. Consistency
- Follow established templates and structures
- Use consistent terminology throughout
- Maintain uniform formatting and style
- Cross-reference related documentation

### 3. Completeness
- Cover all public APIs and features
- Include setup, usage, and troubleshooting
- Provide context and rationale for decisions
- Document breaking changes and migrations

### 4. Maintainability
- Keep documentation close to code
- Update docs with code changes
- Use automation where possible
- Regular review and cleanup cycles

## 📁 File Organization

### File Naming Conventions

```
# Good examples
README.md                    # Package/app overview
api-reference.md            # API documentation
troubleshooting.md          # Issue resolution
getting-started.md          # Quick start guide
configuration.md            # Setup and config

# Bad examples
readme.txt                  # Wrong format
API_Docs.md                # Inconsistent casing
troubleshoot.md            # Abbreviated/unclear
```

### Directory Structure

```
package-or-app/
├── README.md              # Main documentation
├── CHANGELOG.md           # Version history
├── docs/                  # Detailed documentation
│   ├── api/              # API references
│   ├── guides/           # How-to guides
│   ├── examples/         # Usage examples
│   └── troubleshooting/  # Issue resolution
└── src/                  # Source code
```

## ✍️ Writing Guidelines

### Markdown Standards

#### Headers
```markdown
# H1 - Document Title (one per document)
## H2 - Major Sections
### H3 - Subsections
#### H4 - Details (use sparingly)
```

#### Code Blocks
```markdown
# Specify language for syntax highlighting
\`\`\`typescript
const example = "Always specify the language";
\`\`\`

# Use inline code for short snippets
Use the \`className\` prop for styling.
```

#### Lists
```markdown
# Use bullet points for unordered lists
- Item one
- Item two
  - Nested item
  - Another nested item

# Use numbers for ordered lists
1. First step
2. Second step
3. Third step
```

#### Links
```markdown
# Internal links (relative paths)
See the [API Reference](./api/README.md) for details.

# External links
Visit [OpenAI](https://openai.com) for more information.

# Link to specific sections
Jump to [Installation](#installation) section.
```

### Content Structure

#### README Files
Every README should include:

1. **Title and Description** - What and why
2. **Quick Start** - Fastest path to success
3. **Features** - What it can do
4. **Installation/Setup** - How to get started
5. **Usage Examples** - Practical demonstrations
6. **API Reference** - Interface documentation
7. **Contributing** - How to help
8. **Troubleshooting** - Common issues

#### API Documentation
- **Method/Function signature**
- **Parameters** with types and descriptions
- **Return values** with types
- **Usage examples**
- **Error conditions**
- **Related methods/functions**

#### Guides and Tutorials
- **Objective** - What you'll learn/build
- **Prerequisites** - What you need to know/have
- **Step-by-step instructions**
- **Code examples** for each step
- **Expected outcomes**
- **Next steps** or related guides

## 🎨 Formatting Standards

### Typography
- Use **bold** for emphasis and important terms
- Use *italics* for subtle emphasis or foreign terms
- Use `inline code` for code elements, file names, and commands
- Use > blockquotes for important notes or warnings

### Code Examples
```typescript
// ✅ Good: Complete, runnable example
import { createUser } from '@ultraterrestrial/users';

const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com'
});

// ❌ Bad: Incomplete or unclear example
const user = createUser(data);
```

### Callouts and Admonitions
```markdown
> **Note**: This feature is experimental and may change.

> **Warning**: This operation cannot be undone.

> **Tip**: You can use keyboard shortcuts to speed up development.
```

## 🔧 Technical Standards

### Code Documentation

#### TypeScript/JavaScript
```typescript
/**
 * Creates a new user in the system
 * 
 * @param userData - The user information
 * @param options - Additional configuration options
 * @returns Promise resolving to the created user
 * 
 * @example
 * ```typescript
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * ```
 */
async function createUser(
  userData: UserData,
  options?: CreateUserOptions
): Promise<User> {
  // Implementation
}
```

#### React Components
```typescript
/**
 * A reusable button component with multiple variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** The visual style variant */
  variant: 'primary' | 'secondary' | 'danger';
  /** Button text content */
  children: React.ReactNode;
  /** Click handler function */
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  // Component implementation
};
```

### Environment Configuration
Document all environment variables:

```markdown
## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `API_KEY` | Yes | - | External service API key |
| `DEBUG` | No | `false` | Enable debug logging |
```

## 🔍 Quality Assurance

### Review Checklist

Before publishing documentation:

- [ ] **Accuracy**: All information is correct and current
- [ ] **Completeness**: All necessary information is included
- [ ] **Clarity**: Easy to understand for the target audience
- [ ] **Examples**: Working code examples provided
- [ ] **Links**: All internal and external links work
- [ ] **Formatting**: Follows markdown and style standards
- [ ] **Grammar**: Proper spelling and grammar
- [ ] **Structure**: Logical flow and organization

### Automated Checks

#### Markdown Linting
```bash
# Use markdownlint for consistency
bun run lint:docs

# Check for broken links
bun run check:links
```

#### Spell Checking
```bash
# Use cspell for spell checking
bun run spell:check
```

## 🔄 Maintenance Workflow

### Regular Updates
- **Monthly**: Review and update package documentation
- **Quarterly**: Comprehensive documentation audit
- **Release cycles**: Update version-specific information
- **Breaking changes**: Update migration guides

### Change Management
1. **Code changes**: Update related documentation in same PR
2. **API changes**: Update API documentation immediately
3. **New features**: Create feature documentation
4. **Deprecations**: Add deprecation notices and migration paths

### Documentation Ownership
- **Package maintainers**: Responsible for package documentation
- **Feature teams**: Responsible for feature documentation
- **Documentation team**: Responsible for cross-cutting documentation

## 📊 Metrics and Success

### Documentation Quality Metrics
- **Coverage**: Percentage of public APIs documented
- **Freshness**: Average age of documentation updates
- **Accessibility**: Time to find information
- **Completeness**: Percentage of sections filled in templates

### User Feedback
- **Issues**: Track documentation-related issues
- **Questions**: Monitor support channels for repeated questions
- **Contributions**: Encourage community documentation contributions

---

Following these standards ensures our documentation remains high-quality, consistent, and valuable for all users of the Ultraterrestrial project.