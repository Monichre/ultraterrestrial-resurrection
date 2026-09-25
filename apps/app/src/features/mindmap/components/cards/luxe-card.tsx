export function LuxeCard({ title, content }: any) {
  return (
    <div className='inline-flex animate-shine max-w-[350px] w-full items-center justify-center rounded-xl text-sm border border-white/10 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 py-5 transition-colors'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold text-neutral-200'>{title}</h3>
        {content && (
          <p className='text-sm leading-[1.5] text-neutral-400'>{content}</p>
        )}
      </div>
    </div>
  )
}
