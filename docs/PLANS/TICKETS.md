---
description: Todo2 MCP Integration - AI-powered todo management with 6 optimized MCP tools - use this Complete Workflow Process to manage all your queries everytime! No exceptions!
alwaysApply: true
---

# 🧠 AI Task State Machine with Todo2 + MCP

## 🚨 CRITICAL TODO2 WORKFLOW REQUIREMENT

**⚠️ ABSOLUTE RULE: EVERY USER REQUEST MUST USE TODO2 WORKFLOW ⚠️**

**BEFORE ANY WORK, YOU MUST:**

1. 📋 **Create todo(s)** based on intelligent complexity assessment
2. 🔍 **Search the local codebase** for existing patterns and context
3. 🌐 **Search the internet** for 2025 information using web search tools
4. 📝 **Document both searches** in a research_with_links comment with verified links

**🧠 INTELLIGENT TASK CREATION: ASSESS COMPLEXITY, OPTIMIZE EFFICIENCY 🧠**

**TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**

---

## 🎯 SIMPLICITY & CLEAN CODE MANDATE

**⚠️ CRITICAL: AI MUST ALWAYS PREFER SIMPLE, CLEAN SOLUTIONS ⚠️**

**🧹 CLEAN CODE PRINCIPLES (NON-NEGOTIABLE):**

- **Simple over Complex**: Always choose the straightforward approach over elaborate solutions
- **Clear over Clever**: Prioritize readability and understanding over showing off technical prowess
- **Minimal over Maximal**: Use the least amount of code necessary to solve the problem effectively
- **Direct over Abstract**: Avoid unnecessary layers of abstraction unless truly needed for the specific use case

**🚫 FORBIDDEN APPROACHES:**

- **Reinventing the wheel**: Building custom solutions when proven libraries/tools already exist
- Over-engineering simple problems with complex patterns
- Creating unnecessary abstractions "for future flexibility"
- Using advanced features when basic ones suffice
- Building elaborate architectures for straightforward tasks
- Adding complexity without clear, immediate benefit

**✅ PREFERRED APPROACHES:**

- **Leverage existing solutions first**: Search for proven libraries, frameworks, and tools before building from scratch
- **Don't reinvent the wheel**: Use established, well-maintained packages and solutions that solve your problem
- Use built-in language features and standard libraries first
- Choose well-established, simple patterns over exotic ones
- Write code that a junior developer can easily understand
- Implement the most direct solution that meets the requirements
- Add complexity only when requirements explicitly demand it

**🎯 SIMPLICITY DECISION FRAMEWORK:**

1. "Does a library or existing solution already solve this problem?" → If YES, use the existing solution
2. "Is there a simpler way to achieve the same result?" → If YES, use the simpler way
3. "Would a junior developer understand this immediately?" → If NO, simplify further
4. "Am I adding complexity for hypothetical future needs?" → If YES, remove the complexity
5. "Does this solution do exactly what's needed, no more?" → If NO, trim to requirements

**Remember: The best code is not the cleverest code—it's the code that solves the problem clearly and simply.**

---

## 📋 Documentation Sections

This workflow is organized into focused sections for better maintainability:

### 🔄 Workflow Requirements

- Task assessment policy and decision framework
- Task lifecycle state machine
- Review workflow and human approval requirements
- Intelligent task creation strategy

# 🧠 AI Task State Machine with Todo2 + MCP

## 🚨 CRITICAL TODO2 WORKFLOW REQUIREMENT

**⚠️ ABSOLUTE RULE: EVERY USER REQUEST MUST USE TODO2 WORKFLOW ⚠️**

**BEFORE ANY WORK, YOU MUST:**

1. 📋 **Create todo(s)** based on intelligent complexity assessment (see guidelines below)
2. 🔍 **Search the local codebase** for existing patterns and context
3. 🌐 **Search the internet** for 2025 information using web search tools
4. 📝 **Document both searches** in a research_with_links comment with verified links

**🧠 INTELLIGENT TASK CREATION: ASSESS COMPLEXITY, OPTIMIZE EFFICIENCY 🧠**

**TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**

### 🎯 INTELLIGENT TASK ASSESSMENT POLICY

**✅ CREATE MULTIPLE TASKS (2-10) WHEN:**

- **Complex Implementation**: Requires research + design + implementation + testing phases
- **Multiple Components**: Changes span multiple files, systems, or teams
- **Parallel Work Opportunities**: Different aspects can be worked on simultaneously
- **Unknown Territory**: Requires investigation before implementation approach is clear
- **High-Stakes Changes**: Benefits from staged approach with validation points
- **Cross-Functional Work**: Involves multiple stakeholders or approval steps
- **Time Investment**: Estimated 2+ hours of work or spans multiple sessions

**✅ SINGLE TASK IS ACCEPTABLE WHEN:**

- **Simple Bug Fixes**: Clear problem with obvious solution (< 1 hour)
- **Minor Configuration**: Quick settings or parameter changes
- **Trivial Updates**: Simple text changes, typo fixes, or basic documentation
- **Well-Understood Changes**: Routine work with established patterns
- **Atomic Operations**: Complete, self-contained changes

**🎯 DECISION FRAMEWORK - ASK YOURSELF:**

1. "Does this require research to understand the approach?" → If YES, likely needs multiple tasks
2. "Can different parts be worked on in parallel?" → If YES, split for efficiency
3. "Is this a routine change I've done many times?" → If YES, single task may suffice
4. "Will this take more than 1-2 hours?" → If YES, consider breaking down
5. "Does this touch multiple systems/files?" → If YES, likely needs multiple tasks

**If ANY of questions 1, 2, 4, or 5 are YES → CREATE MULTIPLE TASKS**
**If ALL are NO and it's routine/simple → SINGLE TASK IS ACCEPTABLE**

### 🚫 UPDATED POLICY EXAMPLES

- **Complex Bug Fixes** (unknown root cause) → Multiple tasks (investigate → fix → test)
- **Simple Bug Fixes** (obvious typo/config) → Single task acceptable
- **New Features** → Multiple tasks (research → design → implement → test)
- **Quick Documentation** (adding a paragraph) → Single task acceptable
- **Major Documentation** (new guide/restructure) → Multiple tasks
- **API Integration** → Multiple tasks (research → implement → test)
- **Configuration Change** (known parameter) → Single task acceptable

**EVERY SINGLE INTERACTION MUST START WITH create_todos - COUNT BASED ON COMPLEXITY**

**🎯 REMEMBER: Optimize for efficiency, not artificial task inflation!**

---

## 🔄 Task Lifecycle as a State Machine

```text
[PLANNED]
    ↓ research_with_links (required)
[RESEARCHED]
    ↓ specification gathering (if complex task)
[SPECIFICATIONS CLARIFIED]
    ↓ status: In Progress
[IN PROGRESS]
    ↓ status: Review + result
[REVIEW - AWAITING HUMAN FEEDBACK] ⚠️ HUMAN APPROVAL REQUIRED ⚠️
    ↓ human approval → status: Done
    ↓ human requests changes → status: In Progress
[IMPLEMENTED]
    ↓ final review triggered
[DONE]
    ↓ MANDATORY TASK REFINEMENT (required)
[TASK REFINEMENT PHASE]
    ↓ assess remaining tasks + create/update/delete as needed
    ↘ new/updated/deleted todos → [PLANNED]
```

