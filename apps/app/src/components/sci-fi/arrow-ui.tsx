export const ArrowUI = () => {
	return (
		<div className="absolute top-0 h-full w-2 left-1 md:-left-6">
			<div className="absolute top-1/2 -left-1 origin-bottom-left -rotate-90 -translate-y-1/2 text-[8px] text-gray-65 __classNameName_5df1f2">
				PST
			</div>
			<svg
				className="absolute -top-[1px] -left-[3.5px]"
				width="8"
				height="100%"
				viewBox="0 0 8 100%"
				style="position:relative;overflow:visible"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 4L4 1L7 4"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
				<line
					x1="4"
					y1="1"
					x2="4"
					y2="100%"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></line>
			</svg>
			<svg
				className="absolute -bottom-[1px] -left-[3.5px]"
				width="8"
				height="5"
				viewBox="0 0 8 5"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 1L4 4L7 1"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg>
		</div>
	);
};

export const ElegantHeaderDesign = () => {
	return (
		<div className="absolute top-[-270px] h-[800px] w-full overflow-hidden md:overflow-visible">
			<div className="absolute z-10 top-1/2 left-10 md:left-14 transform -translate-y-1/2 w-[160px] h-[160px] md:w-[200px] md:h-[200px] flex items-center justify-center">
				<div className="absolute -top-2 left-0 w-full h-1/2">
					<div className="absolute top-0 left-0 h-full w-full p-2">
						<div className="absolute top-0 left-0 h-full w-full opacity-15 animate-wipe">
							<svg
								width="100%"
								height="100%"
								xmlns="http://www.w3.org/2000/svg"
							>
								<defs>
									<pattern
										id="pattern-0"
										patternUnits="userSpaceOnUse"
										width="4"
										height="4"
									>
										<g clip-path="url(#clip0)">
											<path
												d="M1 -1L5 3"
												stroke="var(--gray-0)"
												stroke-width="0.5"
											></path>
											<path
												d="M-1 1L3 5"
												stroke="var(--gray-0)"
												stroke-width="0.5"
											></path>
										</g>
									</pattern>
									<clipPath id="clip0">
										<rect width="4" height="4" fill="white"></rect>
									</clipPath>
								</defs>
								<rect
									x="0"
									y="0"
									width="100%"
									height="100%"
									fill="url(#pattern-0)"
								></rect>
							</svg>
						</div>
						<div className="animate-opacity-in">H1</div>
					</div>
					<div className="absolute top-0 left-full h-full w-full p-2">
						<div className="absolute top-0 left-0 h-full w-full scale-x-[-1] opacity-30 animate-wipe-up">
							<svg
								width="100%"
								height="100%"
								xmlns="http://www.w3.org/2000/svg"
							>
								<defs>
									<pattern
										id="pattern-0"
										patternUnits="userSpaceOnUse"
										width="4"
										height="4"
									>
										<g clip-path="url(#clip0)">
											<path
												d="M1 -1L5 3"
												stroke="var(--gray-0)"
												stroke-width="0.5"
											></path>
											<path
												d="M-1 1L3 5"
												stroke="var(--gray-0)"
												stroke-width="0.5"
											></path>
										</g>
									</pattern>
									<clipPath id="clip0">
										<rect width="4" height="4" fill="white"></rect>
									</clipPath>
								</defs>
								<rect
									x="0"
									y="0"
									width="100%"
									height="100%"
									fill="url(#pattern-0)"
								></rect>
							</svg>
						</div>
						<div className="animate-opacity-in">H2</div>
					</div>
				</div>
				<div className="absolute top-0 left-0 h-full w-full bg-gray-98 rounded-full animate-scale-slow"></div>
				<div className="relative z-10 -left-6 animate-opacity-in">
					<div className="flex">
						<div>D</div>
						<div>S</div>
						<div>2</div>
						<div className="relative text-transparent overflow-hidden">
							8
							<div
								className="absolute top-0 text-gray-50 animate-count"
								style="animation-delay:0ms"
							>
								<div>1</div>
								<div>_</div>
								<div>2</div>
								<div>*</div>
								<div>3</div>
								<div>^</div>
								<div>1</div>
							</div>
						</div>
					</div>
					<div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-95 p-1 flex gap-[2px]">
						<div className="w-[2px] h-[2px] bg-gray-50 rounded-full animate-blink opacity-10"></div>
						<div
							className="w-[2px] h-[2px] bg-gray-50 rounded-full animate-blink opacity-10"
							style="animation-delay:1s"
						></div>
						<div
							className="w-[2px] h-[2px] bg-gray-50 rounded-full animate-blink opacity-10"
							style="animation-delay:2s"
						></div>
						<div
							className="w-[2px] h-[2px] bg-gray-50 rounded-full animate-blink opacity-10"
							style="animation-delay:3s"
						></div>
						<div
							className="w-[2px] h-[2px] bg-gray-50 rounded-full animate-blink opacity-10"
							style="animation-delay:4s"
						></div>
					</div>
				</div>
			</div>
			<div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-[68px] md:-translate-x-[88px] -translate-y-1/2 h-[110px] w-[110px] flex items-center justify-center">
				<div className="absolute top-0 left-0 h-full w-full bg-gray-100 rounded-full animate-scale-slow"></div>
				<div className="relative z-10 -left-7 flex animate-opacity-in">
					FE2
					<div className="relative text-transparent overflow-hidden">
						8
						<div
							className="absolute top-0 text-gray-50 animate-count"
							style="animation-delay:700ms"
						>
							<div>2</div>
							<div>_</div>
							<div>3</div>
							<div>*</div>
							<div>4</div>
							<div>^</div>
							<div>2</div>
						</div>
					</div>
				</div>
				<div className="relative z-10 -left-1 flex animate-opacity-in">
					BE
					<div className="relative text-transparent overflow-hidden">
						8
						<div
							className="absolute top-0 text-gray-50 animate-count"
							style="animation-delay:1450ms"
						>
							<div>7</div>
							<div>_</div>
							<div>8</div>
							<div>*</div>
							<div>9</div>
							<div>^</div>
							<div>7</div>
						</div>
					</div>
				</div>
				<div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-1 h-4 w-[1px] animate-opacity-in">
					<div className="absolute top-0 left-0 h-full w-full bg-gray-75"></div>
					<div className="absolute -bottom-3 animate-opacity-in">DKO3</div>
				</div>
				<div className="absolute top-2 animate-opacity-in">
					<div
						className="absolute top-3 left-1/2 -translate-x-1/2"
						style="mask-image:url(#hexmask)"
					>
						<svg
							className="none"
							width="14"
							height="16"
							viewBox="0 0 14 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<mask id="hexmask">
								<path
									d="M7 1L13 4.88889L13 11.1111L7 15L1 11.1111L1 4.88889L7 1Z"
									stroke="#FFF"
									stroke-width="0.5"
								></path>
							</mask>
						</svg>
						<div
							className="absolute top-0 left-0 w-full h-full bg-conic animate-sprite-rotate"
							style="--border-angle:0turn"
						></div>
					</div>
					<div
						className="absolute top-[15px] left-1/2 -translate-x-1/2"
						style="mask-image:url(#hexmask2)"
					>
						<svg
							width="10"
							height="10"
							viewBox="0 0 10 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<mask id="hexmask2">
								<path
									d="M5 0.5L9 3L9 7L5 9.5L1 7L1 3L5 0.5Z"
									stroke="#FFF"
									stroke-width="0.5"
								></path>
							</mask>
						</svg>
						<div
							className="absolute top-0 left-0 w-full h-full bg-conic animate-sprite-rotate"
							style="--border-angle:0turn;animation-delay:300ms"
						></div>
					</div>
					<div
						className="absolute top-[17px] left-1/2 -translate-x-1/2"
						style="mask-image:url(#hexmask3)"
					>
						<svg
							width="6"
							height="6"
							viewBox="0 0 6 6"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<mask id="hexmask3">
								<path
									d="M3 1L5 2.11111L5 3.88889L3 5L1 3.88889L1 2.11111L3 1Z"
									stroke="#FFF"
									stroke-width="0.5"
								></path>
							</mask>
						</svg>
						<div
							className="absolute top-0 left-0 w-full h-full bg-conic animate-sprite-rotate"
							style="--border-angle:0turn;animation-delay:600ms"
						></div>
					</div>
				</div>
			</div>
			<div className="absolute top-1/2 left-1/3 md:left-1/2 transform -translate-y-1/2 h-[330px] w-[330px] flex items-center justify-center">
				<div className="absolute top-0 left-0 h-full w-full bg-gray-95 rounded-full animate-wipe -rotate-45"></div>
				<div className="absolute -top-[15px] -left-[15px] h-[360px] w-[360px] rotate-225 animate-scale-angle">
					<div
						className="absolute top-0 left-0 w-full h-full rounded-full bg-dashed dark:hidden animate-spin-slow"
						style="animation-delay:1500ms"
					></div>
					<div
						className="absolute top-0 left-0 w-full h-full rounded-full bg-dashed-dark hidden dark:block animate-spin-slow"
						style="animation-delay:1500ms"
					></div>
				</div>
				<div className="absolute top-14 right-16 animate-opacity-in">2025</div>
				<div className="absolute right-16 text-[7px] animate-opacity-in">
					<div>CL20</div>
					<div className="absolute -top-5">IX60</div>
					<div className="absolute top-5">TB12</div>
					<div className="absolute h-3 -top-12 flex gap-[1px] animate-opacity-in">
						<div className="relative h-full w-[1px] bg-gray-100">
							<div className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-1"></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-2"
								style="animation-delay:200ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-1"
								style="animation-delay:1000ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-2"
								style="animation-delay:300ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-2"
								style="animation-delay:700ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-1"
								style="animation-delay:500ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-1"
								style="animation-delay:600ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-2"
								style="animation-delay:200ms"
							></div>
						</div>
						<div className="relative h-full w-[1px] bg-gray-100">
							<div
								className="absolute bottom-0 w-full h-2.5 bg-gray-65 origin-bottom animate-scale-1"
								style="animation-delay:800ms"
							></div>
						</div>
					</div>
				</div>
				<div className="relative left-5 flex animate-opacity-in">
					DB1
					<div className="relative text-transparent overflow-hidden">
						8
						<div
							className="absolute top-0 text-gray-50 animate-count"
							style="animation-delay:3500ms"
						>
							<div>5</div>
							<div>_</div>
							<div>6</div>
							<div>*</div>
							<div>7</div>
							<div>^</div>
							<div>5</div>
						</div>
					</div>
				</div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4">
					<div className="absolute top-0 left-0 w-full h-full bg-gray-75 rounded-full animate-scale-down">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2">
							<div className="absolute top-0 left-0 w-full h-full rounded-full bg-conic-contrast animate-spin-reverse"></div>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-gray-75 rounded-full"></div>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-65 rounded-full"></div>
						</div>
					</div>
					<div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-1 h-4 w-[1px] animate-opacity-in">
						<div className="absolute top-0 left-0 h-full w-full bg-gray-75"></div>
						<div className="absolute -bottom-3">KN0</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const SideArrayTwo = () => {
	return (
		<div class="absolute top-0 h-full w-2 left-5 md:-left-8">
			<div class="absolute top-1/2 -left-1 origin-bottom-left -rotate-90 -translate-y-1/2 text-[8px] text-gray-65 __className_5df1f2">
				QUT
			</div>
			<svg
				class="absolute -top-[1px] -left-[3.5px]"
				width="8"
				height="100%"
				viewBox="0 0 8 100%"
				style="position:relative;overflow:visible"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 4L4 1L7 4"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
				<line
					x1="4"
					y1="1"
					x2="4"
					y2="100%"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></line>
			</svg>
			<svg
				class="absolute -bottom-[1px] -left-[3.5px]"
				width="8"
				height="5"
				viewBox="0 0 8 5"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 1L4 4L7 1"
					stroke="var(--gray-75)"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg>
		</div>
	);
};
