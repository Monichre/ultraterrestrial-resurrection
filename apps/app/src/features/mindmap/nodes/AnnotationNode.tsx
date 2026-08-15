import { memo } from "react";

function AN({ label, level, arrowStyle }: any) {
	return (
		<>
			<div style={{ padding: 10, display: "flex" }}>
				<div style={{ marginRight: 4 }}>{level}.</div>
				<div>{label}</div>
			</div>
			{arrowStyle && (
				<div className="arrow" style={arrowStyle}>
					{arrowStyle.variant === "curved" && "⤹"}
					{arrowStyle.variant === "straight" && "↘"}
					{arrowStyle.variant === "hook" && "↪"}
					{arrowStyle.variant === "zigzag" && "↯"}
					{!arrowStyle.variant && "⤹"}
				</div>
			)}
		</>
	);
}

export const AnnotationNode = memo(AN);