## 🚨 **CRITICAL REVIEW WORKFLOW WARNING** 🚨

**⚠️ ABSOLUTE RULE: REVIEW STATE REQUIRES EXPLICIT HUMAN APPROVAL ⚠️**

**🔍 REVIEW STATE BEHAVIOR:**

- **AI MUST STOP** at Review status and wait for human feedback
- **NO AUTO-COMPLETION** - Tasks do not automatically move to Done
- **HUMAN APPROVAL REQUIRED** - Only humans can approve Review → Done transition
- **FEEDBACK LOOP** - Humans can request changes via comments
- **AI RESPONSE** - If changes requested, AI returns task to "In Progress" and fixes issues

**❌ FORBIDDEN ACTIONS IN REVIEW STATE:**

- AI cannot mark tasks as "Done" without explicit human approval
- AI cannot assume task completion after adding result comments
- AI cannot skip the human review and approval process
- AI cannot auto-advance tasks from Review to Done status

**✅ CORRECT REVIEW WORKFLOW:**

1. **AI completes work** → Adds result comment → Moves to "Review"
2. **AI waits** → No further action until human responds
3. **Human reviews** → Provides feedback via comments or approval
4. **If approved** → Human marks task as "Done"
5. **If changes needed** → Human adds feedback comment → AI moves to "In Progress" → AI fixes issues

**🎯 REVIEW STATE ENFORCEMENT:**

- Review status is a **HUMAN GATE** in the workflow
- AI must respect human decision-making authority
- All Review → Done transitions require human authorization
- AI should encourage human review and feedback

---

## 🔄 **MANDATORY TASK REFINEMENT AFTER COMPLETION** 🔄

**⚠️ ABSOLUTE RULE: EVERY TASK COMPLETION MUST TRIGGER TASK REFINEMENT ⚠️**

When a task is marked as "Done", AI MUST immediately:

1. **📋 ASSESS** - Review all incomplete tasks in current project/context
2. **🆕 CREATE** - Add new tasks based on completion learnings or newly identified requirements  
3. **✏️ UPDATE** - Modify existing task descriptions, priorities, or dependencies based on new information
4. **🗑️ DELETE** - Remove tasks that are no longer relevant or necessary

**🔍 QUICK ASSESSMENT GUIDE:**

- **Create tasks** → Additional work revealed, new requirements discovered, follow-up actions needed
- **Update tasks** → Changed context/constraints, shifted priorities, modified technical approaches  
- **Delete tasks** → Redundant work, obsolete requirements, better approaches found

**📝 DOCUMENTATION:** Add note comment documenting number of tasks created/updated/deleted and reasoning.

**🚫 FORBIDDEN:** Marking task Done without refinement assessment or skipping refinement "to save time"

---

### 🔄 **INTELLIGENT TASK CREATION STRATEGY**

**🧠 CONTEXT-AWARE TASK PLANNING - EFFICIENCY OVER PROCESS 🧠**

**⚠️ CORE PRINCIPLE: MATCH TASK COUNT TO ACTUAL COMPLEXITY ⚠️**

**✅ MULTI-TASK SCENARIOS (2-10 tasks):**

- **Research Required**: Unknown solution approach or technology
- **Multi-Component**: Changes across different systems/files
- **Staged Implementation**: Benefits from validation checkpoints
- **Parallel Opportunities**: Different aspects can progress simultaneously
- **Cross-Team Coordination**: Requires multiple stakeholder involvement
- **Extended Timeline**: Work spanning multiple sessions/days

**✅ SINGLE TASK SCENARIOS:**

- **Routine Operations**: Well-understood changes with clear approach
- **Atomic Changes**: Complete, self-contained modifications
- **Quick Fixes**: Simple solutions to obvious problems
- **Minor Updates**: Small text, config, or documentation changes

**🎯 INTELLIGENT ASSESSMENT QUESTIONS:**

1. "Do I need to research how to approach this?" → Research complexity indicator
2. "Can parts of this work happen in parallel?" → Parallelization opportunity
3. "Is this a routine change I've done before?" → Complexity assessment
4. "Will this require multiple work sessions?" → Scope indicator
5. "Does this touch multiple systems/teams?" → Integration complexity

**Smart Decision Logic:**

- **2+ YES answers** → Multiple tasks likely beneficial
- **Mostly NO answers** → Single task probably sufficient
- **Uncertain complexity** → Start with research task, then assess

*💡 Focus on optimizing workflow efficiency, not maximizing task count*

---

## 🎯 **TASK REFINEMENT ENFORCEMENT POLICY**

**⚠️ CRITICAL: TASK COMPLETION WITHOUT REFINEMENT IS INCOMPLETE ⚠️**

**🔒 ENFORCEMENT RULES:**

- **Task marked as "Done"** → **MUST immediately trigger refinement assessment**
- **No exceptions** → Every completion requires refinement evaluation
- **Documentation required** → Must document refinement decisions in note comments
- **Systematic approach** → Follow the CREATE/UPDATE/DELETE assessment criteria

**📊 REFINEMENT SUCCESS METRICS:**

- **Proactive task creation** → Identifying follow-up work before it becomes urgent
- **Accurate task updates** → Keeping task descriptions and priorities current
- **Efficient task deletion** → Removing obsolete work to maintain focus
- **Learning integration** → Applying completion insights to improve remaining tasks

**🚫 VIOLATION CONSEQUENCES:**

- **Incomplete workflow** → Task completion without refinement is considered incomplete
- **Technical debt** → Obsolete tasks accumulate and reduce system effectiveness
- **Missed opportunities** → Failure to identify follow-up work leads to gaps
- **Reduced quality** → Lack of refinement degrades overall project execution

**✅ SUCCESS INDICATORS:**

- Remaining tasks stay relevant and up-to-date
- New requirements are captured promptly as tasks
- Task backlog reflects current project reality
- Continuous improvement is embedded in the workflow

### 🔬 Research Protocol

- Mandatory research phase checklist
- Local codebase search requirements
- Internet research with verified links
- Specification gathering guidelines

# 🔬 MANDATORY RESEARCH PROTOCOL (CRITICAL)

**⚠️ ABSOLUTE REQUIREMENT: NO IMPLEMENTATION WITHOUT RESEARCH ⚠️**

### Research Phase Checklist (MUST COMPLETE ALL)

1. **🔍 LOCAL CODEBASE SEARCH (REQUIRED FIRST)**
   - Search existing project files for context and patterns
   - Identify current architecture, dependencies, and coding conventions
   - **MUST include code snippets** showing existing implementations
   - **MUST analyze** file structure, naming conventions, and patterns

2. **🌐 INTERNET RESEARCH (MANDATORY - NO EXCEPTIONS)**
   - **MUST** use web search tools to find 2025 information
   - **MUST** include 2-10 REAL, VERIFIED links (NO HALLUCINATED URLs)
   - **ONLY use URLs that were actually returned by web search tools**
   - **MUST analyze and synthesize** findings from each source

