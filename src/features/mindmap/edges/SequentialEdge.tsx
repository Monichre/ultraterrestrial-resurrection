// 'use client'
// // import React from 'react'
// // import {
// //   BaseEdge,
// //   EdgeLabelRenderer,
// //   EdgeProps,
// //   getBezierPath,
// //   useReactFlow,
// // } from '@xyflow/react'
// // import { NEONS } from '@/utils'
// // import { useMindMap } from '@/providers'
// // import { getEdgeParams } from '@/features/mindmap/graph'
// // import { motion } from 'framer-motion'

// // type SiblingEdgeProps = {
// //   data: { sourceType: string; targetType: string }
// // }

// // const MotionBaseEdge = motion(BaseEdge)
// // const TwoWayArrows = ({ stroke, children }: any) => (
// //   <svg
// //     className='w-7 h-7'
// //     viewBox='0 0 119 88'
// //     fill='none'
// //     xmlns='http://www.w3.org/2000/svg'
// //   >
// //     <path
// //       d='M113.4 17.361C89.7749 15.4615 65.0241 16.6174 41.5779 13.361C40.5911 13.224 29.0625 12.6854 31.8001 11.3166C33.5007 10.4663 52.3886 3.44264 52.2445 3.31659C50.1253 1.46242 27.3922 8.25769 25.0445 10.6055C24.8923 10.7577 50.8571 26.8896 54.2001 28.561'
// //       stroke={'#fff'}
// //       strokeWidth='3'
// //       stroke-linecap='round'
// //     />
// //     <path
// //       d='M3 58.961C35.8611 62.7435 69.5762 69.9485 102.2 71.761C117.812 72.6284 95.7404 64.0866 91 58.161C84.9491 50.5974 106.398 70.7889 115.711 73.4499C119.397 74.5029 88.2736 80.414 86.2001 84.561'
// //       stroke={'#fff'}
// //       strokeWidth='3'
// //       stroke-linecap='round'
// //     />
// //     {children}
// //   </svg>
// // )
// // export const MarkerEnd = () => (
// //   <svg
// //     className='absolute top-0 left-0 wf-ull h-full stroke-1'
// //     viewBox='0 0 64 64'
// //     fill='none'
// //     xmlns='http://www.w3.org/2000/svg'
// //     id='custom-marker'
// //   >
// //     <path
// //       d='M1.91734 2.01577L25.1499 23.4512L50.0672 0.330973L26.947 25.2483L63.5456 63.644L25.1499 27.0455L0.232543 50.1656L23.3527 25.2483L1.91734 2.01577Z'
// //       fill='currentColor'
// //     />
// //     <path
// //       d='M1.91734 2.01577L25.1499 23.4512L50.0672 0.330973L26.947 25.2483L63.5456 63.644L25.1499 27.0455L0.232543 50.1656L23.3527 25.2483L1.91734 2.01577Z'
// //       fill='currentColor'
// //       fill-opacity='0.2'
// //     />
// //   </svg>
// // )
// // export const SiblingEdge = ({
// //   id,
// //   sourceX,
// //   sourceY,
// //   targetX,
// //   target,
// //   source,
// //   targetY,
// //   sourcePosition,
// //   targetPosition,
// //   style = {
// //     stroke: NEONS.blue,
// //   },
// //   label = '::',
// // }: EdgeProps & SiblingEdgeProps) => {
// //   console.log('target: ', target)
// //   console.log('source: ', source)
// //   console.log('style: ', style)
// //   const { useInternalNode } = useMindMap()
// //   const sourceNode = useInternalNode(source)
// //   console.log('sourceNode: ', sourceNode)
// //   const targetNode = useInternalNode(target)
// //   console.log('targetNode: ', targetNode)

// //   if (!sourceNode || !targetNode) {
// //     return null
// //   }

// //   const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
// //     sourceNode,
// //     targetNode
// //   )

// //   // const [edgePath, labelX, labelY] = getBezierPath({
// //   //   sourceX,
// //   //   sourceY,
// //   //   sourcePosition,
// //   //   targetX,
// //   //   targetY,
// //   //   targetPosition,
// //   // })

