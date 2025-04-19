import type { EventsRecord } from "@/db/xata"
import { Float } from "@react-three/drei"
import { format } from "date-fns"
import { motion, useAnimate } from "framer-motion"

const EventTimelineItem = ( { disclosureEvent }: { disclosureEvent: EventsRecord } ) => {
  const { name, date, location, latitude, longitude, photos } = disclosureEvent
  const photo = photos?.[0] || { url: "" }

  console.log( "🚀 ~ file: SpatialTimelineV2.tsx:27 ~ photos:", photos )



  const [scope, animate] = useAnimate()

  return (
    <div className="slide" id="slide-1">
      <div className="slide-copy">
        <h2>{name}</h2>
        <p id="index">      {date && format( date, 'MMM dd, yyyy' )}</p>


        <div className="flex items-center mt-8 gap-6">
          <span className="text-white tracking-wider">
            {location}
          </span>

        </div>
      </div>

      <div className="slide-img">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
        >
          <Float>
            <div className="sm:w-40 sm:h-40 h-32 w-32 md:w-48 md:h-48 shadow-2xl relative overflow-hidden  hover:scale-105 duration-200 cursor-pointer transition-transform">
              <img

                src={photo.url}
                className="w-full h-full object-cover absolute top-0 left-0"

              />
            </div>
          </Float>
        </motion.div>

      </div>
    </div>
  )
}


export const ScrollThroughTimeline = ( { events, years, activeYear } ) => {

  return (
    <div className="container">
      <div className="active-slide">
        <img src="./assets/1.jpg" alt="" />
        <img src="./assets/2.jpg" alt="" />
        <img src="./assets/3.jpg" alt="" />
        <img src="./assets/4.jpg" alt="" />
        <img src="./assets/5.jpg" alt="" />
        <img src="./assets/6.jpg" alt="" />
        <img src="./assets/7.jpg" alt="" />
        <img src="./assets/8.jpg" alt="" />
        <img src="./assets/9.jpg" alt="" />
        <img src="./assets/10.jpg" alt="" />
      </div>

      <div className="slider">
        <div className="slide" id="slide-1">
          <div className="slide-copy">
            <p>Neo Elegance°</p>
            <p id="index">( ES 2023 0935 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/1.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-2">
          <div className="slide-copy">
            <p>Future Luxe</p>
            <p id="index">( ES 2023 0936 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/2.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-3">
          <div className="slide-copy">
            <p>Cyber Glam</p>
            <p id="index">( ES 2023 0937 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/3.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-4">
          <div className="slide-copy">
            <p>Visionary Threads</p>
            <p id="index">( ES 2023 0938 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/4.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-5">
          <div className="slide-copy">
            <p>Galactic Chic</p>
            <p id="index">( ES 2023 0939 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/5.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-6">
          <div className="slide-copy">
            <p>Tech Sophistication</p>
            <p id="index">( ES 2023 0940 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/6.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-7">
          <div className="slide-copy">
            <p>Avant Edge</p>
            <p id="index">( ES 2023 0941 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/7.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-8">
          <div className="slide-copy">
            <p>Moda Futura</p>
            <p id="index">( ES 2023 0942 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/8.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-9">
          <div className="slide-copy">
            <p>Eco Futurist</p>
            <p id="index">( ES 2023 0943 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/9.jpg" alt="" />
          </div>
        </div>
        <div className="slide" id="slide-10">
          <div className="slide-copy">
            <p>Sleek Tomorrow</p>
            <p id="index">( ES 2023 0944 )</p>
          </div>
          <div className="slide-img">
            <img src="./assets/10.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}