3. **📦 LIBRARY ASSESSMENT (WHEN APPLICABLE)**
   - Check current versions, security status, and compatibility
   - Verify package maintainer activity and community support
   - Compare alternatives and assess performance implications

4. **📝 RESEARCH DOCUMENTATION (ENFORCED)**
   - Format: `**MANDATORY RESEARCH COMPLETED** ✅`
   - Section 1: **Local Codebase Analysis:** (detailed findings with code snippets)
   - Section 2: **Internet Research (2025):** (links with analysis)
   - Section 3: **Library Assessment:** (versions, security, alternatives - if applicable)
   - Section 4: **Synthesis & Recommendation:** (final decision with justification)

---

## 🔍 SPECIFICATION GATHERING PHASE (WHEN NEEDED)

**⚠️ AI INTELLIGENTLY ASSESSES WHEN TO ASK SPECIFICATION QUESTIONS ⚠️**

After research completion, AI should assess whether specifications are clear or need clarification. If requirements are ambiguous or incomplete, AI should ask relevant questions about:

- **Functional Requirements:** Features, behaviors, edge cases, input/output
- **Technical Specifications:** Performance, constraints, security requirements  
- **Scope & Constraints:** Boundaries, timeline, budget, dependencies
- **User Experience:** Interaction design, usability, accessibility

**Workflow:** Research → Assess clarity → Ask questions if needed → Document responses → Implement

### 🔗 **REQUIRED LINK FORMAT (CRITICAL)**

**INTERNET RESEARCH MUST USE THIS EXACT FORMAT:**

```markdown
**Internet Research (2025):**

🔗 **[Descriptive Page Title](https://real-url-from-search)**
- **Found via web search:** Brief description of content source
- **Key Insights:** Specific techniques, patterns, or solutions from this source
- **Applicable to Task:** How this information applies to our implementation
- **Code Examples:** Any relevant code patterns mentioned

🔗 **[Another Source Title](https://another-real-url)**
- **Found via web search:** Description of this source
- **Key Insights:** Important findings from this source
- **Applicable to Task:** Specific relevance to our implementation
```

**🚫 CRITICAL LINK RULES:**

- **NEVER** create fake URLs (example.com, placeholder links)
- **ONLY** use URLs actually returned by web search tools
- **ALWAYS** include descriptive link text, not just raw URLs
- **MUST** analyze and explain relevance to your specific task

**🚫 IMPLEMENTATION BLOCKED UNTIL RESEARCH COMMENT IS ADDED**

### 📝 Task Templates

- Comprehensive task description requirements
- 7-section task template with examples
- Task completion workflow and requirements

# 📝 MANDATORY DETAILED TASK DESCRIPTIONS

**⚠️ REQUIREMENT: ALL TASK DESCRIPTIONS MUST BE COMPREHENSIVE ⚠️**

**Each long_description MUST include:**

1. **🎯 Objective:** Clear goal and expected outcome
2. **📋 Acceptance Criteria:** Specific, measurable requirements (3-5 bullet points)
3. **🚫 Scope Boundaries:** Explicit inclusions, exclusions, and clarification needs
4. **🔧 Technical Requirements:** Technologies, frameworks, patterns to use
5. **📁 Files/Components:** Specific files that will be created/modified
6. **🧪 Testing Requirements:** How success will be validated
7. **⚠️ Edge Cases:** Potential issues and how to handle them
8. **📚 Dependencies:** What must be completed first (if any)

### 📋 **TASK DESCRIPTION TEMPLATE (Copy & Modify):**

```markdown
🎯 **Objective:** [Clear goal and expected outcome in one sentence]

📋 **Acceptance Criteria:**
- [Specific, measurable requirement 1]
- [Specific, measurable requirement 2] 
- [Specific, measurable requirement 3]
- [Additional criteria as needed]

🚫 **Scope Boundaries (CRITICAL):**
- **Included:** [Explicitly list what IS part of this task]
- **Excluded:** [Explicitly list what is NOT part of this task]
- **Clarification Required:** [List any ambiguous areas that need user input]

🔧 **Technical Requirements:**
- [Technology/framework/pattern to use]
- [Architecture or design pattern requirements]
- [Performance or compatibility requirements]

📁 **Files/Components:**
- Create: [/path/to/new/file.ext] ([purpose])
- Update: [/path/to/existing/file.ext] ([changes needed])
- Delete: [/path/to/obsolete/file.ext] ([reason])

🧪 **Testing Requirements:**
- [How success will be validated]
- [Specific test scenarios to cover]
- [Performance or quality benchmarks]

⚠️ **Edge Cases:**
- [Potential issue 1 and mitigation]
- [Potential issue 2 and mitigation]
- [Error conditions to handle]

📚 **Dependencies:** [List todo IDs that must be completed first, or "None"]
```

---

## 🚫 TASK COMPLETION REQUIREMENTS (ENFORCED)

**⚠️ CRITICAL: TASKS CANNOT BE MARKED "Done" WITHOUT RESULT COMMENT ⚠️**

**COMPLETION WORKFLOW (MANDATORY):**

1. **Complete the work** - Implement, test, and verify the solution
2. **Add result comment** - Document what was accomplished, lessons learned, outcomes
3. **Then mark as Done** - Status update will only succeed if result comment exists

**❌ BLOCKED ACTIONS:**

- `update_todos({status: "Done"})` **will fail** if no result comment exists
- Status will remain unchanged and error message will explain requirements
- User feedback rejecting completion will be respected

**✅ PROPER COMPLETION:**

```typescript
// Step 1: Add result comment first
add_comments({
  todoId: "T-1",
  comments: [{ type: "result", content: "Task completed successfully..." }]
})

// Step 2: Then mark as Done (will succeed)
update_todos({ updates: [{ id: "T-1", status: "Done" }] })
```

### 📚 MCP Tools Reference

- Complete MCP tools documentation
- Comment types and their purposes
- Tool usage guidelines

# 📚 MCP Tools Reference

| Tool               | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| create_todos       | Create task(s) with names, long_descriptions, priorities, tags, and dependencies |
| list_todos         | View filtered task lists (by status, tag, priority, or dependency readiness)     |
| update_todos       | Update status, content, tags, dependencies                                       |
| delete_todos       | Remove obsolete tasks                                                            |
| add_comments       | Attach research, result, note, or manualsetup entries                           |
| get_todo_details   | Retrieve todos with full comments & dependencies                                 |

---

## 🧩 Comment Types

| Type                  | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| research_with_links   | **MANDATORY RESEARCH PROTOCOL**: (1) Search local codebase first, (2) Search internet for 2025 information, (3) Include 2–5 REAL links from web search results |
| manualsetup           | Use **only** for tasks humans must perform (e.g., domain config, API keys) |
| note                  | Track logic, decisions, blockers, **human feedback in Review state**, **specification responses** |
| result                | **MANDATORY BEFORE "Review" STATUS** - Document completion, outcomes, lessons learned |

### ✅ Enforcement Policies

- Non-negotiable key principles
- Agent enforcement policy with penalties
- Final enforcement reminders

# ✅ Key Principles (Non-Negotiable)

