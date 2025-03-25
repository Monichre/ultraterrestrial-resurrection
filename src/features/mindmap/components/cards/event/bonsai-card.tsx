'use client'
import { EventsIcon } from "@/components/icons/entity-icons"
import { useEntity } from "@/hooks"
import { STOCK_PHOTOS } from "@/utils"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { useState } from "react"
interface BonsaiCardProps {
  card: any
}

export function BonsaiCard( { card }: BonsaiCardProps ) {
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
    <motion.div
      className="bg-neutral-900/50 rounded-xl p-6 cursor-pointer"
      whileHover={{ scale: 1.02, backgroundColor: "rgba(38, 38, 38, 0.5)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >

      <div className="flex justify-between items-start mb-auto">
        <div className="">
          <img
            src={bgPhoto.url}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
        <EventsIcon className="w-3 h-3" />
      </div>

      <h3 className="font-bebasNeuePro mb-2">{name}</h3>
      <div className="flex flex-col gap-4">

        <div>
          <p className=" text-white mb-2">{location}, <span className="text-[#78efff]">
            {formattedDate}
          </span>
          </p>

        </div>
      </div>
    </motion.div>
  )
} 