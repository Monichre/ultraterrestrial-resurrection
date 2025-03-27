const fs = require("node:fs");
const path = require("node:path");

module.exports = {
	description: "Component Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Component name:",
			validate: (value) => {
				if (/.+/.test(value)) {
					return true;
				}
				return "Component name is required";
			},
		},
		{
			type: "confirm",
			name: "animated",
			message: "Is this an animated component?",
			default: false,
		},
		{
			type: "confirm",
			name: "ui",
			message: "Is this a core UI component? (e.g., button, input, etc.)",
			default: false,
			when: (answers) => !answers.animated,
		},
		{
			type: "confirm",
			name: "addToExisting",
			message: "Would you like to add this component to an existing directory?",
			default: false,
		},
		{
			type: "list",
			name: "existingDir",
			message: "Select the existing component directory:",
			choices: (answers) => {
				const workspace = answers.workspace || "";
				let componentsPath;

				if (answers.animated) {
					componentsPath = path.join(
						workspace,
						"src",
						"components",
						"animated",
					);
				} else if (answers.ui) {
					componentsPath = path.join(workspace, "src", "components", "ui");
				} else {
					componentsPath = path.join(workspace, "src", "components");
				}

				if (!fs.existsSync(componentsPath)) {
					return ["(No existing directories found)"];
				}

				try {
					const directories = fs
						.readdirSync(componentsPath)
						.filter((file) =>
							fs.statSync(path.join(componentsPath, file)).isDirectory(),
						);

					if (directories.length === 0) {
						return ["(No existing directories found)"];
					}

					return directories.map((dir) => ({
						name: dir,
						value: dir,
					}));
				} catch (err) {
					console.error("Error reading directories:", err);
					return ["(Error reading directories)"];
				}
			},
			when: (answers) => answers.addToExisting,
		},
		{
			type: "confirm",
			name: "includeCss",
			message: "Would you like to include a CSS file?",
			default: false,
		},
		{
			type: "confirm",
			name: "includeStories",
			message: "Would you like to include a Storybook stories file?",
			default: false,
		},
	],
	actions: (data) => {
		let basePath = data.workspace || "";
		const templatePath = "./templates/component";

		if (data.addToExisting && data.existingDir) {
			if (data.animated) {
				basePath = path.join(
					basePath,
					"src/components/animated",
					data.existingDir,
				);
			} else if (data.ui) {
				basePath = path.join(basePath, "src/components/ui", data.existingDir);
			} else {
				basePath = path.join(basePath, "src/components", data.existingDir);
			}
		} else {
			const subDir = data.animated ? "animated" : data.ui ? "ui" : "";
			basePath = path.join(basePath, "src/components", subDir);
		}

		const componentPath = path.join(basePath, "{{dashCase name}}");
		const actions = [
			{
				type: "add",
				path: path.join(componentPath, "index.tsx"),
				templateFile: path.join(templatePath, "index.hbs"),
			},
			{
				type: "add",
				path: path.join(componentPath, "{{properCase name}}.tsx"),
				templateFile: path.join(templatePath, "component.hbs"),
			},
		];

		if (data.includeCss) {
			actions.push({
				type: "add",
				path: path.join(componentPath, "{{properCase name}}.module.css"),
				templateFile: path.join(templatePath, "component.css.hbs"),
			});
		}

		if (data.includeStories) {
			actions.push({
				type: "add",
				path: path.join(componentPath, "{{properCase name}}.stories.tsx"),
				templateFile: path.join(templatePath, "component.stories.hbs"),
			});
		}

		return actions;
	},
};
