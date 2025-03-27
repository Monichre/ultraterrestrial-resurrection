const path = require("node:path");

module.exports = {
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
				templateFile: "./templates/api/webhook/api.webhook.hbs",
			},
		];
	},
};
