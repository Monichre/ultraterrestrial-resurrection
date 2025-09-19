import React, { useCallback } from 'react'
import { useGlobals, useStorybookApi } from '@storybook/manager-api'
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components'
import { TypeIcon } from '@storybook/icons'
import { PARAM_KEY, AVAILABLE_FONTS } from './constants'

export const FontSelectorTool = () => {
  const [globals, updateGlobals] = useGlobals()
  const api = useStorybookApi()

  const selectedFont = globals[PARAM_KEY] || 'neue-haas'

  const handleFontChange = useCallback((fontKey) => {
    updateGlobals({
      [PARAM_KEY]: fontKey,
    })

    // Apply font to the preview iframe
    const previewWindow = api.getChannel()
    previewWindow.emit('FONT_CHANGED', fontKey)
  }, [updateGlobals, api])

  const fontItems = AVAILABLE_FONTS.map((font) => ({
    id: font.key,
    title: font.name,
    onClick: () => handleFontChange(font.key),
    active: selectedFont === font.key,
    right: selectedFont === font.key ? '✓' : undefined,
  }))

  const currentFont = AVAILABLE_FONTS.find(font => font.key === selectedFont)

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={fontItems.map(item => ({
            ...item,
            onClick: () => {
              item.onClick()
              onHide()
            }
          }))}
        />
      )}
    >
      <IconButton
        key="font-selector"
        title={`Font: ${currentFont?.name || 'Default'}`}
        active={selectedFont !== 'neue-haas'}
      >
        <TypeIcon />
      </IconButton>
    </WithTooltip>
  )
}