| Rule                                                       | Enforcement |
| ---------------------------------------------------------- | ----------- |
| **ALWAYS start with create_todos for EVERY user request**   | ✅           |
| **INTELLIGENTLY assess complexity for appropriate task count** | ✅           |
| **ALWAYS use Todo2 workflow - single or multiple tasks**    | ✅           |
| Always conduct research_with_links before implementation   | ✅           |
| **Include detailed codebase analysis with code snippets**   | ✅           |
| **Use detailed task descriptions with 8 required sections** | ✅           |
| **Define 3-5 measurable acceptance criteria per task**      | ✅           |
| Use create_todos for full project breakdowns              | ✅           |
| Set dependencies during planning                           | ✅           |
| Never skip result or review                                | ✅           |
| **STAY STRICTLY within defined task scope - no expansion**  | ✅           |

---

## 🎯 Scope Control Rules (Critical)

**⚠️ ABSOLUTE RULE: AI MUST NOT EXPAND BEYOND DEFINED TASK BOUNDARIES ⚠️**

### 📋 Scope Boundary Enforcement

- **Work ONLY on what's explicitly requested** in task acceptance criteria
- **Ask for clarification** when requirements are ambiguous - never assume additional work
- **Stop at task completion** - do not add "helpful" features or improvements
- **Use convergent thinking** - focus narrowly on specific deliverables, not broad solutions

### 🚫 Forbidden Scope Expansions

- Adding features not explicitly requested
- "Improving" code beyond the specific task requirements  
- Implementing related functionality "while you're at it"
- Making assumptions about what the user "probably wants"

### ✅ Proper Scope Control

- **Read task acceptance criteria carefully** - these define your exact boundaries
- **When in doubt, ask** - "Should I also implement X?" rather than assuming
- **Focus on convergent solutions** - solve the specific problem, not related problems
- **Deliver exactly what's requested** - no more, no less

**Scope creep kills projects. Stay focused. Stay disciplined.**

---

## 🎯 Agent Enforcement Policy

| Rule                                                              | AI Agent Behavior | Penalty for Violation |
| ----------------------------------------------------------------- | ----------------- | -------------------- |
| **MUST use Todo2 workflow for EVERY user request (no exceptions)** | **ENFORCED**      | **INTERACTION TERMINATED** |
| **MUST start with create_todos before any work**                 | **ENFORCED**      | **INTERACTION TERMINATED** |
| **MUST assess complexity and create appropriate task count**      | **ENFORCED**      | **TASK REJECTED**    |
| **MUST search local codebase first for every research task**     | **ENFORCED**      | **TASK REJECTED**    |
| **MUST include code snippets in local codebase analysis**        | **ENFORCED**      | **TASK REJECTED**    |
| **MUST search internet for 2025 info before coding** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST include 2-10 REAL links from web search (NO FAKE URLs)**   | **ENFORCED**      | **TASK REJECTED**    |
| **MUST use detailed task descriptions with 7 required sections** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST define measurable acceptance criteria (3-5 points)**       | **ENFORCED**      | **TASK REJECTED**    |
| **MUST stay within defined task scope - no unauthorized expansion** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST ask for clarification when scope is ambiguous**           | **ENFORCED**      | **TASK REJECTED**    |
| Must not write code before research_with_links comment           | Enforced          | Task rejected        |
| Must always submit result comments on completion                 | Enforced          | Task incomplete      |
| Must clean or update remaining todos in review                   | Enforced          | Workflow broken      |

---

## 🔒 FINAL ENFORCEMENT REMINDER

**🚨 CRITICAL: This workflow applies to 100% of user interactions 🚨**

### ✅ CORRECT Workflow

1. **User makes request** (any request, any size)
2. **AI immediately calls create_todos** (first action, always)
3. **AI follows complete Todo2 workflow** (research → implement → result → review)
4. **AI completes task and updates todo status**

### ❌ FORBIDDEN Workflow

1. **User makes request**
2. **AI starts working directly** ← **VIOLATION - INTERACTION TERMINATED**
3. **AI skips todo creation** ← **VIOLATION - INTERACTION TERMINATED**

### 📝 ENFORCEMENT SUMMARY

- **Every user message** → Create todo(s) first (count based on complexity)
- **Every code change** → Todo2 workflow required
- **Every question** → Todo2 workflow required  
- **Every analysis** → Todo2 workflow required
- **Every task** → Todo2 workflow required

**REMEMBER: TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**

### 🏗️ Software Development Best Practices

- concise development best practices for 2025
- Clear modular architecture and professional design patterns
- Security by design and performance optimization guidelines

# 🏗️ SOFTWARE DEVELOPMENT BEST PRACTICES

**⚠️ AI MUST FOLLOW THESE PRACTICES FOR ALL CODE GENERATION ⚠️**

## Essential Principles

• **Professional, scalable design** - Use established patterns and design for growth
• **Easily maintainable code** - Clear names, small functions, consistent style
• **Excellent and modern UI/UX** - Responsive, accessible, intuitive interfaces
• **Low custom code** - Leverage existing well-maintained libraries over reinventing
• **Minimalistic code** - Simple solutions, avoid over-engineering
• **Security by design** - Validate inputs, encrypt data, follow OWASP guidelines
• **Performance optimization** - Cache effectively, use async operations, monitor metrics
• **Comprehensive testing** - Unit tests, integration tests, automated quality gates
• **Clear documentation** - API docs, README files, architectural decisions
• **User-centric iteration** - Feature flags, A/B testing, continuous feedback

## AI Enforcement

**Before generating code, ensure:**
• Architecture follows separation of concerns
• Code is readable and well-documented
• Security best practices implemented
• Dependencies are secure and up-to-date
• Performance considerations addressed
• Tests included and comprehensive
• User experience prioritized

**These practices are mandatory for professional software development.**

### 🔧 [Purpose & Summary](./sections/purpose-and-summary.md)

- Workflow purpose and goals
- Workspace structure overview
- System summary and benefits

---

## 🚨 CRITICAL ENFORCEMENT REMINDER

**Every user interaction MUST start with `create_todos` - no exceptions!**

**🎯 DECISION FRAMEWORK - ASK YOURSELF:**

1. "Does this require research to understand the approach?" → If YES, likely needs multiple tasks
2. "Can different parts be worked on in parallel?" → If YES, split for efficiency  
3. "Is this a routine change I've done many times?" → If YES, single task may suffice
4. "Will this take more than 1-2 hours?" → If YES, consider breaking down
5. "Does this touch multiple systems/files?" → If YES, likely needs multiple tasks

**If ANY of questions 1, 2, 4, or 5 are YES → CREATE MULTIPLE TASKS**
**If ALL are NO and it's routine/simple → SINGLE TASK IS ACCEPTABLE**

---

## 🔒 FINAL REMINDER

**🚨 This workflow applies to 100% of user interactions 🚨**

- **Every user message** → Create todo(s) first (count based on complexity)
- **Every code change** → Todo2 workflow required
- **Every question** → Todo2 workflow required  
- **Every analysis** → Todo2 workflow required

**REMEMBER: TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**


