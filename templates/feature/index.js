import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	description: "Feature Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Feature name",
		},
	],
	actions: (data) => {
		const subDir = "features";
		const basePath = data.workspace
			? path.join(data.workspace, `src/${subDir}`)
			: `src/${subDir}`;
		const actions = [
			{
				type: "add",
				path: path.join(basePath, "{{dashCase name}}/index.tsx"),
				templateFile: path.join(__dirname, "index.hbs"),
			},
			{
				type: "add",
				path: path.join(basePath, "{{dashCase name}}/{{properCase name}}.tsx"),
				templateFile: path.join(__dirname, "feature.hbs"),
			},
		];
		return actions;
	},
};
