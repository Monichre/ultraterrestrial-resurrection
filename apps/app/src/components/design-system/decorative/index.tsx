export const RulerTicks = ({side}: {side: 'left' | 'right'}) => (
  <div className='ruler-ticks absolute -left-[4.5rem] top-[144px] flex flex-col gap-10'>
    <div>0</div>
    <div>50</div>
    <div>100</div>
    <div>150</div>
    <div>200</div>
    <div>250</div>
    <div>300</div>
    <div>350</div>
    <div>400</div>
    <div>450</div>
    <div>500</div>
    <div>550</div>
    <div>600</div>
    <div>650</div>
    <div>700</div>
    <div>750</div>
  </div>
)

export const PaperMarginLineRight = () => (
  <div
    className='bleed-ln-gray-200 bleed-border-b absolute -right-8 rotate-90'
    style={{
      borderImage: 'linear-gradient(var(--tw-full-bleed-color) 0 0) 1 / / 0 9999vw 0 9999vw',
      borderBottom: 'var(--tw-full-bleed-border-bottom-width) solid',
    }}
  />
)

export const PaperMarginLineLeft = () => (
  <div
    className='bleed-ln-gray-200 bleed-border-b absolute -left-8 rotate-90'
    style={{
      borderImage: 'linear-gradient(var(--tw-full-bleed-color) 0 0) 1 / / 0 9999vw 0 9999vw',
      borderBottom: 'var(--tw-full-bleed-border-bottom-width) solid',
    }}
  />
)

export const DecalSectionDivider = () => (
  <div className='hidden justify-center xl:flex 2xl:!px-0' style={{padding: '0px 11.5vw'}}>
    <img
      src='https://alignui.com/images/landing/rapid-dev-lines-top.svg'
      alt=''
      className='h-auto object-contain'
    />
  </div>
)
