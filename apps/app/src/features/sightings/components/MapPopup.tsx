// 'use client'
import type React from 'react'
import {Popup} from 'react-mapbox-gl'
import {formatDate} from '../utils/map-utils'
import type {FeatureInfo, GeoJSONFeature} from '../types'

// Cast Popup to allow children in TypeScript
const PopupWithChildren = Popup as unknown as React.FC<
  React.ComponentProps<typeof Popup> & {children?: React.ReactNode}
>

interface MapPopupProps {
  popupInfo: FeatureInfo
  currentHighlightedEvent?: GeoJSONFeature | null
  onClose: () => void
}

export const MapPopup: React.FC<MapPopupProps> = ({
  popupInfo,
  currentHighlightedEvent,
  onClose,
}) => {
  return (
    <PopupWithChildren coordinates={popupInfo.coordinates} offset={[0, -15]} onClick={onClose}>
      <div className='p-2 max-w-md bg-black bg-opacity-80 text-white rounded-md border border-cyan-500/30 relative'>
        {currentHighlightedEvent &&
        popupInfo.properties.id === currentHighlightedEvent.properties.id ? (
          <div className='absolute -top-2 -left-2 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded'>
            Major Event
          </div>
        ) : null}
        <h3 className='text-lg font-bold mb-1 text-cyan-400'>
          {popupInfo.properties.city || popupInfo.properties.location || 'Unknown location'}
        </h3>
        <div className='flex justify-between items-center mb-2'>
          <p className='text-sm'>
            {formatDate(popupInfo.properties.date || popupInfo.properties.timestamp)}
          </p>
          {popupInfo.properties.shape && (
            <span className='text-xs px-2 py-0.5 bg-gray-700 rounded-full'>
              {popupInfo.properties.shape}
            </span>
          )}
        </div>
        {popupInfo.properties.duration_hours_min && (
          <p className='text-xs mb-2 text-cyan-300'>
            Duration: {popupInfo.properties.duration_hours_min}
          </p>
        )}
        <p className='text-sm'>
          {popupInfo.properties.description ||
            popupInfo.properties.comments ||
            'No description available'}
        </p>
        <div className='mt-2 pt-2 border-t border-gray-700 flex justify-between items-end'>
          {popupInfo.properties.sourceUrl && (
            <a
              href={popupInfo.properties.sourceUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs text-cyan-400 underline inline-block'>
              Source
            </a>
          )}
          {popupInfo.properties.reported_date && (
            <span className='text-xs text-gray-400'>
              Reported: {popupInfo.properties.reported_date}
            </span>
          )}
        </div>
        {(popupInfo.properties.video || popupInfo.properties.image) && (
          <div className='mt-2 flex gap-2'>
            {popupInfo.properties.image && (
              <span className='text-xs bg-indigo-800 px-2 py-0.5 rounded'>📷 Photo</span>
            )}
            {popupInfo.properties.video && (
              <span className='text-xs bg-red-800 px-2 py-0.5 rounded'>🎥 Video</span>
            )}
          </div>
        )}
      </div>
    </PopupWithChildren>
  )
}
