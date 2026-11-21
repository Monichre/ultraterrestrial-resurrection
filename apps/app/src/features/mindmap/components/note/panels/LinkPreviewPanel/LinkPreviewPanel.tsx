import {Icon} from '@/components/ui/Icon'
import {Surface} from '@/components/ui/Surface'
import {Toolbar} from '@/components/9-ui/toolbar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip/tooltip'

export type LinkPreviewPanelProps = {
  url: string
  onEdit: () => void
  onClear: () => void
}

export const LinkPreviewPanel = ({onClear, onEdit, url}: LinkPreviewPanelProps) => {
  return (
    <Surface className='flex items-center gap-2 p-2'>
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-sm underline break-all'>
        {url}
      </a>
      <Toolbar.Divider />
      <Tooltip>
        <TooltipTrigger asChild>
          <Toolbar.Button onClick={onEdit}>
            <Icon name='Pen' />
          </Toolbar.Button>
        </TooltipTrigger>
        <TooltipContent side='top'>Edit link</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toolbar.Button onClick={onClear}>
            <Icon name='Trash2' />
          </Toolbar.Button>
        </TooltipTrigger>
        <TooltipContent side='top'>Remove link</TooltipContent>
      </Tooltip>
    </Surface>
  )
}