---
description: Todo2 MCP Integration - AI-powered todo management with 6 optimized MCP tools - use this Complete Workflow Process to manage all your queries everytime! No exceptions!
alwaysApply: true
---

# 🧠 AI Task State Machine with Todo2 + MCP

## 🚨 CRITICAL TODO2 WORKFLOW REQUIREMENT

**⚠️ ABSOLUTE RULE: EVERY USER REQUEST MUST USE TODO2 WORKFLOW ⚠️**

**BEFORE ANY WORK, YOU MUST:**
1. 📋 **Create todo(s)** based on intelligent complexity assessment 
2. 🔍 **Search the local codebase** for existing patterns and context
3. 🌐 **Search the internet** for 2025 information using web search tools
4. 📝 **Document both searches** in a research_with_links comment with verified links

**🧠 INTELLIGENT TASK CREATION: ASSESS COMPLEXITY, OPTIMIZE EFFICIENCY 🧠**

**TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**

---

## 🎯 SIMPLICITY & CLEAN CODE MANDATE

**⚠️ CRITICAL: AI MUST ALWAYS PREFER SIMPLE, CLEAN SOLUTIONS ⚠️**

**🧹 CLEAN CODE PRINCIPLES (NON-NEGOTIABLE):**
- **Simple over Complex**: Always choose the straightforward approach over elaborate solutions
- **Clear over Clever**: Prioritize readability and understanding over showing off technical prowess
- **Minimal over Maximal**: Use the least amount of code necessary to solve the problem effectively
- **Direct over Abstract**: Avoid unnecessary layers of abstraction unless truly needed for the specific use case

**🚫 FORBIDDEN APPROACHES:**
- **Reinventing the wheel**: Building custom solutions when proven libraries/tools already exist
- Over-engineering simple problems with complex patterns
- Creating unnecessary abstractions "for future flexibility"
- Using advanced features when basic ones suffice
- Building elaborate architectures for straightforward tasks
- Adding complexity without clear, immediate benefit

**✅ PREFERRED APPROACHES:**
- **Leverage existing solutions first**: Search for proven libraries, frameworks, and tools before building from scratch
- **Don't reinvent the wheel**: Use established, well-maintained packages and solutions that solve your problem
- Use built-in language features and standard libraries first
- Choose well-established, simple patterns over exotic ones
- Write code that a junior developer can easily understand
- Implement the most direct solution that meets the requirements
- Add complexity only when requirements explicitly demand it

**🎯 SIMPLICITY DECISION FRAMEWORK:**
1. "Does a library or existing solution already solve this problem?" → If YES, use the existing solution
2. "Is there a simpler way to achieve the same result?" → If YES, use the simpler way
3. "Would a junior developer understand this immediately?" → If NO, simplify further
4. "Am I adding complexity for hypothetical future needs?" → If YES, remove the complexity
5. "Does this solution do exactly what's needed, no more?" → If NO, trim to requirements

**Remember: The best code is not the cleverest code—it's the code that solves the problem clearly and simply.**

---

## 📋 Documentation Sections

This workflow is organized into focused sections for better maintainability:

### 🔄 Workflow Requirements

- Task assessment policy and decision framework
- Task lifecycle state machine
- Review workflow and human approval requirements
- Intelligent task creation strategy

# 🧠 AI Task State Machine with Todo2 + MCP

## 🚨 CRITICAL TODO2 WORKFLOW REQUIREMENT

**⚠️ ABSOLUTE RULE: EVERY USER REQUEST MUST USE TODO2 WORKFLOW ⚠️**

**BEFORE ANY WORK, YOU MUST:**
1. 📋 **Create todo(s)** based on intelligent complexity assessment (see guidelines below)
2. 🔍 **Search the local codebase** for existing patterns and context
3. 🌐 **Search the internet** for 2025 information using web search tools
4. 📝 **Document both searches** in a research_with_links comment with verified links

**🧠 INTELLIGENT TASK CREATION: ASSESS COMPLEXITY, OPTIMIZE EFFICIENCY 🧠**

**TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**

### 🎯 INTELLIGENT TASK ASSESSMENT POLICY

**✅ CREATE MULTIPLE TASKS (2-10) WHEN:**
- **Complex Implementation**: Requires research + design + implementation + testing phases
- **Multiple Components**: Changes span multiple files, systems, or teams
- **Parallel Work Opportunities**: Different aspects can be worked on simultaneously
- **Unknown Territory**: Requires investigation before implementation approach is clear
- **High-Stakes Changes**: Benefits from staged approach with validation points
- **Cross-Functional Work**: Involves multiple stakeholders or approval steps
- **Time Investment**: Estimated 2+ hours of work or spans multiple sessions

**✅ SINGLE TASK IS ACCEPTABLE WHEN:**
- **Simple Bug Fixes**: Clear problem with obvious solution (< 1 hour)
- **Minor Configuration**: Quick settings or parameter changes
- **Trivial Updates**: Simple text changes, typo fixes, or basic documentation
- **Well-Understood Changes**: Routine work with established patterns
- **Atomic Operations**: Complete, self-contained changes

**🎯 DECISION FRAMEWORK - ASK YOURSELF:**
1. "Does this require research to understand the approach?" → If YES, likely needs multiple tasks
2. "Can different parts be worked on in parallel?" → If YES, split for efficiency
3. "Is this a routine change I've done many times?" → If YES, single task may suffice
4. "Will this take more than 1-2 hours?" → If YES, consider breaking down
5. "Does this touch multiple systems/files?" → If YES, likely needs multiple tasks

**If ANY of questions 1, 2, 4, or 5 are YES → CREATE MULTIPLE TASKS**
**If ALL are NO and it's routine/simple → SINGLE TASK IS ACCEPTABLE**

### 🚫 UPDATED POLICY EXAMPLES
- **Complex Bug Fixes** (unknown root cause) → Multiple tasks (investigate → fix → test)
- **Simple Bug Fixes** (obvious typo/config) → Single task acceptable
- **New Features** → Multiple tasks (research → design → implement → test)
- **Quick Documentation** (adding a paragraph) → Single task acceptable
- **Major Documentation** (new guide/restructure) → Multiple tasks
- **API Integration** → Multiple tasks (research → implement → test)
- **Configuration Change** (known parameter) → Single task acceptable

**EVERY SINGLE INTERACTION MUST START WITH create_todos - COUNT BASED ON COMPLEXITY**

**🎯 REMEMBER: Optimize for efficiency, not artificial task inflation!**

---

## 🔄 Task Lifecycle as a State Machine

```text
[PLANNED]
    ↓ research_with_links (required)
[RESEARCHED]
    ↓ specification gathering (if complex task)
[SPECIFICATIONS CLARIFIED]
    ↓ status: In Progress
[IN PROGRESS]
    ↓ status: Review + result
[REVIEW - AWAITING HUMAN FEEDBACK] ⚠️ HUMAN APPROVAL REQUIRED ⚠️
    ↓ human approval → status: Done
    ↓ human requests changes → status: In Progress
[IMPLEMENTED]
    ↓ final review triggered
[DONE]
    ↓ MANDATORY TASK REFINEMENT (required)
[TASK REFINEMENT PHASE]
    ↓ assess remaining tasks + create/update/delete as needed
    ↘ new/updated/deleted todos → [PLANNED]
```

