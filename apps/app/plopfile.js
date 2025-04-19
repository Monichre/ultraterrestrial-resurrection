import fs from "node:fs";
import path from "node:path";
import componentTemplate from "./templates/component/index.js";
import pageTemplate from "./templates/page/index.js";
import featureTemplate from "./templates/feature/index.js";
import { apiTemplate, webhookTemplate } from "./templates/api/index.js";

function addWorkspacePrompt(templateConfig) {
	// Clone the template configuration to avoid modifying the original
	const enhancedTemplate = { ...templateConfig };

	// Get available workspaces (if any)
	let workspaces = [];
	try {
		const packageJsonPath = path.join(process.cwd(), "package.json");
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
			if (packageJson.workspaces) {
				// Handle both array and object formats for workspaces
				workspaces = Array.isArray(packageJson.workspaces)
					? packageJson.workspaces
					: packageJson.workspaces.packages || [];
			}
		}
	} catch (error) {
		console.warn("Error reading workspaces:", error.message);
	}

	// Create the workspace prompt
	const workspacePrompt = {
		type: "list",
		name: "workspace",
		message: "Select the workspace:",
		choices:
			workspaces.length > 0
				? workspaces.map((ws) => ({ name: ws, value: ws }))
				: [{ name: "Root (No workspaces found)", value: "." }],
		default: 0,
	};

	// Add the workspace prompt to the beginning of the prompts array
	enhancedTemplate.prompts = [
		workspacePrompt,
		...(enhancedTemplate.prompts || []),
	];

	return enhancedTemplate;
}

export default function (plop) {
	// Register generators without any helper plugins
	plop.setGenerator("component", addWorkspacePrompt(componentTemplate));
	plop.setGenerator("page", addWorkspacePrompt(pageTemplate));
	plop.setGenerator("feature", addWorkspacePrompt(featureTemplate));
	plop.setGenerator("api", addWorkspacePrompt(apiTemplate));
	plop.setGenerator("webhook", addWorkspacePrompt(webhookTemplate));
}
