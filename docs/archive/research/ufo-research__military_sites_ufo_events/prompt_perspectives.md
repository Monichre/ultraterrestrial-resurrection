# Alternative Perspectives on Research Prompting for Software Engineering

## Perspective 1: The Interface Bridge
Instead of a static prompt, think of this as creating a **translation interface** between research and engineering domains. The prompt should function like a technical specification that includes:

- **Research deliverable format**: Specify exact data structures, schemas, and validation requirements
- **Engineering consumption format**: Define API endpoints, data contracts, and integration points
- **Gap documentation**: Explicitly identify what assumptions engineers will need to make vs. what research needs to verify

## Perspective 2: Multi-Stakeholder Requirements
Consider three distinct user personas who will interact with the prompt:

**Research Specialist Viewpoint**:
- Needs clear success criteria that aren't just "find good research"
- Requires understanding of technical constraints without being overwhelmed
- Wants to know what constitutes "done" from an engineering perspective

**Software Engineer Viewpoint**:
- Needs research packaged as consumable inputs (not insights)
- Requires clear data schemas, edge cases, and confidence levels
- Wants to understand the research limitations for system design

**End Solution Viewpoint**:
- Needs validation of whether the research actually solves the original problem
- Requires clear traceability from research findings to software capabilities
- Wants measurable success metrics that bridge research quality to user value

## Perspective 3: Process-First Design
Refactor the prompt to define **process flows** rather than deliverables:

1. **Discovery Protocol**: How research findings get translated into technical requirements
2. **Validation Pipeline**: How assumptions get tested and refined
3. **Integration Checkpoints**: When research needs to loop back for clarification vs. when engineers proceed with assumptions
4. **Fallback Documentation**: Clear guidance on what to do when research can't provide definitive answers

## Perspective 4: Constraint Articulation
Instead of asking for research on the problem, ask for:

- **Constraint mapping**: What technical limitations must be accounted for?
- **Uncertainty quantification**: What can't be known through research?
- **Risk profiles**: What assumptions are safe to make vs. which need validation?
- **Boundary conditions**: When does the research stop being relevant to engineering decisions?

## Perspective 5: Output as Input Specification
Frame the prompt as defining the **exact input format** that engineers need:

- **Data model**: Precisely structured research output
- **Confidence metadata**: How sure are we about each finding?
- **Usage instructions**: Explicit guidance on how to use each piece of research
- **Integration examples**: Concrete illustrations of how engineers should interpret findings

## Refactored Prompt Structure

```
Research Objective: [Original problem statement]

Technical Context: [Specific engineering constraints and system requirements]

Required Deliverables:
1. Structured Data Model: [Exact format for research findings]
2. Validation Checkpoints: [Specific questions that need definitive answers]
3. Assumption Documentation: [What engineers can assume vs. what needs verification]
4. Integration Protocol: [How findings translate to code-level decisions]
5. Uncertainty Quantification: [Risk assessment for each research area]

Success Criteria (Engineering-Facing):
- Can a junior engineer implement a solution using only these research outputs?
- Are all edge cases documented with guidance on how to handle them?
- Is there a clear mapping from research uncertainty to implementation risk?

Research Boundaries:
- What is explicitly out of scope?
- When should engineers seek additional input vs. proceed with available information?
- What constitutes "research complete" vs. "engineering ready"?
```

## Meta-Perspective: The Prompt as Research Object
Consider that the prompt itself should be treated as a research artifact that can be tested and refined. Include specific feedback mechanisms:

- **Pilot testing**: How will you validate that the prompt produces engineering-usable research?
- **Iteration triggers**: What signals indicate the prompt needs refinement?
- **Success metrics**: How do you measure whether the research-to-engineering translation worked?