'use client'

/**
 * FormationUI — chrome around the Formation° canvas
 * (https://formation.phobon.io, © phbn).
 */
import {useState} from 'react'
import {Formation} from './Formation'
import {SURFACES, type SurfaceId} from './surfaces'
import './formation-ui.css'

const LOGO_PATH =
  'M11.5 5.28867C11.8094 5.11004 12.1906 5.11004 12.5 5.28867L14.9641 6.71132C15.2735 6.88995 15.4641 7.22008 15.4641 7.57734V10.4226C15.4641 10.7799 15.2735 11.11 14.9641 11.2887L12.5 12.7113C12.1906 12.89 11.8094 12.89 11.5 12.7113L9.03589 11.2887C8.72649 11.11 8.53589 10.7799 8.53589 10.4226V7.57734C8.53589 7.22008 8.72649 6.88995 9.03589 6.71132L11.5 5.28867ZM20.5 5.28867C20.1906 5.11004 19.8094 5.11004 19.5 5.28867L17.0359 6.71132C16.7265 6.88995 16.5359 7.22008 16.5359 7.57734V10.4226C16.5359 10.7799 16.7265 11.11 17.0359 11.2887L19.5 12.7113C19.8094 12.89 20.1906 12.89 20.5 12.7113L22.9641 11.2887C23.2735 11.11 23.4641 10.7799 23.4641 10.4226V7.57734C23.4641 7.22008 23.2735 6.88995 22.9641 6.71132L20.5 5.28867ZM15.5 12.2887C15.8094 12.11 16.1906 12.11 16.5 12.2887L18.9641 13.7113C19.2735 13.89 19.4641 14.2201 19.4641 14.5773V17.4226C19.4641 17.7799 19.2735 18.11 18.9641 18.2887L16.5 19.7113C16.1906 19.89 15.8094 19.89 15.5 19.7113L13.0359 18.2887C12.7265 18.11 12.5359 17.7799 12.5359 17.4226V14.5773C12.5359 14.2201 12.7265 13.89 13.0359 13.7113L15.5 12.2887ZM23.5 12.2887C23.8094 12.11 24.1906 12.11 24.5 12.2887L26.9641 13.7113C27.2735 13.89 27.4641 14.2201 27.4641 14.5773V17.4226C27.4641 17.7799 27.2735 18.11 26.9641 18.2887L24.5 19.7113C24.1906 19.89 23.8094 19.89 23.5 19.7113L21.0359 18.2887C20.7265 18.11 20.5359 17.7799 20.5359 17.4226V14.5773C20.5359 14.2201 20.7265 13.89 21.0359 13.7113L23.5 12.2887ZM12.5 19.2887C12.1906 19.11 11.8094 19.11 11.5 19.2887L9.03589 20.7113C8.72649 20.89 8.53589 21.2201 8.53589 21.5773V24.4226C8.53589 24.7799 8.72649 25.11 9.03589 25.2887L11.5 26.7113C11.8094 26.89 12.1906 26.89 12.5 26.7113L14.9641 25.2887C15.2735 25.11 15.4641 24.7799 15.4641 24.4226V21.5773C15.4641 21.2201 15.2735 20.89 14.9641 20.7113L12.5 19.2887ZM19.5 19.2887C19.8094 19.11 20.1906 19.11 20.5 19.2887L22.9641 20.7113C23.2735 20.89 23.4641 21.2201 23.4641 21.5773V24.4226C23.4641 24.7799 23.2735 25.11 22.9641 25.2887L20.5 26.7113C20.1906 26.89 19.8094 26.89 19.5 26.7113L17.0359 25.2887C16.7265 25.11 16.5359 24.7799 16.5359 24.4226V21.5773C16.5359 21.2201 16.7265 20.89 17.0359 20.7113L19.5 19.2887ZM8.49999 12.2887C8.19059 12.11 7.80939 12.11 7.49999 12.2887L5.03589 13.7113C4.72649 13.89 4.53589 14.2201 4.53589 14.5773V17.4226C4.53589 17.7799 4.72649 18.11 5.03589 18.2887L7.49999 19.7113C7.80939 19.89 8.19059 19.89 8.49999 19.7113L10.9641 18.2887C11.2735 18.11 11.4641 17.7799 11.4641 17.4226V14.5773C11.4641 14.2201 11.2735 13.89 10.9641 13.7113L8.49999 12.2887Z'

const CATEGORIES: {label: string; items: string[]; enabled: boolean}[] = [
  {label: 'Flowfield', items: Object.keys(SURFACES), enabled: true},
  {label: 'Texture', items: ['perlin', 'gradient'], enabled: false},
  {label: 'Transmission', items: ['aberth', 'valus', 'dionin', 'argus'], enabled: false},
]

const titleOf = (id: string) =>
  SURFACES[id as SurfaceId]?.title ?? id.charAt(0).toUpperCase() + id.slice(1)

export function FormationUI() {
  const [surface, setSurface] = useState<SurfaceId>('cellular')
  const [title, setTitle] = useState('Cellular')
  const [active, setActive] = useState('cellular')

  const select = (id: string, enabled: boolean) => {
    setTitle(titleOf(id))
    setActive(id)
    if (enabled) setSurface(id as SurfaceId)
  }

  return (
    <div className='formation'>
      <div className='formation__canvas'>
        <Formation surface={surface} />
      </div>

      <div className='formation__ui'>
        <svg className='formation__logo' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
          <path fillRule='evenodd' clipRule='evenodd' d={LOGO_PATH} />
        </svg>

        <nav className='formation__nav'>
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className='formation__group'>{cat.label}</div>
              <ul>
                {cat.items.map((id) => (
                  <li
                    key={id}
                    className={
                      (active === id ? 'is-active ' : '') + (cat.enabled ? '' : 'is-disabled')
                    }
                    onClick={() => select(id, cat.enabled)}>
                    {titleOf(id)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className='formation__desc'>
          A collection of generative, algorithmic shader experiences coalesced from the void.
        </div>
        <div className='formation__credit'>
          <div className='formation__spinner' />
          <span>Formation°</span>
          <span className='formation__c'>
            © 2026
            <br />
            BY
          </span>
          <span className='formation__phbn'>PHBN</span>
        </div>

        <div className='formation__orb' />

        <div className='formation__title' key={title}>
          <span className='formation__reveal'>
            <span>{title}</span>
          </span>
        </div>

        <button className='formation__navigate' type='button'>
          Navigate
        </button>
      </div>
    </div>
  )
}

export default FormationUI
