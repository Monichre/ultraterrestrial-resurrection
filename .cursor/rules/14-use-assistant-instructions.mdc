---
description: 
globs: 
alwaysApply: false
---
# **useAssistantInstructions**

`useAssistantInstructions` is a React hook that allows you to set system instructions for your assistant-ui components.

## [**Usage**](https://www.assistant-ui.com/docs/copilots/use-assistant-instructions#usage)

```
import { useAssistantInstructions } from "@assistant-ui/react"; function MyComponent() {  // Simple string usage  useAssistantInstructions("You are a helpful form assistant...");   // With configuration object  useAssistantInstructions({    instruction: "You are a helpful form assistant...",    disabled: false, // Optional: disable the instructions  });   return <div>My Component</div>;}
```

## [**API Reference**](https://www.assistant-ui.com/docs/copilots/use-assistant-instructions#api-reference)

### [**Parameters**](https://www.assistant-ui.com/docs/copilots/use-assistant-instructions#parameters)

The hook accepts either:
- A string containing the system instructions
- A configuration object with:
  - `instruction`: The system instructions
  - `disabled`: Optional boolean to disable the instructions

### [**Behavior**](https://www.assistant-ui.com/docs/copilots/use-assistant-instructions#behavior)

The hook will:
1. Register the provided instructions as system instructions in the model context
2. Automatically clean up when the component unmounts
3. Update when the instructions change
4. Do nothing if disabled is set to true

## [**Example**](https://www.assistant-ui.com/docs/copilots/use-assistant-instructions#example)

```
function SmartForm() {  useAssistantInstructions({    instruction: `      You are a form assistant that:      - Validates user input      - Provides helpful suggestions      - Explains any errors      - Guides users through complex fields    `,  });   return <form>{/* Your form fields here */}</form>;}
```