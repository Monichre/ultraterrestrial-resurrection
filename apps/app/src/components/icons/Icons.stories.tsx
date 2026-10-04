import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {BaseGridIcon} from './BaseGridIcon'
import {CloudIcon} from './CloudIcon'
import {ConnectIcon} from './connection-icon'
import {
  AttachFileIcon,
  FingerprintIcon,
  QuoteIcon,
  LightingBolt,
  KeyFiguresIcon,
  TopicsIcon,
  OrganizationsIcon,
  DocumentsIcon,
  ArtifactsIcon,
  MonolithsIcon,
  TelescopeIcon,
  MagicWandIcon,
  AlienIcon,
  FlyingSaucerIcon,
  UFOIcon,
  PinIcon,
  DotIcon,
  PlusIcon,
  SlashIcon,
  AddIcon,
  OracleIcon,
} from './entity-icons'
import {
  Dots,
  BroadcastIcon,
  HandDrawnArrowRight,
  HandDrawnArrowDown,
  StarDoodle,
  Star,
  ThinTwinklyStar,
  ScratchyX,
  DoubleX,
  WaypointsIcon,
  ConnectionsIcon,
  GroupIcon,
  AiStarIcon,
  StarIcon,
  LayersIcon,
} from './icons'
import {LocalDevIcon} from './LocalDevIcon'
import {LocalDevSecondaryIcon} from './LocalDevSecondaryIcon'
import {Network} from './Network'
import {SpriteIcon} from './SpriteIcon'
import {TerminalIcon} from './terminal-icon'
import {WorkflowIcon} from './WorkflowIcon'

const IconCell = ({label, children}: {label: string, children: React.ReactNode}) => (
  <div className='flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-colors'>
    <div className='flex items-center justify-center w-12 h-12 text-neutral-300'>
      {children}
    </div>
    <span className='text-xs text-neutral-500 text-center'>{label}</span>
  </div>
)

function IconsGallery() {
  return (
    <div className='p-8'>
      <h2 className='text-lg font-semibold text-neutral-200 mb-6'>Icons Gallery</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        <IconCell label='BaseGridIcon'>
          <BaseGridIcon />
        </IconCell>
        <IconCell label='CloudIcon'>
          <CloudIcon />
        </IconCell>
        <IconCell label='ConnectIcon'>
          <ConnectIcon />
        </IconCell>
        <IconCell label='AttachFileIcon'>
          <AttachFileIcon />
        </IconCell>
        <IconCell label='FingerprintIcon'>
          <FingerprintIcon />
        </IconCell>
        <IconCell label='QuoteIcon'>
          <QuoteIcon />
        </IconCell>
        <IconCell label='LightingBolt'>
          <LightingBolt />
        </IconCell>
        <IconCell label='KeyFiguresIcon'>
          <KeyFiguresIcon />
        </IconCell>
        <IconCell label='TopicsIcon'>
          <TopicsIcon />
        </IconCell>
        <IconCell label='OrganizationsIcon'>
          <OrganizationsIcon />
        </IconCell>
        <IconCell label='DocumentsIcon'>
          <DocumentsIcon />
        </IconCell>
        <IconCell label='ArtifactsIcon'>
          <ArtifactsIcon />
        </IconCell>
        <IconCell label='MonolithsIcon'>
          <MonolithsIcon />
        </IconCell>
        <IconCell label='TelescopeIcon'>
          <TelescopeIcon />
        </IconCell>
        <IconCell label='MagicWandIcon'>
          <MagicWandIcon />
        </IconCell>
        <IconCell label='AlienIcon'>
          <AlienIcon />
        </IconCell>
        <IconCell label='FlyingSaucerIcon'>
          <FlyingSaucerIcon />
        </IconCell>
        <IconCell label='UFOIcon'>
          <UFOIcon />
        </IconCell>
        <IconCell label='PinIcon'>
          <PinIcon />
        </IconCell>
        <IconCell label='DotIcon'>
          <DotIcon />
        </IconCell>
        <IconCell label='PlusIcon'>
          <PlusIcon />
        </IconCell>
        <IconCell label='SlashIcon'>
          <SlashIcon />
        </IconCell>
        <IconCell label='AddIcon'>
          <AddIcon />
        </IconCell>
        <IconCell label='OracleIcon'>
          <OracleIcon />
        </IconCell>
        <IconCell label='Dots'>
          <Dots />
        </IconCell>
        <IconCell label='BroadcastIcon'>
          <BroadcastIcon />
        </IconCell>
        <IconCell label='HandDrawnArrowRight'>
          <HandDrawnArrowRight />
        </IconCell>
        <IconCell label='HandDrawnArrowDown'>
          <HandDrawnArrowDown />
        </IconCell>
        <IconCell label='StarDoodle'>
          <StarDoodle />
        </IconCell>
        <IconCell label='Star'>
          <Star />
        </IconCell>
        <IconCell label='ThinTwinklyStar'>
          <ThinTwinklyStar />
        </IconCell>
        <IconCell label='ScratchyX'>
          <ScratchyX />
        </IconCell>
        <IconCell label='DoubleX'>
          <DoubleX />
        </IconCell>
        <IconCell label='WaypointsIcon'>
          <WaypointsIcon />
        </IconCell>
        <IconCell label='ConnectionsIcon'>
          <ConnectionsIcon />
        </IconCell>
        <IconCell label='GroupIcon'>
          <GroupIcon />
        </IconCell>
        <IconCell label='AiStarIcon'>
          <AiStarIcon />
        </IconCell>
        <IconCell label='StarIcon'>
          <StarIcon />
        </IconCell>
        <IconCell label='LayersIcon'>
          <LayersIcon />
        </IconCell>
        <IconCell label='LocalDevIcon'>
          <LocalDevIcon />
        </IconCell>
        <IconCell label='LocalDevSecondaryIcon'>
          <LocalDevSecondaryIcon />
        </IconCell>
        <IconCell label='Network'>
          <Network />
        </IconCell>
        <IconCell label='SpriteIcon'>
          <SpriteIcon icon='home' />
        </IconCell>
        <IconCell label='TerminalIcon'>
          <TerminalIcon />
        </IconCell>
        <IconCell label='WorkflowIcon'>
          <WorkflowIcon />
        </IconCell>
      </div>
    </div>
  )
}

const meta = {
  title: 'Components/Icons',
  component: IconsGallery,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof IconsGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => <IconsGallery />,
}
