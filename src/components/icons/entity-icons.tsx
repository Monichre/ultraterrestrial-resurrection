'use client'
import {iconAnimationConfig} from '@/components/icons/icons'
import {EVENTS_GREEN, ICON_BLUE} from '@/utils/constants'
import {motion} from 'framer-motion'
import {type LucideProps, Pyramid} from 'lucide-react'

const transition = {
  duration: 4,
  yoyo: Number.POSITIVE_INFINITY,
  ease: 'easeInOut',
}
export const QuoteIcon = ({stroke, onClick}: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      onClick={onClick}
      variants={config}
      stroke={stroke}
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M9.42503 3.44136C10.0561 3.23654 10.7837 3.2402 11.3792 3.54623C12.7532 4.25224 13.3477 6.07191 12.7946 8C12.5465 8.8649 12.1102 9.70472 11.1861 10.5524C10.262 11.4 8.98034 11.9 8.38571 11.9C8.17269 11.9 8 11.7321 8 11.525C8 11.3179 8.17644 11.15 8.38571 11.15C9.06497 11.15 9.67189 10.7804 10.3906 10.236C10.9406 9.8193 11.3701 9.28633 11.608 8.82191C12.0628 7.93367 12.0782 6.68174 11.3433 6.34901C10.9904 6.73455 10.5295 6.95946 9.97725 6.95946C8.7773 6.95946 8.0701 5.99412 8.10051 5.12009C8.12957 4.28474 8.66032 3.68954 9.42503 3.44136ZM3.42503 3.44136C4.05614 3.23654 4.78366 3.2402 5.37923 3.54623C6.7532 4.25224 7.34766 6.07191 6.79462 8C6.54654 8.8649 6.11019 9.70472 5.1861 10.5524C4.26201 11.4 2.98034 11.9 2.38571 11.9C2.17269 11.9 2 11.7321 2 11.525C2 11.3179 2.17644 11.15 2.38571 11.15C3.06497 11.15 3.67189 10.7804 4.39058 10.236C4.94065 9.8193 5.37014 9.28633 5.60797 8.82191C6.06282 7.93367 6.07821 6.68174 5.3433 6.34901C4.99037 6.73455 4.52948 6.95946 3.97725 6.95946C2.7773 6.95946 2.0701 5.99412 2.10051 5.12009C2.12957 4.28474 2.66032 3.68954 3.42503 3.44136Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}

export const LightingBolt = (props) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      variants={config}
      {...props}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M11.25 11.25C11.25 12.3546 10.3546 13.25 9.25 13.25H6.75C5.64543 13.25 4.75 12.3546 4.75 11.25V9.06349C4.75 8.2262 5.09991 7.427 5.71516 6.85908L8 4.75V7.75H9.25C10.3546 7.75 11.25 8.64543 11.25 9.75V11.25Z'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M19.25 17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H14.75C13.6454 19.25 12.75 18.3546 12.75 17.25V15.0635C12.75 14.2262 13.0999 13.427 13.7152 12.8591L16 10.75V13.75H17.25C18.3546 13.75 19.25 14.6454 19.25 15.75V17.25Z'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
    </motion.svg>
  )
}

export const KeyFiguresIcon = (props: React.JSX.IntrinsicAttributes & LucideProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      variants={config}
      {...props}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}
export const TopicsIcon = (props: React.JSX.IntrinsicAttributes & LucideProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE, ...props})
  return (
    <motion.svg
      variants={config}
      {...props}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}
export const EventsIcon = (props: React.JSX.IntrinsicAttributes & LucideProps) => {
  return <UFOIcon {...props} />
}
{
  /* <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg> */
}
{
  /* <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49996 1.80002C4.35194 1.80002 1.79996 4.352 1.79996 7.50002C1.79996 10.648 4.35194 13.2 7.49996 13.2C10.648 13.2 13.2 10.648 13.2 7.50002C13.2 4.352 10.648 1.80002 7.49996 1.80002ZM0.899963 7.50002C0.899963 3.85494 3.85488 0.900024 7.49996 0.900024C11.145 0.900024 14.1 3.85494 14.1 7.50002C14.1 11.1451 11.145 14.1 7.49996 14.1C3.85488 14.1 0.899963 11.1451 0.899963 7.50002Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path><path d="M13.4999 7.89998H1.49994V7.09998H13.4999V7.89998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path><path d="M7.09991 13.5V1.5H7.89991V13.5H7.09991zM10.375 7.49998C10.375 5.32724 9.59364 3.17778 8.06183 1.75656L8.53793 1.24341C10.2396 2.82218 11.075 5.17273 11.075 7.49998 11.075 9.82724 10.2396 12.1778 8.53793 13.7566L8.06183 13.2434C9.59364 11.8222 10.375 9.67273 10.375 7.49998zM3.99969 7.5C3.99969 5.17611 4.80786 2.82678 6.45768 1.24719L6.94177 1.75281C5.4582 3.17323 4.69969 5.32389 4.69969 7.5 4.6997 9.67611 5.45822 11.8268 6.94179 13.2472L6.45769 13.7528C4.80788 12.1732 3.9997 9.8239 3.99969 7.5z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg> */
}