// //   const [edgePath, labelX, labelY] = getBezierPath({
// //     sourceX: sx,
// //     sourceY: sy,
// //     sourcePosition: sourcePos,
// //     targetPosition: targetPos,
// //     targetX: tx,
// //     targetY: ty,
// //   })
// //   // @ts-ignore
// //   const [sourceLabel, targetLabel] = label?.split('::')
// //   const [visible, setVisible] = React.useState(false)
// //   return (
// //     <>
// //       <MotionBaseEdge
// //         path={edgePath}
// //         style={{
// //           ...style,
// //           zIndex: 1,
// //         }}
// //         markerEnd={'custom-marker'}
// //       />

// //       <EdgeLabelRenderer>
// //         <div
// //           className={`absolute nodrag nopan rounded-full p-4 w-[200px] h-[200px] opacity-0 `}
// //           style={{
// //             // backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 74 73%22 fill%3D%22none%22%3E%3Cpath d%3D%22M19.9069 10.1838C17.928 10.8822 16.2006 11.5097 14.6661 12.1855M14.6661 12.1855C10.4645 14.0361 7.70931 16.2487 5.1987 21.2697C3.51783 24.6312 2.53544 28.3007 1.6944 31.9536C-0.47777 41.3882 2.96668 48.3206 8.81366 55.5478C17.4313 66.1997 32.0549 74.7462 46.1869 71.9102C56.471 69.8465 65.8503 61.8258 70.2 52.5065C74.0539 44.2498 73.2839 36.0446 72.0244 27.2754C69.1235 7.07819 50.5864 -2.9112 32.0297 1.92921C26.679 3.32492 22.0101 5.76761 17.877 9.43193C16.8071 10.3805 15.7698 11.3221 14.6661 12.1855ZM14.6661 12.1855C14.0026 12.7047 13.3151 13.1955 12.5821 13.6428C8.04578 16.4106 6.57043 22.6692 4.82841 27.2122%22 stroke%3D%22currentColor%22 strokeWidth%3D%220.8751%22 stroke-dasharray%3D%221.75 1.75%22/%3E%3C/svg%3E')`,
// //             // backgroundSize: 'contain',
// //             // backgroundRepeat: 'no-repeat',
// //             // backgroundPosition: 'center',
// //             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
// //             fontSize: 16,
// //             // everything inside EdgeLabelRenderer has no pointer events by default
// //             // if you have an interactive element, set pointer-events: all
// //             pointerEvents: 'all',
// //           }}
// //         >
// //           {/* <svg
// //             className='absolute top-0 left-0 wf-ull h-full stroke-1'
// //             viewBox='0 0 88 79'
// //             fill='none'
// //             xmlns='http://www.w3.org/2000/svg'
// //           >
// //             <path
// //               d='M23.3444 11.2133C20.964 11.962 18.886 12.6347 17.0401 13.3592M17.0401 13.3592C11.9858 15.343 8.67146 17.715 5.65135 23.0976C3.62937 26.7012 2.44761 30.635 1.43589 34.551C-1.17712 44.665 2.96636 52.0967 9.99994 59.8444C20.3665 71.2635 37.9578 80.4255 54.9578 77.3853C67.3289 75.1729 78.6117 66.5745 83.8442 56.5841C88.4801 47.7327 87.554 38.9366 86.0389 29.5359C82.5493 7.88401 60.2501 -2.82481 37.9275 2.36419C31.4909 3.86043 25.8745 6.47904 20.9026 10.4073C19.6156 11.4241 18.3678 12.4335 17.0401 13.3592ZM17.0401 13.3592C16.2419 13.9157 15.4149 14.4419 14.5332 14.9214C9.07622 17.8885 7.30147 24.5979 5.20592 29.4681'
// //               stroke='currentColor'
// //               strokeWidth='0.8751'
// //               stroke-dasharray='10.59 10.59'
// //             />
// //           </svg> */}

