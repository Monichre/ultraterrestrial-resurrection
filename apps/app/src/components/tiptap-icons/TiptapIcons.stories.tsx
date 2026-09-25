import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'

import {AlignCenterIcon} from './align-center-icon'
import {AlignJustifyIcon} from './align-justify-icon'
import {AlignLeftIcon} from './align-left-icon'
import {AlignRightIcon} from './align-right-icon'
import {ArrowLeftIcon} from './arrow-left-icon'
import {BanIcon} from './ban-icon'
import {BlockquoteIcon} from './blockquote-icon'
import {BoldIcon} from './bold-icon'
import {ChevronDownIcon} from './chevron-down-icon'
import {CloseIcon} from './close-icon'
import {Code2Icon} from './code2-icon'
import {CodeBlockIcon} from './code-block-icon'
import {CornerDownLeftIcon} from './corner-down-left-icon'
import {ExternalLinkIcon} from './external-link-icon'
import {HeadingFiveIcon} from './heading-five-icon'
import {HeadingFourIcon} from './heading-four-icon'
import {HeadingIcon} from './heading-icon'
import {HeadingOneIcon} from './heading-one-icon'
import {HeadingSixIcon} from './heading-six-icon'
import {HeadingThreeIcon} from './heading-three-icon'
import {HeadingTwoIcon} from './heading-two-icon'
import {HighlighterIcon} from './highlighter-icon'
import {ImagePlusIcon} from './image-plus-icon'
import {ItalicIcon} from './italic-icon'
import {LinkIcon} from './link-icon'
import {ListIcon} from './list-icon'
import {ListOrderedIcon} from './list-ordered-icon'
import {ListTodoIcon} from './list-todo-icon'
import {MoonStarIcon} from './moon-star-icon'
import {Redo2Icon} from './redo2-icon'
import {StrikeIcon} from './strike-icon'
import {SubscriptIcon} from './subscript-icon'
import {SunIcon} from './sun-icon'
import {SuperscriptIcon} from './superscript-icon'
import {TrashIcon} from './trash-icon'
import {UnderlineIcon} from './underline-icon'
import {Undo2Icon} from './undo2-icon'

const icons: {name: string, Icon: React.FC<React.SVGProps<SVGSVGElement>>}[] = [
  {name: 'AlignCenter', Icon: AlignCenterIcon},
  {name: 'AlignJustify', Icon: AlignJustifyIcon},
  {name: 'AlignLeft', Icon: AlignLeftIcon},
  {name: 'AlignRight', Icon: AlignRightIcon},
  {name: 'ArrowLeft', Icon: ArrowLeftIcon},
  {name: 'Ban', Icon: BanIcon},
  {name: 'Blockquote', Icon: BlockquoteIcon},
  {name: 'Bold', Icon: BoldIcon},
  {name: 'ChevronDown', Icon: ChevronDownIcon},
  {name: 'Close', Icon: CloseIcon},
  {name: 'Code2', Icon: Code2Icon},
  {name: 'CodeBlock', Icon: CodeBlockIcon},
  {name: 'CornerDownLeft', Icon: CornerDownLeftIcon},
  {name: 'ExternalLink', Icon: ExternalLinkIcon},
  {name: 'Heading', Icon: HeadingIcon},
  {name: 'HeadingOne', Icon: HeadingOneIcon},
  {name: 'HeadingTwo', Icon: HeadingTwoIcon},
  {name: 'HeadingThree', Icon: HeadingThreeIcon},
  {name: 'HeadingFour', Icon: HeadingFourIcon},
  {name: 'HeadingFive', Icon: HeadingFiveIcon},
  {name: 'HeadingSix', Icon: HeadingSixIcon},
  {name: 'Highlighter', Icon: HighlighterIcon},
  {name: 'ImagePlus', Icon: ImagePlusIcon},
  {name: 'Italic', Icon: ItalicIcon},
  {name: 'Link', Icon: LinkIcon},
  {name: 'List', Icon: ListIcon},
  {name: 'ListOrdered', Icon: ListOrderedIcon},
  {name: 'ListTodo', Icon: ListTodoIcon},
  {name: 'MoonStar', Icon: MoonStarIcon},
  {name: 'Redo2', Icon: Redo2Icon},
  {name: 'Strike', Icon: StrikeIcon},
  {name: 'Subscript', Icon: SubscriptIcon},
  {name: 'Sun', Icon: SunIcon},
  {name: 'Superscript', Icon: SuperscriptIcon},
  {name: 'Trash', Icon: TrashIcon},
  {name: 'Underline', Icon: UnderlineIcon},
  {name: 'Undo2', Icon: Undo2Icon},
]

function IconGallery() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px',
        padding: '24px',
        color: 'currentColor',
      }}
    >
      {icons.map(({name, Icon}) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 8px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <Icon className="tiptap-button-icon" />
          <span style={{fontSize: '12px', opacity: 0.7}}>{name}</span>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Components/TiptapIcons',
  component: IconGallery,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {}
