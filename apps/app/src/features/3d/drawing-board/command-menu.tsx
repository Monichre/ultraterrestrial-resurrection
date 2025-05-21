import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils'
import {
  type LucideIcon,
  HelpCircle,
  Circle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'

type ModelView = {
  value: string
  label: string
  icon: LucideIcon
}

const modelViews: ModelView[] = [
  {
    value: 'events',
    label: 'Major Events',
    icon: HelpCircle,
  },
  {
    value: 'topics',
    label: 'Key Topics',
    icon: Circle,
  },
  {
    value: 'personnel',
    label: 'Key Figures',
    icon: ArrowUpCircle,
  },
  {
    value: 'testimonies',
    label: 'Testimonies',
    icon: CheckCircle2,
  },
  {
    value: 'all',
    label: 'All',
    icon: XCircle,
  },
]

export const SmartCommandMenu = () => {
  const [open, setOpen] = useState( false )
  const [selectedView, setSelectedView] = useState<ModelView | null>( null )

  useEffect( () => {
    const down = ( e: KeyboardEvent ) => {
      if ( e.key === 'k' && ( e.metaKey || e.ctrlKey ) ) {
        e.preventDefault()
        setOpen( ( open ) => !open )
      }
    }
    document.addEventListener( 'keydown', down )
    return () => document.removeEventListener( 'keydown', down )
  }, [] )

  return (
    <div className='flex items-center space-x-4 absolute top-20 left-20 z-[100]'>
      <p className='text-sm text-muted-foreground'>View</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='w-[150px] justify-start'
          >
            {selectedView ? (
              <>
                <selectedView.icon className='mr-2 h-4 w-4 shrink-0' />
                {selectedView.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command>
            <CommandInput placeholder='Change status...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {modelViews.map( ( status ) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={( value ) => {
                      setSelectedView(
                        modelViews.find( ( priority ) => priority.value === value ) ||
                        null
                      )
                      setOpen( false )
                    }}
                  >
                    <status.icon
                      className={cn(
                        'mr-2 h-4 w-4',
                        status.value === selectedView?.value
                          ? 'opacity-100'
                          : 'opacity-40'
                      )}
                    />
                    <span>{status.label}</span>
                  </CommandItem>
                ) )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
    //     <Command className="rounded-lg border shadow-md">
    //   <CommandInput placeholder="Search..." />
    //   <CommandList>
    //     {/* <CommandEmpty>No results found.</CommandEmpty> */}
    //     <CommandGroup heading="Categories">
    //       <CommandItem>Events</CommandItem>
    //       <CommandItem>Key Figuresd</CommandItem>
    //       <CommandItem>Testimony</CommandItem>
    //     </CommandGroup>
    //     <CommandSeparator />
    //     <CommandGroup heading="In the news">
    //       <CommandItem>Twitter</CommandItem>
    //       <CommandItem>NSA</CommandItem>
    //     </CommandGroup>
    //   </CommandList>
    // </Command>
  )
}

