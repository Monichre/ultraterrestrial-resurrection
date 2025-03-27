const path = require("node:path");

module.exports = {
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
				templateFile: "./templates/api/route/api.route.hbs",
			},
		];
	},
};