## 🚨 **CRITICAL REVIEW WORKFLOW WARNING** 🚨

**⚠️ ABSOLUTE RULE: REVIEW STATE REQUIRES EXPLICIT HUMAN APPROVAL ⚠️**

**🔍 REVIEW STATE BEHAVIOR:**
- **AI MUST STOP** at Review status and wait for human feedback
- **NO AUTO-COMPLETION** - Tasks do not automatically move to Done
- **HUMAN APPROVAL REQUIRED** - Only humans can approve Review → Done transition
- **FEEDBACK LOOP** - Humans can request changes via comments
- **AI RESPONSE** - If changes requested, AI returns task to "In Progress" and fixes issues

**❌ FORBIDDEN ACTIONS IN REVIEW STATE:**
- AI cannot mark tasks as "Done" without explicit human approval
- AI cannot assume task completion after adding result comments
- AI cannot skip the human review and approval process
- AI cannot auto-advance tasks from Review to Done status

**✅ CORRECT REVIEW WORKFLOW:**
1. **AI completes work** → Adds result comment → Moves to "Review"
2. **AI waits** → No further action until human responds
3. **Human reviews** → Provides feedback via comments or approval
4. **If approved** → Human marks task as "Done"
5. **If changes needed** → Human adds feedback comment → AI moves to "In Progress" → AI fixes issues

**🎯 REVIEW STATE ENFORCEMENT:**
- Review status is a **HUMAN GATE** in the workflow
- AI must respect human decision-making authority
- All Review → Done transitions require human authorization
- AI should encourage human review and feedback

---

## 🔄 **MANDATORY TASK REFINEMENT AFTER COMPLETION** 🔄

**⚠️ ABSOLUTE RULE: EVERY TASK COMPLETION MUST TRIGGER TASK REFINEMENT ⚠️**

When a task is marked as "Done", AI MUST immediately:

1. **📋 ASSESS** - Review all incomplete tasks in current project/context
2. **🆕 CREATE** - Add new tasks based on completion learnings or newly identified requirements  
3. **✏️ UPDATE** - Modify existing task descriptions, priorities, or dependencies based on new information
4. **🗑️ DELETE** - Remove tasks that are no longer relevant or necessary

**🔍 QUICK ASSESSMENT GUIDE:**
- **Create tasks** → Additional work revealed, new requirements discovered, follow-up actions needed
- **Update tasks** → Changed context/constraints, shifted priorities, modified technical approaches  
- **Delete tasks** → Redundant work, obsolete requirements, better approaches found

**📝 DOCUMENTATION:** Add note comment documenting number of tasks created/updated/deleted and reasoning.

**🚫 FORBIDDEN:** Marking task Done without refinement assessment or skipping refinement "to save time"

---

### 🔄 **INTELLIGENT TASK CREATION STRATEGY**

**🧠 CONTEXT-AWARE TASK PLANNING - EFFICIENCY OVER PROCESS 🧠**

**⚠️ CORE PRINCIPLE: MATCH TASK COUNT TO ACTUAL COMPLEXITY ⚠️**

**✅ MULTI-TASK SCENARIOS (2-10 tasks):**
- **Research Required**: Unknown solution approach or technology
- **Multi-Component**: Changes across different systems/files
- **Staged Implementation**: Benefits from validation checkpoints
- **Parallel Opportunities**: Different aspects can progress simultaneously
- **Cross-Team Coordination**: Requires multiple stakeholder involvement
- **Extended Timeline**: Work spanning multiple sessions/days

**✅ SINGLE TASK SCENARIOS:**
- **Routine Operations**: Well-understood changes with clear approach
- **Atomic Changes**: Complete, self-contained modifications
- **Quick Fixes**: Simple solutions to obvious problems
- **Minor Updates**: Small text, config, or documentation changes

**🎯 INTELLIGENT ASSESSMENT QUESTIONS:**
1. "Do I need to research how to approach this?" → Research complexity indicator
2. "Can parts of this work happen in parallel?" → Parallelization opportunity
3. "Is this a routine change I've done before?" → Complexity assessment
4. "Will this require multiple work sessions?" → Scope indicator
5. "Does this touch multiple systems/teams?" → Integration complexity

**Smart Decision Logic:**
- **2+ YES answers** → Multiple tasks likely beneficial
- **Mostly NO answers** → Single task probably sufficient
- **Uncertain complexity** → Start with research task, then assess

*💡 Focus on optimizing workflow efficiency, not maximizing task count*

---

## 🎯 **TASK REFINEMENT ENFORCEMENT POLICY**

**⚠️ CRITICAL: TASK COMPLETION WITHOUT REFINEMENT IS INCOMPLETE ⚠️**

**🔒 ENFORCEMENT RULES:**
- **Task marked as "Done"** → **MUST immediately trigger refinement assessment**
- **No exceptions** → Every completion requires refinement evaluation
- **Documentation required** → Must document refinement decisions in note comments
- **Systematic approach** → Follow the CREATE/UPDATE/DELETE assessment criteria

**📊 REFINEMENT SUCCESS METRICS:**
- **Proactive task creation** → Identifying follow-up work before it becomes urgent
- **Accurate task updates** → Keeping task descriptions and priorities current
- **Efficient task deletion** → Removing obsolete work to maintain focus
- **Learning integration** → Applying completion insights to improve remaining tasks

**🚫 VIOLATION CONSEQUENCES:**
- **Incomplete workflow** → Task completion without refinement is considered incomplete
- **Technical debt** → Obsolete tasks accumulate and reduce system effectiveness
- **Missed opportunities** → Failure to identify follow-up work leads to gaps
- **Reduced quality** → Lack of refinement degrades overall project execution

**✅ SUCCESS INDICATORS:**
- Remaining tasks stay relevant and up-to-date
- New requirements are captured promptly as tasks
- Task backlog reflects current project reality
- Continuous improvement is embedded in the workflow 

### 🔬 Research Protocol

- Mandatory research phase checklist
- Local codebase search requirements
- Internet research with verified links
- Specification gathering guidelines

# 🔬 MANDATORY RESEARCH PROTOCOL (CRITICAL)

**⚠️ ABSOLUTE REQUIREMENT: NO IMPLEMENTATION WITHOUT RESEARCH ⚠️**

### Research Phase Checklist (MUST COMPLETE ALL):

1. **🔍 LOCAL CODEBASE SEARCH (REQUIRED FIRST)**
   - Search existing project files for context and patterns
   - Identify current architecture, dependencies, and coding conventions
   - **MUST include code snippets** showing existing implementations
   - **MUST analyze** file structure, naming conventions, and patterns

2. **🌐 INTERNET RESEARCH (MANDATORY - NO EXCEPTIONS)**
   - **MUST** use web search tools to find 2025 information
   - **MUST** include 2-10 REAL, VERIFIED links (NO HALLUCINATED URLs)
   - **ONLY use URLs that were actually returned by web search tools**
   - **MUST analyze and synthesize** findings from each source

3. **📦 LIBRARY ASSESSMENT (WHEN APPLICABLE)**
   - Check current versions, security status, and compatibility
   - Verify package maintainer activity and community support
   - Compare alternatives and assess performance implications