export const OrganizationsIcon = (props: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      {...props}
      variants={config}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M14 11.0001V4.00006L1 4.00006L1 11.0001H14ZM15 4.00006V11.0001C15 11.5523 14.5523 12.0001 14 12.0001H1C0.447715 12.0001 0 11.5523 0 11.0001V4.00006C0 3.44778 0.447715 3.00006 1 3.00006H14C14.5523 3.00006 15 3.44778 15 4.00006ZM2 5.25C2 5.11193 2.11193 5 2.25 5H5.75C5.88807 5 6 5.11193 6 5.25V9.75C6 9.88807 5.88807 10 5.75 10H2.25C2.11193 10 2 9.88807 2 9.75V5.25ZM7.5 7C7.22386 7 7 7.22386 7 7.5C7 7.77614 7.22386 8 7.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H7.5ZM7 9.5C7 9.22386 7.22386 9 7.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H7.5C7.22386 10 7 9.77614 7 9.5ZM7.5 5C7.22386 5 7 5.22386 7 5.5C7 5.77614 7.22386 6 7.5 6H11.5C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5H7.5Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}

export const TestimoniesIcon = (props: IconProps) => {
  return <QuoteIcon {...props} />
}
export const DocumentsIcon = (props: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      variants={config}
      {...props}
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M3.30902 1C2.93025 1 2.58398 1.214 2.41459 1.55279L1.05279 4.27639C1.01807 4.34582 1 4.42238 1 4.5V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V4.5C14 4.42238 13.9819 4.34582 13.9472 4.27639L12.5854 1.55281C12.416 1.21403 12.0698 1.00003 11.691 1.00003L7.5 1.00001L3.30902 1ZM3.30902 2L7 2.00001V4H2.30902L3.30902 2ZM8 4V2.00002L11.691 2.00003L12.691 4H8ZM7.5 5H13V13H2V5H7.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H5.5Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}
export const ArtifactsIcon = ({stroke = ICON_BLUE, fill, onClick}: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        stroke={stroke}
        onClick={onClick}
        transition={transition}
        d='M12.3536 13.3536C12.1583 13.5488 11.8417 13.5488 11.6465 13.3536L6.39645 8.10355C6.36478 8.07188 6.33824 8.03702 6.31685 8H5.00002C4.78719 8 4.59769 7.86528 4.52777 7.66426L2.12777 0.764277C2.05268 0.548387 2.13355 0.309061 2.3242 0.182972C2.51486 0.0568819 2.76674 0.0761337 2.93602 0.229734L8.336 5.12972C8.44044 5.22449 8.50001 5.35897 8.50001 5.5V5.81684C8.53702 5.83824 8.57189 5.86478 8.60356 5.89645L13.8536 11.1464C14.0488 11.3417 14.0488 11.6583 13.8536 11.8536L12.3536 13.3536ZM8.25 6.95711L7.45711 7.75L12 12.2929L12.7929 11.5L8.25 6.95711ZM3.71669 2.28845L5.35549 7H6.2929L7.50001 5.79289V5.72146L3.71669 2.28845Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}

type IconProps = {
  stroke?: string
  fill?: string
  className?: string
  onClick?: any
}

export const MonolithsIcon = ({
  stroke = 'currentColor',
  fill = 'none',
  className,
  ...props
}: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return <Pyramid stroke={stroke} fill={fill} className={className} {...props} />
}

export const TelescopeIcon = ({
  stroke = 'currentColor',
  fill = 'none',
  className,
  ...props
}: IconProps) => {
  const config = iconAnimationConfig({stroke})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M8.67641 12.3872L9.15839 13.3564C9.40399 13.8502 10.003 14.0519 10.4973 13.8073L11 13.5585M8.67641 12.3872L8.14195 11.3126C7.91787 10.862 8.0635 10.3151 8.48199 10.0357L16.3972 4.75L19.25 9.47551L11 13.5585M8.67641 12.3872L4.75 14.25M11 13.5585L7.75 19.25M11 13.5585L14.25 19.25'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
    </motion.svg>
  )
}

