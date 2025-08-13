import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
	// Comprehensive story patterns to capture all 91 story files
	stories: [
		"../src/**/*.stories.@(js|jsx|ts|tsx)",
		"../src/**/*.stories.mdx",
		// Include stories from sibling research-canvas app
	],

	// Enhanced addons for better development experience
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-storysource",
		"@storybook/addon-console",
		"@storybook/addon-onboarding",
		"@geometricpanda/storybook-addon-badges",
	],

	framework: {
		name: "@storybook/nextjs",
		options: {
			// Performance optimizations
			nextConfigPath: '../next.config.js',
		},
	},

	staticDirs: ["../public"],

	// Enable docs generation for better documentation
	docs: {
		autodocs: true,
	},

	// Enhanced webpack optimizations
	webpackFinal: async ( config ) => {
		// Faster source maps for development
		config.devtool = 'eval-cheap-module-source-map'

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
					storybook: {
						test: /[\\/]node_modules[\\/]@storybook[\\/]/,
						name: 'storybook',
						chunks: 'all',
					},
				},
			},
		}

		// Reduce bundle analysis but keep useful info
		config.stats = 'errors-warnings'

		return config
	},

	// Disable TypeScript checking to avoid react-docgen-typescript errors
	typescript: {
		check: false,
		reactDocgen: false,
	},
}

export default config
