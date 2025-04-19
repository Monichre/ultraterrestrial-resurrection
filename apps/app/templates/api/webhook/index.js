import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	description: "NextJS Webhook Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Webhook resource name:",
			validate: (value) => {
				if (/.+/.test(value)) {
					return true;
				}
				return "Webhook name is required";
			},
		},
	],
	actions: (data) => {
		const basePath = data.workspace || "";
		return [
			{
				type: "add",
				path: path.join(
					basePath,
					"src/app/api/webhooks/{{dashCase name}}/route.ts",
				),
				templateFile: path.join(__dirname, "api.webhook.hbs"),
			},
		];
	},
};
