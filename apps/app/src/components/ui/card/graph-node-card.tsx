import { DotGridBackgroundBlack } from '@/components/backgrounds'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState, useEffect } from 'react'
const dayjs = require( 'dayjs' )
const utc = require( 'dayjs/plugin/utc' )
dayjs.extend( utc )
export type GraphNodeCardData = {
  data: {
    date: string
    description: string
    latitude: number
    longitude: number
    location: string
    photos: string[]
    name: string
    color: string
    type: string
    label: string
    fill: string
  }
}

export const GraphNodeCard: React.FC<GraphNodeCardData> = ( {
  data,
  ...rest
} ) => {
  const {
    date: unformattedDate,
    description,
    latitude,
    location,
    longitude,
    photos,
    name,
    color,
    type,
    label,
    fill,
  } = data
  const date = dayjs( data?.date ).format( 'DD.MM.YY' )
  const [animatedTitle, setAnimatedTitle] = useState<string>( '' )
  const [animatedDate, setAnimatedDate] = useState<string>( '' )
  const [titleFinished, setTitleFinished] = useState( false )
  const [t, setT] = useState<number>( 0 )
  const [i, setI] = useState<number>( 0 )

  useEffect( () => {
    const typingEffect = setInterval( () => {
      if ( t < name.length ) {
        setAnimatedTitle( name.substring( 0, t + 1 ) )
        setT( t + 1 )
      } else {
        clearInterval( typingEffect )

        setTitleFinished( true )
      }
    }, 100 )

    return () => {
      clearInterval( typingEffect )
    }
  }, [name, t] )

  useEffect( () => {
    const typingEffectTwo = setInterval( () => {
      if ( titleFinished ) {
        if ( i < date.length ) {
          setAnimatedDate( date.substring( 0, i + 1 ) )
          setI( i + 1 )
        } else {
          clearInterval( typingEffectTwo )
        }
      }
    }, 100 )

    return () => {
      clearInterval( typingEffectTwo )
    }
  }, [date, date.length, i, name, t, titleFinished] )

  return (
    <Card
      className='bg-card relative overflow-hidden entity-node w-auto max-w-[600px]'
      style={{ borderColor: color }}
      {...rest}
    >
      <DotGridBackgroundBlack />
      <CardHeader className='p-2 relative text-white uppercase font-bebasNeuePro text-lg tracking-wider'>
        {animatedTitle}
      </CardHeader>
      <CardContent className='relative z-20'>
        {/* <p className='text-xs text-muted-foreground text-white'>
          {description}
        </p> */}

        {/* <img src={photos[0].url} alt={photos[0].name} className='mt-2' /> */}

        <div className='mt-2'>
          <p className='date text-[#78efff] font-bebasNeuePro tracking-wider'>
            {/* Date{new Date(date).toLocaleDateString()} */}
            {animatedDate}
          </p>
          <div className='flex'>
            <span>{location}</span>
            <span>
              {latitude}, {longitude}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
