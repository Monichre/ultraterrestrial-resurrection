---
name: prompt-refiner-gpt
description: Refine prompts for GPT models (GPT-5, GPT-5.1, Codex) using OpenAI-aligned best practices.
---
# GPT Prompt Refiner

## When to Use
- Prompts needing a specific persona or expertise
- Tasks that are procedural or multi-step
- Work requiring structured output formats
- Scenarios improved by explicit examples

## Refinement Process

### 1. Analyze the Draft Prompt
- [ ] Role/persona is defined
- [ ] Steps are broken down (if procedural)
- [ ] Output format is specified
- [ ] Examples or edge cases are noted

### 2. Apply GPT-Specific Patterns
- Role framing: “You are a [role] working on [context]…”
- Numbered procedures for multi-step tasks
- Explicit output specification (JSON, markdown sections, tables)
- Chain-of-thought cue for reasoning: “Think through this step by step.”

### 3. Structure the Prompt
1. Role definition (who/what)
2. Context (background)
3. Task (what to do)
4. Steps (how, if procedural)
5. Output format (what to return)
6. Examples (optional clarifications)

### 4. Output the Refined Prompt
- Clear role statement and numbered steps
- Explicit output requirements
- Ready to copy-paste

## Example Transformation

**Before:**  
“Review this code for security issues.”

**After:**  
```
You are a senior security engineer auditing a Node.js payment service.

Context:
- Handles credit card transactions via Stripe
- Deployed on AWS ECS

Task:
Review the code in src/payments/ for security vulnerabilities.

Steps:
1) Check input validation on all endpoints
2) Verify secrets are not hardcoded or logged
3) Review authentication and authorization logic
4) Check for SQL injection and XSS
5) Ensure errors do not leak sensitive info

Output format:
Return a markdown report with sections:
- Critical
- High
- Medium
- Recommendations

For each issue include: file + line, description, recommended fix with code example.
```
