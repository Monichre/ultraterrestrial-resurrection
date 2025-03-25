import { askAIAction } from "@/features/mindmap/actions";
import { useEffect, useState } from "react";

interface AskAIProps {
	question: any;
	prompt?: any;
	table: any;
	children?: React.ReactNode;
	updateAnalysis: (analysis: any) => void;
}

export const AskAI: React.FC<AskAIProps> = ({
	question,
	prompt,
	table,
	children,
	updateAnalysis,
}) => {
	const [status, setStatus] = useState<any>("loading..");

	useEffect(() => {
		askAIAction({ question, prompt, table }).then((res) => {
			if (res?.dbResponse) {
				const { answer: text, records } = res;
				setStatus("Complete");
				updateAnalysis({ text, records });
			}
		});
	}, [question, prompt, table, updateAnalysis]);

	return (
		<div className="w-full flex justify-start items-center">
			{children}: {status}
		</div>
	);
};
