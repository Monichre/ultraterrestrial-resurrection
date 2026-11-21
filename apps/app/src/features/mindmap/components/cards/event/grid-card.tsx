import { useEntity } from "@/hooks"
import { STOCK_PHOTOS } from "@/utils"

import { format } from "date-fns"
import { project } from "deck.gl"
import { ArrowUpRight } from "lucide-react"

import { useState } from "react"

export function GridCard( { card }: { card: any } ) {
  const [isHovered, setIsHovered] = useState( false )
  const {
    findConnections,
    entity,
    bookmarked,
    userNote,
    saveNote,
    updateNote,
  } = useEntity( { card } )
  const { location, date, photos, photo, id, color, name, type } = entity
  const stock = {
    url: STOCK_PHOTOS.saucer,
    src: STOCK_PHOTOS.saucer,
  }
  const bgPhoto = photos?.length && photos[0]?.mediaType?.startsWith( 'image/' ) ? photos[0] : stock
  const formattedDate = date ? format( date, 'MM/dd/yyyy' ) : null

  return (
    <div
      className="relative bg-neutral-950 aspect-square border-r border-b border-neutral-800 grid-card"
      onMouseEnter={() => setIsHovered( true )}
      onMouseLeave={() => setIsHovered( false )}
    >
      <div className="p-3">
        <div className="text-xs text-neutral-400 font-mono">{formattedDate}</div>
      </div>

      <div className="absolute inset-0 flex flex-col p-6">
        <div className="flex justify-between items-start mb-auto">
          <div className="scale-90 origin-left">
            <img
              src={bgPhoto.url}
              alt={name}
              className="h-10 object-contain"
            />
          </div>
          <ArrowUpRight className="w-3 h-3" />
        </div>
        <div className="mt-auto">
          <h3 className="font-mono text-sm mb-2">{name}</h3>
        </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-neutral-950 transition-opacity duration-300 ease-in-out flex flex-col p-6 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="scale-90 origin-left">
            <img
              src={bgPhoto.url}
              alt={project.name}
              className="h-10 object-contain"
            />
          </div>
          <ArrowUpRight className="w-3 h-3" />
        </div>
        <p className="text-[10px] leading-relaxed font-mono mt-auto">
          {location}
        </p>
      </div>
    </div>
  )
}