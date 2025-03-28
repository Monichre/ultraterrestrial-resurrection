'use client'

import { useEffect } from 'react'
import './graph-paper.css' // Include your CSS styles
import { GraphPaperAnimation } from './main'
export const GraphPaper = () => {
  useEffect( () => {
    const animation = new GraphPaperAnimation()
  }, [] )

  return (
    <>
      {/* SVG Symbols */}
      <svg display='none'>
        <symbol
          version='1.1'
          x='0px'
          y='0px'
          width='31.665px'
          height='31.665px'
          viewBox='0 0 31.665 31.665'
          style={{
            // @ts-ignore
            enableBackground: 'new 0 0 31.665 31.665',
          }}
          xmlSpace='preserve'
        >
          <g>
            <path
              d='M16.878,0.415c-0.854-0.565-1.968-0.552-2.809,0.034L1.485,9.214c-0.671,0.468-1.071,1.233-1.071,2.052v9.444
            c0,0.84,0.421,1.623,1.122,2.086l12.79,8.455c0.836,0.553,1.922,0.553,2.758,0l13.044-8.618c0.7-0.463,1.122-1.246,1.122-2.086
            v-9.279c0-0.839-0.421-1.622-1.121-2.085L16.878,0.415z M26.621,10.645l-4.821,3.237l-4.521-3.288L17.25,4.127L26.621,10.645z
             M13.979,4.133v6.329l-4.633,3.24l-4.621-3.099L13.979,4.133z M3.458,13.722l2.991,2.004l-2.991,2.093V13.722z M14.058,27.215
            l-9.331-6.258l4.661-3.258l4.67,3.133V27.215z M12.286,15.674l3.021-2.113l3.519,2.313l-3.119,2.095L12.286,15.674z M17.354,27.215
            V20.83l4.463-2.991l4.805,3.159L17.354,27.215z M27.954,17.927l-3.168-2.082l3.168-2.125V17.927z'
            />
          </g>
        </symbol>
        <symbol
          version='1.1'
          id='twitter'
          x='0px'
          y='0px'
          viewBox='0 0 612 612'
          style={{
            // @ts-ignore
            enableBackground: 'new 0 0 612 612',
          }}
          xmlSpace='preserve'
        >
          <g>
            <g>
              <path
                d='M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411
                c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513
                c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101
                c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104
                c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194
                c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485
                c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z'
              />
            </g>
          </g>
        </symbol>
      </svg>
      <main className='graph-paper'>
        <canvas id='plane-canvas'></canvas>
        <canvas id='main-canvas'></canvas>
        <div className='mouse'>Hold mouse1 button</div>
        <div className='plate'>
          <h2 className='text-animation' data-js='text'>
            {/* frontend developer */}
          </h2>
          <p className='text-animation' data-js='text'>
            {/* Russia, Saint-Petersburg */}
          </p>
          <div className='social'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='social__twitter'
              href='https://twitter.com/fajjet'
            ></a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='social__codepen'
              href='https://codepen.io/fajjet'
            ></a>
          </div>
        </div>
      </main>
    </>
  )
}
