const path = require("node:path");

module.exports = {
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
				templateFile: "./templates/page/page.hbs",
			},
		];
	},
};
