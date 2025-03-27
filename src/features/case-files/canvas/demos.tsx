import { CanvasAnnotations } from "./canvas-annotations";

export function CanvasAnnotationsDemo() {
	const annotations = [
		{
			id: "1",
			x: 25,
			y: 30,
			content: "Color palette",
		},
		{
			id: "2",
			x: 75,
			y: 60,
			content: "Canvas tools",
		},
		{
			id: "3",
			x: 50,
			y: 80,
			content: "Layer controls",
		},
	];

	return (
		<div className="relative h-[400px] w-full rounded-lg border bg-muted/30">
			<CanvasAnnotations
				annotations={annotations}
				onAnnotationClick={(id: string) => {
					console.log(`Clicked annotation ${id}`);
				}}
			/>
		</div>
	);
}
