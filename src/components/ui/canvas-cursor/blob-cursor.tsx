"use client";
import type * as React from "react";

import AnimatedCursor from "react-animated-cursor";

type BlobCursorProps = React.HTMLAttributes<HTMLDivElement>;

export const BlobCursor: React.FC<BlobCursorProps> = () => {
	const values = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15";
	return (
		<>
			<svg
				id="goo-svg"
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="800"
				aria-labelledby="blob-cursor-title"
			>
				<title id="blob-cursor-title">Blob cursor effects</title>
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
			<AnimatedCursor
				innerSize={8}
				outerSize={35}
				innerScale={1}
				outerScale={1.7}
				// color={'#fff'}
				// innerStyle={{
				//   backgroundColor: 'red',
				// }}
				outerAlpha={0.8}
				outerStyle={{
					mixBlendMode: "difference",
					transformOrigin: "center center",
					backgroundColor: "#fff",
					filter: 'url("#goo")',
				}}
			/>
		</>
	);
};
