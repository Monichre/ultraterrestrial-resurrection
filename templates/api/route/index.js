import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	description: "NextJS API Route Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "API route/resource name:",
			validate: (value) => {
				if (/.+/.test(value)) {
					return true;
				}
				return "API route name is required";
			},
		},
	],
	actions: (data) => {
		const basePath = data.workspace || "";
		return [
			{
				type: "add",
				path: path.join(basePath, "src/app/api/{{dashCase name}}/route.ts"),
				templateFile: path.join(__dirname, "api.route.hbs"),
			},
		];
	},
};
