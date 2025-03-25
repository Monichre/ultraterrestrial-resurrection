import type { FlowEdge, FlowNode } from "@/lib/flow/workflow";

export const EXAM_CREATOR_PARALLELIZATION_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "generate-text",
			id: "validateLLM",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 251.46219588875414,
				y: -157.42640737415334,
			},
		},
		{
			type: "generate-text",
			id: "Nr22stf-aM3K9KZ7fHREZ",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 245.3399584365339,
				y: 489.49722280589094,
			},
		},
		{
			type: "visualize-text",
			id: "eYRTRKwrUcn_fmuMKuUEl",
			data: {},
			position: {
				x: 648.6394983132599,
				y: -252.7402610767247,
			},
			width: 379,
			height: 300,
		},
		{
			type: "generate-text",
			id: "ZnL2SgGAMwaZSLNH-bOX3",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 241.32228205169054,
				y: 158.08000713832058,
			},
		},
		{
			type: "generate-text",
			id: "lu-X2l3QTJj8RBk4fDwGL",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 1687.7585469555088,
				y: 418.93136565541863,
			},
		},
		{
			type: "text-gray-200 dark:text-gray-800",
			id: "_4RcYkPOEDKn-hmGOAvy9",
			data: {
				config: {
					value:
						"<assistant_info>\n  You are an expert in combining and organizing educational content. \n Your task is to combine the outputs from three different agents create a cohesive exam paper. \n\n will receive: - A set of multiple-choice questions. open-answer essay prompts. to: Compile these into single, well-structured Organize paper with following structure: 1. Multiple-choice 2. Short-answer 3. Essay Ensure content flows logically, using clear section headers. Output should: Be formatted for readability. Include proper numbering each question. \n</assistant_info>\n",
				},
			},
			position: {
				x: 1250.9578657920588,
				y: -224.79053213173495,
			},
			width: 350,
			height: 417,
		},
		{
			type: "visualize-text",
			id: "kaTYJV52ljshMg0uClQl1",
			data: {},
			position: {
				x: 649.7252565724999,
				y: 107.18165405549195,
			},
			width: 377,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "s5NSuCUuEByh_BTCSSMDU",
			data: {},
			position: {
				x: 646.3721167044031,
				y: 456.0475192259633,
			},
			width: 377,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "9cLCaECGGL5t21iQ3TDc9",
			data: {},
			position: {
				x: 1695.1459958597898,
				y: -234.91904513607875,
			},
			width: 518,
			height: 614,
		},
		{
			type: "text-gray-200 dark:text-gray-800",
			id: "VGFbBVUjlwdQ2cGhrCv72",
			data: {
				config: {
					value: "I want to create a exam on React Flow programming",
				},
			},
			position: {
				x: -722.022355638326,
				y: 62.42404642145064,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-gray-200 dark:text-gray-800",
			id: "FpL4edqHCqaXqhGrD2xEJ",
			data: {
				config: {
					value:
						"<assistant_info>\n  You are an expert in creating multiple-choice questions for educational purposes. \n Your task is to create on the given topic. Each question should:\n - Be clear and concise.\n Include a single correct answer three plausible distractors (incorrect answers).\n Test student's understanding of key concepts from topic.\n\n The output Contain question, four options, answer.\n Ensure not obviously incorrect but based common misconceptions or related ideas.\n ALWAYS Only 2 questions\n</assistant_info>\n<examples>\n Example 1: Question: What primary cause climate change? Options: A. Solar flares B. Volcanic eruptions C. Greenhouse gas emissions D. Changes Earth's orbit Correct Answer: C \n\n 2: Which following gases considered greenhouse gas? Oxygen Nitrogen Carbon dioxide Argon \n</examples>\n\n",
				},
			},
			position: {
				x: -157.73052506593396,
				y: -200.36676668546224,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-gray-200 dark:text-gray-800",
			id: "mcXEqjj4TY8HBof7E6pdl",
			data: {
				config: {
					value:
						"<assistant_info>\n  You are an expert in creating short-answer questions for educational purposes. \n Your task is to create that: - Require students demonstrate understanding of the topic 1-3 sentences. Are open-ended but specific enough test key concepts. \n\n The output should: Include question as a standalone sentence or prompt. Provide sample ideal answer reference. ALWAYS Only 2 questions\n</assistant_info>\n<example>\n Example 1: Question: Explain how greenhouse gases contribute global warming. Sample Answer: Greenhouse trap heat Earth's atmosphere, preventing it from escaping into space. This leads increase temperatures over time. 2: What significance Paris Agreement addressing climate change? treaty that aims limit warming below degrees Celsius compared pre-industrial levels by reducing gas emissions. \n</example>\n",
				},
			},
			position: {
				x: -159.63323331453773,
				y: 122.18288195856604,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-gray-200 dark:text-gray-800",
			id: "eVfOwR2k_3HG4sBFeFZcg",
			data: {
				config: {
					value:
						"<assistant_info>\n  You are an expert in creating essay prompts for educational purposes. \n Your task is to create that: - Encourage critical thinking and analysis of the topic. Allow students explore different perspectives or arguments. Require detailed explanations evidence-based reasoning. \n\n The output should: Include a clearly worded question statement. Optionally provide guidance on how approach essay. ALWAYS Only 1 prompt\n</assistant_info>\n<example>\n Example 1: Prompt: Discuss social, economic, environmental impacts climate change. How can governments individuals work together address these challenges? Guidance: In your essay, examples specific impacts, such as rising sea levels economic costs. at least one solution involving government policies individual actions. 2: Analyze role renewable energy mitigating What challenges benefits transitioning sources? Consider types energy, solar wind, evaluate their feasibility various regions. Address both technological factors. \n</example>\n\n",
				},
			},
			position: {
				x: -160.93480457629244,
				y: 461.9358073446226,
			},
			width: 350,
			height: 300,
		},
		{
			type: "prompt-crafter",
			id: "7-uZXwIU-n7fEMCoLZsMt",
			data: {
				config: {
					template:
						"<multiple-choice-content>\n  {{multiple-choice-content}}\n</multiple-choice-content>\n {{open-answer-questions-content}}\n<open-questions-content>\n</open-questions-content>\n<essay-content>\n {{essay-content}}\n</essay-content>",
				},
				dynamicHandles: {
					"template-tags": [
						{
							name: "multiple-choice-content",
							id: "GDFxwCjnyoesYWdUKZtGq",
						},
						{
							name: "open-answer-questions-content",
							id: "llV7g536-dmly98vvpFak",
						},
						{
							name: "essay-content",
							id: "Zla3PfCwXBMnW32gB_MiF",
						},
					],
				},
			},
			position: {
				x: 1251.6723866635305,
				y: 232.25256033640713,
			},
		},
	],
	edges: [
		{
			source: "_4RcYkPOEDKn-hmGOAvy9",
			sourceHandle: "result",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "system",
			type: "status",
			id: "xy-edge___4RcYkPOEDKn-hmGOAvy9result-lu-X2l3QTJj8RBk4fDwGLsystem",
			data: {},
		},
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "kaTYJV52ljshMg0uClQl1",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-kaTYJV52ljshMg0uClQl1input",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "s5NSuCUuEByh_BTCSSMDU",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-s5NSuCUuEByh_BTCSSMDUinput",
			data: {},
		},
		{
			source: "lu-X2l3QTJj8RBk4fDwGL",
			sourceHandle: "result",
			target: "9cLCaECGGL5t21iQ3TDc9",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__lu-X2l3QTJj8RBk4fDwGLresult-9cLCaECGGL5t21iQ3TDc9input",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-validateLLMprompt",
			data: {},
			selected: false,
		},
		{
			source: "mcXEqjj4TY8HBof7E6pdl",
			sourceHandle: "result",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__mcXEqjj4TY8HBof7E6pdlresult-ZnL2SgGAMwaZSLNH-bOX3system",
			data: {},
		},
		{
			source: "FpL4edqHCqaXqhGrD2xEJ",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__FpL4edqHCqaXqhGrD2xEJresult-validateLLMsystem",
			data: {},
		},
		{
			source: "eVfOwR2k_3HG4sBFeFZcg",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__eVfOwR2k_3HG4sBFeFZcgresult-Nr22stf-aM3K9KZ7fHREZsystem",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "result",
			target: "eYRTRKwrUcn_fmuMKuUEl",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__validateLLMresult-eYRTRKwrUcn_fmuMKuUElinput",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-ZnL2SgGAMwaZSLNH-bOX3prompt",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-Nr22stf-aM3K9KZ7fHREZprompt",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "GDFxwCjnyoesYWdUKZtGq",
			type: "status",
			id: "xy-edge__validateLLMresult-7-uZXwIU-n7fEMCoLZsMtGDFxwCjnyoesYWdUKZtGq",
			data: {},
		},
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "llV7g536-dmly98vvpFak",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-7-uZXwIU-n7fEMCoLZsMtllV7g536-dmly98vvpFak",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "Zla3PfCwXBMnW32gB_MiF",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-7-uZXwIU-n7fEMCoLZsMtZla3PfCwXBMnW32gB_MiF",
			data: {},
		},
		{
			source: "7-uZXwIU-n7fEMCoLZsMt",
			sourceHandle: "result",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__7-uZXwIU-n7fEMCoLZsMtresult-lu-X2l3QTJj8RBk4fDwGLprompt",
			data: {},
		},
	],
};
