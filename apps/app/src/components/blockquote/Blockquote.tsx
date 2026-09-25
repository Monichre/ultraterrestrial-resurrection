import { BlurAppear } from '@/components/animated/animated-wrappers'
import { TextEffect } from '@/components/animated/text-effect'
import { AvatarImage } from '@/components/ui/avatar'
import { QuoteIcon } from 'lucide-react'

export const BlockQuote = ( {
  quote,
  author,
  children,
}: {
  quote: string
  author: string
  children?: any
} ) => {
  return (
    <BlurAppear>
      <blockquote className=''>
        <p className='inline italic'>
          <QuoteIcon
            aria-hidden='true'
            className='size-3 mr-1 fill-white stroke-none -translate-y-1 inline'
          />
          <div>
            <TextEffect per='word' preset='fade' children={`${quote}`} />
          </div>

          <QuoteIcon
            aria-hidden='true'
            className='size-3 ml-1 fill-white stroke-none translate-y-1 inline'
          />
        </p>
        {children ? <BlurAppear>{children}</BlurAppear> : null}

        <p className='text-sm text-end tracking-tighter italic font-semibold mt-1.5'>
          {author}
        </p>
      </blockquote>
    </BlurAppear>
  )
}
