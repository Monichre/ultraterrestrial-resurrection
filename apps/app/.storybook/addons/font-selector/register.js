import { addons, types } from '@storybook/manager-api'
import { ADDON_ID, TOOL_ID } from './constants'
import { FontSelectorTool } from './FontSelectorTool'

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Font Selector',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: FontSelectorTool,
  })
})