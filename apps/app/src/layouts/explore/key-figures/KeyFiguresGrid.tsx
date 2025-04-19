import type { KeyFiguresArray } from "@/app/(site)/explore/key-figures/page";
import { Particles, TextEffect } from "@/components/animated";
import SwipeGrid from "@/components/animated/swipe-grid/SwipeGrid";
import { cn } from "@/utils";

const formatKeyFigures = (keyFigures: KeyFiguresArray) => {
	// @ts-ignore
	return keyFigures.map((figure) => {
		return {
			name: figure.name,
			src:
				// @ts-ignore
				figure.photo && figure.photo.length
					? // @ts-ignore
						figure.photo[0]?.signedUrl || figure?.photo[0]?.url
					: figure.photo
						? figure.photo
						: "/atro-4.png" || "/atro-4.png",
			// content: <>{/* Add the JSX content for each swipe grid item */}</>.toString(),
		};
	});
};

export const KeyFiguresGrid = ({
	keyFigures,
}: {
	keyFigures: KeyFiguresArray;
}) => {
	const items: any = formatKeyFigures(keyFigures);
	return (
		<div className="key-figures relative">
			<div
				className={cn(
					`fixed`,
					"top-[100px]",
					"left-[50px]",

					"w-min",
					"h-min",
					"z-50",
				)}
			>
				<TextEffect
					per="char"
					preset="fade"
					className="text-white text-6xl header-style"
					as="h1"
				>
					Key Figures
				</TextEffect>
			</div>
			<SwipeGrid items={items}>
				{/* <BoxReveal boxColor={'#5046e6'} duration={0.5}>
        <p className='text-[3.5rem] font-semibold'>
          Key Figures<span className='text-[#5046e6]'>.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={'#5046e6'} duration={0.5}>
        <h2 className='mt-[.5rem] text-[1rem]'>
          These are the need-to-know or who's-who of Ufology
          <span className='text-[#5046e6]'>Subject Matter Experts</span>
          <span className='text-[#5046e6]'>Critical Personnel</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={'#5046e6'} duration={0.5}>
        <div className='mt-[1.5rem]'>
          <p>
            Help us verify the credibility of these individuals' <br />
            <span className='font-semibold text-[#5046e6]'> Claims</span>,
            <span className='font-semibold text-[#5046e6]'> Expertise</span>
            ,
            <span className='font-semibold text-[#5046e6]'>
              {' '}
              Testimony CSS
            </span>
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={'#5046e6'} duration={0.5}>
        <p>
          <span className='font-semibold text-[#5046e6]'>
            {' '}
            Not seeing someone
          </span>
          submit a request to add a key figure <br />
          . <br />
          <Button className='mt-[1.6rem] bg-[#5046e6]'>Add Now</Button>
        </p>
      </BoxReveal> */}
			</SwipeGrid>
			<Particles />
		</div>
	);
};