export const MagicWandIcon = ({stroke = ICON_BLUE, fill, onClick}: IconProps) => {
  const config = iconAnimationConfig({stroke})
  return (
    <motion.svg
      variants={config}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}>
      <motion.path
        initial={{pathLength: 0.001}}
        stroke={stroke}
        animate={{pathLength: 1}}
        transition={transition}
        d='M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z'
        fill={fill}
        fill-rule='evenodd'
        clip-rule='evenodd'></motion.path>
    </motion.svg>
  )
}

export const AlienIcon = ({stroke = ICON_BLUE, fill = 'none', className, onClick}: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      stroke={stroke}
      onClick={onClick}>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M7.53601 16.0616C8.01848 16.559 8.53188 17.0319 9.01987 17.524C9.74801 18.2582 10.9297 19.25 12 19.25C13.0703 19.25 14.252 18.2582 14.9801 17.524C15.4681 17.0319 15.9815 16.559 16.464 16.0616C20.266 12.1412 17.6339 4.75 12 4.75C6.36613 4.75 3.734 12.1412 7.53601 16.0616Z'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M10.25 12.25L8.75 10.75'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M13.75 12.25L15.25 10.75'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
    </motion.svg>
  )
}

export const FlyingSaucerIcon = ({
  stroke = ICON_BLUE,
  fill = 'none',
  className,
  onClick,
}: IconProps) => {
  const config = iconAnimationConfig({stroke: ICON_BLUE})
  return (
    <motion.svg
      width='24'
      stroke={stroke}
      onClick={onClick}
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M8.75 15.75L6.75 19.25'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M15.25 15.75L17.25 19.25'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M15.25 8.75H8.75C7.09315 8.75 5.75 10.0931 5.75 11.75V12.25H18.25V11.75C18.25 10.0931 16.9069 8.75 15.25 8.75Z'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M7.75 8.75C7.75 6.40279 9.65279 4.75 12 4.75C14.3472 4.75 16.25 6.40279 16.25 8.75'
        stroke='currentColor'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
    </motion.svg>
  )
}

export const UFOIcon = ({
  stroke = ICON_BLUE,
  fill = 'none',
  className,
  onClick,
  ...props
}: IconProps) => {
  const config = iconAnimationConfig({stroke})
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      stroke={stroke}
      variants={config}
      onClick={onClick}
      {...props}>
      <motion.path
        initial={{pathLength: 0.001}}
        stroke={stroke}
        animate={{pathLength: 1}}
        transition={transition}
        d='M6.85467 10.408C5.34979 11.5973 4.52773 12.9733 4.80246 14.1495C5.27992 16.1938 8.88944 16.8604 12.8645 15.6385C16.8396 14.4166 19.675 11.7688 19.1975 9.7246C18.9572 8.6957 17.9235 8.01578 16.449 7.75L15.9492 7.66016'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        stroke={stroke}
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M16.75 17.75L18.25 19.25'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        stroke={stroke}
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M13.75 18.75L14.25 19.25'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        stroke={stroke}
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M18.75 15.75L19.25 16.25'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
      <motion.path
        stroke={stroke}
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M10.5003 4.90074L9.97512 5.04283C7.65461 5.67062 6.27752 8.07889 6.8993 10.4218L7.04259 10.9618C7.2165 11.6171 7.71414 12.1392 8.38877 12.2068C9.22364 12.2906 10.5035 12.2886 12.0672 11.8655C13.6387 11.4404 14.7514 10.7916 15.4321 10.2967C15.9766 9.90072 16.146 9.20539 15.9733 8.55469L15.8278 8.00632C15.206 5.66336 12.8208 4.27295 10.5003 4.90074Z'
        strokeWidth='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'></motion.path>
    </motion.svg>
  )
}

export const PinIcon = ({stroke = 'currentColor', className}: IconProps) => {
  return (
    <motion.svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M6 3.5C6 2.67157 6.67157 2 7.5 2C8.32843 2 9 2.67157 9 3.5C9 4.32843 8.32843 5 7.5 5C6.67157 5 6 4.32843 6 3.5ZM8 5.94999C9.14112 5.71836 10 4.70948 10 3.5C10 2.11929 8.88071 1 7.5 1C6.11929 1 5 2.11929 5 3.5C5 4.70948 5.85888 5.71836 7 5.94999V13.5C7 13.7761 7.22386 14 7.5 14C7.77614 14 8 13.7761 8 13.5V5.94999Z'
        stroke={stroke}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </motion.svg>
  )
}