// //           <svg
// //             className='absolute top-0 left-0 w-full h-full stroke-1'
// //             viewBox='0 0 74 73'
// //             fill='none'
// //             xmlns='http://www.w3.org/2000/svg'
// //           >
// //             <path
// //               d='M19.9069 10.1838C17.928 10.8822 16.2006 11.5097 14.6661 12.1855M14.6661 12.1855C10.4645 14.0361 7.70931 16.2487 5.1987 21.2697C3.51783 24.6312 2.53544 28.3007 1.6944 31.9536C-0.47777 41.3882 2.96668 48.3206 8.81366 55.5478C17.4313 66.1997 32.0549 74.7462 46.1869 71.9102C56.471 69.8465 65.8503 61.8258 70.2 52.5065C74.0539 44.2498 73.2839 36.0446 72.0244 27.2754C69.1235 7.07819 50.5864 -2.9112 32.0297 1.92921C26.679 3.32492 22.0101 5.76761 17.877 9.43193C16.8071 10.3805 15.7698 11.3221 14.6661 12.1855ZM14.6661 12.1855C14.0026 12.7047 13.3151 13.1955 12.5821 13.6428C8.04578 16.4106 6.57043 22.6692 4.82841 27.2122'
// //               stroke='#fff'
// //               strokeWidth='0.2'
// //               stroke-dasharray='1.75 1.75'
// //             />
// //           </svg>
// //           <div className='flex flex-col h-full w-full justify-center align-center items-center text-center text-white justify-center '>
// //             <div className='flex justify-evenly items-center align-middle'>
// //               <div className='font-bebasNeuePro text-xs text-white tracking-widest font-light w-min '>
// //                 {sourceLabel}
// //               </div>
// //               <div className=' w-fill-text-primary mx-4'>
// //                 <TwoWayArrows stroke={style.stroke}>
// //                   <animateMotion
// //                     dur='2s'
// //                     repeatCount='indefinite'
// //                     path={edgePath}
// //                   />
// //                 </TwoWayArrows>
// //               </div>
// //               <div className='font-bebasNeuePro text-md text-white tracking-widest font-light w-min '>
// //                 {targetLabel}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </EdgeLabelRenderer>
// //     </>
// //   )
// // }

// import {useMindMap} from '@/providers'
// import {NEONS} from '@/utils'
// import {BezierEdge, type EdgeProps} from '@xyflow/react'

// import {getSmartEdge} from '@tisoap/react-flow-smart-edge'

// type SiblingEdgeProps = {
//   data: {sourceType: string; targetType: string}
// }

// const foreignObjectSize = 200

// const TwoWayArrows = ({stroke, children}: any) => (
//   <svg className='w-7 h-7' viewBox='0 0 119 88' fill='none' xmlns='http://www.w3.org/2000/svg'>
//     <path
//       d='M113.4 17.361C89.7749 15.4615 65.0241 16.6174 41.5779 13.361C40.5911 13.224 29.0625 12.6854 31.8001 11.3166C33.5007 10.4663 52.3886 3.44264 52.2445 3.31659C50.1253 1.46242 27.3922 8.25769 25.0445 10.6055C24.8923 10.7577 50.8571 26.8896 54.2001 28.561'
//       stroke={'#fff'}
//       strokeWidth='3'
//       stroke-linecap='round'
//     />
//     <path
//       d='M3 58.961C35.8611 62.7435 69.5762 69.9485 102.2 71.761C117.812 72.6284 95.7404 64.0866 91 58.161C84.9491 50.5974 106.398 70.7889 115.711 73.4499C119.397 74.5029 88.2736 80.414 86.2001 84.561'
//       stroke={'#fff'}
//       strokeWidth='3'
//       stroke-linecap='round'
//     />
//     {children}
//   </svg>
// )
// export const MarkerEnd = () => (
//   <svg
//     className='absolute top-0 left-0 wf-ull h-full stroke-1'
//     viewBox='0 0 64 64'
//     fill='none'
//     xmlns='http://www.w3.org/2000/svg'
//     id='custom-marker'>
//     <path
//       d='M1.91734 2.01577L25.1499 23.4512L50.0672 0.330973L26.947 25.2483L63.5456 63.644L25.1499 27.0455L0.232543 50.1656L23.3527 25.2483L1.91734 2.01577Z'
//       fill='currentColor'
//     />
//     <path
//       d='M1.91734 2.01577L25.1499 23.4512L50.0672 0.330973L26.947 25.2483L63.5456 63.644L25.1499 27.0455L0.232543 50.1656L23.3527 25.2483L1.91734 2.01577Z'
//       fill='currentColor'
//       fill-opacity='0.2'
//     />
//   </svg>
// )
// export const SiblingEdge = (props: EdgeProps & SiblingEdgeProps) => {
//   console.log('props: ', props)
//   const {
//     id,
//     sourceX,
//     sourceY,
//     targetX,
//     target,
//     source,
//     targetY,
//     sourcePosition,
//     targetPosition,
//     markerStart,
//     markerEnd,
//     style = {
//       stroke: NEONS.blue,
//     },
//     label = '::',
//   } = props
//   const {useNodes} = useMindMap()
//   console.log('sourcePosition: ', sourcePosition)
//   // const sourceNode = useInternalNode(source)
//   // console.log('sourceNode: ', sourceNode)

