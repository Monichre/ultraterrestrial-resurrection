#!/usr/bin/env node

const fg = require("fast-glob");
const fs = require("node:fs");
const path = require("node:path");

// Get all .tsx component files under src/features/case-files that are not story files
const files = fg.sync([
	"src/features/case-files/**/*.tsx",
	"!src/features/case-files/**/*.stories.tsx",
]);

for (const file of files) {
	const ext = path.extname(file);
	const baseName = path.basename(file, ext);
	const dir = path.dirname(file);
	const storyFile = path.join(dir, `${baseName}.stories.tsx`);

	// Skip if story file already exists
	if (fs.existsSync(storyFile)) {
		console.log(`Story already exists for ${file}`);
		continue;
	}

	// Convert kebab-case filename to PascalCase component name
	const componentName = baseName
		.split("-")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
	const title = `@case-files/${baseName}`;

	// Create the story file content
	const content = `import type { Meta, StoryObj } from '@storybook/react'
import { ${componentName} } from './${baseName}'

const meta: Meta<typeof ${componentName}> = {
  title: '${title}',
  component: ${componentName},
}

export default meta

type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
  render: () => <${componentName} />,
}
`;

	fs.writeFileSync(storyFile, content);
	console.log(`Created story: ${storyFile}`);
}