export const DotIcon = ({stroke = 'currentColor', className}: IconProps) => {
  return (
    <motion.svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M7.5 9.125C8.39746 9.125 9.125 8.39746 9.125 7.5C9.125 6.60254 8.39746 5.875 7.5 5.875C6.60254 5.875 5.875 6.60254 5.875 7.5C5.875 8.39746 6.60254 9.125 7.5 9.125ZM7.5 10.125C8.94975 10.125 10.125 8.94975 10.125 7.5C10.125 6.05025 8.94975 4.875 7.5 4.875C6.05025 4.875 4.875 6.05025 4.875 7.5C4.875 8.94975 6.05025 10.125 7.5 10.125Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </motion.svg>
  )
}

export const PlusIcon = ({stroke = 'currentColor', className}: IconProps) => {
  return (
    <motion.svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </motion.svg>
  )
}

export const SlashIcon = ({stroke = ICON_BLUE, fill = ICON_BLUE, onClick}: IconProps) => {
  return (
    <motion.svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M4.10876 14L9.46582 1H10.8178L5.46074 14H4.10876Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </motion.svg>
  )
}

export const AddIcon = ({fill = 'currentColor', stroke, className}: IconProps) => {
  const config = iconAnimationConfig({stroke})
  return (
    <motion.svg
      variants={config}
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      stroke={stroke}
      className={className}>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </motion.svg>
  )
}

export const OracleIcon = ({
  stroke = ICON_BLUE,
  fill = ICON_BLUE,
  onClick,
  className,
}: IconProps) => {
  return (
    <motion.svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      className={className}>
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.05'
        d='M6.78296 13.376C8.73904 9.95284 8.73904 5.04719 6.78296 1.62405L7.21708 1.37598C9.261 4.95283 9.261 10.0472 7.21708 13.624L6.78296 13.376Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.1'
        d='M7.28204 13.4775C9.23929 9.99523 9.23929 5.00475 7.28204 1.52248L7.71791 1.2775C9.76067 4.9119 9.76067 10.0881 7.71791 13.7225L7.28204 13.4775Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.15'
        d='M7.82098 13.5064C9.72502 9.99523 9.72636 5.01411 7.82492 1.50084L8.26465 1.26285C10.2465 4.92466 10.2451 10.085 8.26052 13.7448L7.82098 13.5064Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.2'
        d='M8.41284 13.429C10.1952 9.92842 10.1957 5.07537 8.41435 1.57402L8.85999 1.34729C10.7139 4.99113 10.7133 10.0128 8.85841 13.6559L8.41284 13.429Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.25'
        d='M9.02441 13.2956C10.6567 9.8379 10.6586 5.17715 9.03005 1.71656L9.48245 1.50366C11.1745 5.09919 11.1726 9.91629 9.47657 13.5091L9.02441 13.2956Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.3'
        d='M9.66809 13.0655C11.1097 9.69572 11.1107 5.3121 9.67088 1.94095L10.1307 1.74457C11.6241 5.24121 11.6231 9.76683 10.1278 13.2622L9.66809 13.0655Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.35'
        d='M10.331 12.7456C11.5551 9.52073 11.5564 5.49103 10.3347 2.26444L10.8024 2.0874C12.0672 5.42815 12.0659 9.58394 10.7985 12.9231L10.331 12.7456Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.4'
        d='M11.0155 12.2986C11.9938 9.29744 11.9948 5.71296 11.0184 2.71067L11.4939 2.55603C12.503 5.6589 12.502 9.35178 11.4909 12.4535L11.0155 12.2986Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.45'
        d='M11.7214 11.668C12.4254 9.01303 12.4262 5.99691 11.7237 3.34116L12.2071 3.21329C12.9318 5.95292 12.931 9.05728 12.2047 11.7961L11.7214 11.668Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        opacity='.5'
        d='M12.4432 10.752C12.8524 8.63762 12.8523 6.36089 12.4429 4.2466L12.9338 4.15155C13.3553 6.32861 13.3554 8.66985 12.9341 10.847L12.4432 10.752Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <motion.path
        initial={{pathLength: 0.001}}
        animate={{pathLength: 1}}
        transition={transition}
        d='M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704Z'
        fill={fill}
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </motion.svg>
  )
}
