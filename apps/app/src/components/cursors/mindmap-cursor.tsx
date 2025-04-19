'use client'
import * as React from 'react'

import AnimatedCursor from 'react-animated-cursor'
// const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {

// })

export const GooeyCursor: React.FC = () => {
  const valuesAlt = ` 2.000  0.000  0.000  0.000  0.000 
0.000  2.000  0.000  0.000  0.000 
0.000  0.000  2.000  0.000  0.000 
0.000  0.000  0.000  1.000  0.000`

  const values = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15'
  return (
    <>
      <svg
        id='goo-svg'
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        className='absolute pointer-events-none z-0'
      // width='800'
      >
        <defs>
          <filter id='goo'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='6' result='blur' />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values={values}
              result='goo'
            />
            <feComposite in='SourceGraphic' in2='goo' operator='atop' />
          </filter>
        </defs>
      </svg>
      <AnimatedCursor
        innerSize={5}
        outerSize={35}
        innerScale={2}
        outerScale={1.7}
        outerAlpha={0.4}
        clickables={['a', 'button']}
        // color={"#27F1FF"}  
        // color={'#fff'}
        innerStyle={{
          // backgroundColor: ICON_GREEN,
          backgroundColor: '#fff',
          // backgroundImage: "url('/ufo.png')",
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          // cursor: 'none',
        }}
        // outerAlpha={0.4}
        outerStyle={{

          // mixBlendMode: 'difference',
          // transformOrigin: 'center center',
          // mixBlendMode: 'exclusion',
          backgroundColor: 'transparent',
          border: `1px solid rgba(39, 241, 255, 1)`,
          // filter: 'url("#goo")',
        }}
      />
    </>
  )
}
