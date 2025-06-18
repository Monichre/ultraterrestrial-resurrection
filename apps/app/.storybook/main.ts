import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	// More specific story patterns to reduce scanning
	stories: [
		"../src/components/research/**/*.stories.tsx",
		"../src/features/mindmap/**/*.stories.tsx",
		"../src/features/ai/pipelines/**/*.stories.tsx",
	],

	// Minimal addons for faster startup
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-storysource",
	],

	framework: {
		name: "@storybook/nextjs",
		options: {
			// Performance optimizations
			nextConfigPath: '../next.config.js',
		},
	},

	staticDirs: ["../public"],

	// Disable docs generation for faster builds
	docs: {
		autodocs: false,
	},

	// Webpack optimizations
	webpackFinal: async (config) => {
		// Faster source maps for development
		config.devtool = 'eval-cheap-module-source-map';
		
		// Optimize chunks
		config.optimization = {
			...config.optimization,
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
		};

		// Reduce bundle analysis
		config.stats = 'errors-warnings';
		
		return config;
	},

	// TypeScript optimizations
	typescript: {
		check: false,
		reactDocgen: false,
	},
};

export default config;
