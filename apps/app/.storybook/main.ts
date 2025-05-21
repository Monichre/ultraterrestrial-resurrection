import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	// ...
	stories: [
		"../src/components/**/*.stories.tsx",
		"../src/features/**/*.stories.tsx",
		"../src/features/**/**/*.stories.tsx",
		"../src/layouts/**/*.stories.tsx",
		"../src/**/**/*.stories.tsx",
	],

	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@chromatic-com/storybook",
		"@geometricpanda/storybook-addon-badges",
		"@storybook/addon-console",
		"@storybook/addon-storysource",
		"@storybook/testing-library",
		"@storybook/jest",
	],

	// 👈 Add this
	framework: "@storybook/nextjs",

	staticDirs: ["../public"],

	docs: {},
};

export default config;
