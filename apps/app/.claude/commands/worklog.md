# Agent Work Log Template

Use this command: `/worklog`

The agent will automatically:

1. Generate a unique session ID based on current context
2. Analyze the work performed to determine the focus area
3. Create a comprehensive work log

## Auto-Generated Header Format

```
# Agent [X]: [Auto-Detected Focus Area] Work Log

**Date:** [Auto: Current date YYYY-MM-DD]
**Time:** [Auto: Current time HH:MM TZ]
**Session ID:** [Auto: focus-area-YYYYMMDD-HHMMSS]
**Agent:** [Auto: Agent identifier]
**Branch/Context:** [Auto: Current git branch or context]
**Session Duration:** [Auto: Calculate from start time or estimate]
**Focus Area:** [Auto: Detected from files modified/tasks completed]
```

## Session ID Generation Rules

The agent should generate session IDs using this format:
`[focus-area-abbreviation]-[YYYYMMDD]-[HHMMSS]`

**Focus Area Detection Logic:**

- **frontend-ui**: Modified React components, styles, UI files
- **backend-api**: Modified API routes, server logic, database
- **database**: Schema changes, migrations, data operations
- **testing**: Test files, QA, debugging activities
- **docs**: Documentation, README, comments
- **deployment**: Build, CI/CD, infrastructure
- **research**: Investigation, analysis, proof-of-concepts
- **bugfix**: Primarily fixing existing issues
- **feature**: Adding new functionality
- **refactor**: Code cleanup, optimization, restructuring
- **integration**: Connecting systems, third-party APIs
- **security**: Auth, permissions, vulnerability fixes

**Examples of Auto-Generated Session IDs:**

- `frontend-ui-20241229-153045`
- `backend-api-20241229-140815`
- `bugfix-database-20241229-092330`
- `feature-integration-20241229-161205`

## Core Sections (Required)

### 📋 Overview

- **Primary Objective:** [1-2 sentence summary]
- **Completion Status:** [Percentage or qualitative assessment]
- **Key Achievements:** [3-5 bullet points of main accomplishments]

### 🎯 Tasks Completed

For each major task area, use priority indicators:

- 🔴 **Critical/Urgent**
- 🟡 **High Priority**
- 🟢 **Standard Priority**
- 🔵 **Enhancement/Nice-to-have**

#### [Task Category] [Priority Icon]

**Files Modified:**

- `path/to/file.ext` - [Brief description of changes]
- `path/to/another/file.ext` - [Brief description of changes]

**Key Changes:**

- [Specific technical detail]
- [Another specific change]
- [Impact or improvement made]

**Issues Resolved:**

- [Problem description] → [Solution implemented]

### 🔧 Technical Details

#### New Files Created ([X] total)

1. `file/path.ext` - [Purpose and functionality]
2. `file/path.ext` - [Purpose and functionality]

#### Enhanced/Modified Files ([X] total)

1. `file/path.ext` - [What was changed and why]
2. `file/path.ext` - [What was changed and why]

#### Deleted/Deprecated ([X] total)

1. `file/path.ext` - [Reason for removal]

### 🗄️ Database/API Changes

- **New Endpoints:** [List with brief descriptions]
- **Modified Endpoints:** [List with changes made]
- **Database Schema:** [Any structural changes]
- **Integration Points:** [How changes connect to existing systems]

### 🐛 Issues & Debugging

#### Issues Encountered

1. **Issue:** [Description]
   - **Cause:** [Root cause analysis]
   - **Resolution:** [How it was fixed]
   - **Prevention:** [How to avoid in future]

#### Known Issues/Limitations

- [Issue 1]: [Description and potential impact]
- [Issue 2]: [Workaround or future fix needed]

### 📊 Quality Metrics

#### Code Quality

- **Tests Added/Modified:** [Number and coverage]
- **Error Handling:** [Improvements made]
- **Performance Impact:** [Any optimizations or concerns]
- **Security Considerations:** [Any security implications]

#### Success Criteria

- ✅ [Specific measurable outcome achieved]
- ✅ [Another measurable outcome]
- ⚠️ [Partial success or needs follow-up]
- ❌ [Failed objective - with explanation]

### 🔗 Integration Status

#### ✅ Working Systems

- [System/feature 1]: [Brief status]
- [System/feature 2]: [Brief status]

#### ⚠️ Needs Attention

- [System/feature]: [What needs to be done]

#### 🚫 Blocked/Broken

- [System/feature]: [Issue and dependencies]

### 🏗️ Architecture Decisions

#### [Decision Name]

- **Decision:** [What was decided]
- **Rationale:** [Why this approach was chosen]
- **Alternatives Considered:** [Other options evaluated]
- **Impact:** [How this affects the system]
- **Result:** [Outcome of the decision]

### 📈 Next Steps & Recommendations

#### Immediate Priorities (Next Session)

1. [Priority 1]: [Specific action needed]
2. [Priority 2]: [Specific action needed]

#### Medium-term Goals (Next 2-3 Sessions)

1. [Goal 1]: [Description and rationale]
2. [Goal 2]: [Description and rationale]

#### Future Considerations

- [Consideration 1]: [Long-term planning item]
- [Consideration 2]: [Technical debt or enhancement]

### 🎯 Handoff Information

#### For Next Agent

- **Context:** [Key background information]
- **Current State:** [Where things stand]
- **Blockers:** [Any issues that need resolution]
- **Resources:** [Helpful files, docs, or references]

#### Environment State

- **Branch Status:** [Clean/has uncommitted changes/merge conflicts]
- **Dependencies:** [Any new packages or requirements]
- **Configuration:** [Environment or config changes made]

### 📋 Verification Checklist

Before submitting, verify:

- [ ] All file paths are accurate and complete
- [ ] Technical terminology is precise
- [ ] Decision rationales are clear
- [ ] Next steps are specific and actionable
- [ ] No sensitive information is included
- [ ] Success metrics are measurable
- [ ] Integration impacts are documented

---

**Work Log Completed:** [Timestamp]
**Next Recommended Focus:** [Suggestion for continuation]