//   // const targetNode = useInternalNode(target)
//   // console.log('targetNode: ', targetNode)

//   const nodes = useNodes()
//   console.log('nodes: ', nodes)

//   const getSmartEdgeResponse = getSmartEdge({
//     sourcePosition,
//     targetPosition,
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     nodes,
//   })
//   console.log('getSmartEdgeResponse: ', getSmartEdgeResponse)

//   // If the value returned is null, it means "getSmartEdge" was unable to find
//   // a valid path, and you should do something else instead
//   if (getSmartEdgeResponse === null) {
//     return <BezierEdge {...props} />
//   }
//   // if (!sourceNode || !targetNode) {
//   //   return null
//   // }

//   const {edgeCenterX, edgeCenterY, svgPathString, ...rest} = getSmartEdgeResponse

//   console.log('rest: ', rest)
//   // const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
//   //   sourceNode,
//   //   targetNode
//   // )

//   // const [edgePath, labelX, labelY] = getBezierPath({
//   //   sourceX,
//   //   sourceY,
//   //   sourcePosition,
//   //   targetX,
//   //   targetY,
//   //   targetPosition,
//   // })

//   // const [edgePath, labelX, labelY] = getBezierPath({
//   //   sourceX: sx,
//   //   sourceY: sy,
//   //   sourcePosition: sourcePos,
//   //   targetPosition: targetPos,
//   //   targetX: tx,
//   //   targetY: ty,
//   // })
//   // @ts-ignore
//   const [sourceLabel, targetLabel] = label?.split('::')
//   return (
//     <>
//       <path
//         style={{
//           ...style,
//           zIndex: 3,
//         }}
//         className='react-flow__edge-path'
//         d={svgPathString}
//         markerEnd={markerEnd}
//         markerStart={markerStart}
//       />
//       <foreignObject
//         width={foreignObjectSize}
//         height={foreignObjectSize}
//         x={edgeCenterX - foreignObjectSize / 2}
//         y={edgeCenterY - foreignObjectSize / 2}
//         requiredExtensions='http://www.w3.org/1999/xhtml'>
//         <span>{/* {sourceLabel}:{targetLabel} */}</span>
//       </foreignObject>
//     </>
//   )
//   // return (
//   //   <>
//   //     <BaseEdge
//   //       path={edgePath}
//   //       style={{
//   //         ...style,
//   //         zIndex: 1,
//   //       }}
//   //       markerEnd={'custom-marker'}
//   //     />

