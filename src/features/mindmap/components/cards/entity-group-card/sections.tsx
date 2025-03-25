import { DOMAIN_MODEL_COLORS } from "@/utils"

export const CardCorners = ( { type }: any ) => (
  <>
    <span
      className={` cursor-pointer left-[-2px] absolute top-[-2px] z-10 w-[1px] h-3`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  cursor-pointer left-[-2px] absolute top-[-2px] z-10 w-3 h-[1px]`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  bottom-[-2px] cursor-pointer absolute right-[-2px] z-10 w-[1px] h-3`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  bottom-[-2px] cursor-pointer absolute right-[-2px] z-10 w-3 h-[1px]`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  bottom-[-2px] cursor-pointer left-[-2px] absolute z-10 w-[1px] h-3`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  bottom-[-2px] cursor-pointer left-[-2px] absolute z-10 w-3 h-[1px]`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  cursor-pointer absolute right-[-2px] top-[-2px] z-10 w-[1px] h-3`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
    <span
      className={`  cursor-pointer absolute right-[-2px] top-[-2px] z-10 w-3 h-[1px]`}
      style={{
        backgroundColor: DOMAIN_MODEL_COLORS[type],
      }}
    />
  </>
)

export const CardTop = ( { children }: any ) => (
  <div className='absolute top-0 left-0 z-10 w-full flex justify-between p-2 align-middle items-center'>
    {children}
  </div>
)
export const CardBottom = ( { children }: any ) => (
  <div className='absolute bottom-0 left-0 z-10 w-full flex justify-between p-2 align-middle items-center'>
    {children}
  </div>
)