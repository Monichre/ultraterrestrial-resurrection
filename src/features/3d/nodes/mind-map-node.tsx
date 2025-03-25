import { motion } from 'framer-motion'

export const MindMapNode = ({ data, ...rest }: any) => {
  return (
    // @ts-ignore
    <div xmlns='http://www.w3.org/1999/xhtml'>
      <div className='flex h-[400px] w-full items-center justify-center rounded-lg border border-light-border dark:border-dark-border md:h-[640px] md:flex-1'>
        <motion.div
          className='group relative flex w-[500px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white font-sans shadow-lg transition-shadow ease-out hover:shadow-2xl dark:bg-[#1A1A1A] dark:shadow-inner-shadow-dark-md dark:hover:shadow-inner-shadow-dark-float'
          initial={{
            height: 116,
            width: 200,
          }}
          style={{
            height: '116px',
            width: '200px',
          }}
          transition={{
            damping: 20,
            stiffness: 260,
            type: 'spring',
          }}
          whileHover={{
            scale: 1.05,
          }}
        >
          <div className='flex flex-col items-start w-full gap-4 px-4 py-4'>
            <div className='flex items-start justify-between w-full'>
              <div className='flex flex-col items-start gap-4'>
                <div className='inline-block select-none rounded-full bg-[#FFF2F6] px-3 py-1 text-[12px] font-medium text-[#FF0342] transition-colors duration-200 group-hover:bg-[#FFEDF2]'>
                  In 15 mins
                </div>
                <div>
                  <div className='text-lg font-semibold'>Design Sync</div>
                  <div className='text-sm text-gray-500'>1:30PM → 2:30PM</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