4. **📝 RESEARCH DOCUMENTATION (ENFORCED)**
   - Format: `**MANDATORY RESEARCH COMPLETED** ✅`
   - Section 1: **Local Codebase Analysis:** (detailed findings with code snippets)
   - Section 2: **Internet Research (2025):** (links with analysis)
   - Section 3: **Library Assessment:** (versions, security, alternatives - if applicable)
   - Section 4: **Synthesis & Recommendation:** (final decision with justification)

---

## 🔍 SPECIFICATION GATHERING PHASE (WHEN NEEDED)

**⚠️ AI INTELLIGENTLY ASSESSES WHEN TO ASK SPECIFICATION QUESTIONS ⚠️**

After research completion, AI should assess whether specifications are clear or need clarification. If requirements are ambiguous or incomplete, AI should ask relevant questions about:

- **Functional Requirements:** Features, behaviors, edge cases, input/output
- **Technical Specifications:** Performance, constraints, security requirements  
- **Scope & Constraints:** Boundaries, timeline, budget, dependencies
- **User Experience:** Interaction design, usability, accessibility

**Workflow:** Research → Assess clarity → Ask questions if needed → Document responses → Implement

### 🔗 **REQUIRED LINK FORMAT (CRITICAL)**

**INTERNET RESEARCH MUST USE THIS EXACT FORMAT:**

```markdown
**Internet Research (2025):**

🔗 **[Descriptive Page Title](https://real-url-from-search)**
- **Found via web search:** Brief description of content source
- **Key Insights:** Specific techniques, patterns, or solutions from this source
- **Applicable to Task:** How this information applies to our implementation
- **Code Examples:** Any relevant code patterns mentioned

🔗 **[Another Source Title](https://another-real-url)**
- **Found via web search:** Description of this source
- **Key Insights:** Important findings from this source
- **Applicable to Task:** Specific relevance to our implementation
```

**🚫 CRITICAL LINK RULES:**
- **NEVER** create fake URLs (example.com, placeholder links)
- **ONLY** use URLs actually returned by web search tools
- **ALWAYS** include descriptive link text, not just raw URLs
- **MUST** analyze and explain relevance to your specific task

**🚫 IMPLEMENTATION BLOCKED UNTIL RESEARCH COMMENT IS ADDED** 

### 📝 Task Templates

- Comprehensive task description requirements
- 7-section task template with examples
- Task completion workflow and requirements

# 📝 MANDATORY DETAILED TASK DESCRIPTIONS

**⚠️ REQUIREMENT: ALL TASK DESCRIPTIONS MUST BE COMPREHENSIVE ⚠️**

**Each long_description MUST include:**
1. **🎯 Objective:** Clear goal and expected outcome
2. **📋 Acceptance Criteria:** Specific, measurable requirements (3-5 bullet points)
3. **🚫 Scope Boundaries:** Explicit inclusions, exclusions, and clarification needs
4. **🔧 Technical Requirements:** Technologies, frameworks, patterns to use
5. **📁 Files/Components:** Specific files that will be created/modified
6. **🧪 Testing Requirements:** How success will be validated
7. **⚠️ Edge Cases:** Potential issues and how to handle them
8. **📚 Dependencies:** What must be completed first (if any)

### 📋 **TASK DESCRIPTION TEMPLATE (Copy & Modify):**

```markdown
🎯 **Objective:** [Clear goal and expected outcome in one sentence]

📋 **Acceptance Criteria:**
- [Specific, measurable requirement 1]
- [Specific, measurable requirement 2] 
- [Specific, measurable requirement 3]
- [Additional criteria as needed]

🚫 **Scope Boundaries (CRITICAL):**
- **Included:** [Explicitly list what IS part of this task]
- **Excluded:** [Explicitly list what is NOT part of this task]
- **Clarification Required:** [List any ambiguous areas that need user input]

🔧 **Technical Requirements:**
- [Technology/framework/pattern to use]
- [Architecture or design pattern requirements]
- [Performance or compatibility requirements]

📁 **Files/Components:**
- Create: [/path/to/new/file.ext] ([purpose])
- Update: [/path/to/existing/file.ext] ([changes needed])
- Delete: [/path/to/obsolete/file.ext] ([reason])

🧪 **Testing Requirements:**
- [How success will be validated]
- [Specific test scenarios to cover]
- [Performance or quality benchmarks]

⚠️ **Edge Cases:**
- [Potential issue 1 and mitigation]
- [Potential issue 2 and mitigation]
- [Error conditions to handle]

📚 **Dependencies:** [List todo IDs that must be completed first, or "None"]
```

---

## 🚫 TASK COMPLETION REQUIREMENTS (ENFORCED)

**⚠️ CRITICAL: TASKS CANNOT BE MARKED "Done" WITHOUT RESULT COMMENT ⚠️**

**COMPLETION WORKFLOW (MANDATORY):**
1. **Complete the work** - Implement, test, and verify the solution
2. **Add result comment** - Document what was accomplished, lessons learned, outcomes
3. **Then mark as Done** - Status update will only succeed if result comment exists

**❌ BLOCKED ACTIONS:**
- `update_todos({status: "Done"})` **will fail** if no result comment exists
- Status will remain unchanged and error message will explain requirements
- User feedback rejecting completion will be respected

**✅ PROPER COMPLETION:**
```typescript
// Step 1: Add result comment first
add_comments({
  todoId: "T-1",
  comments: [{ type: "result", content: "Task completed successfully..." }]
})

// Step 2: Then mark as Done (will succeed)
update_todos({ updates: [{ id: "T-1", status: "Done" }] })
``` 

### 📚 MCP Tools Reference

- Complete MCP tools documentation
- Comment types and their purposes
- Tool usage guidelines

# 📚 MCP Tools Reference

| Tool               | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| create_todos       | Create task(s) with names, long_descriptions, priorities, tags, and dependencies |
| list_todos         | View filtered task lists (by status, tag, priority, or dependency readiness)     |
| update_todos       | Update status, content, tags, dependencies                                       |
| delete_todos       | Remove obsolete tasks                                                            |
| add_comments       | Attach research, result, note, or manualsetup entries                           |
| get_todo_details   | Retrieve todos with full comments & dependencies                                 |

---

## 🧩 Comment Types

| Type                  | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| research_with_links   | **MANDATORY RESEARCH PROTOCOL**: (1) Search local codebase first, (2) Search internet for 2025 information, (3) Include 2–5 REAL links from web search results |
| manualsetup           | Use **only** for tasks humans must perform (e.g., domain config, API keys) |
| note                  | Track logic, decisions, blockers, **human feedback in Review state**, **specification responses** |
| result                | **MANDATORY BEFORE "Review" STATUS** - Document completion, outcomes, lessons learned | 

### ✅ Enforcement Policies

- Non-negotiable key principles
- Agent enforcement policy with penalties
- Final enforcement reminders

# ✅ Key Principles (Non-Negotiable)

