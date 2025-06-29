# MindMapBottomMenu Chat Submission Fix

## Summary

Fixed an issue where pressing Enter in chat mode (activeCommand === 'chat' or 'deep research') did not submit the message to the AI assistant. Now, pressing Enter (without Shift) in chat mode calls `submitMessage`, ensuring the message is sent and processed. The input fields are cleared after submission. This aligns the chat experience with user expectations and the intended design.

## Files Modified

- `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu.tsx`

## What Was Changed

- In `handleKeyDown`, when in chat mode and Enter is pressed, the code now calls `submitMessage` with a synthetic event after setting input and appending the message.
- In `handleFormSubmit`, when in chat mode, the code now calls `submitMessage` with the event after setting input and appending the message.
- Both handlers clear the input fields after submission.

## Reasoning

- Previously, pressing Enter only set input and appended the message, but did not actually send it to the AI assistant backend. This resulted in no response from the assistant.
- The fix ensures that the message is properly submitted and processed, providing immediate feedback to the user and maintaining expected chat functionality.

## Risks/Assumptions

- No unrelated logic was changed. Only the chat mode submission flow was updated.
- No downstream impacts are expected, as the change is isolated to chat submission logic.
