import { cn } from '@/utils'

export function Card( {
  title,
  description,
  content,
  className,
}: Readonly<{
  title: string
  description: string
  content: any
  className: string
}> ) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl transition-all bg-white dark:bg-neutral-800 border group border-neutral-500/30 shadow-2xl hover:shadow-xl shadow-neutral-500/30 flex flex-col  w-28 h-42 rotate-12',
        className
      )}
    >
      <div className='flex size-20 justify-center items-center'>{content}</div>
      <p className='text-xs text-neutral-200 dark:text-neutral-500'>
        {description}
      </p>
      <p className='text-xs text-neutral-700 dark:text-neutral-400 font-medium'>
        {title}
      </p>
    </div>
  )
}
