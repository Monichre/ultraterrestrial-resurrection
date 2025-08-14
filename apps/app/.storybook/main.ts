import type { StorybookConfig } from "@storybook/nextjs"
import path from 'path'
import { fileURLToPath } from 'url'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
	// Comprehensive story patterns to capture all 91 story files
	stories: [
		"../src/**/*.stories.@(js|jsx|ts|tsx)",
		"../src/**/*.stories.mdx",
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
			// Point to the actual Next config (ts)
			nextConfigPath: '../next.config.ts',
		},
	},

	staticDirs: ["../public"],

	// Enable docs generation for better documentation
	docs: {
		autodocs: true,
	},

	// Enhanced webpack optimizations + path resolution
	webpackFinal: async ( config ) => {
		// Faster source maps for development
		config.devtool = 'eval-cheap-module-source-map'

		// Ensure resolve exists
		config.resolve = config.resolve || {}
		config.resolve.extensions = config.resolve.extensions || ['.ts', '.tsx', '.js', '.jsx', '.json']

		// Add TS paths support and @ alias to src
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, '../tsconfig.json'),
			}),
		]
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'@': path.resolve(__dirname, '../src'),
'@tiptap-pro/extension-drag-handle-react': path.resolve(__dirname, './stubs/tiptap-pro/extension-drag-handle-react.ts'),
			'react-hot-toast': path.resolve(__dirname, './stubs/react-hot-toast.ts'),
			'@tippyjs/react/headless': path.resolve(__dirname, './stubs/tippy-headless.tsx'),
			'@tiptap/extension-table': path.resolve(__dirname, './stubs/tiptap/extension-table.ts'),
			'@tiptap/extension-table-row': path.resolve(__dirname, './stubs/tiptap/extension-table-row.ts'),
			'@tiptap/extension-table-header': path.resolve(__dirname, './stubs/tiptap/extension-table-header.ts'),
			'@tiptap/extension-code-block-lowlight': path.resolve(__dirname, './stubs/tiptap/extension-code-block-lowlight.ts'),
			'lowlight': path.resolve(__dirname, './stubs/lowlight.ts'),
			'@tiptap/extension-character-count': path.resolve(__dirname, './stubs/tiptap/extension-character-count.ts'),
			'@tiptap/extension-font-family': path.resolve(__dirname, './stubs/tiptap/extension-font-family.ts'),
			'@tiptap/extension-color': path.resolve(__dirname, './stubs/tiptap/extension-color.ts'),
			'@tiptap/extension-focus': path.resolve(__dirname, './stubs/tiptap/extension-focus.ts'),
			'@tiptap/extension-collaboration-cursor': path.resolve(__dirname, './stubs/tiptap/extension-collaboration-cursor.ts'),
			'@tiptap-pro/extension-emoji': path.resolve(__dirname, './stubs/tiptap-pro/extension-emoji.ts'),
			'@tiptap-pro/extension-table-of-contents': path.resolve(__dirname, './stubs/tiptap-pro/extension-toc.ts'),
'@tiptap-pro/extension-file-handler': path.resolve(__dirname, './stubs/tiptap-pro/extension-file-handler.ts'),
			'@tiptap-pro/extension-ai': path.resolve(__dirname, './stubs/tiptap-pro/extension-ai.ts'),
			'react-colorful': path.resolve(__dirname, './stubs/react-colorful.tsx'),
		}

		// Remove CaseSensitivePathsPlugin to avoid casing build breaks on macOS
		config.plugins = (config.plugins || []).filter(
			// @ts-expect-error plugin typing is loose here
			(plugin) => plugin?.constructor?.name !== 'CaseSensitivePathsPlugin'
		)

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
