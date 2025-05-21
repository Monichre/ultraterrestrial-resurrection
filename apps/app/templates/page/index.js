import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	description: "Page Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Page name:",
			validate: (value) => {
				if (/.+/.test(value)) {
					return true;
				}
				return "Page name is required";
			},
		},
	],
	actions: (data) => {
		const basePath = data.workspace || "";
		return [
			{
				type: "add",
				path: path.join(basePath, "src/app/{{dashCase name}}/page.tsx"),
				templateFile: path.join(__dirname, "page.hbs"),
			},
		];
	},
};