//   //     <EdgeLabelRenderer>
//   //       <motion.div
//   //         className={`absolute nodrag nopan rounded-full p-4 w-[200px] h-[200px]`}
//   //         initial={{ opacity: 0 }}
//   //         animate={{ opacity: visible ? 1 : 0 }}
//   //         style={{
//   //           // backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 74 73%22 fill%3D%22none%22%3E%3Cpath d%3D%22M19.9069 10.1838C17.928 10.8822 16.2006 11.5097 14.6661 12.1855M14.6661 12.1855C10.4645 14.0361 7.70931 16.2487 5.1987 21.2697C3.51783 24.6312 2.53544 28.3007 1.6944 31.9536C-0.47777 41.3882 2.96668 48.3206 8.81366 55.5478C17.4313 66.1997 32.0549 74.7462 46.1869 71.9102C56.471 69.8465 65.8503 61.8258 70.2 52.5065C74.0539 44.2498 73.2839 36.0446 72.0244 27.2754C69.1235 7.07819 50.5864 -2.9112 32.0297 1.92921C26.679 3.32492 22.0101 5.76761 17.877 9.43193C16.8071 10.3805 15.7698 11.3221 14.6661 12.1855ZM14.6661 12.1855C14.0026 12.7047 13.3151 13.1955 12.5821 13.6428C8.04578 16.4106 6.57043 22.6692 4.82841 27.2122%22 stroke%3D%22currentColor%22 strokeWidth%3D%220.8751%22 stroke-dasharray%3D%221.75 1.75%22/%3E%3C/svg%3E')`,
//   //           // backgroundSize: 'contain',
//   //           // backgroundRepeat: 'no-repeat',
//   //           // backgroundPosition: 'center',
//   //           transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
//   //           fontSize: 16,
//   //           // everything inside EdgeLabelRenderer has no pointer events by default
//   //           // if you have an interactive element, set pointer-events: all
//   //           pointerEvents: 'all',
//   //         }}
//   //       >
//   //         {/* <svg
//   //           className='absolute top-0 left-0 wf-ull h-full stroke-1'
//   //           viewBox='0 0 88 79'
//   //           fill='none'
//   //           xmlns='http://www.w3.org/2000/svg'
//   //         >
//   //           <path
//   //             d='M23.3444 11.2133C20.964 11.962 18.886 12.6347 17.0401 13.3592M17.0401 13.3592C11.9858 15.343 8.67146 17.715 5.65135 23.0976C3.62937 26.7012 2.44761 30.635 1.43589 34.551C-1.17712 44.665 2.96636 52.0967 9.99994 59.8444C20.3665 71.2635 37.9578 80.4255 54.9578 77.3853C67.3289 75.1729 78.6117 66.5745 83.8442 56.5841C88.4801 47.7327 87.554 38.9366 86.0389 29.5359C82.5493 7.88401 60.2501 -2.82481 37.9275 2.36419C31.4909 3.86043 25.8745 6.47904 20.9026 10.4073C19.6156 11.4241 18.3678 12.4335 17.0401 13.3592ZM17.0401 13.3592C16.2419 13.9157 15.4149 14.4419 14.5332 14.9214C9.07622 17.8885 7.30147 24.5979 5.20592 29.4681'
//   //             stroke='currentColor'
//   //             strokeWidth='0.8751'
//   //             stroke-dasharray='10.59 10.59'
//   //           />
//   //         </svg> */}

//   //         <svg
//   //           className='absolute top-0 left-0 w-full h-full stroke-1'
//   //           viewBox='0 0 74 73'
//   //           fill='none'
//   //           xmlns='http://www.w3.org/2000/svg'
//   //         >
//   //           <path
//   //             d='M19.9069 10.1838C17.928 10.8822 16.2006 11.5097 14.6661 12.1855M14.6661 12.1855C10.4645 14.0361 7.70931 16.2487 5.1987 21.2697C3.51783 24.6312 2.53544 28.3007 1.6944 31.9536C-0.47777 41.3882 2.96668 48.3206 8.81366 55.5478C17.4313 66.1997 32.0549 74.7462 46.1869 71.9102C56.471 69.8465 65.8503 61.8258 70.2 52.5065C74.0539 44.2498 73.2839 36.0446 72.0244 27.2754C69.1235 7.07819 50.5864 -2.9112 32.0297 1.92921C26.679 3.32492 22.0101 5.76761 17.877 9.43193C16.8071 10.3805 15.7698 11.3221 14.6661 12.1855ZM14.6661 12.1855C14.0026 12.7047 13.3151 13.1955 12.5821 13.6428C8.04578 16.4106 6.57043 22.6692 4.82841 27.2122'
//   //             stroke='#fff'
//   //             strokeWidth='0.2'
//   //             stroke-dasharray='1.75 1.75'
//   //           />
//   //         </svg>
//   //         <div className='flex flex-col h-full w-full justify-center align-center items-center text-center text-white justify-center '>
//   //           <div className='flex justify-evenly items-center align-middle'>
//   //             <div className='font-bebasNeuePro text-xs text-white tracking-widest font-light w-min '>
//   //               {sourceLabel}
//   //             </div>
//   //             <div className=' w-fill-text-primary mx-4'>
//   //               <TwoWayArrows stroke={style.stroke}>
//   //                 <animateMotion
//   //                   dur='2s'
//   //                   repeatCount='indefinite'
//   //                   path={edgePath}
//   //                 />
//   //               </TwoWayArrows>
//   //             </div>
//   //             <div className='font-bebasNeuePro text-md text-white tracking-widest font-light w-min '>
//   //               {targetLabel}
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </motion.div>
//   //     </EdgeLabelRenderer>
//   //   </>
//   // )
// }
import { NEONS } from '@/utils'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'

export const SequentialEdge = ( {
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
  style = {
    stroke: NEONS.blue,
  },
}: any ) => {
  const [edgePath, labelX, labelY] = getBezierPath( {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  } )

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className='nodrag nopan'>
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
