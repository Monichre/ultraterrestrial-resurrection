"use client";

import useCanvasCursor from "@/hooks/useCanvasCursor";

export const CanvasCursor = () => {
	const valuesAlt = ` 2.000  0.000  0.000  0.000  0.000 
  0.000  2.000  0.000  0.000  0.000 
  0.000  0.000  2.000  0.000  0.000 
  0.000  0.000  0.000  1.000  0.000`;

	const values = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15";
	useCanvasCursor();

	return (
		<>
			<svg
				id="goo-svg"
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="100"
				className="fixed z-50 w-min bottom-0"
				aria-labelledby="cursor-svg-title"
			>
				<title id="cursor-svg-title">Custom cursor effects</title>
				<defs>
					<filter id="goo">
						<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values={values}
							result="goo"
						/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop" />
					</filter>
				</defs>
			</svg>

			<canvas
				className="pointer-events-none fixed inset-0 z-50"
				id="canvas"
				// style={{
				//   mixBlendMode: 'difference',
				//   transformOrigin: 'center center',
				//   backgroundColor: '#fff',
				// filter: 'url("#goo")',
				// }}
			/>
		</>
	);
};
