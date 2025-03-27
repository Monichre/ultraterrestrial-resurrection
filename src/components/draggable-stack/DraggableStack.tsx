'use client'
import {clx} from '@/lib/utils/clx/clx-merge'
import {motion} from 'framer-motion'
import {useState} from 'react'
import {twMerge} from 'tailwind-merge'

export const DragCards = clx.div('absolute inset-0 z-10')
export const DragCardsTitle = clx.h4(
  'relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]'
)

type TDragCard = {
  containerRef: React.RefObject<HTMLDivElement>
  src: string
  alt: string
  top: string
  left: string
  rotate: string
  className: string
}

export function DragCard({containerRef, src, alt, top, left, rotate, className}: TDragCard) {
  const [zIndex, setZIndex] = useState(0)

  return (
    <motion.img
      onMouseDown={() => updateZIndex_(setZIndex)}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge('drag-elements absolute w-48 bg-neutral-200 p-1 pb-4', className)}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      // Uncomment below and remove dragElastic to remove movement after release
      //   dragMomentum={false}
      dragElastic={0.65}
    />
  )
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const updateZIndex_ = (setZIndex: React.Dispatch<React.SetStateAction<number>>) => {
  const els = document.querySelectorAll('.drag-elements')

  let maxZIndex = Number.NEGATIVE_INFINITY

  els.forEach((el) => {
    const zIndex = Number.parseInt(window.getComputedStyle(el).getPropertyValue('z-index'))

    if (!Number.isNaN(zIndex) && zIndex > maxZIndex) {
      maxZIndex = zIndex
    }
  })

  setZIndex(maxZIndex + 1)
}

// "use client";
// import { useRef } from "react";

// import { clx } from "@/lib/utils/clx/clx-merge";
// import { DragCard, DragCards, DragCardsTitle } from "@/components/ui/cards-drag";

// export function DemoCardsDrag() {
//   const containerRef = useRef(null);

//   const DemoContainer = clx.section(
//     "relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950",
//   );

//   return (
//     <DemoContainer>
//       <DragCardsTitle>CARDS</DragCardsTitle>

//       <DragCards ref={containerRef}>
//         {CARDS_DEMO.map((card, index) => (
//           <DragCard
//             key={index}
//             containerRef={containerRef}
//             src={card.src}
//             alt={card.alt}
//             rotate={card.rotate}
//             top={card.top}
//             left={card.left}
//             className={card.className}
//           />
//         ))}
//       </DragCards>
//     </DemoContainer>
//   );
// }

// /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
// /*                        CONSTANTS                           */
// /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// const CARDS_DEMO = [
//   {
//     src: "https://images.unsplash.com/photo-1635373670332-43ea883bb081?q=80&w=2781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "6deg",
//     top: "20%",
//     left: "25%",
//     className: "w-36 md:w-56",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "12deg",
//     top: "45%",
//     left: "60%",
//     className: "w-24 md:w-48",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "-6deg",
//     top: "20%",
//     left: "40%",
//     className: "w-52 md:w-80",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2609&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "8deg",
//     top: "50%",
//     left: "40%",
//     className: "w-48 md:w-72",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1602212096437-d0af1ce0553e?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "18deg",
//     top: "20%",
//     left: "65%",
//     className: "w-40 md:w-64",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Example image",
//     rotate: "-3deg",
//     top: "35%",
//     left: "55%",
//     className: "w-24 md:w-48",
//   },
// ] as const;
