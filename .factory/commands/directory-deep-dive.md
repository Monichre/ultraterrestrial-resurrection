---
description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (entry points, exports), hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

description: Analyze a target directory’s purpose, structure, and key entry points
argument-hint: [directory-path]
---

# Directory Deep Dive

Analyze directory **$ARGUMENTS** (or current dir if none) for purpose, architecture, and entry points.

## Steps

1. Identify the directory path from $ARGUMENTS.
2. Map structure:
   - Key files (index/entrypoints), exports, hooks/components/utilities.
   - Config, routes, and data layer touchpoints.
3. Summarize architecture principles and patterns used.
4. List main responsibilities and boundaries; note dependencies or shared utilities.
5. Surface risks (dead code, duplication, anti-patterns) and immediate quick wins.

## Output

- Purpose statement
- Key files and roles
- Data/control flow notes
- Risks + suggested next steps

---

argument-hint: [scope] | --modules | --patterns | --dependencies | --security
description: directory deep dive with architecture review and design patterns analysis
---

Analyze directory structure and purpose

## Instructions

1. **Target Directory**
   - Focus on the specified directory `$ARGUMENTS` or the current working directory

2. **Investigate Architecture**
   - Analyze the implementation principles and architecture of the code in this directory and its subdirectories
   - Look for:
     - Design patterns being used
     - Dependencies and their purposes
     - Key abstractions and interfaces
     - Naming conventions and code organization

3. **Create or Update Documentation**
   - Create a CLAUDE.md file capturing this knowledge
   - If one already exists, update it with newly discovered information
   - Include:
     - Purpose and responsibility of this module
     - Key architectural decisions
     - Important implementation details
     - Common patterns used throughout the code
     - Any gotchas or non-obvious behaviors

4. **Ensure Proper Placement**
   - Place the CLAUDE.md file in the directory being analyzed
   - This ensures the context is loaded when working in that specific area

## Credit

This command is based on the work of Thomas Landgraf: <https://thomaslandgraf.substack.com/p/claude-codes-memory-working-with>
