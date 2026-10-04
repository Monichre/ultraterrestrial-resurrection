'use  client'
import { format } from 'date-fns'
import './data-card.css'
interface DataCardProps {
  name: string
  description: string
  location: string
  city: string
  state: string
  date: string
  coordinates: string
  summary: string
  image: string
  video: string
  country: string
  comments?: string
  shape: string
  duration_hours_min: string
  latitude: number
  longitude: number
}

export const DataCard: React.FC<DataCardProps> = (props) => {
  console.log('props: ', props)
  const {
    name,
    description,
    location,
    city,
    state,
    date,
    coordinates,
    summary,
    image,
    video,
    country,
    latitude,
    duration_hours_min,
    longitude,
  } = props
  return (
    <div className='data-card w-full'>
      <h1 className='name text-black font-bebasNeuePro'>
        {city}, {state}
        <br />
        {country}
      </h1>
      <div className='info text-black'>{props.comments}</div>
      <div className='location text-black'>
        {' '}
        <strong>{city}</strong>, {state}
      </div>
      <div className='type bg-black'>
        <div className='checkbox'>
          <input type='checkbox' id='espresso' checked={true} />
          <label htmlFor='espresso'>UFO</label>
        </div>
        <div className='checkbox'>
          <input type='checkbox' id='filter' />
          <label htmlFor='filter'>Sighting</label>
        </div>
      </div>
      <div className='date text-black'>
        <span className='side-title text-black'>{latitude}</span>
        {longitude}
      </div>
      <div className='weight text-black'>
        <span className='side-title'>
          {date ? format(date, 'MMMM dd, yyyy') : null}
        </span>
        {/* {longitude} */}
      </div>
      <div className='footnote text-black'>Shape: {props.shape}</div>
      <div className='site text-black'>{duration_hours_min}</div>
      <div className='pattern'></div>
      <div className='square one'></div>
      <div className='square two'></div>
      <div className='strip'></div>
    </div>
  )
}