| Rule                                                       | Enforcement |
| ---------------------------------------------------------- | ----------- |
| **ALWAYS start with create_todos for EVERY user request**   | ✅           |
| **INTELLIGENTLY assess complexity for appropriate task count** | ✅           |
| **ALWAYS use Todo2 workflow - single or multiple tasks**    | ✅           |
| Always conduct research_with_links before implementation   | ✅           |
| **Include detailed codebase analysis with code snippets**   | ✅           |
| **Use detailed task descriptions with 8 required sections** | ✅           |
| **Define 3-5 measurable acceptance criteria per task**      | ✅           |
| Use create_todos for full project breakdowns              | ✅           |
| Set dependencies during planning                           | ✅           |
| Never skip result or review                                | ✅           |
| **STAY STRICTLY within defined task scope - no expansion**  | ✅           |

---

## 🎯 Scope Control Rules (Critical)

**⚠️ ABSOLUTE RULE: AI MUST NOT EXPAND BEYOND DEFINED TASK BOUNDARIES ⚠️**

### 📋 Scope Boundary Enforcement:
- **Work ONLY on what's explicitly requested** in task acceptance criteria
- **Ask for clarification** when requirements are ambiguous - never assume additional work
- **Stop at task completion** - do not add "helpful" features or improvements
- **Use convergent thinking** - focus narrowly on specific deliverables, not broad solutions

### 🚫 Forbidden Scope Expansions:
- Adding features not explicitly requested
- "Improving" code beyond the specific task requirements  
- Implementing related functionality "while you're at it"
- Making assumptions about what the user "probably wants"

### ✅ Proper Scope Control:
- **Read task acceptance criteria carefully** - these define your exact boundaries
- **When in doubt, ask** - "Should I also implement X?" rather than assuming
- **Focus on convergent solutions** - solve the specific problem, not related problems
- **Deliver exactly what's requested** - no more, no less

**Scope creep kills projects. Stay focused. Stay disciplined.**

---

## 🎯 Agent Enforcement Policy

| Rule                                                              | AI Agent Behavior | Penalty for Violation |
| ----------------------------------------------------------------- | ----------------- | -------------------- |
| **MUST use Todo2 workflow for EVERY user request (no exceptions)** | **ENFORCED**      | **INTERACTION TERMINATED** |
| **MUST start with create_todos before any work**                 | **ENFORCED**      | **INTERACTION TERMINATED** |
| **MUST assess complexity and create appropriate task count**      | **ENFORCED**      | **TASK REJECTED**    |
| **MUST search local codebase first for every research task**     | **ENFORCED**      | **TASK REJECTED**    |
| **MUST include code snippets in local codebase analysis**        | **ENFORCED**      | **TASK REJECTED**    |
| **MUST search internet for 2025 info before coding** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST include 2-10 REAL links from web search (NO FAKE URLs)**   | **ENFORCED**      | **TASK REJECTED**    |
| **MUST use detailed task descriptions with 7 required sections** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST define measurable acceptance criteria (3-5 points)**       | **ENFORCED**      | **TASK REJECTED**    |
| **MUST stay within defined task scope - no unauthorized expansion** | **ENFORCED**      | **TASK REJECTED**    |
| **MUST ask for clarification when scope is ambiguous**           | **ENFORCED**      | **TASK REJECTED**    |
| Must not write code before research_with_links comment           | Enforced          | Task rejected        |
| Must always submit result comments on completion                 | Enforced          | Task incomplete      |
| Must clean or update remaining todos in review                   | Enforced          | Workflow broken      |

---

## 🔒 FINAL ENFORCEMENT REMINDER

**🚨 CRITICAL: This workflow applies to 100% of user interactions 🚨**

### ✅ CORRECT Workflow:
1. **User makes request** (any request, any size)
2. **AI immediately calls create_todos** (first action, always)
3. **AI follows complete Todo2 workflow** (research → implement → result → review)
4. **AI completes task and updates todo status**

### ❌ FORBIDDEN Workflow:
1. **User makes request**
2. **AI starts working directly** ← **VIOLATION - INTERACTION TERMINATED**
3. **AI skips todo creation** ← **VIOLATION - INTERACTION TERMINATED**

### 📝 ENFORCEMENT SUMMARY:
- **Every user message** → Create todo(s) first (count based on complexity)
- **Every code change** → Todo2 workflow required
- **Every question** → Todo2 workflow required  
- **Every analysis** → Todo2 workflow required
- **Every task** → Todo2 workflow required

**REMEMBER: TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT** 

### 🏗️ Software Development Best Practices

- concise development best practices for 2025
- Clear modular architecture and professional design patterns
- Security by design and performance optimization guidelines

# 🏗️ SOFTWARE DEVELOPMENT BEST PRACTICES

**⚠️ AI MUST FOLLOW THESE PRACTICES FOR ALL CODE GENERATION ⚠️**

## Essential Principles

• **Professional, scalable design** - Use established patterns and design for growth
• **Easily maintainable code** - Clear names, small functions, consistent style
• **Excellent and modern UI/UX** - Responsive, accessible, intuitive interfaces
• **Low custom code** - Leverage existing well-maintained libraries over reinventing
• **Minimalistic code** - Simple solutions, avoid over-engineering
• **Security by design** - Validate inputs, encrypt data, follow OWASP guidelines
• **Performance optimization** - Cache effectively, use async operations, monitor metrics
• **Comprehensive testing** - Unit tests, integration tests, automated quality gates
• **Clear documentation** - API docs, README files, architectural decisions
• **User-centric iteration** - Feature flags, A/B testing, continuous feedback

## AI Enforcement

**Before generating code, ensure:**
• Architecture follows separation of concerns
• Code is readable and well-documented
• Security best practices implemented
• Dependencies are secure and up-to-date
• Performance considerations addressed
• Tests included and comprehensive
• User experience prioritized

**These practices are mandatory for professional software development.** 

### 🔧 [Purpose & Summary](./sections/purpose-and-summary.md)
- Workflow purpose and goals
- Workspace structure overview
- System summary and benefits

---

## 🚨 CRITICAL ENFORCEMENT REMINDER

**Every user interaction MUST start with `create_todos` - no exceptions!**

**🎯 DECISION FRAMEWORK - ASK YOURSELF:**
1. "Does this require research to understand the approach?" → If YES, likely needs multiple tasks
2. "Can different parts be worked on in parallel?" → If YES, split for efficiency  
3. "Is this a routine change I've done many times?" → If YES, single task may suffice
4. "Will this take more than 1-2 hours?" → If YES, consider breaking down
5. "Does this touch multiple systems/files?" → If YES, likely needs multiple tasks

**If ANY of questions 1, 2, 4, or 5 are YES → CREATE MULTIPLE TASKS**
**If ALL are NO and it's routine/simple → SINGLE TASK IS ACCEPTABLE**

---

## 🔒 FINAL REMINDER

**🚨 This workflow applies to 100% of user interactions 🚨**

- **Every user message** → Create todo(s) first (count based on complexity)
- **Every code change** → Todo2 workflow required
- **Every question** → Todo2 workflow required  
- **Every analysis** → Todo2 workflow required

**REMEMBER: TODO2 WORKFLOW IS MANDATORY - TASK COUNT IS CONTEXT-DEPENDENT**
