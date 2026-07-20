import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import webpack from 'webpack'

const appRoot = process.cwd()
const storybookDir = path.join( appRoot, '.storybook' )
const repoRoot = path.resolve( appRoot, '../..' )
const brandBibleRoot = path.join( repoRoot, 'docs/design/brand-bible' )
const referencePrototypeRoot = path.join( repoRoot, 'docs/design/reference-prototype' )

process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES ??= path.join( storybookDir, 'mocked-google-fonts.cjs' )

const config: StorybookConfig = {
  // Comprehensive story patterns to capture all 91 story files
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  // Enhanced addons for better development experience
  addons: [
    '@storybook/addon-themes',
    '@storybook/addon-docs',
    './addons/font-selector/register.js',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../next.config.ts',
    },
  },

  staticDirs: [
    '../public',
    { from: brandBibleRoot, to: '/brand-bible' },
    { from: path.join( referencePrototypeRoot, 'public/images' ), to: '/images' },
  ],

  // Enable docs generation for better documentation (uses default autodocs from preview tags)
  docs: {},

  // Enhanced webpack optimizations + path resolution

  // If you need webpack customizations, uncomment
  webpackFinal: async ( config, { configType } ) => {
    // Eval source maps make the production catalog enormous and dramatically slow
    // minification. Keep fast source maps for the dev server and omit them from builds.
    config.devtool = configType === 'DEVELOPMENT' ? 'eval-cheap-module-source-map' : false

    // Ensure resolve exists
    config.resolve = config.resolve || {}
    config.resolve.extensions = config.resolve.extensions || ['.ts', '.tsx', '.js', '.jsx', '.json']

    // Add TS paths support and @ alias to src
    config.resolve.plugins = [
      ...( config.resolve.plugins || [] ),
      new TsconfigPathsPlugin( {
        configFile: path.join( appRoot, 'tsconfig.json' ),
      } ),
    ]
    config.resolve.alias = {
      ...( config.resolve.alias || {} ),
      '@reference': referencePrototypeRoot,
      '@ai-sdk/react': path.join( storybookDir, 'stubs/ai-sdk-react.ts' ),
      '@ai-sdk/rsc': path.join( storybookDir, 'stubs/ai-sdk-rsc.ts' ),
      'next/font/google': path.join( storybookDir, 'stubs/next-font.ts' ),
      'next/font/local': path.join( storybookDir, 'stubs/next-font.ts' ),
      '@/app/fonts': path.join( storybookDir, 'stubs/app-fonts.ts' ),
      '@': path.join( appRoot, 'src' ),
      '@tiptap-pro/extension-drag-handle-react': path.join(
        storybookDir,
        'stubs/tiptap-pro/extension-drag-handle-react.ts'
      ),
      'react-hot-toast': path.join( storybookDir, 'stubs/react-hot-toast.ts' ),
      '@tippyjs/react/headless': path.join( storybookDir, 'stubs/tippy-headless.tsx' ),
      '@tiptap/extension-table': path.join( storybookDir, 'stubs/tiptap/extension-table.ts' ),
      '@tiptap/extension-table-row': path.join( storybookDir, 'stubs/tiptap/extension-table-row.ts' ),
      '@tiptap/extension-table-header': path.join(
        storybookDir,
        'stubs/tiptap/extension-table-header.ts'
      ),
      '@tiptap/extension-code-block-lowlight': path.join(
        storybookDir,
        'stubs/tiptap/extension-code-block-lowlight.ts'
      ),
      lowlight: path.join( storybookDir, 'stubs/lowlight.ts' ),
      '@tiptap/extension-character-count': path.join(
        storybookDir,
        'stubs/tiptap/extension-character-count.ts'
      ),
      '@tiptap/extension-font-family': path.join(
        storybookDir,
        'stubs/tiptap/extension-font-family.ts'
      ),
      '@tiptap/extension-color': path.join( storybookDir, 'stubs/tiptap/extension-color.ts' ),
      '@tiptap/extension-focus': path.join( storybookDir, 'stubs/tiptap/extension-focus.ts' ),
      '@tiptap/extension-collaboration-cursor': path.join(
        storybookDir,
        'stubs/tiptap/extension-collaboration-cursor.ts'
      ),
      '@tiptap-pro/extension-emoji': path.join( storybookDir, 'stubs/tiptap-pro/extension-emoji.ts' ),
      '@tiptap-pro/extension-table-of-contents': path.join(
        storybookDir,
        'stubs/tiptap-pro/extension-toc.ts'
      ),
      '@tiptap-pro/extension-file-handler': path.join(
        storybookDir,
        'stubs/tiptap-pro/extension-file-handler.ts'
      ),
      '@tiptap-pro/extension-ai': path.join( storybookDir, 'stubs/tiptap-pro/extension-ai.ts' ),
      'react-colorful': path.join( storybookDir, 'stubs/react-colorful.tsx' ),
    }

    config.plugins = [
      ...( config.plugins || [] ),
      new webpack.NormalModuleReplacementPlugin( /^@\//, ( resource ) => {
        const moduleContext = path.resolve( resource.context || '' )
        const isReferenceModule =
          moduleContext === referencePrototypeRoot ||
          moduleContext.startsWith( `${referencePrototypeRoot}${path.sep}` )

        if ( !isReferenceModule ) return

        const referenceRequest =
          resource.request === '@/types/document' ? 'types/documents' : resource.request.slice( 2 )

        resource.request = path.join( referencePrototypeRoot, referenceRequest )
      } ),
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]features[\\/]mindmap[\\/]actions[\\/]xata-to-xyflow$/,
        path.join( storybookDir, 'stubs/xata-to-xyflow.ts' )
      ),
    ]

    // Remove CaseSensitivePathsPlugin to avoid casing build breaks on macOS
    config.plugins = ( config.plugins || [] ).filter(
      ( plugin ) => plugin?.constructor?.name !== 'CaseSensitivePathsPlugin'
    )

    // Reduce bundle analysis but keep useful info
    config.stats = 'errors-warnings'

    return config
  },

  // Branding parameters for Ultraterrestrial
  refs: {},
}

export default config
