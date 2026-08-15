"use client";

import { EntityCardUtilityMenu } from "@/features/mindmap/components/cards/entity-card";
import { DOMAIN_MODEL_COLORS, STOCK_PHOTOS, truncate } from "@/utils";

import { motion } from "framer-motion";

import { useState } from "react";

import { useEntity } from "@/hooks";
import { format } from "date-fns";

export function GraphCard({ card }: any) {
	const {
		handleHoverLeave,
		entity,
		showMenu,
		setShowMMenu,
		bookmarked,
		setBookmarked,
		relatedDataPoints,
		saveNote,
		updateNote,
		userNote,
		connectionListConnections,
		handleHoverEnter,
		findConnections,
	} = useEntity({ card });
	const { type, color, photos, name, date: unformattedDate, role } = entity;
	const date = unformattedDate ? format(unformattedDate, "MMMM d, yyyy") : "";
	const stock = {
		url: STOCK_PHOTOS.saucer,
		src: STOCK_PHOTOS.saucer,
	};
	const bgPhoto =
		photos?.length && photos[0]?.mediaType?.startsWith("image/")
			? photos[0]
			: stock;

	// const [animatedTitle, setAnimatedTitle] = useState<string>('')
	// const [animatedDate, setAnimatedDate] = useState<string>('')
	// const [titleFinished, setTitleFinished] = useState(false)
	// const [t, setT] = useState<number>(0)
	// const [i, setI] = useState<number>(0)

	// useEffect(() => {
	//   const typingEffect = setInterval(() => {
	//     if (t < name.length) {
	//       setAnimatedTitle(name.substring(0, t + 1))
	//       setT(t + 1)
	//     } else {
	//       clearInterval(typingEffect)

	//       setTitleFinished(true)
	//     }
	//   }, 100)

	//   return () => {
	//     clearInterval(typingEffect)
	//   }
	// }, [name, t])

	// useEffect(() => {
	//   const typingEffectTwo = setInterval(() => {
	//     if (titleFinished) {
	//       if (i < date.length) {
	//         setAnimatedDate(date.substring(0, i + 1))
	//         setI(i + 1)
	//       } else {
	//         clearInterval(typingEffectTwo)
	//       }
	//     }
	//   }, 100)

	//   return () => {
	//     clearInterval(typingEffectTwo)
	//   }
	// }, [date, date.length, i, name, t, titleFinished])

	const modelColor = DOMAIN_MODEL_COLORS[type];

	const [activeIndex, setActiveIndex] = useState(0);
	const updateActiveIndex = (index: number) => {
		setActiveIndex(index);
	};

	return (
		<>
			{/* <div
        className={`absolute -inset-2 rounded-lg bg-gradient-to-r from-[#78efff] via-[#E393E6] to-[${color}] opacity-50 blur w-full h-full`}
      ></div> */}
			<div
				className="absolute -inset-2 rounded-lg opacity-50 blur w-full h-full"
				style={{
					backgroundImage: `linear-gradient(to right, #78efff, #E393E6, ${color})`,
				}}
			></div>
			<div
				className={`relative z-50 rounded-[calc(var(--radius)-2px)] p-[1px] bg-black w`}
				style={{ border: `1px solid ${color}` }}
			>
				<EntityCardUtilityMenu
					updateNote={updateNote}
					saveNote={saveNote}
					userNote={userNote}
					bookmarked={bookmarked}
					findConnections={findConnections}
				/>

				<motion.div
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 24,
					}}
				>
					<motion.div
						style={{
							borderRadius: "4px",
						}}
						className="relative z-50 dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] px-3 py-4"
					>
						<div
							className={`relative w-full h-full pl-3 flex justify-start-center items-center`}
							style={{ borderLeft: `1px solid ${modelColor}` }}
						>
							<motion.img
								src={bgPhoto.url || bgPhoto.src}
								alt="What I Talk About When I Talk About Running - book cover"
								className="h-[75px] w-[75px] object-cover object-center p-1 mr-4"
								style={{
									borderRadius: "4px",
								}}
							/>
							<div className={`w-auto relative`}>
								{/* {type === 'personnel' && (
                  <DialogImage
                    src={image.url || image.src}
                    alt='What I Talk About When I Talk About Running - book cover'
                    className='h-[75px] w-[75px] object-cover object-center p-1 mr-4'
                    style={{
                      borderRadius: '4px',
                    }}
                  />
                )} */}

								<motion.div>
									<h2
										className="text-white font-bebasNeuePro text-xl whitespace-normal w-fit capitalize "
										style={{ textWrap: "pretty" }}
									>
										{name}
									</h2>
								</motion.div>

								<motion.div className="">
									<p className="font-source text-white tracking-wider ">
										{card?.location || truncate(role, 50)}
									</p>
									<p className="date text-1xl text-[#78efff] text-uppercase font-bebasNeuePro tracking-wider w-auto ml-auto mt-1">
										{type === "personnel" && card?.credibility
											? `Credibility Score: ${card?.credibility}`
											: type === "personnel" && card.rank
												? `Platform Ranking: ${card?.rank}`
												: date}
									</p>
								</motion.div>
							</div>
						</div>
						{/* </motion.div>

          <DialogContainer>
            <DialogContent
              style={{
                borderRadius: '12px',
              }}
              className='relative h-[95vh] w-[80vw] bg-black overflow-scroll shadow-2xl shadow-blue-500/20 transition-all duration-1000'
            >
              <ScrollArea className='h-full overflow-scroll' type='scroll'>
                <div className='relative p-6'>
                  <div>
                    <div className='flex justify-center py-10'>
                      <img
                        src={image.url || image.src}
                        alt='What I Talk About When I Talk About Running - book cover'
                        className='h-auto w-auto'
                      />
                    </div>
                    <div className='relative h-auto'>
                      <div className='flex w-full justify-between'>
                        <h2 className='text-white font-bebasNeuePro tracking-wider uppercase'>
                          {name}
                        </h2>

                      >
                      
                      </div>

                      <p className='font-light text-[#78efff] font-bebasNeuePro tracking-wider mt-2 text-sm'>
                        {date}
                      </p>
                      <p className='font-light text-[#78efff] font-bebasNeuePro tracking-wider mt-2 text-sm'>
                        {location}
                      </p>
                      <p className='font-light text-[#78efff] font-bebasNeuePro tracking-wider mt-2 text-sm'>
                        {latitude}, {longitude}
                      </p>
                    </div>

                    <div className='overflow-hidden border-t border-zinc-200 dark:border-zinc-700'>
                      <div className='mb-4 flex space-x-2'>
                        <ShinyButton onClick={() => updateActiveIndex(0)}>
                          Details
                        </ShinyButton>
                        <ShinyButton
                          onClick={() => {
                            findEntityConnectionsWithAI()
                            updateActiveIndex(1)
                          }}
                        >
                          Connections
                        </ShinyButton>
                      </div>
                      <TransitionPanel
                        activeIndex={activeIndex}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        variants={{
                          enter: { opacity: 0, y: -50, filter: 'blur(4px)' },
                          center: { opacity: 1, y: 0, filter: 'blur(0px)' },
                          exit: { opacity: 0, y: 50, filter: 'blur(4px)' },
                        }}
                      >
                        {items.map((item, index) => (
                          <div key={index} className='py-2'>
                            <h3 className='mb-2 font-medium text-zinc-800 dark:text-zinc-100'>
                              {item.title}
                            </h3>
                            {item.render()}
                          </div>
                        ))}
                      </TransitionPanel>
                    </div>
                  </div>

          
                </div>
              </ScrollArea>
              <DialogClose className='text-zinc-500' />
            </DialogContent>
          </DialogContainer> */}
					</motion.div>
				</motion.div>
			</div>
		</>
	);
}
